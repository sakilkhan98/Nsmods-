/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  KeyRound, 
  Power, 
  X, 
  Check, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Sliders, 
  Save, 
  MessageSquare,
  LogOut,
  Shield
} from 'lucide-react';
import { AdminSettings, saveAdminSettings, resetAdminSettings } from '../utils/adminSettings';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminSettings: AdminSettings;
  onUpdateSettings: (newSettings: AdminSettings) => void;
  onExitAdmin: () => void;
}

export default function AdminControlModal({
  isOpen,
  onClose,
  adminSettings,
  onUpdateSettings,
  onExitAdmin
}: AdminControlModalProps) {
  const [newPassword, setNewPassword] = useState(adminSettings.userPassword);
  const [newAdminPassword, setNewAdminPassword] = useState(adminSettings.adminPassword || 'admin');
  const [isLocked, setIsLocked] = useState(adminSettings.isAppLocked);
  const [maintenanceMsg, setMaintenanceMsg] = useState(adminSettings.maintenanceMessage);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveAdminSettings({
      userPassword: newPassword.trim() || 'nsmods',
      adminPassword: newAdminPassword.trim() || 'admin',
      isAppLocked: isLocked,
      maintenanceMessage: maintenanceMsg.trim()
    });
    onUpdateSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleToggleLock = (lockedState: boolean) => {
    setIsLocked(lockedState);
    const updated = saveAdminSettings({ isAppLocked: lockedState });
    onUpdateSettings(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all admin configurations and passwords to default (nsmods / admin)?')) {
      const def = resetAdminSettings();
      setNewPassword(def.userPassword);
      setNewAdminPassword(def.adminPassword);
      setIsLocked(def.isAppLocked);
      setMaintenanceMsg(def.maintenanceMessage);
      onUpdateSettings(def);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-emerald-950/40 text-slate-100 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  Admin Master Control Panel
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage user passwords, change secret admin key, and toggle app kill-switch.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-900/60 border border-emerald-500/50 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-200"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Admin configuration updated and saved successfully!</span>
          </motion.div>
        )}

        <form onSubmit={handleSaveAll} className="space-y-4">
          {/* Section 1: Kill Switch / Lock App */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power className={`w-4 h-4 ${isLocked ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Application Status (Kill Switch)
                </span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                isLocked 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {isLocked ? '🔴 LOCKED (MAINTENANCE)' : '🟢 ACTIVE (ONLINE)'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enabling the kill-switch instantly locks the application, kicking active non-admin users out to the login screen immediately.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleToggleLock(false)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                  !isLocked 
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Keep App Active</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleLock(true)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                  isLocked 
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-rose-300'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock App (Kill Switch)</span>
              </button>
            </div>

            {/* Quick emergency lock & exit button */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Activate Kill-Switch and instantly exit to the locked home screen? Normal users will be kicked out immediately.')) {
                  handleToggleLock(true);
                  onExitAdmin();
                }
              }}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
            >
              <Power className="w-3.5 h-3.5 text-rose-400" />
              <span>Lock App & Exit to Home Screen Immediately</span>
            </button>

            {/* Maintenance notice editor */}
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2 space-y-1.5"
              >
                <label className="text-[11px] font-semibold text-rose-300 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Maintenance Notice shown to users:</span>
                </label>
                <textarea
                  rows={2}
                  value={maintenanceMsg}
                  onChange={(e) => setMaintenanceMsg(e.target.value)}
                  className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2 text-xs text-rose-100 outline-none focus:border-rose-400"
                  placeholder="Application is temporarily locked for scheduled maintenance..."
                />
              </motion.div>
            )}
          </div>

          {/* Section 2: Manage Passwords */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Security & Passwords
              </span>
            </div>

            {/* User Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Regular User Access Key:
                </label>
                <span className="text-[10px] text-slate-500">
                  Active: <strong className="text-cyan-400 font-mono">{adminSettings.userPassword}</strong>
                </span>
              </div>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-500 transition"
                placeholder="Enter password for normal users..."
                required
              />
              <p className="text-[10px] text-slate-500">Regular users enter this key to access the studio.</p>
            </div>

            {/* Secret Admin Password */}
            <div className="space-y-1 pt-2 border-t border-slate-850">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secret Admin Access Password:</span>
                </label>
                <span className="text-[10px] text-slate-500">
                  Active: <strong className="text-emerald-400 font-mono">{adminSettings.adminPassword || 'admin'}</strong>
                </span>
              </div>
              <input
                type="text"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-300 outline-none focus:border-emerald-500 transition"
                placeholder="Enter private admin password (only you know this)..."
                required
              />
              <p className="text-[10px] text-slate-500">Only you know this password. Entering this unlocks full administrator privileges.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </form>

        {/* Admin Logout Box */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Finished with administration?
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Log out from administrator mode and return to the main sign-in screen?')) {
                onExitAdmin();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Sign Out</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            NSMods Master Administration • Confidential • Only visible to Admin
          </p>
        </div>
      </motion.div>
    </div>
  );
}
