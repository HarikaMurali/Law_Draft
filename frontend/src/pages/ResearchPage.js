import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from '../utils/axios';
import '../App.css';

const ResearchPage = () => {
  const [activeTab, setActiveTab] = useState('caseLaw');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingFromHistory, setLoadingFromHistory] = useState(false);

  // Check for research data from History page
  useEffect(() => {
    const storedData = localStorage.getItem('researchData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setActiveTab(data.tab || 'caseLaw');
        setSearchQuery(data.query || '');
        const hasSavedResults = Array.isArray(data.resumeResults) && data.resumeResults.length > 0;

        if (hasSavedResults) {
          setLoadingFromHistory(true);
          setSearchResults(data.resumeResults);
          setTimeout(() => setLoadingFromHistory(false), 1200);
          localStorage.removeItem('researchData');
          return;
        }

        if (data.query) {
          setLoadingFromHistory(true);
          setTimeout(() => {
            performSearch(data.query, data.tab || 'caseLaw', true);
          }, 300);
        } else {
          setLoadingFromHistory(false);
        }

        localStorage.removeItem('researchData');
      } catch (error) {
        console.error('Failed to parse research data:', error);
        setLoadingFromHistory(false);
      }
    }
  }, []);

  const performSearch = async (query, tab, fromHistory = false) => {
    if (!query?.trim()) {
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      let response;
      
      if (tab === 'caseLaw') {
        response = await axios.post('/api/research/cases', { query });
        setSearchResults(response.data.results || []);
      } else if (tab === 'statutes') {
        response = await axios.post('/api/research/statutes', { query });
        setSearchResults(response.data.results || []);
      } else if (tab === 'dictionary') {
        response = await axios.post('/api/research/dictionary', { term: query });
        if (response.data.success) {
          setSearchResults([{
            term: response.data.term,
            definition: response.data.definition,
            category: 'Indian Law'
          }]);
        }
      }
      
      if (fromHistory) {
        setLoadingFromHistory(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      if (!fromHistory) {
        alert('Search failed. Please try again.');
      }
      setLoadingFromHistory(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    performSearch(searchQuery, activeTab);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleResearchMore = (query, type) => {
    let url = '';
    
    if (type === 'case') {
      // Search on Indian Kanoon
      url = `https://indiankanoon.org/search/?formInput=${encodeURIComponent(query)}`;
    } else if (type === 'statute') {
      // Search on India Code
      url = `https://www.indiacode.nic.in/search?searchText=${encodeURIComponent(query)}`;
    } else if (type === 'dictionary') {
      // Search on Google for legal definition
      url = `https://www.google.com/search?q=${encodeURIComponent(query + ' legal definition india')}`;
    }
    
    window.open(url, '_blank');
  };

  const tabConfig = {
    caseLaw:    { emoji: '📚', label: 'Case Law Database', color: '#3b82f6', desc: 'Search cases, citations, or legal issues…' },
    statutes:   { emoji: '📖', label: 'Statute Reference',  color: '#10b981', desc: 'Search statutes, acts, or sections…' },
    dictionary: { emoji: '📘', label: 'Legal Dictionary',   color: '#a855f7', desc: 'Search legal terms or definitions…' },
  };

  const tab = tabConfig[activeTab];

  return (
    <Layout>
      <div className="animate-fade-in-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                boxShadow: '0 4px 15px rgba(59,130,246,0.35)'
              }}>🔍</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Legal Research</h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginLeft: 60 }}>AI-powered Indian legal research — Cases, Statutes & Definitions</p>
          </div>
        </div>

        {/* Loading from History Banner */}
        {loadingFromHistory && (
          <div style={{
            padding: '14px 20px', borderRadius: 12, marginBottom: 20,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.1) 100%)',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex', alignItems: 'center', gap: 12,
            animation: 'fade-in-up 0.3s ease',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(59,130,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>📜</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#60a5fa', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Loading from History</p>
              <p style={{ color: '#94a3b8', fontSize: 12 }}>Retrieving your previous search results...</p>
            </div>
            <div style={{
              width: 20, height: 20, border: '2px solid rgba(59,130,246,0.3)',
              borderTopColor: '#3b82f6', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}

        {/* ── Category Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {Object.entries(tabConfig).map(([key, t]) => {
            const isActive = activeTab === key;
            return (
              <div key={key} className="card" onClick={() => setActiveTab(key)} style={{
                padding: '22px 24px', cursor: 'pointer',
                borderTop: `3px solid ${t.color}`,
                background: isActive ? `${t.color}15` : 'rgba(15,23,42,0.7)',
                border: isActive ? `1px solid ${t.color}55` : '1px solid rgba(148,163,184,0.15)',
                borderTopWidth: 3, borderTopColor: t.color,
                transition: 'all 0.25s ease',
                transform: isActive ? 'translateY(-2px)' : 'none',
                boxShadow: isActive ? `0 8px 25px ${t.color}25` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 36 }}>{t.emoji}</span>
                  <div>
                    <p style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{t.label}</p>
                    <p style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>Gemini AI Research</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Search & Filter Tab ── */}
        <div className="card" style={{
          marginBottom: 28, padding: 0, overflow: 'hidden',
          border: `1px solid ${tab.color}40`,
          background: 'rgba(15,23,42,0.8)'
        }}>
          {/* Tab Header */}
          <div style={{
            padding: '14px 24px',
            borderBottom: '1px solid rgba(148,163,184,0.15)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: `${tab.color}08`
          }}>
            <span style={{ fontSize: 18 }}>{tab.emoji}</span>
            <span style={{ color: tab.color, fontWeight: 700, fontSize: 15, letterSpacing: '0.5px' }}>{tab.label}</span>
            {searchResults.length > 0 && (
              <span style={{
                marginLeft: 'auto', fontSize: 12, color: '#64748b',
                background: 'rgba(100,116,139,0.15)', padding: '3px 10px', borderRadius: 20
              }}>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Large Search Input */}
          <div style={{ padding: '22px 24px 18px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                fontSize: 22, opacity: 0.5
              }}>🔍</span>
              <input
                type="text"
                placeholder={tab.desc}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field"
                style={{
                  paddingLeft: 56, paddingRight: 150,
                  padding: '18px 150px 18px 56px',
                  fontSize: 16, borderRadius: 14,
                  background: 'rgba(30,41,59,0.9)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  color: '#e2e8f0',
                }}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="btn-primary"
                data-search-trigger="true"
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  padding: '12px 24px', borderRadius: 10, fontSize: 14,
                  background: `linear-gradient(135deg, ${tab.color}, ${tab.color}cc)`,
                  boxShadow: `0 4px 15px ${tab.color}40`,
                  opacity: isSearching ? 0.6 : 1,
                }}
              >
                {isSearching ? '⏳ Searching…' : '🔎 Search'}
              </button>
            </div>
          </div>

          {/* Tab Switcher Pills */}
          <div style={{ padding: '0 24px 18px', display: 'flex', gap: 8 }}>
            {Object.entries(tabConfig).map(([key, t]) => {
              const isActive = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                  background: isActive ? `${t.color}22` : 'rgba(30,41,59,0.6)',
                  color: isActive ? t.color : '#94a3b8',
                  outline: isActive ? `1px solid ${t.color}44` : '1px solid transparent',
                }}>
                  {t.emoji} {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content: Case Law ── */}
        {activeTab === 'caseLaw' && (
          <div>
            {searchResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {searchResults.map((caseItem) => (
                  <div key={caseItem.id} className="card glass-hover" style={{
                    padding: 0, overflow: 'hidden',
                    borderLeft: '4px solid #3b82f6',
                    background: 'rgba(15,23,42,0.7)',
                  }}>
                    <div style={{ padding: '24px 26px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ fontSize: 28 }}>⚖️</span>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{caseItem.title}</h3>
                          </div>
                          <p style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: 14, marginLeft: 42 }}>📑 {caseItem.citation}</p>
                          <div style={{ display: 'flex', gap: 16, marginTop: 8, marginLeft: 42 }}>
                            <span style={{ color: '#64748b', fontSize: 13 }}>🏛️ {caseItem.court}</span>
                            <span style={{ color: '#64748b', fontSize: 13 }}>📅 {caseItem.year}</span>
                          </div>
                        </div>
                        <span style={{
                          padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                          background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                          color: '#60a5fa', whiteSpace: 'nowrap', flexShrink: 0,
                        }}>{caseItem.relevance}</span>
                      </div>
                      <div style={{
                        background: 'rgba(30,41,59,0.5)', borderRadius: 10, padding: 16,
                        marginLeft: 42, marginBottom: 16,
                      }}>
                        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{caseItem.summary}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginLeft: 42 }}>
                        <button onClick={() => handleCopyToClipboard(caseItem.citation)} style={{
                          flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                          background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.15)',
                          color: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s',
                        }}>📋 Copy Citation</button>
                        <button onClick={() => handleCopyToClipboard(`${caseItem.title}\n${caseItem.citation}\n${caseItem.summary}`)}
                          className="btn-primary" style={{
                            flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13,
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
                          }}>📄 Copy Case Details</button>
                        <button onClick={() => handleResearchMore(caseItem.title, 'case')}
                          className="btn-primary" style={{
                            flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                          }}>🔗 Research More</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="card" style={{ textAlign: 'center', padding: '50px 30px', background: 'rgba(15,23,42,0.7)' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>📚</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>AI-Powered Case Law Research</h3>
                <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                  Search for Indian Supreme Court and High Court judgments using AI
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 650, margin: '0 auto' }}>
                  {[
                    { label: 'Try searching:', term: 'Fundamental Rights', color: '#3b82f6' },
                    { label: 'Or by article:', term: 'Article 21', color: '#a855f7' },
                    { label: 'Or case name:', term: 'Kesavananda Bharati', color: '#10b981' },
                  ].map((s, i) => (
                    <div key={i} onClick={() => { setSearchQuery(s.term); }} style={{
                      padding: '18px 16px', borderRadius: 12, cursor: 'pointer',
                      background: `${s.color}18`, border: `1px solid ${s.color}35`,
                      transition: 'all 0.2s',
                    }}>
                      <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{s.label}</p>
                      <p style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>"{s.term}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Content: Statutes ── */}
        {activeTab === 'statutes' && (
          <div>
            {searchResults.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {searchResults.map((statute) => (
                  <div key={statute.id} className="card glass-hover" style={{
                    padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    borderLeft: '4px solid #10b981',
                    background: 'rgba(15,23,42,0.7)',
                  }}>
                    <div style={{ padding: '22px 24px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                        <span style={{ fontSize: 30, flexShrink: 0 }}>📜</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{statute.title}</h3>
                          <span style={{
                            display: 'inline-block', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                            color: '#34d399',
                          }}>{statute.sections}</span>
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(30,41,59,0.5)', borderRadius: 10, padding: 14, marginBottom: 14,
                      }}>
                        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.65 }}>{statute.description}</p>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                        {statute.keywords.split(',').map((keyword, idx) => (
                          <span key={idx} style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                            color: '#6ee7b7',
                          }}>{keyword.trim()}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: '0 24px 20px', display: 'flex', gap: 10 }}>
                      <button onClick={() => handleCopyToClipboard(`${statute.title}\n${statute.description}`)}
                        className="btn-primary" style={{
                          flex: 1, padding: '11px 16px', borderRadius: 10, fontSize: 13,
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                        }}>📋 Copy Details</button>
                      <button onClick={() => handleResearchMore(statute.title, 'statute')}
                        className="btn-primary" style={{
                          flex: 1, padding: '11px 16px', borderRadius: 10, fontSize: 13,
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
                        }}>🔗 Research More</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '50px 30px', background: 'rgba(15,23,42,0.7)' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>📖</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Search Indian Statutes & Acts</h3>
                <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                  Search for IPC sections, bare acts, and legal provisions
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 650, margin: '0 auto' }}>
                  {[
                    { label: 'Try searching:', term: 'Indian Penal Code', color: '#10b981' },
                    { label: 'Or by section:', term: 'Section 302 IPC', color: '#3b82f6' },
                    { label: 'Or by act:', term: 'Contract Act', color: '#a855f7' },
                  ].map((s, i) => (
                    <div key={i} onClick={() => { setSearchQuery(s.term); }} style={{
                      padding: '18px 16px', borderRadius: 12, cursor: 'pointer',
                      background: `${s.color}18`, border: `1px solid ${s.color}35`,
                      transition: 'all 0.2s',
                    }}>
                      <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{s.label}</p>
                      <p style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>"{s.term}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Content: Dictionary ── */}
        {activeTab === 'dictionary' && (
          <div>
            {searchResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {searchResults.map((term, idx) => (
                  <div key={idx} className="card glass-hover" style={{
                    padding: 0, overflow: 'hidden',
                    borderLeft: '4px solid #a855f7',
                    background: 'rgba(15,23,42,0.7)',
                  }}>
                    <div style={{ padding: '24px 26px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 28 }}>📖</span>
                          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{term.term}</h3>
                        </div>
                        <span style={{
                          padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                          color: '#c084fc',
                        }}>{term.category}</span>
                      </div>
                      <div style={{
                        background: 'rgba(30,41,59,0.5)', borderRadius: 10, padding: 18, marginBottom: 16,
                      }}>
                        <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{term.definition}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => handleCopyToClipboard(`${term.term}: ${term.definition}`)}
                          className="btn-primary" style={{
                            flex: 1, padding: '12px 16px', borderRadius: 10, fontSize: 13,
                            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                            boxShadow: '0 4px 15px rgba(168,85,247,0.3)',
                          }}>📋 Copy Definition</button>
                        <button onClick={() => handleResearchMore(term.term, 'dictionary')}
                          className="btn-primary" style={{
                            flex: 1, padding: '12px 16px', borderRadius: 10, fontSize: 13,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                          }}>🔗 Research More</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '50px 30px', background: 'rgba(15,23,42,0.7)' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>📘</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>AI-Powered Legal Dictionary</h3>
                <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                  Get instant AI definitions for legal terms, IPC sections & concepts
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 650, margin: '0 auto' }}>
                  {[
                    { label: 'Try searching:', term: 'IPC 302', color: '#a855f7' },
                    { label: 'Or Latin terms:', term: 'Habeas Corpus', color: '#3b82f6' },
                    { label: 'Or concepts:', term: 'Mens Rea', color: '#10b981' },
                  ].map((s, i) => (
                    <div key={i} onClick={() => { setSearchQuery(s.term); }} style={{
                      padding: '18px 16px', borderRadius: 12, cursor: 'pointer',
                      background: `${s.color}18`, border: `1px solid ${s.color}35`,
                      transition: 'all 0.2s',
                    }}>
                      <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{s.label}</p>
                      <p style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>"{s.term}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Quick Tips ── */}
        <div className="card" style={{
          marginTop: 32, padding: 0, overflow: 'hidden',
          borderLeft: '4px solid #f59e0b',
          background: 'rgba(15,23,42,0.7)',
        }}>
          <div style={{
            padding: '14px 24px',
            borderBottom: '1px solid rgba(148,163,184,0.1)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(245,158,11,0.05)'
          }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15, letterSpacing: '0.5px' }}>Research Tips</span>
          </div>
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {[
                { icon: '🎯', text: 'Use specific keywords for more accurate results' },
                { icon: '📑', text: 'Search by case name, citation, or legal principle' },
                { icon: '📝', text: 'Citations can be directly inserted into your drafts' },
                { icon: '⭐', text: 'Bookmark frequently used statutes and cases' },
                { icon: '🕐', text: 'All research is saved in your history for reference' },
              ].map((tip, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.08)',
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
                  <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.5 }}>{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default ResearchPage;
