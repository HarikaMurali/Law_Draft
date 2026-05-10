import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import '../App.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/auth/register', {
        name,
        email,
        password
      });

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* Reusable input style */
  const inputStyle = {
    width: '100%', padding: '14px 14px 14px 42px', fontSize: 14, fontWeight: 500,
    background: 'rgba(30,41,59,0.6)', color: '#fff',
    border: '1px solid rgba(148,163,184,0.15)', borderRadius: 12,
    outline: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box',
  };
  const focusIn = (e) => { e.target.style.borderColor = '#a855f7'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.15)'; };
  const focusOut = (e) => { e.target.style.borderColor = 'rgba(148,163,184,0.15)'; e.target.style.boxShadow = 'none'; };

  /* Password strength */
  const getStrength = () => {
    if (!password) return { level: 0, label: '', color: '#334155' };
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (s <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (s <= 2) return { level: 2, label: 'Fair', color: '#f59e0b' };
    if (s <= 3) return { level: 3, label: 'Good', color: '#3b82f6' };
    return { level: 4, label: 'Strong', color: '#10b981' };
  };
  const strength = getStrength();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'linear-gradient(135deg, #0f0a1a 0%, #0d1117 40%, #0a0f1e 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* ── Logo ── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: '0 auto 18px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
            boxShadow: '0 8px 30px rgba(59,130,246,0.35)',
          }}>⚖️</div>
          <h1 style={{
            fontSize: 32, fontWeight: 900, letterSpacing: '-1px', marginBottom: 4,
            background: 'linear-gradient(135deg, #93c5fd, #3b82f6, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>LexiCraft</h1>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Create your account to get started</p>
        </div>

        {/* ── Card ── */}
        <div style={{
          background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148,163,184,0.12)', borderRadius: 20,
          padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Create Account</h2>
            <p style={{ color: '#64748b', fontSize: 13 }}>Fill in the details to register</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 20, padding: '12px 16px', borderRadius: 12,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>👤</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>📧</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 6 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔒</span>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ ...inputStyle, paddingRight: 46 }} onFocus={focusIn} onBlur={focusOut} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.5, padding: 0,
                }}>{showPassword ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {/* Strength bar */}
            {password && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 4,
                      background: i <= strength.level ? strength.color : 'rgba(100,116,139,0.2)',
                      transition: 'background 0.3s ease',
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: strength.color, textAlign: 'right' }}>{strength.label}</p>
              </div>
            )}

            {/* Confirm Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔐</span>
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                {confirmPassword && (
                  <span style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16,
                  }}>{password === confirmPassword ? '✅' : '❌'}</span>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px 24px', borderRadius: 14, fontSize: 15, fontWeight: 800,
                background: loading ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 25px rgba(59,130,246,0.35)',
                transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                  }} />
                  Creating account…
                </>
              ) : (
                <>✨ Create Account</>
              )}
            </button>
          </form>

          {/* Divider + Login */}
          <div style={{ borderTop: '1px solid rgba(148,163,184,0.1)', marginTop: 28, paddingTop: 24, textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3b82f6', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
              >Sign in</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#334155', fontSize: 12, marginTop: 24 }}>
          © 2026 LexiCraft — AI-Powered Legal Drafting
        </p>
      </div>
    </div>
  );
};

export default Register;
