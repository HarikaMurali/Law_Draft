import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🤖',
      title: 'AI Drafting',
      description: 'Generate professional legal drafts instantly using AI assistance.'
    },
    {
      icon: '🔍',
      title: 'Research Tools',
      description: 'Access case references and Indian law databases directly.'
    },
    {
      icon: '📋',
      title: 'Template Library',
      description: 'Customize legal templates for different case needs.'
    },
    {
      icon: '🔒',
      title: 'Secure Storage',
      description: 'Your documents are encrypted and safely stored.'
    }
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", backgroundColor: "white" }}>
      {/* Navigation Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          backgroundColor: "#1a1a1a",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#4ade80",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px"
          }}>
            📄
          </div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
            LexiCraft
          </h2>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "25px" }}>
          <a href="#home" style={{ textDecoration: "none", color: "white" }}>Home</a>
          <a href="#templates" onClick={(e) => {e.preventDefault(); navigate('/templates');}} style={{ textDecoration: "none", color: "white", cursor: "pointer" }}>Templates</a>
          <a href="#draft" onClick={(e) => {e.preventDefault(); navigate('/dashboard');}} style={{ textDecoration: "none", color: "white", cursor: "pointer" }}>Draft Maker</a>
          <a href="#about" style={{ textDecoration: "none", color: "white" }}>About</a>
          <a href="#contact" style={{ textDecoration: "none", color: "white" }}>Contact</a>
        </div>

        {/* Security Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px", color: "#4ade80" }}>🔒</span>
          <span style={{ fontSize: "14px" }}>Secure & Confidential</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          margin: "40px auto",
          maxWidth: "1200px"
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "15px", color: "#2c3e50", fontWeight: "700" }}>
          AI-powered Legal Drafting
        </h1>
        <p style={{ fontSize: "20px", color: "#555", marginBottom: "30px" }}>
          Smart, fast, and reliable drafting for lawyers and law students.
        </p>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: "14px 30px",
              marginRight: "15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500"
            }}
          >
            Start Drafting
          </button>
          <button
            onClick={() => navigate('/templates')}
            style={{
              padding: "14px 30px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500"
            }}
          >
            Explore Templates
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "25px",
        padding: "20px",
        maxWidth: "1200px",
        margin: "50px auto"
      }}>
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => {
              if (feature.title === 'Research Tools') navigate('/research');
              else if (feature.title === 'Template Library') navigate('/templates');
              else if (feature.title === 'AI Drafting') navigate('/dashboard');
            }}
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>{feature.icon}</div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#2c3e50" }}>{feature.title}</h3>
            <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.6" }}>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Who It's For */}
      <section style={{ padding: "50px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", marginBottom: "30px", color: "#2c3e50" }}>Who It's For</h2>
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "30px"
        }}>
          <div style={{ flex: "1", minWidth: "200px", textAlign: "center", padding: "20px" }}>
            <h4 style={{ fontSize: "22px", marginBottom: "10px", color: "#2c3e50" }}>Law Students</h4>
            <p style={{ color: "#666", fontSize: "15px" }}>Learn drafting the smart way with AI guidance.</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px", textAlign: "center", padding: "20px" }}>
            <h4 style={{ fontSize: "22px", marginBottom: "10px", color: "#2c3e50" }}>Lawyers</h4>
            <p style={{ color: "#666", fontSize: "15px" }}>Save time on document preparation and research.</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px", textAlign: "center", padding: "20px" }}>
            <h4 style={{ fontSize: "22px", marginBottom: "10px", color: "#2c3e50" }}>Legal Teams</h4>
            <p style={{ color: "#666", fontSize: "15px" }}>Collaborate securely on case documents and contracts.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "50px 20px", backgroundColor: "#f8f9fa", margin: "40px 0" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", marginBottom: "30px", color: "#2c3e50" }}>What Users Say</h2>
        <blockquote style={{
          fontStyle: "italic",
          textAlign: "center",
          fontSize: "18px",
          color: "#555",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px"
        }}>
          "This app saves me hours every week. A must-have for every legal professional!" – Advocate Meera
        </blockquote>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "42px", marginBottom: "20px", color: "#2c3e50", fontWeight: "700" }}>
          About LexiCraft
        </h2>
        <p style={{ textAlign: "center", fontSize: "18px", color: "#666", marginBottom: "50px", maxWidth: "800px", margin: "0 auto 50px" }}>
          LexiCraft is an AI-powered legal drafting platform designed to revolutionize how legal professionals create, manage, and refine legal documents.
        </p>

        {/* How It Works - Detailed Features */}
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontSize: "32px", marginBottom: "30px", color: "#2c3e50", textAlign: "center" }}>How Our Features Work</h3>
          
          {/* AI Drafting */}
          <div style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            marginBottom: "30px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{
                fontSize: "48px",
                width: "70px",
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e3f2fd",
                borderRadius: "15px"
              }}>🤖</div>
              <h4 style={{ fontSize: "28px", color: "#007bff", margin: 0 }}>AI-Powered Drafting</h4>
            </div>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", marginBottom: "15px" }}>
              Our advanced AI engine analyzes your input and generates professional legal documents tailored to your specific needs. Simply provide:
            </p>
            <ul style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", paddingLeft: "30px" }}>
              <li><strong>Case Type:</strong> Select from Civil, Criminal, Contract, Family Law, Property, or Employment</li>
              <li><strong>Case Details:</strong> Enter party names, case facts, jurisdiction, and specific requirements</li>
              <li><strong>Template Selection:</strong> Choose a base template or start from scratch</li>
            </ul>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", marginTop: "15px" }}>
              The AI instantly generates a comprehensive draft following Indian legal standards, proper formatting, and appropriate legal language. You can then:
            </p>
            <ul style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", paddingLeft: "30px" }}>
              <li><strong>Edit in Real-Time:</strong> Modify any section with our intuitive editor</li>
              <li><strong>Proofread:</strong> Get AI-powered suggestions for improvements</li>
              <li><strong>Suggest Clauses:</strong> Receive recommendations for additional clauses based on case type</li>
              <li><strong>Save & Export:</strong> Save drafts to your account or download as PDF/DOCX</li>
            </ul>
          </div>

          {/* Research Tools */}
          <div style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            marginBottom: "30px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{
                fontSize: "48px",
                width: "70px",
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff3e0",
                borderRadius: "15px"
              }}>🔍</div>
              <h4 style={{ fontSize: "28px", color: "#ffc107", margin: 0 }}>Integrated Research Tools</h4>
            </div>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", marginBottom: "15px" }}>
              Access comprehensive legal research capabilities directly within the platform:
            </p>
            <ul style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", paddingLeft: "30px" }}>
              <li><strong>Case Law Database:</strong> Search Indian Supreme Court and High Court judgments</li>
              <li><strong>Statute Reference:</strong> Quick access to Indian Penal Code, CPC, CrPC, and other acts</li>
              <li><strong>Precedent Analysis:</strong> Find relevant case citations for your drafts</li>
              <li><strong>Legal Dictionary:</strong> Instant definitions of legal terms and concepts</li>
              <li><strong>Citation Generator:</strong> Automatically format case citations in standard format</li>
            </ul>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", marginTop: "15px" }}>
              All research findings can be directly inserted into your draft with proper citations, ensuring accuracy and credibility.
            </p>
          </div>

          {/* Template Library */}
          <div style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            marginBottom: "30px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{
                fontSize: "48px",
                width: "70px",
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e8f5e9",
                borderRadius: "15px"
              }}>📋</div>
              <h4 style={{ fontSize: "28px", color: "#28a745", margin: 0 }}>Comprehensive Template Library</h4>
            </div>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", marginBottom: "15px" }}>
              Choose from our extensive collection of professionally crafted templates:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                <h5 style={{ fontSize: "18px", color: "#007bff", marginBottom: "10px" }}>📄 Civil Law</h5>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Complaints, Plaints, Written Statements, Appeals, Review Petitions</p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                <h5 style={{ fontSize: "18px", color: "#dc3545", marginBottom: "10px" }}>⚖️ Criminal Law</h5>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>FIRs, Bail Applications, Charge Sheets, Defense Motions</p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                <h5 style={{ fontSize: "18px", color: "#28a745", marginBottom: "10px" }}>📝 Contracts</h5>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Business Agreements, NDAs, Partnership Deeds, MOUs</p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                <h5 style={{ fontSize: "18px", color: "#6f42c1", marginBottom: "10px" }}>👨‍👩‍👧 Family Law</h5>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Divorce Petitions, Custody Applications, Maintenance Claims</p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                <h5 style={{ fontSize: "18px", color: "#fd7e14", marginBottom: "10px" }}>🏠 Property Law</h5>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Sale Deeds, Lease Agreements, Property Disputes</p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                <h5 style={{ fontSize: "18px", color: "#17a2b8", marginBottom: "10px" }}>💼 Employment</h5>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Employment Contracts, Termination Letters, Service Agreements</p>
              </div>
            </div>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", marginTop: "20px" }}>
              Each template is customizable and includes:
            </p>
            <ul style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", paddingLeft: "30px" }}>
              <li>Standard legal format and structure</li>
              <li>Placeholder fields for easy customization</li>
              <li>Relevant clauses and provisions</li>
              <li>Compliance with Indian legal standards</li>
            </ul>
          </div>

          {/* Secure Storage */}
          <div style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{
                fontSize: "48px",
                width: "70px",
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fce4ec",
                borderRadius: "15px"
              }}>🔒</div>
              <h4 style={{ fontSize: "28px", color: "#e91e63", margin: 0 }}>Secure & Confidential Storage</h4>
            </div>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", marginBottom: "15px" }}>
              Your documents and data are protected with enterprise-grade security:
            </p>
            <ul style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", paddingLeft: "30px" }}>
              <li><strong>End-to-End Encryption:</strong> All drafts are encrypted both in transit and at rest</li>
              <li><strong>Secure Authentication:</strong> JWT-based authentication with bcrypt password hashing</li>
              <li><strong>Private Storage:</strong> Each user's documents are isolated and access-controlled</li>
              <li><strong>Regular Backups:</strong> Automated backups ensure your data is never lost</li>
              <li><strong>Compliance:</strong> Adheres to data protection and legal confidentiality standards</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        padding: "60px 20px",
        backgroundColor: "#f8f9fa",
        marginTop: "60px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "42px", marginBottom: "20px", color: "#2c3e50", fontWeight: "700" }}>
            Get In Touch
          </h2>
          <p style={{ textAlign: "center", fontSize: "18px", color: "#666", marginBottom: "50px" }}>
            Have questions or need assistance? We're here to help!
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            marginBottom: "40px"
          }}>
            {/* Contact Info Cards */}
            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📧</div>
              <h4 style={{ fontSize: "22px", color: "#2c3e50", marginBottom: "10px" }}>Email Us</h4>
              <p style={{ color: "#666", fontSize: "16px", marginBottom: "10px" }}>For general inquiries:</p>
              <a href="mailto:support@lexicraft.com" style={{ color: "#007bff", fontSize: "16px", textDecoration: "none", fontWeight: "500" }}>
                support@lexicraft.com
              </a>
              <p style={{ color: "#666", fontSize: "16px", marginTop: "15px", marginBottom: "10px" }}>For technical support:</p>
              <a href="mailto:tech@lexicraft.com" style={{ color: "#007bff", fontSize: "16px", textDecoration: "none", fontWeight: "500" }}>
                tech@lexicraft.com
              </a>
            </div>

            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📞</div>
              <h4 style={{ fontSize: "22px", color: "#2c3e50", marginBottom: "10px" }}>Call Us</h4>
              <p style={{ color: "#666", fontSize: "16px", marginBottom: "10px" }}>Customer Support:</p>
              <a href="tel:+911234567890" style={{ color: "#007bff", fontSize: "18px", textDecoration: "none", fontWeight: "500" }}>
                +91 123 456 7890
              </a>
              <p style={{ color: "#666", fontSize: "14px", marginTop: "15px" }}>Mon - Fri: 9:00 AM - 6:00 PM IST<br/>Sat: 10:00 AM - 4:00 PM IST</p>
            </div>

            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📍</div>
              <h4 style={{ fontSize: "22px", color: "#2c3e50", marginBottom: "10px" }}>Visit Us</h4>
              <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.6" }}>
                LexiCraft Technologies Pvt. Ltd.<br/>
                123, Legal Tech Hub<br/>
                MG Road, Bangalore<br/>
                Karnataka - 560001, India
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            <h3 style={{ fontSize: "28px", color: "#2c3e50", marginBottom: "20px", textAlign: "center" }}>Send Us a Message</h3>
            <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "16px", color: "#2c3e50", marginBottom: "8px", fontWeight: "500" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    color: "#000",
                    backgroundColor: "#fff"
                  }}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "16px", color: "#2c3e50", marginBottom: "8px", fontWeight: "500" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    color: "#000",
                    backgroundColor: "#fff"
                  }}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "16px", color: "#2c3e50", marginBottom: "8px", fontWeight: "500" }}>
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    color: "#000",
                    backgroundColor: "#fff"
                  }}
                  placeholder="How can we help you?"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "16px", color: "#2c3e50", marginBottom: "8px", fontWeight: "500" }}>
                  Message *
                </label>
                <textarea
                  required
                  rows="6"
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "Arial, sans-serif",
                    color: "#000",
                    backgroundColor: "#fff"
                  }}
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "14px 30px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginTop: "10px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div style={{ marginTop: "60px" }}>
            <h3 style={{ fontSize: "32px", color: "#2c3e50", marginBottom: "30px", textAlign: "center" }}>Frequently Asked Questions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", margin: "0 auto" }}>
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h4 style={{ fontSize: "18px", color: "#007bff", marginBottom: "10px" }}>Is my data secure on LexiCraft?</h4>
                <p style={{ fontSize: "15px", color: "#666", margin: 0, lineHeight: "1.6" }}>
                  Absolutely! All your documents are encrypted with industry-standard encryption. We follow strict data protection protocols to ensure client confidentiality.
                </p>
              </div>
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h4 style={{ fontSize: "18px", color: "#007bff", marginBottom: "10px" }}>Can I customize the AI-generated drafts?</h4>
                <p style={{ fontSize: "15px", color: "#666", margin: 0, lineHeight: "1.6" }}>
                  Yes! All drafts are fully editable. The AI provides a strong starting point, and you have complete control to modify, add, or remove any content.
                </p>
              </div>
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h4 style={{ fontSize: "18px", color: "#007bff", marginBottom: "10px" }}>Do you offer customer support?</h4>
                <p style={{ fontSize: "15px", color: "#666", margin: 0, lineHeight: "1.6" }}>
                  Yes, our support team is available via email and phone during business hours. We also provide comprehensive documentation and video tutorials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Statement */}
      <section style={{
        textAlign: "center",
        padding: "30px",
        backgroundColor: "#f1f3f5",
        borderRadius: "10px",
        maxWidth: "800px",
        margin: "40px auto"
      }}>
        <h3 style={{ fontSize: "24px", marginBottom: "10px", color: "#2c3e50" }}>Privacy & Security</h3>
        <p style={{ fontSize: "16px", color: "#555" }}>
          All drafts are encrypted and stored securely to ensure client confidentiality.
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: "60px",
        padding: "40px 20px",
        backgroundColor: "#1a1a1a",
        color: "white",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "30px",
            marginBottom: "30px",
            textAlign: "left"
          }}>
            <div>
              <h4 style={{ marginBottom: "15px" }}>LexiCraft</h4>
              <p style={{ fontSize: "14px", color: "#999" }}>
                AI-powered legal drafting platform for modern lawyers.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: "15px" }}>Product</h4>
              <p style={{ fontSize: "14px", color: "#999", marginBottom: "8px" }}>Features</p>
              <p style={{ fontSize: "14px", color: "#999", marginBottom: "8px" }}>Templates</p>
              <p style={{ fontSize: "14px", color: "#999" }}>Pricing</p>
            </div>
            <div>
              <h4 style={{ marginBottom: "15px" }}>Support</h4>
              <p style={{ fontSize: "14px", color: "#999", marginBottom: "8px" }}>Help Center</p>
              <p style={{ fontSize: "14px", color: "#999", marginBottom: "8px" }}>Contact</p>
              <p style={{ fontSize: "14px", color: "#999" }}>Privacy</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #333", paddingTop: "20px", fontSize: "14px", color: "#999" }}>
            <p>&copy; 2025 LexiCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
