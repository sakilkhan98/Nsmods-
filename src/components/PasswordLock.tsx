/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, ExternalLink, ShieldCheck, ArrowRight, Lock, AlertCircle, LogIn } from 'lucide-react';
import { getAdminSettings, subscribeAdminSettings, AdminSettings } from '../utils/adminSettings';

interface PasswordLockProps {
  onUnlock: (isAdmin?: boolean) => void;
}

export default function PasswordLock({ onUnlock }: PasswordLockProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [isAdminGranted, setIsAdminGranted] = useState(false);

  // Load current admin settings reactively
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());
  
  useEffect(() => {
    const unsub = subscribeAdminSettings((updated) => {
      setAdminSettings(updated);
    });
    return unsub;
  }, []);

  const isMaintenanceMode = adminSettings.isAppLocked;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaintenanceMode) return;

    const clean = password.trim().toLowerCase();
    const currentPass = (adminSettings.userPassword || 'nsmods').toLowerCase();

    // Check if entered password matches current user password or secret master admin key
    if (clean === 'admin' || clean === 'nsadmin') {
      setIsAdminGranted(true);
      setUnlocked(true);
      setError(false);
      setTimeout(() => {
        onUnlock(true);
      }, 600);
    } else if (clean === currentPass) {
      setIsAdminGranted(false);
      setUnlocked(true);
      setError(false);
      setTimeout(() => {
        onUnlock(false);
      }, 600);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // Secret Admin Access: Triggered strictly by clicking the developer DP avatar
  // Absolutely zero public text or hint is displayed. Only the admin knows this.
  const handleSecretAdminTrigger = () => {
    setIsAdminGranted(true);
    setUnlocked(true);
    setTimeout(() => {
      onUnlock(true);
    }, 600);
  };

  const handleGetFreeKey = () => {
    window.open('https://t.me/Sharechat_ns_098', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white font-sans overflow-hidden">
      {/* Dynamic background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_65%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: shake ? [-10, 10, -10, 10, -5, 5, 0] : 0 
            }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md mx-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 shadow-2xl shadow-indigo-950/40"
          >
            {/* Developer DP (Secret Admin Trigger - No visible labels) */}
            <div className="flex flex-col items-center mb-5">
              <div 
                onClick={handleSecretAdminTrigger}
                className="relative cursor-pointer select-none"
              >
                {/* Standard Avatar Frame */}
                <div className="w-20 h-20 rounded-full bg-slate-950 p-1 border-2 border-slate-700 hover:border-slate-500 flex items-center justify-center overflow-hidden shadow-xl transition-all">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" 
                    alt="NSMods Developer" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
              </div>
            </div>

            {/* App Brand Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-emerald-400 bg-clip-text text-transparent">
                NSMODS DIALOG PRO
              </h2>
              <p className="text-slate-400 text-xs mt-1.5 font-normal">
                পেশাদার ৫-টি ডায়ালগ আর্কিটেকচার এবং Classes.dex Smali বিল্ডার
              </p>
            </div>

            {/* If App is Locked by Admin (Maintenance Mode) */}
            {isMaintenanceMode ? (
              <div className="space-y-4 text-center py-2">
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-rose-400">
                    <Lock className="w-4 h-4" />
                    <span>অ্যাপ বর্তমানে বন্ধ আছে</span>
                  </div>
                  <p className="text-xs text-rose-200/80 leading-relaxed font-sans">
                    {adminSettings.maintenanceMessage || 'এডমিন কর্তৃক অ্যাপটি সাময়িকভাবে বন্ধ রাখা হয়েছে।'}
                  </p>
                </div>

                {/* Optional Master Admin Login box in maintenance mode */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const clean = password.trim().toLowerCase();
                    if (clean === 'admin' || clean === 'nsadmin') {
                      setIsAdminGranted(true);
                      setUnlocked(true);
                      setTimeout(() => onUnlock(true), 600);
                    } else {
                      setError(true);
                      setShake(true);
                      setTimeout(() => setShake(false), 500);
                    }
                  }} 
                  className="space-y-2 pt-1"
                >
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                    <input
                      type="password"
                      placeholder="এডমিন মাস্টার কী (Admin Only)..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(false);
                      }}
                      className="w-full bg-slate-950/90 border border-slate-800 focus:border-indigo-500 text-white pl-10 pr-3 py-2.5 rounded-xl outline-none text-xs font-mono placeholder:text-slate-600"
                    />
                  </div>
                  {error && (
                    <p className="text-rose-400 text-[11px] font-medium">ভুল এডমিন পাসওয়ার্ড!</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>এডমিন লগইন করুন</span>
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleGetFreeKey}
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer transition border border-slate-800"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>টেলিগ্রাম চ্যানেলে যোগাযোগ করুন</span>
                </button>
              </div>
            ) : (
              /* Regular Login Form */
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <KeyRound className="w-4 h-4 text-indigo-400" />
                  </span>
                  <input
                    type="password"
                    placeholder="সিকিউরিটি পাসওয়ার্ড / কী দিয়ে লগইন করুন..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    className={`w-full bg-slate-950/80 border ${
                      error ? 'border-rose-500/70 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500/20'
                    } text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-mono text-xs placeholder:text-slate-600`}
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-400 text-xs text-center font-medium flex items-center justify-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>ভুল অ্যাক্সেস কী! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।</span>
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-4 rounded-2xl cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all text-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>লগইন করুন (Unlock Studio)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGetFreeKey}
                    className="w-full flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 py-2.5 px-3 rounded-xl text-xs font-medium cursor-pointer transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Get Free Key (Telegram)</span>
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-[10px] text-slate-600 font-mono">
                Authorized modder studio by NSMods (Sharechat_ns_098)
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`p-5 rounded-full ${isAdminGranted ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'} border mb-6`}
            >
              <ShieldCheck className="w-16 h-16" />
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-1">
              {isAdminGranted ? '👑 ADMIN ACCESS ACTIVE' : 'ACCESS GRANTED'}
            </h2>
            <p className="text-slate-400 text-xs font-light max-w-xs">
              {isAdminGranted 
                ? 'এডমিন মাস্টার প্যানেল সক্রিয় করা হয়েছে...'
                : 'Initializing 5 Dialog architectures and classes.dex Smali...'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce delay-100" />
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce delay-200" />
              <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-300" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
