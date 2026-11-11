import React, { useState } from 'react';
import { Download, Upload, RotateCcw, AlertTriangle, Check, ShieldCheck, Database, FileText } from 'lucide-react';
import { CareerDatabase } from '../../types/career';

interface DataManagementViewProps {
  database: CareerDatabase;
  onExport: () => void;
  onImport: (jsonString: string) => { success: boolean; error?: string };
  onResetDemo: () => void;
  onStartFresh: () => void;
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({
  database,
  onExport,
  onImport,
  onResetDemo,
  onStartFresh,
}) => {
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = onImport(content);
        if (result.success) {
          setImportStatus({ message: 'Career backup imported successfully!', isError: false });
        } else {
          setImportStatus({ message: result.error || 'Failed to import backup.', isError: true });
        }
      }
    };
    reader.readAsText(file);
  };

  const dbSizeApprox = (JSON.stringify(database).length / 1024).toFixed(1);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-display text-white">Data Management & Career Backup</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Persistent offline storage, automated state retention, JSON career export, and restore controls
        </p>
      </div>

      {/* Storage Status Strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Persistent Storage Active
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                Auto-Saved
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              Database size: ~{dbSizeApprox} KB · {database.matches.length} Matches · {database.seasons.length} Seasons
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono text-left sm:text-right">
          Last Synced: {new Date(database.lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      {/* Export / Import Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export JSON */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Download className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-display">Export Career Backup</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download your complete football career state (player profile, all matches, unlocked trophies, records, and transfers) as an offline JSON file.
            </p>
          </div>

          <button
            onClick={onExport}
            className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Career File (.json)
          </button>
        </div>

        {/* Import JSON */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Upload className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-display">Restore / Import Career</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a previously exported career backup JSON file to restore your player records and seasons on any device.
            </p>
          </div>

          <div>
            <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-cyan-400" />
              Choose Backup JSON File
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </label>

            {importStatus && (
              <div
                className={`mt-2 p-2 rounded-lg text-xs font-semibold ${
                  importStatus.isError
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {importStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone / Reset options */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Career State Presets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reload Demo Career */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white">Load Superstar Demo Career</h4>
            <p className="text-[11px] text-slate-400">
              Reset database to the pre-populated Marcus Vance career featuring 4 thrilling seasons, Champions League & Ballon d'Or trophies, and over 80 matches.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset database to the pre-populated demo superstar career?')) {
                  onResetDemo();
                }
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              Load Demo Career
            </button>
          </div>

          {/* Start Fresh */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white">Start Fresh Blank Career</h4>
            <p className="text-[11px] text-slate-400">
              Clear all match history and create a brand-new custom 18-year-old academy rookie to document your own journey from scratch.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Start a fresh new career? Make sure to export a backup if you wish to keep current data!')) {
                  onStartFresh();
                }
              }}
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold rounded-lg text-xs border border-rose-500/30 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              Start Blank Career
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
