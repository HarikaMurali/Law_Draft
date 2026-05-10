/**
 * Shared date formatter that respects the user's date-format preference
 * stored in localStorage via the Settings page.
 *
 * Supported formats: 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'
 */

export const getDateFormat = () => {
  try {
    const raw = localStorage.getItem('appSettings');
    if (raw) {
      const s = JSON.parse(raw);
      if (s.dateFormat) return s.dateFormat;
    }
  } catch { /* ignore */ }
  return 'DD/MM/YYYY'; // sensible default for India
};

/**
 * Format a date string / Date object to a human-readable string
 * using the user-chosen format + optional time.
 *
 * @param {string|Date} input  – ISO string or Date
 * @param {object}      opts
 * @param {boolean}     opts.time  – include HH:MM am/pm  (default false)
 * @param {boolean}     opts.short – use short month name instead of numeric (e.g. "15 Feb 2026")
 */
export const formatDate = (input, { time = false, short = false } = {}) => {
  if (!input) return '—';
  const d = new Date(input);
  if (isNaN(d)) return '—';

  const fmt = getDateFormat();
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();

  const shortMonth = d.toLocaleString('en-IN', { month: 'short' });

  let dateStr;
  if (short) {
    // Always use "15 Feb 2026" style when short=true, but respect day/month order
    dateStr = fmt === 'MM/DD/YYYY'
      ? `${shortMonth} ${dd}, ${yyyy}`
      : fmt === 'YYYY-MM-DD'
        ? `${yyyy} ${shortMonth} ${dd}`
        : `${dd} ${shortMonth} ${yyyy}`;
  } else {
    switch (fmt) {
      case 'MM/DD/YYYY': dateStr = `${mm}/${dd}/${yyyy}`; break;
      case 'YYYY-MM-DD': dateStr = `${yyyy}-${mm}-${dd}`; break;
      case 'DD/MM/YYYY':
      default:           dateStr = `${dd}/${mm}/${yyyy}`; break;
    }
  }

  if (time) {
    const t = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    dateStr += `, ${t}`;
  }

  return dateStr;
};

export default formatDate;
