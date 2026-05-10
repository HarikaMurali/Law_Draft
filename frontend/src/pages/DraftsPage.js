import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import jsPDF from 'jspdf';
import Layout from '../components/Layout';
import UploadDocument from '../components/UploadDocument';
import { formatDate } from '../utils/dateFormat';
import '../App.css';

const DraftsPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [filteredDrafts, setFilteredDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewDraft, setViewDraft] = useState(null);
  const [activeTab, setActiveTab] = useState('drafts'); // 'drafts' or 'upload'
  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
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

=======
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
    fetchDrafts();
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    let filtered = drafts;

=======
    filterAndSortDrafts();
  }, [searchTerm, filterType, sortBy, drafts]);

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

  const filterAndSortDrafts = () => {
    let filtered = drafts;

    // Search filter
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
    if (searchTerm) {
      filtered = filtered.filter(
        (draft) =>
          draft.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          draft.caseType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

<<<<<<< HEAD
=======
    // Type filter
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
    if (filterType !== 'all') {
      filtered = filtered.filter((draft) => draft.caseType === filterType);
    }

<<<<<<< HEAD
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'name') {
=======
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'name') {
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
        return a.title?.localeCompare(b.title);
      }
      return 0;
    });

    setFilteredDrafts(filtered);
<<<<<<< HEAD
  }, [drafts, searchTerm, filterType, sortBy]);
=======
  };
>>>>>>> 66f77381e04af314442a171e9764063c060781d1

  const deleteDraft = async (id) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/drafts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (viewDraft && viewDraft._id === id) setViewDraft(null);
