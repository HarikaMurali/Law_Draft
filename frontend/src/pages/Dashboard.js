import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import DraftForm from '../components/DraftForm';
import DraftList from '../components/DraftList';
import DraftEditor from '../components/DraftEditor';
import Layout from '../components/Layout';
import Galaxy from '../components/Galaxy';
import '../App.css';

const Dashboard = () => {
  const [draftText, setDraftText] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [templateData, setTemplateData] = useState(null);
  const [loadingFromHistory, setLoadingFromHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    
    // Check if a template was selected
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      const template = JSON.parse(selectedTemplate);
      setTemplateData(template);
      localStorage.removeItem('selectedTemplate'); // Clear after loading
    }
    
    // Check if editing an existing draft
    const editDraft = localStorage.getItem('editDraft');
    if (editDraft) {
      const draft = JSON.parse(editDraft);
      setDraftText(draft.draftText || draft.details || '');
      setLoadingFromHistory(true);
      setTimeout(() => setLoadingFromHistory(false), 2000); // Show banner for 2 seconds
      localStorage.removeItem('editDraft'); // Clear after loading
    }
    
    // Fetch existing drafts
    fetchDrafts();
  }, [navigate]);

  const fetchDrafts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/drafts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrafts(res.data);
    } catch (err) {
      console.error('Failed to fetch drafts:', err);
    }
  };

  const handleGenerateDraft = async (formData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/generate', formData);
      if (response.data && response.data.draft) {
        setDraftText(response.data.draft);
      } else {
        setError('No draft was generated. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate draft');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Drafts', value: drafts.length, icon: '📄', color: '#a855f7' },
    { label: 'This Month', value: 12, icon: '📅', color: '#3b82f6' },
    { label: 'Templates Used', value: 8, icon: '📋', color: '#10b981' },
    { label: 'Time Saved', value: '24h', icon: '⏱️', color: '#f59e0b' },
  ];

  return (
    <Layout>
      {/* Galaxy Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: -10, pointerEvents: 'none'
      }}>
        <Galaxy
          mouseRepulsion={true} mouseInteraction={false} density={1.5}
          glowIntensity={0.5} saturation={0.0} hueShift={0} transparent={false}
        />
      </div>

      <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── Welcome Section ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              boxShadow: '0 4px 15px rgba(168,85,247,0.35)'
            }}>⚖️</div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                Welcome back, {localStorage.getItem('userName') || 'User'}! 👋
              </h1>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Generate professional legal drafts in seconds</p>
            </div>
          </div>
        </div>

        {/* Loading from History Banner */}
        {loadingFromHistory && (
          <div style={{
            padding: '14px 20px', borderRadius: 12, marginBottom: 20,
            background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(124,58,237,0.1) 100%)',
            border: '1px solid rgba(168,85,247,0.3)',
            display: 'flex', alignItems: 'center', gap: 12,
            animation: 'fade-in-up 0.3s ease',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(168,85,247,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>📄</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#c084fc', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Draft Loaded from History</p>
              <p style={{ color: '#94a3b8', fontSize: 12 }}>Your previous draft has been loaded and ready to edit</p>
            </div>
            <span style={{ fontSize: 20 }}>✓</span>
          </div>
        )}

        {/* ── Error Message ── */}
        {error && (
          <div style={{
            marginBottom: 20, padding: '14px 20px', borderRadius: 12,
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)',
            color: '#fca5a5', fontSize: 14, fontWeight: 600
          }}>
            {error}
          </div>
        )}

        {/* ── Quick Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {statCards.map((s, i) => (
            <div key={i} className="card glass-hover" style={{
              padding: '22px 24px', textAlign: 'center',
              borderTop: `3px solid ${s.color}`,
              background: 'rgba(15,23,42,0.7)',
            }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{s.icon}</span>
              <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>

          {/* Left Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Generate New Draft */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
              <div style={{
                padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.1)',
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(168,85,247,0.04)'
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }} />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Generate New Draft</span>
              </div>
              <div style={{ padding: '22px 24px' }}>
                <DraftForm
                  onGenerateDraft={handleGenerateDraft}
                  isLoading={isLoading}
                  templateData={templateData}
                />
              </div>
            </div>

            {/* Drafts List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
              <div style={{
                padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(59,130,246,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Your Drafts</span>
                </div>
                <span style={{ fontSize: 11, color: '#64748b', background: 'rgba(100,116,139,0.15)', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{drafts.length}</span>
              </div>
              <div style={{ padding: '16px 20px', maxHeight: 400, overflowY: 'auto' }} className="activity-scroll">
                <DraftList
                  drafts={drafts}
                  onSelectDraft={(draft) => {
                    setDraftText(draft.draftText || '');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Content — Draft Editor */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
            <div style={{
              padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.1)',
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(16,185,129,0.04)'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Draft Editor</span>
            </div>
            <div style={{ padding: '22px 24px' }}>
              <DraftEditor
                draftText={draftText}
                onDraftChange={setDraftText}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;