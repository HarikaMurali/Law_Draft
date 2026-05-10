/**
 * Frontend utility for hierarchical case types
 * Mirrors backend structure for consistency
 */

export const CASE_TYPES = {
  'Civil Law': {
    displayName: 'Civil Law',
    icon: '📋',
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
    icon: '⚖️',
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
    icon: '👨‍👩‍👧',
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
    icon: '🏠',
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
    icon: '💼',
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

export function getMainCategories() {
  return Object.keys(CASE_TYPES);
}

export function getSubcategories(mainCategory) {
  if (!CASE_TYPES[mainCategory]) return [];
  return Object.keys(CASE_TYPES[mainCategory].subcategories);
}

export function getTypes(mainCategory, subcategory) {
  if (!CASE_TYPES[mainCategory] || !CASE_TYPES[mainCategory].subcategories[subcategory]) {
    return [];
  }
  return CASE_TYPES[mainCategory].subcategories[subcategory].types;
}

export function formatCaseType(mainCategory, subcategory, type) {
  return `${mainCategory} → ${subcategory} → ${type}`;
}

export function parseCaseType(formattedType) {
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

export function getSimplifiedCaseType(mainCategory) {
  const simplificationMap = {
    'Civil Law': 'Civil',
    'Criminal Law': 'Criminal',
    'Family Law': 'Family',
    'Property Law': 'Property',
    'Employment Law': 'Employment'
  };
  return simplificationMap[mainCategory] || mainCategory;
}
