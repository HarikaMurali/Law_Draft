import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../App.css';

const SettingsPage = () => {
  const defaults = {
    darkMode: false, notifications: true, autoSave: true,
    language: 'en', dateFormat: 'DD/MM/YYYY', defaultCaseType: 'Civil',
    emailNotifications: true, soundEffects: false,
  };

  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('appSettings');
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch { return defaults; }
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings({ ...defaults });
    localStorage.removeItem('appSettings');
    setSaved(false);
  };

  /* ── Toggle switch component ── */
  const Toggle = ({ checked, onChange, color = '#a855f7' }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 52, height: 28, borderRadius: 20, cursor: 'pointer',
        background: checked ? color : 'rgba(100,116,139,0.3)',
        border: `1px solid ${checked ? color : 'rgba(148,163,184,0.2)'}`,
        position: 'relative', transition: 'all 0.25s ease',
        boxShadow: checked ? `0 0 12px ${color}44` : 'none',
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2,
        left: checked ? 27 : 3,
        transition: 'left 0.25s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  );

  /* ── Select dropdown component ── */
  const SelectField = ({ value, onChange, options }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      style={{
        width: 180, padding: '10px 14px', fontSize: 13, fontWeight: 600,
        background: 'rgba(15,23,42,0.8)', color: '#fff', border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: 10, cursor: 'pointer', appearance: 'auto',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  /* ── Setting row ── */
  const SettingRow = ({ icon, title, description, children, noBorder }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 0',
      borderBottom: noBorder ? 'none' : '1px solid rgba(148,163,184,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{title}</p>
          <p style={{ color: '#64748b', fontSize: 12 }}>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const sections = [
    {
      id: 'appearance', icon: '🎨', label: 'Appearance', color: '#a855f7',
      description: 'Theme, language, and date display preferences',
    },
    {
      id: 'editor', icon: '📝', label: 'Editor', color: '#3b82f6',
      description: 'Draft editing behavior and defaults',
    },
    {
      id: 'notifications', icon: '🔔', label: 'Notifications', color: '#f59e0b',
      description: 'Push, email, and sound alert settings',
    },
    {
      id: 'account', icon: '👤', label: 'Account', color: '#ef4444',
      description: 'Password, email, and account management',
    },
  ];

  return (
    <Layout>
      <div className="animate-fade-in-up" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                boxShadow: '0 4px 15px rgba(100,116,139,0.35)'
              }}>⚙️</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Settings</h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginLeft: 60 }}>Customize your experience and preferences</p>
          </div>
          {saved && (
            <div style={{
              padding: '8px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700,
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
              color: '#34d399', display: 'flex', alignItems: 'center', gap: 6,
            }}>✅ Saved!</div>
          )}
        </div>

        {/* ── Section Nav Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} style={{ textDecoration: 'none' }}>
              <div className="card glass-hover" style={{
                padding: '18px 16px', textAlign: 'center',
                borderTop: `3px solid ${s.color}`, background: 'rgba(15,23,42,0.7)', cursor: 'pointer',
              }}>
                <span style={{ fontSize: 26, display: 'block', marginBottom: 8 }}>{s.icon}</span>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{s.label}</p>
                <p style={{ color: '#64748b', fontSize: 10 }}>{s.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* ── Appearance ── */}
        <div id="appearance" className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(168,85,247,0.04)'
          }}>
            <span style={{ fontSize: 18 }}>🎨</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Appearance</span>
          </div>
          <div style={{ padding: '6px 28px 12px' }}>
            <SettingRow icon="🌙" title="Dark Mode" description="Enable dark theme across the application">
              <Toggle checked={settings.darkMode} onChange={(v) => handleChange('darkMode', v)} />
            </SettingRow>
            <SettingRow icon="🌐" title="Language" description="Select your preferred language">
              <SelectField value={settings.language} onChange={(v) => handleChange('language', v)} options={[
                { value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' }, { value: 'de', label: 'German' },
                { value: 'hi', label: 'Hindi' }, { value: 'ta', label: 'Tamil' },
              ]} />
            </SettingRow>
            <SettingRow icon="📅" title="Date Format" description="Choose how dates are displayed" noBorder>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, background: 'rgba(168,85,247,0.1)', padding: '4px 10px', borderRadius: 8 }}>
                  Preview: {(() => { const d = new Date(); const dd = String(d.getDate()).padStart(2,'0'); const mm = String(d.getMonth()+1).padStart(2,'0'); const yyyy = d.getFullYear(); if (settings.dateFormat === 'MM/DD/YYYY') return `${mm}/${dd}/${yyyy}`; if (settings.dateFormat === 'YYYY-MM-DD') return `${yyyy}-${mm}-${dd}`; return `${dd}/${mm}/${yyyy}`; })()}
                </span>
                <SelectField value={settings.dateFormat} onChange={(v) => handleChange('dateFormat', v)} options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]} />
              </div>
            </SettingRow>
          </div>
        </div>

        {/* ── Editor Preferences ── */}
        <div id="editor" className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(59,130,246,0.04)'
          }}>
            <span style={{ fontSize: 18 }}>📝</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Editor Preferences</span>
          </div>
          <div style={{ padding: '6px 28px 12px' }}>
            <SettingRow icon="💾" title="Auto-Save" description="Automatically save drafts while editing">
              <Toggle checked={settings.autoSave} onChange={(v) => handleChange('autoSave', v)} color="#3b82f6" />
            </SettingRow>
            <SettingRow icon="📋" title="Default Case Type" description="Pre-selected case type for new drafts" noBorder>
              <SelectField value={settings.defaultCaseType} onChange={(v) => handleChange('defaultCaseType', v)} options={[
                { value: 'Civil', label: 'Civil' }, { value: 'Criminal', label: 'Criminal' },
                { value: 'Contract', label: 'Contract' }, { value: 'Family', label: 'Family' },
                { value: 'Property', label: 'Property' }, { value: 'Employment', label: 'Employment' },
              ]} />
            </SettingRow>
          </div>
        </div>

        {/* ── Notifications ── */}
        <div id="notifications" className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(245,158,11,0.04)'
          }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Notifications</span>
          </div>
          <div style={{ padding: '6px 28px 12px' }}>
            <SettingRow icon="📲" title="Push Notifications" description="Receive in-app notifications">
              <Toggle checked={settings.notifications} onChange={(v) => handleChange('notifications', v)} color="#f59e0b" />
            </SettingRow>
            <SettingRow icon="📧" title="Email Notifications" description="Get updates and summaries via email">
              <Toggle checked={settings.emailNotifications} onChange={(v) => handleChange('emailNotifications', v)} color="#f59e0b" />
            </SettingRow>
            <SettingRow icon="🔊" title="Sound Effects" description="Play sounds for actions and alerts" noBorder>
              <Toggle checked={settings.soundEffects} onChange={(v) => handleChange('soundEffects', v)} color="#f59e0b" />
            </SettingRow>
          </div>
        </div>

        {/* ── Account ── */}
        <div id="account" className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 28, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(239,68,68,0.04)'
          }}>
            <span style={{ fontSize: 18 }}>👤</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Account</span>
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🔑', label: 'Change Password', desc: 'Update your account password', color: '#a855f7' },
              { icon: '📧', label: 'Update Email', desc: 'Change your registered email address', color: '#3b82f6' },
              { icon: '📤', label: 'Export Data', desc: 'Download all your drafts and history', color: '#10b981' },
            ].map((item, i) => (
              <button key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.12)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = item.color + '60'; e.currentTarget.style.background = item.color + '10'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)'; e.currentTarget.style.background = 'rgba(30,41,59,0.5)'; }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: item.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0
                }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.label}</p>
                  <p style={{ color: '#64748b', fontSize: 12 }}>{item.desc}</p>
                </div>
                <span style={{ color: '#475569', fontSize: 18 }}>›</span>
              </button>
            ))}

            {/* Danger Zone */}
            <div style={{ marginTop: 8, padding: '16px 18px', borderRadius: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: 'rgba(239,68,68,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0
                }}>🗑️</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fca5a5', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Delete Account</p>
                  <p style={{ color: '#64748b', fontSize: 12 }}>Permanently delete your account and all data</p>
                </div>
                <button style={{
                  padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5', cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                >Delete</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Save / Reset ── */}
        <div style={{ display: 'flex', gap: 14 }}>
          <button onClick={handleSave} className="btn-primary" style={{
            flex: 1, padding: '14px 24px', borderRadius: 14, fontSize: 15, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>💾 Save Settings</button>
          <button onClick={handleReset} className="btn-secondary" style={{
            padding: '14px 28px', borderRadius: 14, fontSize: 14, fontWeight: 700,
          }}>↩️ Reset</button>
        </div>

      </div>
    </Layout>
  );
};

export default SettingsPage;
