import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from '../utils/axios';
import { formatDate as sharedFormatDate } from '../utils/dateFormat';
import '../App.css';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState('all'); // 'all', '7days', '30days', 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'filters', 'date'
  const [resumeLoadingId, setResumeLoadingId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/activity/history', {
          params: {
            action: filterAction === 'all' ? undefined : filterAction,
            type: filterType === 'all' ? undefined : filterType,
            search: searchTerm || undefined,
            page,
            limit: 20
          }
        });

        if (response.data.success) {
          setActivities(response.data.activities);
          setTotalPages(response.data.pagination?.pages || 1);
        } else {
          setActivities([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
        setActivities([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [filterAction, filterType, searchTerm, page]);
  const formatDate = (dateString) => sharedFormatDate(dateString, { time: true, short: true });

  const getActionIcon = (action) => {
    const iconMap = {
      'Generated Draft': '✨',
      'Edited Draft': '✏️',
      'Deleted Draft': '🗑️',
      'Downloaded Draft': '⬇️',
      'Proofreading': '🔍',
      'Clause Suggestion': '💡',
      'Case Law Search': '📚',
      'Statute Search': '📖',
      'Dictionary Lookup': '📘',
      'Template Used': '📋',
      'Login': '🔐',
      'Registered': '✅'
    };
    return iconMap[action] || '📌';
  };

  const getFilteredActivities = () => {
    let filtered = activities;

    // Filter by date if custom range is set
    if (dateRange !== 'all' && (startDate || endDate)) {
      filtered = filtered.filter((activity) => {
        const actDate = new Date(activity.createdAt).toISOString().split('T')[0];
        if (startDate && actDate < startDate) return false;
        if (endDate && actDate > endDate) return false;
        return true;
      });
    }

    return filtered;
  };

  const resumableActions = new Set([
    'Case Law Search',
    'Statute Search',
    'Dictionary Lookup',
    'Proofreading',
    'Clause Suggestion'
  ]);

  const fallbackResumeNavigation = async (activity) => {
    const action = activity.action;

    if (action === 'Case Law Search' || action === 'Statute Search' || action === 'Dictionary Lookup') {
      const searchQuery = activity.metadata?.query || activity.metadata?.searchQuery || activity.metadata?.term || activity.title?.replace(/^Searched: |^Looked up: /, '');
      const tab = action === 'Case Law Search' ? 'caseLaw' : action === 'Statute Search' ? 'statutes' : 'dictionary';
      localStorage.setItem('researchData', JSON.stringify({
        tab,
        query: searchQuery,
        resumeResults: activity.metadata?.results || activity.metadata?.topResults || null,
        resumedAt: new Date().toISOString()
      }));
      navigate('/research');
      return true;
    }

    if (action === 'Proofreading' || action === 'Clause Suggestion') {
      if (activity.draftId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/api/drafts/${activity.draftId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data) {
            localStorage.setItem('editDraft', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Failed to fetch draft:', error);
        }
      }
      navigate('/dashboard');
      return true;
    }

    return false;
  };

  const resumeActivity = async (activity) => {
    if (!activity?._id) return false;
    setResumeLoadingId(activity._id);
    try {
      const response = await axios.get(`/api/activity/resume/${activity._id}`);
      const { resumeType, resumePayload } = response.data || {};

      if (!resumeType || !resumePayload) {
        throw new Error('No resume data');
      }

      if (resumeType.startsWith('research')) {
        localStorage.setItem('researchData', JSON.stringify({
          tab: resumePayload.tab || 'caseLaw',
          query: resumePayload.query || '',
          resumeResults: resumePayload.results || [],
          resumedAt: resumePayload.timestamp || new Date().toISOString()
        }));
        navigate('/research');
        return true;
      }

      if (resumeType === 'proofread') {
        localStorage.setItem('resumeProofread', JSON.stringify(resumePayload));
        navigate('/dashboard');
        return true;
      }

      if (resumeType === 'clause-suggestion') {
        localStorage.setItem('resumeClauses', JSON.stringify(resumePayload));
        navigate('/dashboard');
        return true;
      }

      throw new Error('Unsupported resume type');
    } catch (error) {
      console.error('Failed to resume activity:', error);
      throw error;
    } finally {
      setResumeLoadingId(null);
    }
  };

  const handleActivityClick = async (activity) => {
    const action = activity.action;

    if (resumableActions.has(action)) {
      try {
        const resumed = await resumeActivity(activity);
        if (resumed) return;
      } catch (error) {
        const handled = await fallbackResumeNavigation(activity);
        if (handled) return;
        alert('Unable to load saved data. Please try again.');
        return;
      }
      return;
    }
    
    // Research activities - redirect to Research page with query
    // Draft activities - redirect to drafts page or dashboard
    if (action === 'Generated Draft' || action === 'Edited Draft') {
      if (activity.draftId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/api/drafts/${activity.draftId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data) {
            localStorage.setItem('editDraft', JSON.stringify(response.data));
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Failed to fetch draft:', error);
          // Fallback to drafts page
          navigate('/drafts');
        }
      } else {
        navigate('/drafts');
      }
      return;
    }
    
    // Template Used - redirect to templates page
    if (action === 'Template Used') {
      navigate('/templates');
      return;
    }
    
    // Deleted Draft - redirect to drafts page
    if (action === 'Deleted Draft' || action === 'Downloaded Draft') {
      navigate('/drafts');
      return;
    }
  };

  const getActionColorHex = (action) => {
    const colorMap = {
      'Generated Draft': '#a855f7',
      'Edited Draft': '#3b82f6',
      'Deleted Draft': '#ef4444',
      'Downloaded Draft': '#06b6d4',
      'Proofreading': '#eab308',
      'Clause Suggestion': '#ec4899',
      'Case Law Search': '#10b981',
      'Statute Search': '#f97316',
      'Dictionary Lookup': '#6366f1',
      'Template Used': '#f59e0b',
      'Login': '#64748b',
      'Registered': '#22c55e'
    };
    return colorMap[action] || '#94a3b8';
  };

  const filteredActivities = getFilteredActivities();

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
              }}>📋</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Activity History</h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginLeft: 60 }}>Track and filter all your actions in one place</p>
          </div>
          <span style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)',
            color: '#c084fc',
          }}>{filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'}</span>
        </div>

        {/* ── Filter Panel ── */}
        <div className="card" style={{
          marginBottom: 28, padding: 0, overflow: 'hidden',
          border: '1px solid rgba(168,85,247,0.25)',
          background: 'rgba(15,23,42,0.8)'
        }}>
          {/* Tab Bar */}
          <div style={{
            display: 'flex', borderBottom: '1px solid rgba(148,163,184,0.12)',
            background: 'rgba(168,85,247,0.04)'
          }}>
            {[
              { key: 'search',  icon: '🔍', label: 'Search' },
              { key: 'filters', icon: '⚙️', label: 'Filters' },
              { key: 'date',    icon: '📅', label: 'Date Range' }
            ].map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                flex: 1, padding: '14px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                background: 'transparent', border: 'none',
                color: activeTab === t.key ? '#fff' : '#64748b',
                borderBottom: activeTab === t.key ? '2px solid #a855f7' : '2px solid transparent',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '22px 24px' }}>
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div>
                <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>Search activities</p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 20, opacity: 0.5 }}>🔍</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    placeholder="Search by title, description, or keyword…"
                    className="input-field"
                    style={{
                      padding: '16px 20px 16px 54px', fontSize: 16, borderRadius: 14,
                      background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(148,163,184,0.2)',
                    }}
                  />
                </div>
                <p style={{ color: '#475569', fontSize: 12, marginTop: 10 }}>Results update as you type</p>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>Action Type</p>
                  <select value={filterAction} onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
                    className="input-field" style={{ padding: '14px 16px', borderRadius: 12, fontSize: 14, cursor: 'pointer', background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(148,163,184,0.2)' }}>
                    <option value="all">All Actions</option>
                    <option value="Generated Draft">✨ Generated Draft</option>
                    <option value="Edited Draft">✏️ Edited Draft</option>
                    <option value="Deleted Draft">🗑️ Deleted Draft</option>
                    <option value="Case Law Search">📚 Case Law Search</option>
                    <option value="Statute Search">📖 Statute Search</option>
                    <option value="Dictionary Lookup">📘 Dictionary Lookup</option>
                    <option value="Proofreading">🔍 Proofreading</option>
                    <option value="Clause Suggestion">💡 Clause Suggestion</option>
                  </select>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>Case Type</p>
                  <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                    className="input-field" style={{ padding: '14px 16px', borderRadius: 12, fontSize: 14, cursor: 'pointer', background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(148,163,184,0.2)' }}>
                    <option value="all">All Types</option>
                    <option value="Contract">📜 Contract</option>
                    <option value="Civil">⚖️ Civil</option>
                    <option value="Criminal">🚨 Criminal</option>
                    <option value="Family">👨‍👩‍👧 Family</option>
                  </select>
                </div>
              </div>
            )}

            {/* Date Range Tab */}
            {activeTab === 'date' && (
              <div>
                <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>Select period</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
                  {[
                    { value: 'all',    label: 'All Time',     icon: '🌐' },
                    { value: '7days',  label: 'Last 7 Days',  icon: '📆' },
                    { value: '30days', label: 'Last 30 Days', icon: '📊' },
                    { value: 'custom', label: 'Custom',       icon: '✏️' }
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => {
                      setDateRange(opt.value); setPage(1);
                      if (opt.value === '7days') { const d = new Date(); setEndDate(d.toISOString().split('T')[0]); d.setDate(d.getDate() - 7); setStartDate(d.toISOString().split('T')[0]); }
                      else if (opt.value === '30days') { const d = new Date(); setEndDate(d.toISOString().split('T')[0]); d.setDate(d.getDate() - 30); setStartDate(d.toISOString().split('T')[0]); }
                      else { setStartDate(''); setEndDate(''); }
                    }} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      padding: '14px 8px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 700, border: 'none',
                      background: dateRange === opt.value ? 'rgba(168,85,247,0.15)' : 'rgba(30,41,59,0.6)',
                      outline: dateRange === opt.value ? '1px solid rgba(168,85,247,0.45)' : '1px solid rgba(148,163,184,0.12)',
                      color: dateRange === opt.value ? '#c084fc' : '#94a3b8',
                      transition: 'all 0.2s',
                    }}>
                      <span style={{ fontSize: 20 }}>{opt.icon}</span>{opt.label}
                    </button>
                  ))}
                </div>

                {dateRange === 'custom' && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
                    padding: 18, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 12
                  }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>From</p>
                      <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                        className="input-field" style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(148,163,184,0.2)' }} />
                    </div>
                    <div>
                      <p style={{ color: '#64748b', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>To</p>
                      <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                        className="input-field" style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(148,163,184,0.2)' }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Filters Bar */}
          {(searchTerm || filterAction !== 'all' || filterType !== 'all' || dateRange !== 'all') && (
            <div style={{
              borderTop: '1px solid rgba(148,163,184,0.1)', background: 'rgba(15,23,42,0.4)',
              padding: '12px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: '#475569', fontSize: 11, fontWeight: 700, marginRight: 4 }}>Active:</span>
              {searchTerm && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}>
                  🔍 {searchTerm} <button onClick={() => { setSearchTerm(''); setPage(1); }} style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: 14 }}>×</button>
                </span>
              )}
              {filterAction !== 'all' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                  ⚙️ {filterAction} <button onClick={() => { setFilterAction('all'); setPage(1); }} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: 14 }}>×</button>
                </span>
              )}
              {filterType !== 'all' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                  📋 {filterType} <button onClick={() => { setFilterType('all'); setPage(1); }} style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontSize: 14 }}>×</button>
                </span>
              )}
              {dateRange !== 'all' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.3)', color: '#f472b6' }}>
                  📅 {dateRange === '7days' ? '7 days' : dateRange === '30days' ? '30 days' : 'Custom'}
                  <button onClick={() => { setDateRange('all'); setPage(1); }} style={{ background: 'none', border: 'none', color: '#f472b6', cursor: 'pointer', fontSize: 14 }}>×</button>
                </span>
              )}
              <button onClick={() => { setFilterAction('all'); setFilterType('all'); setSearchTerm(''); setDateRange('all'); setPage(1); }}
                style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
            </div>
          )}
        </div>

        {/* ── Activity List ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ display: 'inline-flex', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a855f7', animation: 'pulse 1.2s ease-in-out infinite' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1.2s ease-in-out infinite 0.2s' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 1.2s ease-in-out infinite 0.4s' }} />
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>Loading activity history…</p>
          </div>
        ) : filteredActivities.length > 0 ? (
          <>
            <p style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 }}>
              {filteredActivities.length} Result{filteredActivities.length !== 1 ? 's' : ''}
            </p>

            {/* Helper Text */}
            <div style={{
              padding: '12px 16px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5 }}>
                <strong style={{ color: '#60a5fa' }}>Tip:</strong> Click on any activity with a <span style={{ color: '#60a5fa', fontWeight: 700 }}>→</span> arrow to view or continue that work
              </p>
            </div>

            {/* Activity Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredActivities.map((activity, idx) => {
                const color = getActionColorHex(activity.action);
                const isClickable = ['Generated Draft', 'Edited Draft', 'Template Used', 'Deleted Draft', 'Downloaded Draft'].includes(activity.action) || resumableActions.has(activity.action);
                const isResuming = resumeLoadingId === activity._id;
                return (
                  <div 
                    key={activity._id || idx} 
                    className="card glass-hover" 
                    onClick={() => isClickable && !isResuming && handleActivityClick(activity)}
                    style={{
                      padding: 0, overflow: 'hidden',
                      borderLeft: `4px solid ${color}`,
                      background: 'rgba(15,23,42,0.7)',
                      cursor: isClickable ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = `0 8px 25px ${color}30`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      {/* Icon */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                        background: `${color}18`, border: `1px solid ${color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                      }}>{getActionIcon(activity.action)}</div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color }}>{activity.action}</span>
                          {activity.caseType && (
                            <span style={{
                              padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                              background: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.2)',
                              color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8,
                            }}>{activity.caseType}</span>
                          )}
                        </div>
                        {(activity.title || activity.draftName) && (
                          <p style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {activity.title || activity.draftName}
                          </p>
                        )}
                        {activity.details && (
                          <p style={{ color: '#64748b', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.details}</p>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span style={{ color: '#475569', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {formatDate(activity.createdAt || activity.timestamp)}
                      </span>
                      
                      {/* Click indicator for clickable activities */}
                      {isClickable && (
                        <div style={{
                          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                          background: `${color}22`, border: `1px solid ${color}40`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: color, fontSize: 14, fontWeight: 700,
                        }}>
                          {isResuming ? '⏳' : '→'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(148,163,184,0.1)'
              }}>
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  style={{
                    padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                    background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.15)',
                    color: '#cbd5e1', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.3 : 1,
                  }}>← Prev</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, page - 2) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button key={pageNum} onClick={() => setPage(pageNum)} style={{
                      width: 36, height: 36, borderRadius: 10, fontSize: 13, fontWeight: 700,
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      background: pageNum === page ? '#a855f7' : 'rgba(30,41,59,0.4)',
                      color: pageNum === page ? '#fff' : '#94a3b8',
                      boxShadow: pageNum === page ? '0 4px 12px rgba(168,85,247,0.3)' : 'none',
                    }}>{pageNum}</button>
                  );
                })}
                <span style={{ color: '#475569', fontSize: 12, padding: '0 6px' }}>of {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="btn-primary" style={{
                    padding: '8px 16px', borderRadius: 10, fontSize: 13,
                    opacity: page === totalPages ? 0.3 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  }}>Next →</button>
              </div>
            )}
          </>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(15,23,42,0.7)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>No Activities Found</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
              {activities.length === 0 ? 'Start creating drafts and using research tools to build your activity log.' : 'Try adjusting your filters to view more results.'}
            </p>
            {(searchTerm || filterAction !== 'all' || filterType !== 'all' || dateRange !== 'all') && (
              <button onClick={() => { setFilterAction('all'); setFilterType('all'); setSearchTerm(''); setDateRange('all'); setPage(1); }}
                className="btn-primary" style={{ padding: '12px 28px', borderRadius: 12, fontSize: 14 }}>
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
