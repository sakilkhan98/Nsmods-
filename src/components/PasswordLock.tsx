/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, ExternalLink, ShieldCheck, ArrowRight, Lock, AlertCircle, LogIn, ShieldAlert } from 'lucide-react';
import { getAdminSettings, subscribeAdminSettings, AdminSettings } from '../utils/adminSettings';

interface PasswordLockProps {
  onUnlock: (isAdmin?: boolean) => void;
}

export default function PasswordLock({ onUnlock }: PasswordLockProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [isAdminGranted, setIsAdminGranted] = useState(false);
  const [mode, setMode] = useState<'user' | 'admin'>('user');

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
    const clean = password.trim();
    if (!clean) {
      setError(true);
      setErrorMessage('Please enter your password.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const currentAdminPass = (adminSettings.adminPassword || 'admin').trim();
    const currentUserPass = (adminSettings.userPassword || 'nsmods').trim();

    // Check if entered password matches secret admin password
    if (clean === currentAdminPass) {
      setIsAdminGranted(true);
      setUnlocked(true);
      setError(false);
      setTimeout(() => {
        onUnlock(true);
      }, 500);
      return;
    }

    // In maintenance mode, only admin password is valid
    if (isMaintenanceMode) {
      setError(true);
      setErrorMessage('Application is currently locked. Only administrator credentials are valid.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Check regular user password
    if (clean.toLowerCase() === currentUserPass.toLowerCase()) {
      setIsAdminGranted(false);
      setUnlocked(true);
      setError(false);
      setTimeout(() => {
        onUnlock(false);
      }, 500);
    } else {
      setError(true);
      setErrorMessage('Incorrect password! Please check and try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleGetFreeKey = () => {
    window.open('https://t.me/Sharechat_ns_098', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white font-sans overflow-hidden select-none">
      {/* Dynamic background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.14),transparent_65%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: shake ? [-8, 8, -8, 8, -4, 4, 0] : 0 
            }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md mx-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-indigo-950/50"
          >
            {/* Developer DP (Double tap / click action completely removed as requested) */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-20 h-20 rounded-full bg-slate-950 p-1 border-2 border-slate-700/80 flex items-center justify-center overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" 
                  alt="NSMods Developer" 
                  className="w-full h-full object-cover rounded-full pointer-events-none" 
                />
              </div>
            </div>

            {/* App Brand Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-emerald-400 bg-clip-text text-transparent">
                NSMODS DIALOG PRO
              </h2>
              <p className="text-slate-400 text-xs mt-1.5 font-medium tracking-wide">
                Professional 5-Architecture Dialog Studio & Classes.dex Smali Builder
              </p>
            </div>

            {/* If App is Locked by Admin (Maintenance Mode) */}
            {isMaintenanceMode ? (
              <div className="space-y-4 text-center py-1">
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-rose-400">
                    <Lock className="w-4 h-4" />
                    <span>Application Temporarily Locked</span>
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    {adminSettings.maintenanceMessage || 'The application is locked for maintenance by the administrator.'}
                  </p>
                </div>

                {/* Dedicated Admin Unlock in maintenance mode */}
                <form onSubmit={handleUnlock} className="space-y-3 pt-2">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                    </span>
                    <input
                      type="password"
                      placeholder="Enter Admin Password..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(false);
                      }}
                      className="w-full bg-slate-950/90 border border-slate-800 focus:border-emerald-500 text-white pl-11 pr-4 py-3 rounded-2xl outline-none text-xs font-mono placeholder:text-slate-500 transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-rose-400 text-xs font-medium flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errorMessage}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Admin Master Unlock</span>
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleGetFreeKey}
                  className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 py-2.5 px-4 rounded-xl text-xs font-medium cursor-pointer transition border border-slate-800/80"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Contact Telegram Channel</span>
                </button>
              </div>
            ) : (
              /* Regular Login Form (Accepts both User Password and Secret Admin Password) */
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {mode === 'admin' ? 'Enter Secret Admin Password' : 'Enter Access Password or Admin Key'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(prev => prev === 'user' ? 'admin' : 'user');
                      setError(false);
                    }}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                  >
                    {mode === 'admin' ? '← User Login' : 'Admin Login?'}
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <KeyRound className={`w-4 h-4 ${mode === 'admin' ? 'text-emerald-400' : 'text-indigo-400'}`} />
                  </span>
                  <input
                    type="password"
                    placeholder={mode === 'admin' ? 'Enter secret admin password...' : 'Enter access key or password...'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    className={`w-full bg-slate-950/90 border ${
                      error 
                        ? 'border-rose-500/70 focus:ring-rose-500/20' 
                        : mode === 'admin' ? 'border-emerald-500/50 focus:border-emerald-400' : 'border-slate-800 focus:border-indigo-500'
                    } text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none transition-all font-mono text-xs placeholder:text-slate-500`}
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-400 text-xs text-center font-medium flex items-center justify-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.p>
                )}

                <button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-2 ${
                    mode === 'admin'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/40'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/20'
                  } text-white font-bold py-3.5 px-4 rounded-2xl cursor-pointer shadow-lg active:scale-[0.98] transition-all text-xs`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>{mode === 'admin' ? 'Unlock as Administrator' : 'Unlock Studio'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGetFreeKey}
                    className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 py-2.5 px-3 rounded-xl text-xs font-medium cursor-pointer transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Get Free Key (Telegram)</span>
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-[10px] text-slate-500 font-mono">
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
              animate={{ scale: [0, 1.15, 1] }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`p-5 rounded-full ${isAdminGranted ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'} border mb-6`}
            >
              <ShieldCheck className="w-16 h-16" />
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
              {isAdminGranted ? '👑 ADMIN ACCESS GRANTED' : 'ACCESS GRANTED'}
            </h2>
            <p className="text-slate-400 text-xs font-normal max-w-xs">
              {isAdminGranted 
                ? 'Administrator Master Controls activated successfully...'
                : 'Initializing 5 Dialog architectures and Classes.dex Smali engine...'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
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
