import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import '../App.css';

const DraftEditor = ({ draftText, onDraftChange, isLoading }) => {
  const [title, setTitle] = useState('');
  const [proofreadResult, setProofreadResult] = useState('');
  const [clauseSuggestions, setClauseSuggestions] = useState('');
  const [isProofreading, setIsProofreading] = useState(false);
  const [isSuggestingClauses, setIsSuggestingClauses] = useState(false);

  useEffect(() => {
    const savedProofread = localStorage.getItem('resumeProofread');
    if (savedProofread) {
      try {
        const data = JSON.parse(savedProofread);
        if (data.originalText) {
          onDraftChange(data.originalText);
        }
        if (data.analysis) {
          setProofreadResult(data.analysis);
        }
      } catch (error) {
        console.error('Failed to load proofread data:', error);
      } finally {
        localStorage.removeItem('resumeProofread');
      }
    }

    const savedClauses = localStorage.getItem('resumeClauses');
    if (savedClauses) {
      try {
        const data = JSON.parse(savedClauses);
        if (data.originalText) {
          onDraftChange(data.originalText);
        }
        if (data.suggestions) {
          setClauseSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error('Failed to load clause suggestions:', error);
      } finally {
        localStorage.removeItem('resumeClauses');
      }
    }
  }, [onDraftChange]);

  const handleSaveDraft = async () => {
    if (!draftText.trim()) {
      alert('Please enter some draft text to save.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/drafts',
        { 
          title: title || 'Untitled Draft',
          draftText: draftText,
          category: 'General'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const handleAutoGenerate = async () => {
    // Trigger the parent's generation flow or show a message
    alert('Please use the "Generate New Draft" form to auto-generate content.');
  };

  const handleProofread = async () => {
    if (!draftText.trim()) {
      alert('Please enter some draft text to proofread.');
      return;
    }

    setIsProofreading(true);
    setProofreadResult('');

    try {
      const response = await axios.post('/api/proofread', {
        text: draftText
      });
      setProofreadResult(response.data.result || 'Proofreading complete. No major issues found.');
    } catch (error) {
      console.error('Proofreading failed:', error);
      setProofreadResult('Proofreading service is currently unavailable. Please try again later.');
    } finally {
      setIsProofreading(false);
    }
  };

  const handleSuggestClauses = async () => {
    if (!draftText.trim()) {
      alert('Please enter some draft text to get clause suggestions.');
      return;
    }

    setIsSuggestingClauses(true);
    setClauseSuggestions('');

    try {
      const response = await axios.post('/api/suggest-clauses', {
        text: draftText
      });
      setClauseSuggestions(response.data.suggestions || 'No additional clause suggestions at this time.');
    } catch (error) {
      console.error('Clause suggestion failed:', error);
      setClauseSuggestions('Clause suggestion service is currently unavailable. Please try again later.');
    } finally {
      setIsSuggestingClauses(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Title Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Draft Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "white",
            color: "#333"
          }}
        />
      </div>

      {/* Draft Textarea */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        {isLoading && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            borderRadius: "5px"
          }}>
            <div style={{ textAlign: "center", color: "white" }}>
              <div className="spinner" style={{ margin: "0 auto 10px" }}></div>
              <p>Generating your draft...</p>
            </div>
          </div>
        )}
        
        <textarea
          value={draftText}
          onChange={(e) => onDraftChange(e.target.value)}
          rows={15}
          placeholder="Enter or generate your legal draft here..."
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "14px",
            fontFamily: "monospace",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "white",
            color: "#333",
            resize: "vertical"
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={handleSaveDraft}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          💾 Save Draft
        </button>
        <button
          onClick={handleAutoGenerate}
          style={{
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          🤖 Auto Generate
        </button>
        <button
          onClick={handleProofread}
          disabled={isProofreading}
          style={{
            padding: "12px 24px",
            backgroundColor: isProofreading ? "#999" : "#ffc107",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isProofreading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          {isProofreading ? '⏳ Proofreading...' : '🔍 Proofread'}
        </button>
        <button
          onClick={handleSuggestClauses}
          disabled={isSuggestingClauses}
          style={{
            padding: "12px 24px",
            backgroundColor: isSuggestingClauses ? "#999" : "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isSuggestingClauses ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          {isSuggestingClauses ? '⏳ Suggesting...' : '📝 Suggest Clauses'}
        </button>
      </div>

      {/* Proofread Results */}
      {proofreadResult && (
        <div style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "5px",
          color: "#856404"
        }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#856404" }}>Proofreading Results:</h4>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{proofreadResult}</p>
        </div>
      )}

      {/* Clause Suggestions */}
      {clauseSuggestions && (
        <div style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#d1ecf1",
          border: "1px solid #17a2b8",
          borderRadius: "5px",
          color: "#0c5460"
        }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#0c5460" }}>Suggested Clauses:</h4>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{clauseSuggestions}</p>
        </div>
      )}

      {/* Draft Stats */}
      {draftText && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginTop: "20px"
        }}>
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "5px",
            textAlign: "center",
            border: "1px solid #dee2e6"
          }}>
            <p style={{ color: "#6c757d", fontSize: "14px", margin: "0 0 5px 0" }}>Words</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff", margin: 0 }}>
              {draftText.split(/\s+/).filter(w => w).length}
            </p>
          </div>
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "5px",
            textAlign: "center",
            border: "1px solid #dee2e6"
          }}>
            <p style={{ color: "#6c757d", fontSize: "14px", margin: "0 0 5px 0" }}>Characters</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745", margin: 0 }}>
              {draftText.length}
            </p>
          </div>
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "5px",
            textAlign: "center",
            border: "1px solid #dee2e6"
          }}>
            <p style={{ color: "#6c757d", fontSize: "14px", margin: "0 0 5px 0" }}>Paragraphs</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#ffc107", margin: 0 }}>
              {draftText.split('\n\n').filter(p => p.trim()).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftEditor;