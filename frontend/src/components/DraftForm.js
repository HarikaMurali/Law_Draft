import React, { useState, useEffect } from 'react';
import '../App.css';
import { 
  getMainCategories, 
  getSubcategories, 
  getTypes,
  formatCaseType,
  getSimplifiedCaseType 
} from '../utils/caseTypesConfig';

const DraftForm = ({ onGenerateDraft, isLoading, templateData }) => {
  const [mainCategory, setMainCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [specificType, setSpecificType] = useState('');
  const [details, setDetails] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Karnataka, India');
  const [error, setError] = useState('');

  const mainCategories = getMainCategories();
  const subcategories = mainCategory ? getSubcategories(mainCategory) : [];
  const specificTypes = subcategory ? getTypes(mainCategory, subcategory) : [];

  // Load template data when provided
  useEffect(() => {
    if (templateData) {
      // Parse template category if it's in new format, otherwise use it as main category
      if (templateData.category.includes(' → ')) {
        const parts = templateData.category.split(' → ');
        setMainCategory(parts[0]?.trim() || 'Civil Law');
        setSubcategory(parts[1]?.trim() || '');
        setSpecificType(parts[2]?.trim() || '');
      } else {
        // Old format - map to new structure
        const categoryMap = {
          'Civil': 'Civil Law',
          'Criminal': 'Criminal Law',
          'Contract': 'Civil Law',
          'Family': 'Family Law',
          'Property': 'Property Law',
          'Employment': 'Employment Law'
        };
        setMainCategory(categoryMap[templateData.category] || 'Civil Law');
      }
      
      setDetails(`Template: ${templateData.title}\n\n${templateData.description}\n\nPlease provide your case details below:\n`);
    }
  }, [templateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mainCategory || !subcategory || !specificType || !details.trim()) {
      setError('Please complete all required fields');
      return;
    }

    const formattedCaseType = formatCaseType(mainCategory, subcategory, specificType);
    const simplifiedType = getSimplifiedCaseType(mainCategory);

    onGenerateDraft({ 
      caseType: formattedCaseType, // Full hierarchical path
      mainCategory,
      subcategory,
      specificType,
      simplifiedCaseType: simplifiedType, // For AI prompts
      details, 
      jurisdiction 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Legal Category <span className="text-red-400">*</span>
        </label>
        <select
          value={mainCategory}
          onChange={(e) => {
            setMainCategory(e.target.value);
            setSubcategory('');
            setSpecificType('');
          }}
          className="input-field bg-slate-800"
          disabled={isLoading}
        >
          <option value="">Select a Category</option>
          {mainCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {mainCategory && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Subcategory <span className="text-red-400">*</span>
          </label>
          <select
            value={subcategory}
            onChange={(e) => {
              setSubcategory(e.target.value);
              setSpecificType('');
            }}
            className="input-field bg-slate-800"
            disabled={isLoading}
          >
            <option value="">Select a Subcategory</option>
            {subcategories.map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>
      )}

      {subcategory && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Case Type <span className="text-red-400">*</span>
          </label>
          <select
            value={specificType}
            onChange={(e) => setSpecificType(e.target.value)}
            className="input-field bg-slate-800"
            disabled={isLoading}
          >
            <option value="">Select Case Type</option>
            {specificTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Case Details <span className="text-red-400">*</span>
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="input-field bg-slate-800 resize-none h-32"
          placeholder="Describe the case details, parties involved, and key facts..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Jurisdiction (Optional)
        </label>
        <input
          type="text"
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          className="input-field bg-slate-800"
          placeholder="e.g., Karnataka, India"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !mainCategory || !subcategory || !specificType}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="spinner w-5 h-5"></div>
            Generating...
          </>
        ) : (
          <>
            ✨ Generate Draft
          </>
        )}
      </button>
    </form>
  );
};

export default DraftForm;