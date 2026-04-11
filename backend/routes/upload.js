const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { parseDocument, cleanupFile, analyzeExtractedText, buildChunkedDraftContext } = require('../utils/documentParser');
const { generateContent, PRIMARY_MODEL } = require('../utils/gemini');
const { formatCaseType, getSimplifiedCaseType } = require('../config/caseTypesConfig');
const Activity = require('../models/Activity');
const Draft = require('../models/Draft');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only PDF and image files
  const allowedTypes = /pdf|jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({
        success: false,
        error: 'File too large',
        details: 'Maximum file size is 20MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files',
        details: 'Only one file can be uploaded at a time'
      });
    }
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      details: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: 'Upload error',
      details: err.message
    });
  }
  next();
};

/**
 * Upload document and extract text
 * POST /api/upload/analyze
 */
router.post('/analyze', auth, (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      console.error('🔴 Multer error:', err.message);
      return res.status(400).json({
        success: false,
        error: 'File upload error',
        details: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    // Check if file was received
    if (!req.file) {
      console.error('❌ No file received in request');
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        details: 'Please select a file to upload'
      });
    }

    const filePath = req.file.path;
    console.log(`📄 Analyzing uploaded file: ${req.file.originalname}`);
    console.log(`📁 File path: ${filePath}`);
    console.log(`📊 File size: ${req.file.size} bytes`);
    console.log(`📋 MIME type: ${req.file.mimetype}`);

    // Parse the document to extract text
    const extractedText = await parseDocument(filePath, req.file.mimetype);

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the document');
    }

    let documentAnalysis = '';
    try {
      documentAnalysis = await analyzeExtractedText(
        extractedText,
        req.body?.caseType || 'General',
        req.body?.jurisdiction || 'Karnataka, India'
      );
    } catch (analysisErr) {
      console.error('Document analysis step failed:', analysisErr.message);
    }

    console.log(`✅ Document analyzed successfully - extracted ${extractedText.length} characters`);

    // Log activity
    try {
      await Activity.create({
        userId: req.user.userId,
        action: 'Uploaded Document',
        title: `Analyzed: ${req.file.originalname}`,
        type: 'Document Upload',
        details: `Uploaded and analyzed ${req.file.mimetype}`,
        metadata: {
          fileName: req.file.originalname,
          fileSize: req.file.size,
          timestamp: new Date().toISOString()
        }
      });
    } catch (actErr) {
      console.error('Activity logging error:', actErr.message);
    }

    res.json({
      success: true,
      extractedText,
      documentAnalysis,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      message: 'Document analyzed successfully. Use the extracted text to generate a draft.'
    });

  } catch (err) {
    console.error('❌ Document analysis error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze document',
      details: err.message
    });
  } finally {
    // Clean up the temporary file
    if (req.file) {
      cleanupFile(req.file.path);
    }
  }
});

/**
 * Generate draft from extracted document text
 * POST /api/upload/generate-from-document
 */
