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
  LogOut
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
  const [isLocked, setIsLocked] = useState(adminSettings.isAppLocked);
  const [maintenanceMsg, setMaintenanceMsg] = useState(adminSettings.maintenanceMessage);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveAdminSettings({
      userPassword: newPassword.trim() || 'nsmods',
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
    if (window.confirm('আপনি কি নিশ্চিত যে সকল এডমিন সেটিংস এবং ইউজার পাসওয়ার্ড ডিফল্ট (nsmods) এ রিসেট করতে চান?')) {
      const def = resetAdminSettings();
      setNewPassword(def.userPassword);
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
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
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
                  এডমিন মাস্টার কন্ট্রোল প্যানেল
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  SECRET ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                শুধুমাত্র আপনি এই প্যানেল থেকে ইউজার পাসওয়ার্ড পরিবর্তন ও অ্যাপ বন্ধ রাখতে পারবেন।
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-900/60 border border-emerald-500/50 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-200"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>সফলভাবে এডমিন কনফিগারেশন সেভ হয়েছে!</span>
          </motion.div>
        )}

        <form onSubmit={handleSaveAll} className="space-y-5">
          {/* Section 1: Kill Switch / Lock App */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power className={`w-4 h-4 ${isLocked ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  অ্যাপ স্ট্যাটাস (কিল সুইচ / অ্যাপ বন্ধ রাখা)
                </span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                isLocked 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {isLocked ? '🔴 অ্যাপ বন্ধ (LOCKED)' : '🟢 অ্যাপ চালু (ACTIVE)'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              আপনি যদি চান সাধারণ কোনো ইউজার অ্যাপ ব্যবহার করতে পারবে না, তবে এক ক্লিকেই অ্যাপ লক/বন্ধ করে রাখতে পারবেন।
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
                <span>অ্যাপ চালু রাখুন (Online)</span>
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
                <span>অ্যাপ বন্ধ করুন (Kill Switch)</span>
              </button>
            </div>

            {/* Maintenance notice editor */}
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2 space-y-1.5"
              >
                <label className="text-[11px] font-semibold text-rose-300 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>ইউজারদের দেখানোর বার্তা (Maintenance Notice):</span>
                </label>
                <textarea
                  rows={2}
                  value={maintenanceMsg}
                  onChange={(e) => setMaintenanceMsg(e.target.value)}
                  className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2 text-xs text-rose-100 outline-none focus:border-rose-400"
                  placeholder="অ্যাপটি বর্তমানে সাময়িকভাবে বন্ধ আছে..."
                />
              </motion.div>
            )}
          </div>

          {/* Section 2: Change Normal User Password */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                ইউজার অ্যাক্সেস পাসওয়ার্ড পরিবর্তন
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              নরমাল ইউজাররা অ্যাপে ঢুকতে যে পাসওয়ার্ড ব্যবহার করবে তা এখানে পরিবর্তন করুন। বর্তমানে সক্রিয় পাসওয়ার্ড: <code className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">{adminSettings.userPassword}</code>
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                নতুন ইউজার পাসওয়ার্ড (New User Password):
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 outline-none focus:border-emerald-500"
                placeholder="নতুন পাসওয়ার্ড লিখুন..."
                required
              />
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
              <span>ডিফল্ট রিসেট করুন</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                বন্ধ করুন
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>পরিবর্তন সেভ করুন</span>
              </button>
            </div>
          </div>
        </form>

        {/* Admin Logout Box */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            এডমিন সেশন শেষ করতে চান?
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('আপনি কি নিশ্চিত যে এডমিন মোড থেকে লগআউট করে মূল লগইন স্ক্রিনে যেতে চান?')) {
                onExitAdmin();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>এডমিন থেকে লগআউট</span>
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
