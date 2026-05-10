const express = require('express');
const router = express.Router();
const Draft = require('../models/Draft');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
<<<<<<< HEAD
const { generateContent, PRIMARY_MODEL, normalizeGeminiError } = require('../utils/gemini');
const { formatCaseType, getSimplifiedCaseType } = require('../config/caseTypesConfig');

=======
const { generateContent, PRIMARY_MODEL } = require('../utils/gemini');
const { formatCaseType, getSimplifiedCaseType } = require('../config/caseTypesConfig');

// Mock draft generator (fallback when API is unavailable)
const generateMockDraft = (caseType, details, jurisdiction) => {
  const date = new Date().toLocaleDateString();
  
  return `LEGAL DRAFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TITLE: ${caseType.toUpperCase()} LEGAL DRAFT
DATE: ${date}
JURISDICTION: ${jurisdiction || 'Default'}

I. PARTIES INVOLVED
   Primary Party: Mentioned in the case details
   Secondary Party: All relevant parties as per the facts presented
   
II. FACTUAL BACKGROUND
   The parties are involved in a legal matter as described below:
   
   ${details}
   
   The above facts constitute the basis of this legal action.

III. LEGAL ISSUES
   The following legal issues arise from the factual background:
   
   1. Whether the facts constitute a valid legal cause of action
   2. Whether the applicable laws have been violated
   3. What remedies are available to the aggrieved party
   4. The quantum of damages, if any

IV. PRAYERS/RELIEF SOUGHT
   The petitioner/plaintiff respectfully prays before this Hon'ble Court for:
   
   1. To declare the rights and obligations of the parties
   2. To enforce the contractual/legal obligations
   3. To award compensation for damages suffered
   4. To grant such other relief as deemed just and proper
   5. To award costs of this proceeding

V. APPLICABLE LAWS & SECTIONS
   The following laws and provisions are applicable to this case:
   For ${jurisdiction || 'the applicable jurisdiction'}:
   - Relevant Statutes and Acts
   - Common Law Principles
   - Established Precedents
   - Applicable Regulations
   
   The court shall apply these provisions in interpreting the rights 
   and obligations of the parties.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTE: This is a generated draft for reference purposes. It should be 
reviewed and customized by a qualified legal professional before filing 
with any court or legal authority.

Generated on: ${date}
Draft Type: ${caseType}`;
};

>>>>>>> 66f77381e04af314442a171e9764063c060781d1
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
<<<<<<< HEAD
      const normalizedError = normalizeGeminiError(aiError);
      console.error('Gemini API error:', normalizedError.message);

      res.status(normalizedError.statusCode || 500).json({
        error: 'Failed to generate draft',
        details: normalizedError.message,
        code: normalizedError.code
=======
      console.error('Gemini API error, falling back to mock:', aiError.message);
      
      // Fallback to mock if AI fails
      const draftText = generateMockDraft(finalCaseType, details, jurisdiction);

      res.json({
        draft: draftText,
        metadata: {
          model: "fallback-mock",
          aiGenerated: false,
          caseType: finalCaseType,
          jurisdiction: jurisdiction || 'Karnataka, India',
          timestamp: new Date().toISOString(),
          note: "AI service temporarily unavailable, using template"
        }
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
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

<<<<<<< HEAD
=======
// Mock endpoint for testing
router.post('/mock', async (req, res) => {
  try {
    const { caseType, details, jurisdiction } = req.body;

    if (!caseType || !details) {
      return res.status(400).json({ error: 'Case type and details are required' });
    }

    const draftText = generateMockDraft(caseType, details, jurisdiction);

    res.json({
      draft: draftText,
      metadata: {
        model: "mock-generator",
        caseType,
        jurisdiction: jurisdiction || 'default',
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("Mock draft generation error:", err);
    res.status(500).json({
      error: 'Failed to generate draft',
      details: err.message
    });
  }
});

>>>>>>> 66f77381e04af314442a171e9764063c060781d1
module.exports = router;