<<<<<<< HEAD
      const refreshDrafts = async () => {
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
      refreshDrafts();
=======
      fetchDrafts();
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
    } catch (err) {
      console.error('Failed to delete draft:', err);
    }
  };

  const exportToPDF = (draft) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const usableWidth = pageWidth - margin * 2;
    let y = margin;

    // Header line
    doc.setDrawColor(100, 80, 160);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    const titleLines = doc.splitTextToSize(draft.title || 'Untitled Draft', usableWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 8 + 4;

    // Meta info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const meta = `Case Type: ${draft.caseType || 'N/A'}   |   Date: ${formatDate(draft.createdAt, { short: true })}`;
    doc.text(meta, margin, y);
    y += 8;

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Body text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    const content = draft.draftText || draft.details || 'No content available';
    const lines = doc.splitTextToSize(content, usableWidth);

    for (let i = 0; i < lines.length; i++) {
      if (y > pageHeight - margin - 15) {
        // Footer on current page
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text(`LexiCraft — Legal Draft Maker`, margin, pageHeight - 10);
        doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 10);
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(lines[i], margin, y);
      y += 6;
    }

    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(`LexiCraft — Legal Draft Maker`, margin, pageHeight - 10);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 10);

    const filename = `${(draft.title || 'draft').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(filename);
  };

  const handleDraftGenerated = (draftContent, metadata) => {
    // Show the draft in editor
    setViewDraft({
      _id: `tmp-${Date.now()}`,
      title: `${metadata.caseType} Draft - From Document`,
      caseType: metadata.caseType,
      draftText: draftContent,
      content: draftContent,
      createdAt: new Date().toISOString(),
      metadata
    });
    
    // Refresh drafts list
<<<<<<< HEAD
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/drafts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrafts(res.data);
      } catch (err) {
        console.error('Failed to fetch drafts:', err);
      }
    })();
=======
    fetchDrafts();
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
    
    // Switch to drafts tab
    setActiveTab('drafts');
  };

  const statCards = [
    { label: 'Total Drafts', value: drafts.length, color: '#a855f7' },
    { label: 'This Month', value: drafts.filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth()).length, color: '#3b82f6' },
    { label: 'Completed', value: drafts.filter(d => d.status === 'completed').length || drafts.length, color: '#10b981' },
    { label: 'In Progress', value: drafts.filter(d => d.status === 'draft').length || 0, color: '#f59e0b' }
  ];

  const caseTypeColors = {
    Civil: '#3b82f6',
    Criminal: '#ef4444',
    Contract: '#10b981',
    Family: '#f59e0b',
    Property: '#8b5cf6',
    Employment: '#ec4899',
    General: '#6b7280',
  };

  return (
    <Layout>
      <div className="animate-fade-in-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                boxShadow: '0 4px 15px rgba(168,85,247,0.35)'
              }}>📄</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>My Drafts</h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginLeft: 60 }}>Manage, view, and export your legal drafts</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}
            style={{ fontSize: 14, padding: '12px 28px', borderRadius: 12 }}>
            + New Draft
          </button>
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: 'flex', gap: 10, marginBottom: 28,
          borderBottom: '1px solid rgba(148,163,184,0.15)',
          paddingBottom: 0
        }}>
          <button
            onClick={() => setActiveTab('drafts')}
            style={{
              padding: '12px 20px',
              background: activeTab === 'drafts' ? 'rgba(168,85,247,0.15)' : 'transparent',
              border: activeTab === 'drafts' ? '1px solid rgba(168,85,247,0.4)' : 'none',
              borderBottom: activeTab === 'drafts' ? '2px solid #a855f7' : '1px solid rgba(148,163,184,0.15)',
              borderRadius: '8px 8px 0 0',
              color: activeTab === 'drafts' ? '#c4b5fd' : '#64748b',
              fontWeight: activeTab === 'drafts' ? 700 : 500,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s'
            }}
          >
            📋 My Drafts
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '12px 20px',
              background: activeTab === 'upload' ? 'rgba(168,85,247,0.15)' : 'transparent',
              border: activeTab === 'upload' ? '1px solid rgba(168,85,247,0.4)' : 'none',
              borderBottom: activeTab === 'upload' ? '2px solid #a855f7' : '1px solid rgba(148,163,184,0.15)',
              borderRadius: '8px 8px 0 0',
              color: activeTab === 'upload' ? '#c4b5fd' : '#64748b',
              fontWeight: activeTab === 'upload' ? 700 : 500,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s'
            }}
          >
            📤 Upload & Analyze
          </button>
        </div>

        {/* ── Upload Tab ── */}
        {activeTab === 'upload' && (
          <UploadDocument onDraftGenerated={handleDraftGenerated} />
        )}

        {/* ── Drafts Tab ── */}
        {activeTab === 'drafts' && (
          <>
        {/* ── Search & Filter Tab ── */}
        <div className="card" style={{
          marginBottom: 28, padding: 0, overflow: 'hidden',
          border: '1px solid rgba(168,85,247,0.25)',
          background: 'rgba(15,23,42,0.8)'
        }}>
          {/* Tab Header */}
          <div style={{
            padding: '14px 24px',
            borderBottom: '1px solid rgba(148,163,184,0.15)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(168,85,247,0.06)'
          }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <span style={{ color: '#c4b5fd', fontWeight: 700, fontSize: 15, letterSpacing: '0.5px' }}>Search & Filter</span>
            <span style={{
              marginLeft: 'auto', fontSize: 12, color: '#64748b',
              background: 'rgba(100,116,139,0.15)', padding: '3px 10px', borderRadius: 20
            }}>{filteredDrafts.length} result{filteredDrafts.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Search Input — large & prominent */}
          <div style={{ padding: '20px 24px 16px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                fontSize: 20, opacity: 0.5
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search by title, case type, or keywords…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{
                  paddingLeft: 50, paddingRight: 20,
                  padding: '16px 20px 16px 52px',
                  fontSize: 16, borderRadius: 14,
                  background: 'rgba(30,41,59,0.9)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              />
            </div>
          </div>

          {/* Filters Row */}
          <div style={{
            padding: '0 24px 20px',
            display: 'flex', gap: 12, flexWrap: 'wrap'
          }}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
              style={{
                flex: 1, minWidth: 180, padding: '12px 16px',
                borderRadius: 10, fontSize: 14, cursor: 'pointer',
                background: 'rgba(30,41,59,0.9)',
                border: '1px solid rgba(148,163,184,0.2)',
              }}
            >
              <option value="all">All Case Types</option>
              <option value="Civil">Civil</option>
              <option value="Criminal">Criminal</option>
              <option value="Contract">Contract</option>
              <option value="Family">Family</option>
              <option value="Property">Property</option>
              <option value="Employment">Employment</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
              style={{
                flex: 1, minWidth: 180, padding: '12px 16px',
                borderRadius: 10, fontSize: 14, cursor: 'pointer',
                background: 'rgba(30,41,59,0.9)',
                border: '1px solid rgba(148,163,184,0.2)',
              }}
            >
              <option value="date">Sort by Date (Newest)</option>
              <option value="name">Sort by Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {statCards.map((s, i) => (
            <div key={i} className="card" style={{
              padding: '20px 22px', textAlign: 'center',
              borderTop: `3px solid ${s.color}`,
              background: 'rgba(15,23,42,0.7)',
            }}>
              <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Drafts Grid — Individual Card Boxes ── */}
        {filteredDrafts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>No Drafts Found</h3>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Create your first draft to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filteredDrafts.map((draft) => {
              const typeColor = caseTypeColors[draft.caseType] || caseTypeColors.General;
              return (
                <div key={draft._id} className="card glass-hover" style={{
                  padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  border: '1px solid rgba(148,163,184,0.15)',
                  background: 'rgba(15,23,42,0.7)',
                }}>
                  {/* Card color accent top bar */}
                  <div style={{ height: 4, background: `linear-gradient(90deg, ${typeColor}, ${typeColor}88)` }} />

                  {/* Card Header */}
                  <div style={{ padding: '20px 22px 14px', cursor: 'pointer' }} onClick={() => setViewDraft(draft)}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <h3 style={{
                        fontSize: 16, fontWeight: 700, color: '#f1f5f9',
                        lineHeight: 1.35, flex: 1,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {draft.title || 'Untitled Draft'}
                      </h3>
                      <span style={{
                        flexShrink: 0, padding: '4px 10px', borderRadius: 6,
                        background: `${typeColor}22`, border: `1px solid ${typeColor}44`,
                        color: typeColor, fontSize: 10, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: 0.8, whiteSpace: 'nowrap'
                      }}>
                        {draft.caseType || 'General'}
                      </span>
                    </div>

                    <p style={{
                      color: '#94a3b8', fontSize: 13, lineHeight: 1.6,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                    }}>
                      {draft.details || draft.draftText?.substring(0, 200) || 'No description'}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div style={{
                    marginTop: 'auto',
                    padding: '14px 22px',
                    borderTop: '1px solid rgba(148,163,184,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(15,23,42,0.3)'
                  }}>
                    <span style={{ color: '#64748b', fontSize: 12 }}>
                      {formatDate(draft.createdAt, { short: true })}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setViewDraft(draft)} title="View"
                        style={{
                          padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                          color: '#60a5fa', cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        👁️ View
                      </button>
                      <button onClick={() => exportToPDF(draft)} title="Export PDF"
                        style={{
                          padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                          color: '#34d399', cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        📥 PDF
                      </button>
                      <button onClick={() => {
                        localStorage.setItem('editDraft', JSON.stringify(draft));
                        navigate('/dashboard');
                      }} title="Edit"
                        style={{
                          padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)',
                          color: '#c084fc', cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => deleteDraft(draft._id)} title="Delete"
                        style={{
                          padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                          color: '#f87171', cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        </>
        )}

      {/* ── View Draft Modal ── */}
      {viewDraft && (
        <div
          onClick={() => setViewDraft(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: 16, width: '100%', maxWidth: 780,
              maxHeight: '85vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.1)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px 28px', borderBottom: '1px solid rgba(148,163,184,0.15)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
                  {viewDraft.title || 'Untitled Draft'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 6,
                    background: `${caseTypeColors[viewDraft.caseType] || '#6b7280'}22`,
                    border: `1px solid ${caseTypeColors[viewDraft.caseType] || '#6b7280'}44`,
                    color: caseTypeColors[viewDraft.caseType] || '#6b7280',
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8
                  }}>
                    {viewDraft.caseType || 'General'}
                  </span>
                  <span style={{ color: '#64748b', fontSize: 13 }}>
                    Created {formatDate(viewDraft.createdAt, { short: true })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewDraft(null)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.2)',
                  color: '#94a3b8', fontSize: 16, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }} className="activity-scroll">
              {viewDraft.details && viewDraft.details !== viewDraft.draftText && (
                <div style={{
                  marginBottom: 24, padding: 18, borderRadius: 12,
                  background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.12)'
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#64748b', marginBottom: 8 }}>Case Details</p>
                  <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{viewDraft.details}</p>
                </div>
              )}

              <div style={{
                background: '#fff', borderRadius: 12, padding: 28,
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <pre style={{
                  color: '#1e293b', fontSize: 14, whiteSpace: 'pre-wrap',
                  fontFamily: "'Inter', sans-serif", lineHeight: 1.8, margin: 0
                }}>
                  {viewDraft.draftText || viewDraft.details || 'No content available for this draft.'}
                </pre>
              </div>

              {viewDraft.clauses && viewDraft.clauses.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#64748b', marginBottom: 14 }}>Clauses</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {viewDraft.clauses.map((clause, idx) => (
                      <div key={idx} style={{
                        padding: 16, borderRadius: 10,
                        background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.12)'
                      }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#c084fc', marginBottom: 6 }}>{clause.title || clause.key}</p>
                        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{clause.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '18px 28px', borderTop: '1px solid rgba(148,163,184,0.15)',
              display: 'flex', gap: 10
            }}>
              <button onClick={() => exportToPDF(viewDraft)} className="btn-primary"
                style={{ flex: 1, borderRadius: 12, padding: '13px 20px', fontSize: 14, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
                📥 Export PDF
              </button>
              <button onClick={() => { localStorage.setItem('editDraft', JSON.stringify(viewDraft)); navigate('/dashboard'); }}
                className="btn-primary" style={{ flex: 1, borderRadius: 12, padding: '13px 20px', fontSize: 14 }}>
                ✏️ Edit Draft
              </button>
              <button onClick={() => setViewDraft(null)} className="btn-secondary"
                style={{ borderRadius: 12, padding: '13px 24px', fontSize: 14 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default DraftsPage;
