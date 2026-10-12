import React, { useState, useEffect } from 'react';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  Database,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Moon,
  Sun,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { repository } from '../services/repository';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { exportUserData, importUserData, ImportValidationResult } from '../services/backupService';
import { migrateGuestDataToAccount } from '../services/migrationService';
import { UserPreferences } from '../types/userData';

export const SettingsPage: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportValidationResult | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const isCloud = isSupabaseConfigured();

  useEffect(() => {
    repository.getPreferences().then(setPreferences);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const json = await exportUserData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kthtry-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await importUserData(content);
      setImportStatus(res);
      if (res.valid) {
        repository.getPreferences().then(setPreferences);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = async () => {
    await repository.clearAllData();
    setIsResetModalOpen(false);
    window.location.reload();
  };

  const handleMigrateToAccount = async () => {
    setIsMigrating(true);
    setMigrationStatus(null);
    try {
      const result = await migrateGuestDataToAccount();
      if (result.success) {
        setMigrationStatus(`Successfully merged ${result.topicsMigrated} topics and ${result.attemptsMigrated} attempts to your Supabase account!`);
      } else {
        setMigrationStatus(`Migration notice: ${result.error}`);
      }
    } catch (err: any) {
      setMigrationStatus(`Error: ${err?.message || 'Migration failed'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#F0EAE8]">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
          Settings &amp; Data Management
        </h1>
        <p className="text-xs sm:text-sm text-[#7E6C7C] mt-1">
          Control your storage engines, export validated backups, and manage privacy.
        </p>
      </div>

      {/* CLOUD & BACKEND STATUS */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isCloud ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {isCloud ? <Cloud className="w-5 h-5" /> : <Database className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1D1A39]">
                {isCloud ? 'Supabase PostgreSQL Backend Active' : 'Local Guest Mode (IndexedDB Active)'}
              </h3>
              <p className="text-xs text-[#7E6C7C] mt-0.5">
                {isCloud
                  ? 'Your progress is securely persisted to your cloud database with Row Level Security.'
                  : 'Your progress is stored 100% locally in your browser with IndexedDB. No account required.'}
              </p>
            </div>
          </div>
          <Badge variant="tag" size="xs">
            {isCloud ? 'Cloud Mode' : 'Guest Mode'}
          </Badge>
        </div>

        {isCloud ? (
          <div className="mt-4 pt-4 border-t border-[#F0EAE8] flex items-center justify-between text-xs">
            <span className="text-[#574459]">Have local guest data to merge into this account?</span>
            <Button
              variant="secondary"
              size="xs"
              isLoading={isMigrating}
              onClick={handleMigrateToAccount}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync / Merge Guest Data
            </Button>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-[#F0EAE8] text-xs text-[#574459] bg-[#FAF7F6] p-3 rounded-xl">
            <span className="font-semibold text-[#1D1A39] block mb-1">To enable Supabase Cloud:</span>
            <p className="text-[11px] text-[#7E6C7C]">
              Add <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E2D6D4]">VITE_SUPABASE_URL</code> and{' '}
              <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E2D6D4]">VITE_SUPABASE_ANON_KEY</code> to your environment file and apply migrations from <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E2D6D4]">/supabase/migrations/</code>.
            </p>
          </div>
        )}

        {migrationStatus && (
          <p className="mt-3 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            {migrationStatus}
          </p>
        )}
      </Card>

      {/* DATA EXPORT & IMPORT */}
      <Card className="p-6">
        <CardTitle className="text-base mb-1">Data Backup &amp; Portability</CardTitle>
        <CardDescription className="mb-4">
          Export your entire preparation history to a standard JSON format or restore from an existing backup.
        </CardDescription>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Box */}
          <div className="p-4 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-[#1D1A39]">Export Workspace Data</h4>
              <p className="text-xs text-[#7E6C7C] mt-1">
                Generates a complete JSON backup containing all 16 module checklists, attempts, timeline tasks, and notes.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                size="sm"
                isLoading={isExporting}
                onClick={handleExport}
                icon={<Download className="w-4 h-4" />}
              >
                Download JSON Backup
              </Button>
            </div>
          </div>

          {/* Import Box */}
          <div className="p-4 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-[#1D1A39]">Restore from Backup</h4>
              <p className="text-xs text-[#7E6C7C] mt-1">
                Upload a previously saved <code className="font-mono">.json</code> file to restore your progress.
              </p>
            </div>
            <div className="mt-4">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#FAF7F6] text-[#1D1A39] border border-[#E2D6D4] hover:bg-[#F3ECE9] cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#451952]" />
                <span>Upload .json Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Import Feedback */}
        {importStatus && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs font-semibold ${
              importStatus.valid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {importStatus.message}
          </div>
        )}
      </Card>

      {/* DANGER ZONE: RESET GUEST DATA */}
      <Card className="p-6 border-rose-200 bg-rose-50/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-rose-950 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" /> Reset Local Workspace
            </h4>
            <p className="text-xs text-[#7E6C7C] mt-1 max-w-xl">
              Permanently erase all locally stored attempts, checklists, and timelines from this browser. This cannot be undone unless you have an exported backup.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsResetModalOpen(true)}
          >
            Clear All Data
          </Button>
        </div>
      </Card>

      {/* CONFIRMATION RESET MODAL */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Workspace Reset"
        description="Are you completely sure you want to erase your study data?"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#574459] leading-relaxed">
            This action will clear all your locally recorded problem attempts, checklists, study plans, and custom tasks.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleResetData}>
              Yes, Erase Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
