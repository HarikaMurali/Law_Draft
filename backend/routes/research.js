const express = require('express');
const router = express.Router();
const axios = require('axios');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const { generateContent } = require('../utils/gemini');

// Search Indian Case Law using Gemini AI
router.post('/cases', auth, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ error: 'Please provide a search query (minimum 3 characters)' });
    }

    console.log(`Searching Indian case law for: ${query}`);

    try {
      const prompt = `You are an Indian legal research expert. Search for and provide 5-8 relevant Indian court cases related to: "${query}"

For each case provide in this EXACT format (one case per block):

CASE 1:
Title: [Full case name]
Citation: [AIR/SCC citation]
Year: [Year]
Court: [Supreme Court of India / High Court name]
Summary: [2-3 line summary of the judgment]
Relevance: [Area of law]

Provide real, accurate Indian cases only. If searching for keywords, find the most landmark/important cases.`;

      const aiResponse = await generateContent(prompt);

      // Parse AI response into structured format
      const cases = [];
      const caseBlocks = aiResponse.split(/CASE \d+:/i).filter(block => block.trim());
      
      caseBlocks.forEach((block, index) => {
        const titleMatch = block.match(/Title:\s*(.+)/i);
        const citationMatch = block.match(/Citation:\s*(.+)/i);
        const yearMatch = block.match(/Year:\s*(\d+)/i);
        const courtMatch = block.match(/Court:\s*(.+)/i);
        const summaryMatch = block.match(/Summary:\s*(.+)/i);
        const relevanceMatch = block.match(/Relevance:\s*(.+)/i);

        if (titleMatch) {
          cases.push({
            id: index + 1,
            title: titleMatch[1].trim(),
            citation: citationMatch ? citationMatch[1].trim() : 'Citation not available',
            year: yearMatch ? parseInt(yearMatch[1]) : 'N/A',
            court: courtMatch ? courtMatch[1].trim() : 'Court not specified',
            summary: summaryMatch ? summaryMatch[1].trim() : 'Summary not available',
            relevance: relevanceMatch ? relevanceMatch[1].trim() : 'General',
            url: '#'
          });
        }
      });

      console.log(`✅ Found ${cases.length} cases using Gemini AI`);

      // Log activity with resume payload
      if (req.user?.userId) {
        try {
          await Activity.create({
            userId: req.user.userId,
            action: 'Case Law Search',
            title: `Searched: ${query}`,
            type: 'General',
            details: `Found ${cases.length} relevant cases`,
            metadata: { 
              query,
              resultsCount: cases.length,
              topResults: cases.slice(0, 3).map(c => ({ title: c.title, citation: c.citation })),
              resumeType: 'research-case',
              resumePayload: {
                tab: 'caseLaw',
                query,
                results: cases,
                timestamp: new Date().toISOString()
              }
            }
          });
        } catch (actErr) {
          console.error('Activity logging error:', actErr.message);
        }
      }

      res.json({
        success: true,
        count: cases.length,
        results: cases,
        source: 'AI-Powered Research'
      });

    } catch (apiError) {
      console.error('Gemini case search error:', apiError.message);
      
      // Fallback
      res.json({
        success: true,
        count: 0,
        results: [],
        source: 'Fallback',
        note: 'AI service temporarily unavailable. Please try again.'
      });
    }

  } catch (error) {
    console.error('Case search error:', error.message);
    res.status(500).json({ error: 'Failed to search case law', details: error.message });
  }
});

