import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../App.css';

const TemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewTemplate, setViewTemplate] = useState(null);
  const navigate = useNavigate();
  
  const templates = [
    {
      id: 1,
      title: 'Civil Complaint',
      description: 'Standard civil complaint template for filing lawsuits',
      category: 'Civil Law → Suits → Declaration Suit',
      mainCategory: 'Civil Law',
      icon: '⚖️',
      uses: 234,
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: 2,
      title: 'Discharge Application',
      description: 'Motion to discharge charges in criminal cases',
      category: 'Criminal Law → Motions → Discharge Application',
      mainCategory: 'Criminal Law',
      icon: '🔒',
      uses: 189,
      color: 'from-red-500 to-red-700',
    },
    {
      id: 3,
      title: 'Business Contract',
      description: 'Comprehensive business agreement and contract',
      category: 'Civil Law → Contracts → Agreement Drafting',
      mainCategory: 'Civil Law',
      icon: '📝',
      uses: 456,
      color: 'from-green-500 to-green-700',
    },
    {
      id: 4,
      title: 'Divorce Petition',
      description: 'Petition for dissolution of marriage with child custody',
      category: 'Family Law → Divorce → Mutual Consent Divorce',
      mainCategory: 'Family Law',
      icon: '👨‍👩‍👧',
      uses: 312,
      color: 'from-purple-500 to-purple-700',
    },
    {
      id: 5,
      title: 'Property Deed',
      description: 'Real estate transfer and property ownership deed',
      category: 'Property Law → Property Transfer → Sale Deed',
      mainCategory: 'Property Law',
      icon: '🏠',
      uses: 278,
      color: 'from-yellow-500 to-yellow-700',
    },
    {
      id: 6,
      title: 'Employment Agreement',
      description: 'Standard employment contract with NDA and non-compete clauses',
      category: 'Employment Law → Agreements → Employment Contract',
      mainCategory: 'Employment Law',
      icon: '💼',
      uses: 401,
      color: 'from-pink-500 to-pink-700',
    },
    {
      id: 7,
      title: 'NDA Agreement',
      description: 'Non-disclosure agreement for confidential information protection',
      category: 'Employment Law → Agreements → NDA',
      mainCategory: 'Employment Law',
      icon: '🤐',
      uses: 523,
      color: 'from-indigo-500 to-indigo-700',
    },
    {
      id: 8,
      title: 'Bail Application',
      description: 'Regular Bail application in criminal matters',
      category: 'Criminal Law → Bail Applications → Regular Bail',
      mainCategory: 'Criminal Law',
      icon: '📜',
      uses: 267,
      color: 'from-gray-500 to-gray-700',
    },
    {
      id: 9,
      title: 'Property Transfer',
      description: 'Gift deed for property transfer between family members',
      category: 'Property Law → Property Transfer → Gift Deed',
      mainCategory: 'Property Law',
      icon: '✍️',
      uses: 198,
      color: 'from-teal-500 to-teal-700',
    },
  ];

  const categories = ['All', 'Civil Law', 'Criminal Law', 'Family Law', 'Property Law', 'Employment Law'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.mainCategory === selectedCategory);

  const handleUseTemplate = (template) => {
    // Store template in localStorage and navigate to dashboard
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    navigate('/dashboard');
  };

  const handleViewTemplate = (template) => {
    setViewTemplate(template);
  };

  const handleCreateCustom = () => {
    navigate('/dashboard');
  };

  const getTemplatePreview = (category) => {
    const mainCategory = category?.includes(' → ') ? category.split(' → ')[0].trim() : category;
    const previews = {
      'Civil Law': `CIVIL COMPLAINT

IN THE [COURT NAME]
[COUNTY], [STATE]

Plaintiff: [PLAINTIFF NAME]
vs.
Defendant: [DEFENDANT NAME]

Case No: [CASE NUMBER]

COMPLAINT FOR [CAUSE OF ACTION]

1. PARTIES
   The Plaintiff is a resident of [County, State]...
   
2. JURISDICTION
   This Court has jurisdiction over this matter...
   
3. FACTS
   [Detailed facts of the case]...`,
      
      'Criminal Law': `MOTION TO DISMISS/SUPPRESS EVIDENCE

IN THE [COURT NAME]
[COUNTY], [STATE]

State vs. [DEFENDANT NAME]
Case No: [CASE NUMBER]

DEFENDANT'S MOTION TO SUPPRESS EVIDENCE

Comes now the Defendant, by and through counsel, and moves this Court to suppress evidence...

1. GROUNDS FOR MOTION
   [Legal grounds]...
   
2. LEGAL ARGUMENT
   [Constitutional arguments]...`,
      
      'Contract': `BUSINESS PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is entered into on [DATE] by and between:

Partner 1: [NAME], residing at [ADDRESS]
Partner 2: [NAME], residing at [ADDRESS]

RECITALS
WHEREAS, the parties desire to form a partnership...

1. PARTNERSHIP NAME AND PURPOSE
   The partnership shall be known as [BUSINESS NAME]...
   
2. CAPITAL CONTRIBUTIONS
   Each partner shall contribute...
   
3. PROFIT AND LOSS DISTRIBUTION
   Profits and losses shall be distributed...`,
      
      'Family Law': `PETITION FOR DISSOLUTION OF MARRIAGE

IN THE [COURT NAME]
[COUNTY], [STATE]

In re the Marriage of:
Petitioner: [NAME]
and
Respondent: [NAME]

Case No: [CASE NUMBER]

PETITION FOR DISSOLUTION OF MARRIAGE WITH CHILDREN

Petitioner respectfully requests the Court grant dissolution of marriage...

1. RESIDENCE
   Petitioner has been a resident for [X] months...
   
2. CHILDREN
   The parties have [NUMBER] minor children...
   
3. PROPERTY
   [Community property details]...`,
      
      'Property Law': `PROPERTY DEED

GRANT DEED

Recording Requested By: [NAME]
When Recorded Mail To: [ADDRESS]

Documentary Transfer Tax: $[AMOUNT]
APN: [PARCEL NUMBER]

FOR VALUABLE CONSIDERATION, receipt of which is hereby acknowledged,

[GRANTOR NAME] ("Grantor")
hereby grants to
[GRANTEE NAME] ("Grantee")

the following described real property in [County], [State]:

[LEGAL DESCRIPTION]...`,
      
      'Employment Law': `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on [DATE]

BETWEEN:
Employer: [COMPANY NAME]
Employee: [EMPLOYEE NAME]

1. POSITION AND DUTIES
   Employee shall serve as [JOB TITLE]...
   
2. COMPENSATION
   Base Salary: $[AMOUNT] per [PERIOD]...
   
3. BENEFITS
   [List of benefits]...
   
4. CONFIDENTIALITY
   Employee agrees to maintain confidentiality...
   
5. NON-COMPETE
   During employment and for [X] months after...`,
      
      'Estate': `LAST WILL AND TESTAMENT

I, [YOUR NAME], a resident of [County], [State], being of sound mind and disposing memory, do hereby make, publish, and declare this to be my Last Will and Testament.

1. REVOCATION
   I hereby revoke all prior wills and codicils.
   
2. DECLARATIONS
   I am [married/single]. I have [X] children...
   
3. APPOINTMENT OF EXECUTOR
   I appoint [NAME] as Executor...
   
4. DISTRIBUTION OF ESTATE
   [Specific bequests]...
   
5. RESIDUARY CLAUSE
   All remaining property shall be distributed...`
    };
    
    return previews[mainCategory] || 'Template preview not available.';
  };

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "white", marginBottom: "10px" }}>
            📋 Templates Library
          </h1>
          <p style={{ color: "#999", fontSize: "16px" }}>
            Pre-built templates for quick draft generation
          </p>
        </div>

        {/* Category Filters */}
        <div style={{
          backgroundColor: "#1a1a1a",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: selectedCategory === cat ? "#4ade80" : "#2a2a2a",
                  color: selectedCategory === cat ? "#1a1a1a" : "#ccc",
                  transition: "all 0.3s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          marginBottom: "40px"
        }}>
          {filteredTemplates.map((template) => (
            <div key={template.id} style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            }}>
              {/* Icon */}
              <div style={{
                fontSize: "48px",
                marginBottom: "15px",
                textAlign: "center"
              }}>
                {template.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#007bff",
                marginBottom: "10px",
                textAlign: "center"
              }}>
                {template.title}
              </h3>

              {/* Description */}
              <p style={{
                color: "#666",
                fontSize: "14px",
                marginBottom: "15px",
                textAlign: "center",
                minHeight: "40px"
              }}>
                {template.description}
              </p>

              {/* Meta Info */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: "8px",
                marginBottom: "15px",
                fontSize: "12px",
                color: "#999"
              }}>
                <span style={{
                  backgroundColor: "#f0f0f0",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  color: "#555",
                  lineHeight: "1.35",
                  wordBreak: "break-word",
                  display: "inline-block"
                }}>
                  {template.category}
                </span>
                <span style={{ textAlign: "right" }}>📊 {template.uses} uses</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => handleUseTemplate(template)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  ✨ Use Template
                </button>
                <button 
                  onClick={() => handleViewTemplate(template)}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  👁️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Custom Template CTA */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}>
          <h3 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
            ✨ Need a Custom Template?
          </h3>
          <p style={{ fontSize: "16px", marginBottom: "20px", opacity: 0.9 }}>
            Create your own template and save it for future use
          </p>
          <button 
            onClick={handleCreateCustom}
            style={{
              padding: "12px 30px",
              backgroundColor: "white",
              color: "#667eea",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            + Create Custom Template
          </button>
        </div>
      </div>

      {/* View Template Modal */}
      {viewTemplate && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setViewTemplate(null)}
        >
          <div 
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "10px",
              padding: "30px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "25px",
              paddingBottom: "20px",
              borderBottom: "1px solid #333"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{
                  fontSize: "48px"
                }}>
                  {viewTemplate.icon}
                </div>
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "white", margin: "0 0 5px 0" }}>
                    {viewTemplate.title}
                  </h2>
                  <p style={{ color: "#999", fontSize: "14px", margin: 0 }}>
                    {viewTemplate.description}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setViewTemplate(null)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#999",
                  fontSize: "28px",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Template Preview */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "25px",
              marginBottom: "25px",
              maxHeight: "400px",
              overflow: "auto"
            }}>
              <pre style={{
                color: "#333",
                fontSize: "13px",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                margin: 0,
                lineHeight: "1.6"
              }}>
                {getTemplatePreview(viewTemplate.category)}
              </pre>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", gap: "15px" }}>
              <button 
                onClick={() => {
                  handleUseTemplate(viewTemplate);
                  setViewTemplate(null);
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500"
                }}
              >
                ✨ Use This Template
              </button>
              <button 
                onClick={() => setViewTemplate(null)}
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TemplatesPage;
