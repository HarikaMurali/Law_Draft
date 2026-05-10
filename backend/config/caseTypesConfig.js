/**
 * Hierarchical Legal Case Types Configuration
 * Follows standard Indian legal classification system
 */

const CASE_TYPES = {
  'Civil Law': {
    displayName: 'Civil Law',
    subcategories: {
      'Suits': {
        displayName: 'Suits',
        types: [
          'Money Recovery Suit',
          'Injunction Suit',
          'Specific Performance',
          'Partition Suit',
          'Declaration Suit'
        ]
      },
      'Contracts': {
        displayName: 'Contracts',
        types: [
          'Agreement Drafting',
          'Breach of Contract',
          'Arbitration Matters'
        ]
      },
      'Torts': {
        displayName: 'Torts',
        types: [
          'Negligence Claims',
          'Damages'
        ]
      }
    }
  },
  'Criminal Law': {
    displayName: 'Criminal Law',
    subcategories: {
      'Complaints': {
        displayName: 'Complaints',
        types: [
          'FIR Draft',
          'Private Complaint'
        ]
      },
      'Bail Applications': {
        displayName: 'Bail Applications',
        types: [
          'Regular Bail',
          'Anticipatory Bail'
        ]
      },
      'Motions': {
        displayName: 'Motions',
        types: [
          'Quashing Petition (Sec 482 CrPC)',
          'Discharge Application'
        ]
      },
      'Trial Stage': {
        displayName: 'Trial Stage',
        types: [
          'Written Arguments',
          'Evidence Submissions'
        ]
      }
    }
  },
  'Family Law': {
    displayName: 'Family Law',
    subcategories: {
      'Divorce': {
        displayName: 'Divorce',
        types: [
          'Mutual Consent Divorce',
          'Contested Divorce'
        ]
      },
      'Child Custody': {
        displayName: 'Child Custody',
        types: [
          'Custody Application',
          'Guardianship'
        ]
      },
      'Maintenance': {
        displayName: 'Maintenance (Sec 125 CrPC)',
        types: [
          'Maintenance Petition',
          'Maintenance Modification'
        ]
      },
      'Domestic Violence': {
        displayName: 'Domestic Violence',
        types: [
          'Protection Order',
          'Restraining Order'
        ]
      },
      'Adoption': {
        displayName: 'Adoption',
        types: [
          'Adoption Petition',
          'Adoption Agreement'
        ]
      }
    }
  },
  'Property Law': {
    displayName: 'Property Law',
    subcategories: {
      'Property Transfer': {
        displayName: 'Property Transfer',
        types: [
          'Sale Deed',
          'Gift Deed'
        ]
      },
      'Disputes': {
        displayName: 'Disputes',
        types: [
          'Encroachment',
          'Title Dispute'
        ]
      },
      'Land Records': {
        displayName: 'Land Records',
        types: [
          'Mutation',
          'RTC Issues (Karnataka specific)'
        ]
      }
    }
  },
  'Employment Law': {
    displayName: 'Employment Law',
    subcategories: {
      'Agreements': {
        displayName: 'Agreements',
        types: [
          'Employment Contract',
          'NDA'
        ]
      },
      'Disputes': {
        displayName: 'Disputes',
        types: [
          'Wrongful Termination',
          'Salary Recovery'
        ]
      },
      'Compliance': {
        displayName: 'Compliance',
        types: [
          'Labour Law Notices',
          'Statutory Compliance'
        ]
      }
    }
  }
};

/**
 * Get all main categories
 */
function getMainCategories() {
  return Object.keys(CASE_TYPES);
}

/**
 * Get subcategories for a main category
 */
function getSubcategories(mainCategory) {
  if (!CASE_TYPES[mainCategory]) return [];
  return Object.keys(CASE_TYPES[mainCategory].subcategories);
}

/**
 * Get types for a specific subcategory
 */
function getTypes(mainCategory, subcategory) {
  if (!CASE_TYPES[mainCategory] || !CASE_TYPES[mainCategory].subcategories[subcategory]) {
    return [];
  }
  return CASE_TYPES[mainCategory].subcategories[subcategory].types;
}

/**
 * Get formatted case type string (for storage and display)
 */
function formatCaseType(mainCategory, subcategory, type) {
  return `${mainCategory} → ${subcategory} → ${type}`;
}

/**
 * Parse formatted case type string
 */
function parseCaseType(formattedType) {
  if (!formattedType || typeof formattedType !== 'string') {
    return { mainCategory: '', subcategory: '', type: '' };
  }
  
  const parts = formattedType.split(' → ');
  return {
    mainCategory: parts[0]?.trim() || '',
    subcategory: parts[1]?.trim() || '',
    type: parts[2]?.trim() || ''
  };
}

/**
 * Get simplified case type for AI prompts (backward compatible)
 */
function getSimplifiedCaseType(mainCategory) {
  // Map comprehensive categories to simpler prompts for AI
  const simplificationMap = {
    'Civil Law': 'Civil',
    'Criminal Law': 'Criminal',
    'Family Law': 'Family',
    'Property Law': 'Property',
    'Employment Law': 'Employment'
  };
  return simplificationMap[mainCategory] || mainCategory;
}

module.exports = {
  CASE_TYPES,
  getMainCategories,
  getSubcategories,
  getTypes,
  formatCaseType,
  parseCaseType,
  getSimplifiedCaseType
};
