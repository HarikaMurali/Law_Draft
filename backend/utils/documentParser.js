const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const { generateContent, generateVisionContent } = require('./gemini');

const CHUNK_SIZE = 9000;

function chunkText(text, chunkSize = CHUNK_SIZE) {
  const chunks = [];
  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize));
  }
  return chunks;
}

/**
 * Extract text from PDF file using the installed pdf-parse v2 API.
 */
async function extractTextFromPDF(filePath) {
  try {
    console.log(`📖 Parsing PDF file with pdf-parse: ${filePath}`);

    const fileBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();
    const extractedText = (result?.text || '').trim();

    if (!extractedText) {
      throw new Error('No readable text found in PDF');
    }

    console.log(`✅ PDF text extracted successfully - ${extractedText.length} characters`);
    return extractedText;
  } catch (err) {
    console.error('❌ Error extracting text from PDF:', err.message);
    throw new Error(`Failed to parse PDF: ${err.message}`);
  }
}

/**
 * Extract text from image using Gemini Vision API
 */
async function extractTextFromImage(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    
    // Determine MIME type from file extension
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.gif') mimeType = 'image/gif';

    console.log(`📸 Extracting text from image: ${ext} (${mimeType})`);

    const prompt = `You are a legal document OCR assistant. Transcribe the document as faithfully as possible.

  Return the output in this structure:
  1. VERBATIM TEXT: a best-effort transcription of all readable text.
  2. STRUCTURED NOTES: bullets for parties, dates, amounts, clauses, and important legal issues.

  Do not invent missing text. If a word is unclear, mark it as [unclear].`;

    // Call Gemini with multimodal payload
    console.log('📡 Calling Gemini Vision API...');
    const extractedText = await generateVisionContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      },
      prompt
    ], { model: 'gemini-2.0-flash' });
    
    console.log(`✅ Image text extracted successfully - ${extractedText.length} characters`);
    return extractedText;
  } catch (err) {
    console.error('❌ Error extracting text from image:', err.message);
    throw new Error(`Failed to parse image: ${err.message}`);
  }
}

/**
 * Parse uploaded document (image or PDF)
 */
async function parseDocument(filePath, mimeType) {
  try {
    if (mimeType.includes('pdf')) {
      return await extractTextFromPDF(filePath);
    } else if (
      mimeType.includes('image/jpeg') ||
      mimeType.includes('image/png') ||
      mimeType.includes('image/webp') ||
      mimeType.includes('image/gif') ||
      mimeType.includes('image/jpg')
    ) {
      return await extractTextFromImage(filePath);
    } else {
      throw new Error('Unsupported file type. Please upload PDF or image files.');
    }
  } catch (err) {
    throw err;
  }
}

async function analyzeExtractedText(extractedText, caseType = 'General', jurisdiction = 'Karnataka, India') {
  if (!extractedText || !extractedText.trim()) {
    throw new Error('No extracted text available for analysis');
  }

  const prompt = `You are a legal document analyst. Analyze the extracted document text below and produce a concise but useful legal briefing.

Document type requested: ${caseType}
Jurisdiction: ${jurisdiction}

Extracted text:
${extractedText}

Return the result with these sections:
1. Document Type
2. Parties
3. Key Facts
4. Legal Issues
5. Important Dates / Amounts
6. Suggested Draft Focus

Be faithful to the text. Do not fabricate facts.`;

  return generateContent(prompt);
}

async function buildChunkedDraftContext(extractedText) {
  if (!extractedText || extractedText.length <= CHUNK_SIZE) {
    return extractedText;
  }

  const chunks = chunkText(extractedText);
  const chunkSummaries = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const prompt = `Summarize this legal document chunk for downstream drafting. Keep parties, facts, dates, amounts, obligations, claims, and legal references.

Chunk ${index + 1}:
${chunk}`;
  const summary = await generateContent(prompt);
  chunkSummaries.push(`CHUNK ${index + 1}:\n${summary}`);
  }

  return chunkSummaries.join('\n\n');
}

/**
 * Clean up temporary file
 */
function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ Temporary file cleaned up');
    }
  } catch (err) {
    console.error('Error cleaning up file:', err.message);
  }
}

module.exports = {
  parseDocument,
  extractTextFromPDF,
  extractTextFromImage,
  cleanupFile,
  analyzeExtractedText,
  buildChunkedDraftContext,
  chunkText
};