// Search Indian Statutes using Gemini AI
router.post('/statutes', auth, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a search query (minimum 2 characters)' });
    }

    console.log(`Searching for statute: ${query}`);

    try {
      const prompt = `You are an Indian legal expert. Provide information about Indian laws/acts related to: "${query}"

If it's a specific section (like "IPC 302", "Section 498A"), provide detailed information about that section.
If it's a general query (like "contract", "criminal"), list 5-8 relevant Indian Acts/Sections.

Provide in this EXACT format (one per block):

ACT 1:
Title: [Full Act name and year]
Sections: [Number of sections or specific section number]
Description: [2-3 line description]
Keywords: [Comma-separated relevant terms]

Provide real, accurate Indian legislation only.`;

      const aiResponse = await generateContent(prompt);

      // Parse AI response
      const statutes = [];
      const actBlocks = aiResponse.split(/ACT \d+:/i).filter(block => block.trim());
      
      actBlocks.forEach((block, index) => {
        const titleMatch = block.match(/Title:\s*(.+)/i);
        const sectionsMatch = block.match(/Sections?:\s*(.+)/i);
        const descMatch = block.match(/Description:\s*(.+)/i);
        const keywordsMatch = block.match(/Keywords:\s*(.+)/i);

        if (titleMatch) {
          statutes.push({
            id: index + 1,
            title: titleMatch[1].trim(),
            sections: sectionsMatch ? sectionsMatch[1].trim() : 'Multiple sections',
            description: descMatch ? descMatch[1].trim() : 'Legal provision under Indian law',
            keywords: keywordsMatch ? keywordsMatch[1].trim() : 'Indian Law',
            url: '#'
          });
        }
      });

      console.log(`✅ Found ${statutes.length} statute documents using Gemini AI`);

      // Log activity with resume payload
      if (req.user?.userId) {
        try {
          await Activity.create({
            userId: req.user.userId,
            action: 'Statute Search',
            title: `Searched: ${query}`,
            type: 'General',
            details: `Found ${statutes.length} relevant statutes/sections`,
            metadata: { 
              searchQuery: query, 
              resultsCount: statutes.length,
              resumeType: 'research-statute',
              resumePayload: {
                tab: 'statutes',
                query,
                results: statutes,
                timestamp: new Date().toISOString()
              }
            }
          });
        } catch (actErr) {
          console.error('Activity logging error:', actErr.message);
        }
      }

      res.json({
        success: true,
        count: statutes.length,
        results: statutes,
        source: 'AI-Powered Research'
      });

    } catch (apiError) {
      console.error('Gemini statute search error:', apiError.message);
      
      // Fallback
      res.json({
        success: true,
        count: 0,
        results: [],
        source: 'Fallback',
        note: 'AI service temporarily unavailable. Try searching for specific sections like "IPC 302" or "Section 138 NI Act"'
      });
    }

  } catch (error) {
    console.error('Statute search error:', error.message);
    res.status(500).json({ error: 'Failed to search statutes', details: error.message });
  }
});

// Legal Dictionary using Gemini AI
router.post('/dictionary', auth, async (req, res) => {
  try {
    const { term } = req.body;
    
    if (!term || term.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a legal term to search' });
    }

    console.log(`Looking up legal term: ${term}`);

    try {
      const prompt = `You are an expert in Indian legal terminology. Provide a comprehensive explanation of the legal term or section: "${term}"

If it's an IPC/CrPC/CPC section (like "IPC 302" or "Section 498A"), provide:
1. Full section text/title
2. What it covers (in simple language)
3. Essential elements/ingredients
4. Punishment (if applicable)
5. Bailable/Non-bailable, Cognizable/Non-cognizable (if criminal)

If it's a legal term (like "Habeas Corpus" or "Prima Facie"), provide:
1. Definition in simple language
2. Origin (Latin/English/Indian)
3. How it's used in Indian legal context
4. Example usage in court

Be concise but comprehensive. Use bullet points for clarity.`;

      const explanation = await generateContent(prompt);

      console.log(`✅ Generated explanation for: ${term}`);

      // Log activity with resume payload
      if (req.user?.userId) {
        try {
          await Activity.create({
            userId: req.user.userId,
            action: 'Dictionary Lookup',
            title: `Looked up: ${term}`,
            type: 'General',
            details: `Searched for definition of legal term/section`,
            metadata: { 
              term,
              resumeType: 'research-dictionary',
              resumePayload: {
                tab: 'dictionary',
                query: term,
                results: [{
                  term,
                  definition: explanation,
                  category: 'Indian Law'
                }],
                timestamp: new Date().toISOString()
              }
            }
          });
        } catch (actErr) {
          console.error('Activity logging error:', actErr.message);
        }
      }

      res.json({
        success: true,
        term: term,
        definition: explanation,
        source: 'AI-Powered Legal Dictionary',
        aiGenerated: true
      });

    } catch (aiError) {
      console.error('Gemini dictionary error:', aiError.message);
      
      // Fallback to basic mock definitions
      const mockDefinitions = {
        'habeas corpus': 'A writ requiring a person under arrest to be brought before a judge or into court.',
        'prima facie': 'At first sight; on the face of it. Evidence that is sufficient to establish a fact unless rebutted.',
        'mens rea': 'The mental element of a crime; guilty mind.',
        'ipc 302': 'IPC Section 302: Punishment for murder. Whoever commits murder shall be punished with death or life imprisonment, and shall also be liable to fine.'
      };

      const termLower = term.toLowerCase();
      const definition = mockDefinitions[termLower] || `Legal term "${term}" - Definition temporarily unavailable. Please try again.`;

      res.json({
        success: true,
        term: term,
        definition: definition,
        source: 'Fallback Dictionary',
        note: 'AI service temporarily unavailable'
      });
    }

  } catch (error) {
    console.error('Dictionary lookup error:', error.message);
    res.status(500).json({ error: 'Failed to lookup term', details: error.message });
  }
});

module.exports = router;
