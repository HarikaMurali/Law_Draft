import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from '../utils/axios';
import '../App.css';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/analytics');
      
      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        setAnalytics(null);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return typeof num === 'number' ? num.toLocaleString() : 0;
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ display: 'inline-flex', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a855f7', animation: 'pulse 1.2s ease-in-out infinite' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1.2s ease-in-out infinite 0.2s' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 1.2s ease-in-out infinite 0.4s' }} />
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>Loading analytics…</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analytics) {
    return (
      <Layout>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(15,23,42,0.7)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>No Analytics Data Yet</h2>
            <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
              Start creating drafts and using research tools to populate your analytics dashboard.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  const statCards = [
    { label: 'Total Drafts', value: formatNumber(analytics.totalDrafts), icon: '📄', color: '#a855f7' },
    { label: 'Research Count', value: formatNumber(analytics.researchCount), icon: '🔬', color: '#3b82f6' },
    { label: 'Total Activities', value: formatNumber(analytics.totalActivities), icon: '📈', color: '#10b981' },
    { label: 'Avg Daily Activity', value: analytics.avgDailyActivity || '0', icon: '⚡', color: '#f59e0b' },
  ];

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
              }}>📊</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Analytics</h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginLeft: 60 }}>Overview of your drafting productivity and usage patterns</p>
          </div>
          <button onClick={() => { setLoading(true); fetchAnalytics(); }} className="btn-primary"
            style={{ padding: '10px 22px', borderRadius: 12, fontSize: 13 }}>🔄 Refresh</button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {statCards.map((s, i) => (
            <div key={i} className="card" style={{
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

        {/* ── Charts Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Bar Chart — Monthly Drafts */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
            <div style={{
              padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(168,85,247,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>📊</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Monthly Drafts</span>
              </div>
              <span style={{ fontSize: 11, color: '#64748b', background: 'rgba(100,116,139,0.15)', padding: '3px 10px', borderRadius: 20 }}>Last 6 months</span>
            </div>
            <div style={{ padding: '20px 16px 16px' }}>
              {analytics.monthlyDrafts?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.monthlyDrafts} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '11px', fontWeight: '600' }} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" style={{ fontSize: '11px' }} tickLine={false} axisLine={false} width={30} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }} cursor={{ fill: 'rgba(148, 163, 184, 0.06)' }} />
                    <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} name="Drafts" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>No data yet</div>
              )}
            </div>
          </div>

          {/* Pie Chart — Case Types */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
            <div style={{
              padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(59,130,246,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Case Types</span>
              </div>
              <span style={{ fontSize: 11, color: '#64748b', background: 'rgba(100,116,139,0.15)', padding: '3px 10px', borderRadius: 20 }}>{analytics.draftsByType?.length || 0} types</span>
            </div>
            <div style={{ padding: '20px 16px 16px' }}>
              {analytics.draftsByType?.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <ResponsiveContainer width="55%" height={220}>
                    <PieChart>
                      <Pie data={analytics.draftsByType} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                        {analytics.draftsByType.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {analytics.draftsByType.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[idx % COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#cbd5e1', flex: 1 }}>{item.type}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>No data yet</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Line Chart — Activity Trend ── */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
          <div style={{
            padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(16,185,129,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>📈</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Activity Trend</span>
            </div>
            <span style={{ fontSize: 11, color: '#64748b', background: 'rgba(100,116,139,0.15)', padding: '3px 10px', borderRadius: 20 }}>Last 7 days</span>
          </div>
          <div style={{ padding: '20px 16px 16px' }}>
            {analytics.dailyActivity?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={analytics.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '11px', fontWeight: '600' }} tickLine={false} axisLine={false}
                    tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} />
                  <YAxis stroke="#64748b" style={{ fontSize: '11px' }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
                    labelFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    cursor={{ stroke: '#475569', strokeDasharray: '4 4' }} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Activities" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>No data yet</div>
            )}
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

          {/* Activity Breakdown */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
            <div style={{
              padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(245,158,11,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🎯</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Activity Breakdown</span>
              </div>
              <span style={{ fontSize: 11, color: '#64748b', background: 'rgba(100,116,139,0.15)', padding: '3px 10px', borderRadius: 20 }}>{analytics.activityByAction?.length || 0} types</span>
            </div>
            <div style={{ padding: '22px 24px' }}>
              {analytics.activityByAction?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {analytics.activityByAction.map((item, idx) => {
                    const maxCount = Math.max(...analytics.activityByAction.map(a => a.count), 1);
                    const pct = (item.count / maxCount) * 100;
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>{item.action}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{item.count}</span>
                        </div>
                        <div style={{ width: '100%', height: 8, background: 'rgba(100,116,139,0.15)', borderRadius: 20, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 20, background: COLORS[idx % COLORS.length], transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#64748b', fontSize: 14 }}>No data yet</p>
              )}
            </div>
          </div>

          {/* Summary Side Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{
              padding: '24px', background: 'rgba(15,23,42,0.7)',
              borderTop: '3px solid #f59e0b',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>📈</span>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#f59e0b' }}>Total</span>
              </div>
              <p style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{formatNumber(analytics.totalActivities)}</p>
              <p style={{ color: '#64748b', fontSize: 12 }}>All recorded activities</p>
            </div>

            <div className="card" style={{
              padding: '24px', background: 'rgba(15,23,42,0.7)',
              borderTop: '3px solid #ec4899',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>🔬</span>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#ec4899' }}>Research</span>
              </div>
              <p style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{formatNumber(analytics.researchCount)}</p>
              <p style={{ color: '#64748b', fontSize: 12 }}>Case law & statute searches</p>
            </div>

            <div className="card" style={{
              padding: '24px', background: 'rgba(15,23,42,0.7)',
              borderTop: '3px solid #10b981',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>🎯</span>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#10b981' }}>Most Active</span>
              </div>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
                {analytics.mostActiveDay?.date ? new Date(analytics.mostActiveDay.date).toLocaleDateString('en-IN', { weekday: 'long' }) : '—'}
              </p>
              <p style={{ color: '#64748b', fontSize: 12 }}>{analytics.mostActiveDay?.count || 0} activities that day</p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AnalyticsPage;
