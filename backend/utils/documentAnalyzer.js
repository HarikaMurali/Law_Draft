const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

/**
 * Extract text from PDF file
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text from PDF
 */
const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing error: ${error.message}`);
  }
};

/**
 * Extract text from image using Gemini Vision API
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<string>} - Extracted text from image
 */
const extractTextFromImage = async (fileBuffer, mimeType) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const apiKey = process.env.GOOGLE_AI_KEY;
    
    if (!apiKey) {
      throw new Error('GOOGLE_AI_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const base64Image = fileBuffer.toString('base64');
    
    const prompt = `You are a document analyzer. Please analyze this image and extract any legal text, documents, or relevant information visible in it. Provide a comprehensive summary of the content, including:
1. Type of document (if identifiable)
2. Parties involved
3. Key facts and details
4. Dates and amounts (if any)
5. Any other relevant legal information

Format the extracted information clearly and concisely.`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      },
      prompt
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Image analysis error: ${error.message}`);
  }
};

/**
 * Parse uploaded document and extract relevant legal information
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - MIME type
 * @returns {Promise<string>} - Extracted and analyzed text
 */
const parseUploadedDocument = async (fileBuffer, fileName, mimeType) => {
  const ext = path.extname(fileName).toLowerCase();

  console.log(`Parsing document: ${fileName} (type: ${mimeType})`);

  if (ext === '.pdf' || mimeType === 'application/pdf') {
    return await extractTextFromPDF(fileBuffer);
  } else if (
    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimeType)
  ) {
    return await extractTextFromImage(fileBuffer, mimeType);
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }
};

module.exports = {
  parseUploadedDocument,
  extractTextFromPDF,
  extractTextFromImage
};
