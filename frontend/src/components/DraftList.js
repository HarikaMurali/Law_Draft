import React from 'react';
import { formatDate } from '../utils/dateFormat';
import '../App.css';

const DraftList = ({ drafts, onSelectDraft }) => {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {drafts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">
            📄 No saved drafts yet
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Generate and save your first draft!
          </p>
        </div>
      ) : (
        drafts.map((draft) => (
          <div
            key={draft._id}
            onClick={() => onSelectDraft(draft)}
            className="glass-hover p-4 cursor-pointer group transition-all hover:pl-6"
          >
            <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition">
              {draft.title || 'Untitled Draft'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {formatDate(draft.createdAt, { short: true })}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default DraftList;