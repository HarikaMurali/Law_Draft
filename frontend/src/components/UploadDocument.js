import React, { useState } from 'react';
import axios from '../utils/axios';
import './UploadDocument.css';
import {
  getMainCategories,
  getSubcategories,
  getTypes,
  formatCaseType,
  getSimplifiedCaseType
} from '../utils/caseTypesConfig';

const UploadDocument = ({ onDraftGenerated }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [documentAnalysis, setDocumentAnalysis] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [specificType, setSpecificType] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Karnataka, India');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: upload, 2: extracted text, 3: review

  const mainCategories = getMainCategories();
  const subcategories = mainCategory ? getSubcategories(mainCategory) : [];
  const specificTypes = subcategory ? getTypes(mainCategory, subcategory) : [];

  const jurisdictions = [
    'Karnataka, India',
    'India',
    'USA',
    'UK',
    'Canada',
    'Australia',
    'General'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Only PDF and image files (JPEG, PNG) are allowed');
        setFile(null);
      }
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post('/api/upload/analyze', formData);

      setExtractedText(response.data.extractedText);
      setDocumentAnalysis(response.data.documentAnalysis || '');
      setStep(2);
      setSuccess(`Document analyzed successfully! Extracted ${response.data.extractedText.length} characters.`);
    } catch (err) {
      setError(err.response?.data?.details || 'Failed to analyze document');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!extractedText) {
      setError('No extracted text available');
      return;
    }

    if (!mainCategory || !subcategory || !specificType) {
      setError('Please select all case type fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formattedCaseType = formatCaseType(mainCategory, subcategory, specificType);
      const simplifiedType = getSimplifiedCaseType(mainCategory);

      const response = await axios.post('/api/upload/generate-from-document', {
        extractedText,
        documentAnalysis,
        caseType: formattedCaseType, // Full hierarchical path
        mainCategory,
        subcategory,
        specificType,
        simplifiedCaseType: simplifiedType,
        jurisdiction: jurisdiction || 'Karnataka, India'
      });

      setSuccess('Draft generated successfully from your document!');
      
      if (onDraftGenerated) {
        onDraftGenerated(response.data.draft, {
          ...response.data.metadata,
          source: 'document'
        });
      }

      // Reset form
      setStep(1);
      setFile(null);
      setExtractedText('');
      setDocumentAnalysis('');
      setMainCategory('');
      setSubcategory('');
      setSpecificType('');
      setJurisdiction('Karnataka, India');
    } catch (err) {
      setError(err.response?.data?.details || 'Failed to generate draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-document-container">
      <div className="upload-card">
        <h2 className="upload-title">📄 Upload & Analyze Document</h2>
        
        {/* Step 1: File Upload */}
        {step === 1 && (
          <div className="upload-step">
            <p className="step-description">
              Upload a PDF or image of a legal document. We'll extract the text and help you generate a draft.
            </p>
            
            <div className="file-upload-box">
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={loading}
                className="file-input"
              />
              <label htmlFor="file-input" className="file-label">
                <span className="upload-icon">📎</span>
                <span className="upload-text">
                  {file ? file.name : 'Click to select PDF or Image'}
                </span>
              </label>
              <p className="file-info">Max 20MB • PDF, JPEG, or PNG</p>
            </div>

            <div className="button-group">
              <button
                onClick={handleAnalyzeDocument}
                disabled={!file || loading}
                className="btn btn-primary btn-analyze"
              >
                {loading ? '⏳ Analyzing...' : '🔍 Analyze Document'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Extracted Text Review */}
        {step === 2 && (
          <div className="upload-step">
            <p className="step-description">
              Review the extracted text and provide case details to generate a draft.
            </p>
            
            <div className="extracted-text-box">
              <h3>📋 Extracted Text Preview</h3>
              <div className="text-preview">
                {extractedText.substring(0, 500)}...
              </div>
              <p className="char-count">{extractedText.length} characters extracted</p>
            </div>

            {documentAnalysis && (
              <div className="extracted-text-box" style={{ marginTop: 16 }}>
                <h3>🧠 Document Analysis Preview</h3>
                <div className="text-preview">
                  {documentAnalysis.substring(0, 500)}...
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="main-category">Legal Category *</label>
              <select
                id="main-category"
                value={mainCategory}
                onChange={(e) => {
                  setMainCategory(e.target.value);
                  setSubcategory('');
                  setSpecificType('');
                }}
                className="form-select"
              >
                <option value="">Select a Category</option>
                {mainCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {mainCategory && (
              <div className="form-group">
                <label htmlFor="subcategory">Subcategory *</label>
                <select
                  id="subcategory"
                  value={subcategory}
                  onChange={(e) => {
                    setSubcategory(e.target.value);
                    setSpecificType('');
                  }}
                  className="form-select"
                >
                  <option value="">Select a Subcategory</option>
                  {subcategories.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {subcategory && (
              <div className="form-group">
                <label htmlFor="specific-type">Case Type *</label>
                <select
                  id="specific-type"
                  value={specificType}
                  onChange={(e) => setSpecificType(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Case Type</option>
                  {specificTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="jurisdiction">Jurisdiction</label>
              <select
                id="jurisdiction"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="form-select"
              >
                <option value="">Select jurisdiction (optional)</option>
                {jurisdictions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button
                onClick={() => setStep(1)}
                className="btn btn-secondary"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerateDraft}
                disabled={!mainCategory || !subcategory || !specificType || loading}
                className="btn btn-primary btn-generate"
              >
                {loading ? '⏳ Generating...' : '✨ Generate Draft'}
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="alert alert-error">
            <span>❌ {error}</span>
            <button
              onClick={() => setError('')}
              className="close-btn"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✅ {success}</span>
            <button
              onClick={() => setSuccess('')}
              className="close-btn"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;