router.post('/generate-from-document', auth, async (req, res) => {
  try {
    const { 
      extractedText, 
      documentAnalysis, 
      caseType, 
      mainCategory,
      subcategory,
      specificType,
      simplifiedCaseType,
      jurisdiction 
    } = req.body;

    // Validation
    if (!extractedText || typeof extractedText !== 'string' || extractedText.trim().length < 20) {
      return res.status(400).json({
        error: 'Valid extracted text is required (minimum 20 characters)'
      });
    }

    // Accept either old format (caseType) or new format (mainCategory + subcategory + specificType)
    let finalCaseType = caseType;
    let finalSimplifiedType = simplifiedCaseType;
    let storedMainCategory = mainCategory;
    let storedSubcategory = subcategory;
    let storedSpecificType = specificType;

    if (!finalCaseType) {
      if (mainCategory && subcategory && specificType) {
        finalCaseType = formatCaseType(mainCategory, subcategory, specificType);
        finalSimplifiedType = getSimplifiedCaseType(mainCategory);
      } else {
        return res.status(400).json({
          error: 'Case type information is required'
        });
      }
    }

    console.log(`📋 Generating draft from extracted document for case type: ${finalCaseType}`);

    try {
      const draftContext = await buildChunkedDraftContext(extractedText);

      // Create a prompt that uses the extracted text
      const prompt = `You are an expert legal assistant specializing in ${jurisdiction || 'Karnataka, India'} law. 
Based on the following extracted document content and analysis, generate a comprehensive, professional legal draft document.

EXTRACTED DOCUMENT CONTENT:
${draftContext}

DOCUMENT ANALYSIS:
${documentAnalysis || 'No separate analysis provided.'}

CASE TYPE: ${finalSimplifiedType || finalCaseType}
JURISDICTION: ${jurisdiction || 'Karnataka, India'}

Generate a complete legal draft following this structure:
1. Title and Header (with case type, date, jurisdiction)
2. Parties Involved (identify from the document)
3. Factual Background (detailed summary from the document)
4. Legal Issues (identify key legal questions from the document)
5. Prayers/Relief Sought (specific remedies requested)
6. Applicable Laws and Legal Provisions (cite relevant statutes, acts, case law) - AT THE END
7. Legal Arguments and Analysis

Use formal legal language, proper legal citation format, and professional structure. The draft should be ready for review by a legal professional. 
Include appropriate legal terminology and formatting for ${jurisdiction || 'Karnataka, India'} jurisdiction.
Make sure to incorporate specific details and facts from the extracted document.`;

      const draftText = await generateContent(prompt);

      console.log('✅ Draft generated successfully from document');

      // Save the draft to database
      if (req.user?.userId) {
        try {
          const draft = await Draft.create({
            userId: req.user.userId,
            caseType: finalCaseType,
            mainCategory: storedMainCategory,
            subcategory: storedSubcategory,
            specificType: storedSpecificType,
            jurisdiction: jurisdiction || 'Karnataka, India',
            content: draftText,
            metadata: {
              generatedFromDocument: true,
              documentBased: true,
              timestamp: new Date().toISOString()
            }
          });

          // Log activity
          await Activity.create({
            userId: req.user.userId,
            action: 'Generated Draft from Document',
            title: `${finalCaseType} Draft (from Document)`,
            type: finalCaseType,
            details: `Generated AI-powered legal draft from uploaded document`,
            metadata: {
              jurisdiction,
              aiGenerated: true,
              draftId: draft._id,
              documentBased: true,
              mainCategory: storedMainCategory,
              subcategory: storedSubcategory,
              specificType: storedSpecificType
            }
          });

          return res.json({
            draft: draftText,
            draftId: draft._id,
            metadata: {
              model: PRIMARY_MODEL,
              aiGenerated: true,
              caseType: finalCaseType,
              jurisdiction: jurisdiction || 'Karnataka, India',
              documentBased: true,
              timestamp: new Date().toISOString()
            }
          });
        } catch (dbErr) {
          console.error('Database error:', dbErr.message);
          // Still return the draft even if saving fails
          return res.json({
            draft: draftText,
            metadata: {
              model: PRIMARY_MODEL,
              aiGenerated: true,
              caseType: finalCaseType,
              jurisdiction: jurisdiction || 'Karnataka, India',
              documentBased: true,
              timestamp: new Date().toISOString(),
              note: 'Draft generated but not saved to database'
            }
          });
        }
      }

      res.json({
        draft: draftText,
        metadata: {
          model: PRIMARY_MODEL,
          aiGenerated: true,
          caseType: finalCaseType,
          jurisdiction: jurisdiction || 'Karnataka, India',
          documentBased: true,
          timestamp: new Date().toISOString()
        }
      });

    } catch (aiError) {
      console.error('AI generation error:', aiError.message);
      res.status(500).json({
        error: 'Failed to generate draft from document',
        details: aiError.message
      });
    }

  } catch (err) {
    console.error('Draft generation error:', err);
    res.status(500).json({
      error: 'Failed to process document draft generation',
      details: err.message
    });
  }
});

module.exports = router;
