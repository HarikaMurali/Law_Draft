const express = require('express');
const router = express.Router();
const Draft = require('../models/Draft');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const { generateContent, PRIMARY_MODEL, normalizeGeminiError } = require('../utils/gemini');
const { formatCaseType, getSimplifiedCaseType } = require('../config/caseTypesConfig');

// Generate full draft with REAL AI
router.post('/', auth, async (req, res) => {
  try {
    const { 
      caseType, 
      details, 
      jurisdiction,
      mainCategory,
      subcategory,
      specificType,
      simplifiedCaseType
    } = req.body;

    // Accept either old format (caseType) or new format
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
        return res.status(400).json({ error: 'Valid case type is required' });
      }
    }

    // Enhanced input validation
    if (!finalCaseType || typeof finalCaseType !== 'string') {
      return res.status(400).json({ error: 'Valid case type is required' });
    }
    if (!details || typeof details !== 'string' || details.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide sufficient case details (minimum 10 characters)' });
    }

    console.log(`Generating draft using Gemini AI for case type: ${finalCaseType}`);

    try {
      // Use Gemini AI for real draft generation
      const prompt = `You are an expert legal assistant specializing in ${jurisdiction || 'Karnataka, India'} law. Generate a comprehensive, professional legal draft document for the following case:

Case Type: ${finalSimplifiedType || finalCaseType}
Jurisdiction: ${jurisdiction || 'Karnataka, India'}
Case Details: ${details}

Generate a complete legal draft following this structure:
1. Title and Header (with case type, date, jurisdiction)
2. Parties Involved (identify from case details)
3. Factual Background (detailed summary of the case)
4. Legal Issues (identify key legal questions)
5. Prayers/Relief Sought (specific remedies requested)
6. Applicable Laws and Legal Provisions (cite relevant statutes, acts, case law) - AT THE END
7. Legal Arguments and Analysis

Use formal legal language, proper legal citation format, and professional structure. The draft should be ready for review by a legal professional. Include appropriate legal terminology and formatting for ${jurisdiction || 'Karnataka, India'} jurisdiction.`;

      const draftText = await generateContent(prompt);

      console.log('✅ Draft generated successfully with Gemini AI');

      // Log activity if user is authenticated
      if (req.user?.userId) {
        try {
          await Activity.create({
            userId: req.user.userId,
            action: 'Generated Draft',
            title: `${finalCaseType} Draft`,
            type: finalCaseType,
            details: `Generated AI-powered legal draft using Gemini AI`,
            metadata: { 
              jurisdiction, 
              aiGenerated: true,
              mainCategory: storedMainCategory,
              subcategory: storedSubcategory,
              specificType: storedSpecificType
            }
          });
        } catch (actErr) {
          console.error('Activity logging error:', actErr.message);
        }
      }

      res.json({
        draft: draftText,
        metadata: {
          model: PRIMARY_MODEL,
          aiGenerated: true,
          caseType: finalCaseType,
          jurisdiction: jurisdiction || 'Karnataka, India',
          timestamp: new Date().toISOString()
        }
      });

    } catch (aiError) {
      const normalizedError = normalizeGeminiError(aiError);
      console.error('Gemini API error:', normalizedError.message);

      res.status(normalizedError.statusCode || 500).json({
        error: 'Failed to generate draft',
        details: normalizedError.message,
        code: normalizedError.code
      });
    }

  } catch (err) {
    console.error("Draft generation error:", err);
    res.status(500).json({
      error: 'Failed to generate draft',
      details: err.message
    });
  }
});

module.exports = router;