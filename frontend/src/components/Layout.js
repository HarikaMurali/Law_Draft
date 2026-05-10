import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../App.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/drafts', icon: '📄', label: 'My Drafts' },
    { path: '/templates', icon: '📋', label: 'Templates' },
    { path: '/research', icon: '🔍', label: 'Research' },
    { path: '/history', icon: '🕒', label: 'History' },
    { path: '/analytics', icon: '📊', label: 'Analytics' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} relative`}>
      {/* Background */}
      <div className="fixed inset-0 -z-10" style={{
        backgroundColor: darkMode ? '#0f172a' : '#000000'
      }}></div>

      {/* Main Content */}
      <div className="min-h-screen">
        {/* Top Header */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: darkMode ? '#1e293b' : '#1a1a1a',
          borderBottom: `1px solid ${darkMode ? '#334155' : '#333'}`,
        }}>
          {/* Top Bar */}
          <div style={{
            padding: "15px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                style={{
                  display: window.innerWidth < 1024 ? "block" : "none",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "8px"
                }}
                aria-label="Toggle menu"
              >
                <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  boxShadow: "0 4px 6px rgba(102, 126, 234, 0.3)"
                }}>
                  ⚖️
                </div>
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>Legal Draft Maker</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                style={{
                  padding: "8px 16px",
                  backgroundColor: darkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.1)",
                  border: darkMode ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid rgba(255, 255, 255, 0.2)",
                  color: darkMode ? "#a5b4fc" : "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease"
                }}
                aria-label="Toggle dark mode"
                title={darkMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "18px" }}>{darkMode ? '☀️' : '🌙'}</span>
                <span>{darkMode ? 'Light' : 'Dark'}</span>
              </button>

              {/* Notifications */}
              <button 
                style={{
                  padding: "8px 16px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease"
                }}
                aria-label="Notifications"
                title="Notifications"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "18px" }}>🔔</span>
                <span style={{
                  position: "absolute",
                  top: "6px",
                  right: "12px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#ef4444",
                  borderRadius: "50%",
                  border: "2px solid #1a1a1a"
                }}></span>
              </button>

              {/* Security Badge */}
              <div style={{ 
                padding: "8px 16px",
                backgroundColor: "rgba(74, 222, 128, 0.1)",
                border: "1px solid rgba(74, 222, 128, 0.3)",
                borderRadius: "5px",
                display: "flex", 
                alignItems: "center", 
                gap: "8px"
              }}>
                <span style={{ fontSize: "18px" }}>🔒</span>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#4ade80" }}>Secure</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc2626";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ef4444";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingLeft: "40px",
            paddingRight: "40px",
            paddingBottom: "0",
            overflowX: "auto"
          }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: "10px 18px",
                  backgroundColor: location.pathname === item.path ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  border: "none",
                  borderBottom: location.pathname === item.path ? "2px solid #a855f7" : "2px solid transparent",
                  color: location.pathname === item.path ? "white" : "#9ca3af",
                  fontSize: "14px",
                  fontWeight: location.pathname === item.path ? "600" : "500",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = "#9ca3af";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ 
          padding: "24px", 
          maxWidth: "1400px", 
          margin: "0 auto",
          color: darkMode ? '#e2e8f0' : '#ffffff'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
