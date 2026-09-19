/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Eye, 
  Code2, 
  Sliders, 
  Type as FontIcon, 
  Palette, 
  FolderArchive,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  FileCode,
  LogOut
} from 'lucide-react';
import { DialogConfig, ActiveTab } from '../types';

interface DedicatedDialogStudioProps {
  activeTab: ActiveTab;
  config: DialogConfig;
  setConfig: React.Dispatch<React.SetStateAction<DialogConfig>>;
  onBack: () => void;
  onOpenExplorer: () => void;
  onGenerateZip: () => void;
  isAdmin?: boolean;
  onOpenAdminModal?: () => void;
  onLogout?: () => void;
}

const PRESET_FONTS = [
  { id: 'sf-pro', name: 'SF Pro (Apple iOS)', fontClass: 'font-sans' },
  { id: 'inter', name: 'Inter Clean Sans', fontClass: 'font-sans' },
  { id: 'space', name: 'Space Grotesk (Tech)', fontClass: 'font-space' },
  { id: 'outfit', name: 'Outfit Geometric', fontClass: 'font-outfit' },
  { id: 'playfair', name: 'Playfair Display (Luxury)', fontClass: 'font-playfair' },
  { id: 'mono', name: 'JetBrains Mono (Hacker)', fontClass: 'font-mono' },
  { id: 'ubuntu', name: 'Ubuntu Smooth', fontClass: 'font-ubuntu' }
];

const PICTURE_PRESETS = [
  {
    name: "Cyberpunk Gamer",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Anime Samurai",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Neon Aesthetic",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Abstract Neon Flow",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Tech Matrix",
    url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80"
  }
];

export default function DedicatedDialogStudio({
  activeTab,
  config,
  setConfig,
  onBack,
  onOpenExplorer,
  onGenerateZip,
  isAdmin = false,
  onOpenAdminModal,
  onLogout
}: DedicatedDialogStudioProps) {
  const [activePane, setActivePane] = useState<'content' | 'fonts' | 'colors' | 'smali'>('content');
  const [copiedSmali, setCopiedSmali] = useState(false);
  const [copiedHook, setCopiedHook] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize dialog version
  const isV1 = activeTab === 'dialog-v1-ios' || activeTab === 'custom-dialog-v1';
  const isV2 = activeTab === 'dialog-v2-picture' || activeTab === 'custom-dialog-v2';
  const isV3 = activeTab === 'dialog-v3-modern' || activeTab === 'custom-dialog-v3';
  const isV4 = activeTab === 'dialog-v4-cyber' || activeTab === 'custom-dialog-v4';
  const isV5 = activeTab === 'dialog-v5-bottomsheet' || activeTab === 'online-welcome';

  const versionTitle = isV1 ? 'Dialog V1 • iOS Classic Dialog' :
                       isV2 ? 'Dialog V2 • Picture & Media Banner Dialog' :
                       isV3 ? 'Dialog V3 • Modern Material 3 Dialog' :
                       isV4 ? 'Dialog V4 • Cyber Gaming Dark Neon Dialog' :
                       'Dialog V5 • Bottom Sheet Action Dialog';

  const smaliClassName = isV1 ? 'NSDialogV1' :
                         isV2 ? 'NSDialogV2' :
                         isV3 ? 'NSDialogV3' :
                         isV4 ? 'NSDialogV4' :
                         'NSDialogV5';

  const dexFilePath = `classes.dex/com/nsmods/dialog/${smaliClassName}.smali`;
  const hookCode = `invoke-static {p0}, Lcom/nsmods/dialog/${smaliClassName};->show(Landroid/content/Context;)V`;

  // Color conversion helper
  const getIntColor = (hex: string) => {
    let clean = (hex || '#FFFFFF').replace('#', '');
    if (clean.length === 6) clean = 'FF' + clean;
    const num = parseInt(clean, 16);
    return num > 0x7fffffff ? num - 0x100000000 : num;
  };

  // Generate real Smali Code for classes.dex
  const generateSmaliCode = () => {
    return `.class public Lcom/nsmods/dialog/${smaliClassName};
.super Ljava/lang/Object;
.source "${smaliClassName}.java"

# NSMods Dialog Pro - Classes.dex Smali Module
# Version: 5.5 Standalone Architecture
# Target: classes.dex -> com/nsmods/dialog/${smaliClassName}.smali

.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    return-void
.end method

.method public static show(Landroid/content/Context;)V
    .registers 8
    .param p0, "context"    # Landroid/content/Context;

    new-instance v0, Landroid/app/AlertDialog$Builder;
    invoke-direct {v0, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    # Set Dialog Title: "${config.title.replace(/"/g, '\\"')}"
    const-string v1, "${config.title.replace(/"/g, '\\"')}"
    invoke-virtual {v0, v1}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    # Set Dialog Message: "${config.message.replace(/"/g, '\\"')}"
    const-string v2, "${config.message.replace(/"/g, '\\"')}"
    invoke-virtual {v0, v2}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    # Set Positive Button ("${config.positiveText}") -> Link: "${config.positiveBtnLink}"
    const-string v3, "${config.positiveText}"
    new-instance v4, Lcom/nsmods/dialog/${smaliClassName}$1;
    invoke-direct {v4, p0}, Lcom/nsmods/dialog/${smaliClassName}$1;-><init>(Landroid/content/Context;)V
    invoke-virtual {v0, v3, v4}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    # Set Negative Button ("${config.negativeText}")
    const-string v5, "${config.negativeText}"
    const/4 v6, 0x0
    invoke-virtual {v0, v5, v6}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    # Create and Display Dialog
    invoke-virtual {v0}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;
    move-result-object v7
    invoke-virtual {v7}, Landroid/app/AlertDialog;->show()V

    return-void
.end method`;
  };

  const handleCopySmali = () => {
    navigator.clipboard.writeText(generateSmaliCode());
    setCopiedSmali(true);
    setTimeout(() => setCopiedSmali(false), 2000);
  };

  const handleCopyHook = () => {
    navigator.clipboard.writeText(hookCode);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setConfig(prev => ({
            ...prev,
            bannerImageUrl: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Font family applied to preview
  const activeFontFamily = config.fontFamily || 'font-sans';

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ড্যাশবোর্ড</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-white hidden sm:inline">
              {versionTitle}
            </span>
            <span className="text-xs font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
              {smaliClassName}.smali
            </span>
            {isAdmin && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                👑 ADMIN
              </span>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {isAdmin && onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold border border-emerald-400/40 cursor-pointer transition shadow"
              title="এডমিন কন্ট্রোল (পাসওয়ার্ড ও লক)"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">এডমিন কন্ট্রোল</span>
            </button>
          )}
          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold cursor-pointer transition"
            title="classes.dex ফাইল ভিউ করুন"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Classes.dex ফাইল</span>
          </button>
          <button
            onClick={onGenerateZip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DEX ZIP ডাউনলোড</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition cursor-pointer"
              title="লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Viewport: 2 Columns on Desktop */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Column: Authentic Interactive Dialog Preview Stage */}
        <div className="lg:col-span-6 bg-[#0B0F19] p-6 flex flex-col items-center justify-center relative overflow-y-auto border-r border-slate-800/80 min-h-[420px]">
          {/* Subtle Stage Grid Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          <div className="relative z-10 w-full max-w-sm">
            
            <AnimatePresence mode="wait">
              {dialogOpen ? (
                <motion.div
                  key="dialog-preview-box"
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -15 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    backgroundColor: config.dialogBgColor || (isV4 ? '#080C14' : isV1 ? 'rgba(30, 41, 59, 0.85)' : '#0F172A'),
                    borderRadius: `${config.dialogCornerRadius || (isV1 ? 26 : 24)}px`,
                    borderColor: config.borderColor || (isV4 ? '#00FFFF' : 'rgba(255,255,255,0.12)'),
                    borderWidth: isV4 ? '2px' : '1px'
                  }}
                  className={`relative overflow-hidden shadow-2xl ${isV4 ? 'shadow-[0_0_25px_rgba(0,255,255,0.25)]' : 'shadow-black/60'} ${isV1 ? 'backdrop-blur-2xl' : ''}`}
                >
                  {/* 1. DIALOG V2: PICTURE BANNER HEADER */}
                  {isV2 && (
                    <div className="w-full h-44 relative overflow-hidden bg-slate-900">
                      <img 
                        src={config.bannerImageUrl || PICTURE_PRESETS[0].url} 
                        alt="Dialog Banner" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-mono">
                        PICTURE V2
                      </span>
                    </div>
                  )}

                  {/* 2. DIALOG V3: MODERN MATERIAL 3 CHIP */}
                  {isV3 && (
                    <div className="flex justify-center pt-5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    </div>
                  )}

                  {/* 3. DIALOG V4: CYBER STATUS TAG */}
                  {isV4 && (
                    <div className="px-5 pt-4 flex items-center justify-between border-b border-cyan-500/20 pb-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                        [ SYSTEM OVERRIDE V4 ]
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                        ACTIVE
                      </span>
                    </div>
                  )}

                  {/* 4. DIALOG V5: BOTTOM SHEET DRAG HANDLE */}
                  {isV5 && (
                    <div className="pt-3 flex justify-center">
                      <div className="w-10 h-1.5 bg-slate-600 rounded-full" />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className={`p-6 ${isV1 ? 'text-center' : config.textAlign === 'left' ? 'text-left' : 'text-center'}`}>
                    {/* Title */}
                    <h3 
                      style={{ 
                        color: config.titleColor || '#FFFFFF',
                        fontSize: `${config.titleSize || 18}px`
                      }}
                      className={`font-bold tracking-tight leading-snug ${activeFontFamily}`}
                    >
                      {config.title || "Hey guy's"}
                    </h3>

                    {/* Message Body */}
                    <p 
                      style={{ 
                        color: config.messageColor || '#94A3B8',
                        fontSize: `${config.messageSize || 14}px`
                      }}
                      className={`mt-2.5 leading-relaxed font-normal ${activeFontFamily}`}
                    >
                      {config.message || "Welcome to NSMods Pro Dialog Studio."}
                    </p>
                  </div>

                  {/* 1. iOS Classic Divider Buttons (Dialog V1 Style) */}
                  {isV1 ? (
                    <div className="grid grid-cols-2 border-t border-white/10 text-center font-medium divide-x divide-white/10">
                      <button
                        onClick={() => setDialogOpen(false)}
                        style={{ color: config.negativeBtnTextColor || '#F87171' }}
                        className="py-3.5 text-sm active:bg-white/10 transition-colors font-semibold cursor-pointer"
                      >
                        {config.negativeText || "CANCEL"}
                      </button>
                      <a
                        href={config.positiveBtnLink || "https://t.me/Sharechat_ns_098"}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: config.positiveBtnTextColor || '#38BDF8' }}
                        className="py-3.5 text-sm active:bg-white/10 transition-colors font-bold cursor-pointer"
                      >
                        {config.positiveText || "JOIN"}
                      </a>
                    </div>
                  ) : (
                    /* Other Dialog Styles: Action Buttons */
                    <div className="p-5 pt-0 flex flex-col sm:flex-row items-center gap-2.5">
                      <button
                        onClick={() => setDialogOpen(false)}
                        style={{ 
                          backgroundColor: config.negativeBtnColor || '#1E293B',
                          color: config.negativeBtnTextColor || '#E2E8F0',
                          borderRadius: `${config.buttonsCornerRadius || 14}px`
                        }}
                        className="w-full sm:flex-1 py-3 text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow"
                      >
                        {config.negativeText || "CANCEL"}
                      </button>

                      <a
                        href={config.positiveBtnLink || "https://t.me/Sharechat_ns_098"}
                        target="_blank"
                        rel="noreferrer"
                        style={{ 
                          backgroundColor: config.positiveBtnColor || '#4F46E5',
                          color: config.positiveBtnTextColor || '#FFFFFF',
                          borderRadius: `${config.buttonsCornerRadius || 14}px`
                        }}
                        className="w-full sm:flex-1 py-3 text-xs font-bold text-center transition-transform active:scale-95 cursor-pointer shadow-lg"
                      >
                        {config.positiveText || "JOIN TELEGRAM"}
                      </a>
                    </div>
                  )}

                </motion.div>
              ) : (
                /* Re-Open State */
                <motion.div
                  key="reopen-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl"
                >
                  <p className="text-xs text-slate-400">ডায়ালগটি বন্ধ করা হয়েছে (Negative Action Triggered)</p>
                  <button
                    onClick={() => setDialogOpen(true)}
                    className="flex items-center justify-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-2xl text-xs cursor-pointer shadow-lg transition active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ডায়ালগ প্রিভিউ পুনরায় খুলুন</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 text-center">
              <span className="text-[11px] text-slate-500 font-mono">
                Authentic preview mode • Zero floating overlays
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: Customization Controls & Smali Hub */}
        <div className="lg:col-span-6 bg-slate-900/70 p-6 flex flex-col h-full overflow-y-auto">
          
          {/* Studio Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-5 overflow-x-auto">
            <button
              onClick={() => setActivePane('content')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activePane === 'content' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>টেক্সট ও কন্টেন্ট</span>
            </button>

            <button
              onClick={() => setActivePane('fonts')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activePane === 'fonts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FontIcon className="w-3.5 h-3.5" />
              <span>ফন্ট ও স্টাইল</span>
            </button>

            <button
              onClick={() => setActivePane('colors')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activePane === 'colors' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>কালার ও থিম</span>
            </button>

            <button
              onClick={() => setActivePane('smali')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activePane === 'smali' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Classes.dex Smali</span>
            </button>
          </div>

          {/* TAB 1: CONTENT & TEXTS */}
          {activePane === 'content' && (
            <div className="space-y-4">
              
              {/* Picture Dialog Specific Controls */}
              {isV2 && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span>পিকচার ব্যানার কনফিগারেশন (Header Image)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>ফাইল আপলোড</span>
                    </button>
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </div>

                  <input 
                    type="text" 
                    value={config.bannerImageUrl || ''}
                    onChange={(e) => setConfig({ ...config, bannerImageUrl: e.target.value })}
                    placeholder="অথবা ইমেজের ওয়েব লিঙ্ক পেস্ট করুন..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  />

                  {/* Preset Wallpapers */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-medium">কুইক ওয়ালপেপার সিলেক্ট করুন:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {PICTURE_PRESETS.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setConfig({ ...config, bannerImageUrl: item.url })}
                          className={`h-12 rounded-xl overflow-hidden border relative cursor-pointer group ${
                            config.bannerImageUrl === item.url ? 'border-emerald-400 ring-2 ring-emerald-400/40' : 'border-slate-800'
                          }`}
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Enter Dialog Title (টাইটেল)</label>
                <input 
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Hey guy's"
                />
              </div>

              {/* Message input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Enter Dialog Message (মেসেজ)</label>
                <textarea 
                  rows={3}
                  value={config.message}
                  onChange={(e) => setConfig({ ...config, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 leading-relaxed"
                  placeholder="hello 👋"
                />
              </div>

              {/* Button Texts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Negative Button Text</label>
                  <input 
                    type="text"
                    value={config.negativeText}
                    onChange={(e) => setConfig({ ...config, negativeText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                    placeholder="No"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Positive Button Text</label>
                  <input 
                    type="text"
                    value={config.positiveText}
                    onChange={(e) => setConfig({ ...config, positiveText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                    placeholder="9k"
                  />
                </div>
              </div>

              {/* Positive Button Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Positive Button URL (টেলিগ্রাম / রিডাইরেক্ট লিঙ্ক)</label>
                <input 
                  type="text"
                  value={config.positiveBtnLink}
                  onChange={(e) => setConfig({ ...config, positiveBtnLink: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-400 outline-none focus:border-indigo-500"
                  placeholder="https://t.me/Sharechat_ns_098"
                />
              </div>

            </div>
          )}

          {/* TAB 2: FONTS & TYPOGRAPHY ("ভিতরে যত রকমের ফন্ট চেঞ্জ চেঞ্জ আছে সব রকম আছে ওইসব কিছু ওখানে চেঞ্জ করতে হবে") */}
          {activePane === 'fonts' && (
            <div className="space-y-5">
              
              {/* Font Family Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>ফন্ট ফ্যামিলি সিলেক্ট করুন (Font Family)</span>
                  <span className="text-[10px] font-mono text-indigo-400">{config.fontFamily || 'SF Pro (Apple)'}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_FONTS.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setConfig({ ...config, fontFamily: font.fontClass })}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                        config.fontFamily === font.fontClass 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{font.name}</div>
                      <div className={`text-sm mt-1 text-slate-400 ${font.fontClass}`}>
                        NSMods Dialog 123
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Message Font Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Title Font Size</span>
                    <span className="font-mono text-indigo-400">{config.titleSize || 18}sp</span>
                  </div>
                  <input 
                    type="range"
                    min={12}
                    max={28}
                    value={config.titleSize || 18}
                    onChange={(e) => setConfig({ ...config, titleSize: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Message Font Size</span>
                    <span className="font-mono text-indigo-400">{config.messageSize || 14}sp</span>
                  </div>
                  <input 
                    type="range"
                    min={10}
                    max={22}
                    value={config.messageSize || 14}
                    onChange={(e) => setConfig({ ...config, messageSize: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

              </div>

              {/* Text Alignment */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-300">টেক্সট অ্যালাইনমেন্ট (Text Alignment)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, textAlign: 'center' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      config.textAlign !== 'left' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Center (মাঝখানে)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, textAlign: 'left' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      config.textAlign === 'left' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Left (বামে)
                  </button>
                </div>
              </div>

              {/* Corner Radii */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Dialog Radius (px)</label>
                  <input 
                    type="number" 
                    value={config.dialogCornerRadius || 24}
                    onChange={(e) => setConfig({ ...config, dialogCornerRadius: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Button Radius (px)</label>
                  <input 
                    type="number" 
                    value={config.buttonsCornerRadius || 14}
                    onChange={(e) => setConfig({ ...config, buttonsCornerRadius: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: COLORS & THEMES */}
          {activePane === 'colors' && (
            <div className="space-y-4">
              
              {/* Preset Palettes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white">কুইক কালার প্যালেট (Color Presets)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfig({
                      ...config,
                      titleColor: '#00FFFF',
                      messageColor: '#E2E8F0',
                      dialogBgColor: '#0A0E17',
                      positiveBtnColor: '#00FFFF',
                      positiveBtnTextColor: '#000000',
                      negativeBtnColor: '#1E293B',
                      borderColor: '#00FFFF'
                    })}
                    className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-400 text-xs font-bold cursor-pointer hover:bg-slate-900"
                  >
                    ⚡ Neon Cyan
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfig({
                      ...config,
                      titleColor: '#FFFFFF',
                      messageColor: '#94A3B8',
                      dialogBgColor: '#0F172A',
                      positiveBtnColor: '#4F46E5',
                      positiveBtnTextColor: '#FFFFFF',
                      negativeBtnColor: '#1E293B',
                      borderColor: '#4F46E5'
                    })}
                    className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-indigo-400 text-xs font-bold cursor-pointer hover:bg-slate-900"
                  >
                    👑 Indigo VIP
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfig({
                      ...config,
                      titleColor: '#F59E0B',
                      messageColor: '#FEF3C7',
                      dialogBgColor: '#0B0B0C',
                      positiveBtnColor: '#D97706',
                      positiveBtnTextColor: '#000000',
                      negativeBtnColor: '#1F1E1A',
                      borderColor: '#F59E0B'
                    })}
                    className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-400 text-xs font-bold cursor-pointer hover:bg-slate-900"
                  >
                    🏆 Royal Gold
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfig({
                      ...config,
                      titleColor: '#10B981',
                      messageColor: '#D1FAE5',
                      dialogBgColor: '#06110D',
                      positiveBtnColor: '#10B981',
                      positiveBtnTextColor: '#000000',
                      negativeBtnColor: '#0F261D',
                      borderColor: '#10B981'
                    })}
                    className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold cursor-pointer hover:bg-slate-900"
                  >
                    🌱 Emerald Mod
                  </button>
                </div>
              </div>

              {/* Detailed Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                
                {/* Title Color */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>Title Color</span>
                    <span className="font-mono text-cyan-400">{config.titleColor}</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={config.titleColor}
                      onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                    <input 
                      type="color" 
                      value={config.titleColor?.startsWith('#') ? config.titleColor : '#FFFFFF'}
                      onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
                      className="w-10 h-9 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                    />
                  </div>
                </div>

                {/* Message Color */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>Message Color</span>
                    <span className="font-mono text-cyan-400">{config.messageColor}</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={config.messageColor}
                      onChange={(e) => setConfig({ ...config, messageColor: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                    <input 
                      type="color" 
                      value={config.messageColor?.startsWith('#') ? config.messageColor : '#94A3B8'}
                      onChange={(e) => setConfig({ ...config, messageColor: e.target.value })}
                      className="w-10 h-9 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>Dialog Background</span>
                    <span className="font-mono text-cyan-400">{config.dialogBgColor}</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={config.dialogBgColor}
                      onChange={(e) => setConfig({ ...config, dialogBgColor: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                    <input 
                      type="color" 
                      value={config.dialogBgColor?.startsWith('#') ? config.dialogBgColor : '#0F172A'}
                      onChange={(e) => setConfig({ ...config, dialogBgColor: e.target.value })}
                      className="w-10 h-9 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                    />
                  </div>
                </div>

                {/* Positive Button Color */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>Positive Button Color</span>
                    <span className="font-mono text-cyan-400">{config.positiveBtnColor}</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={config.positiveBtnColor}
                      onChange={(e) => setConfig({ ...config, positiveBtnColor: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                    <input 
                      type="color" 
                      value={config.positiveBtnColor?.startsWith('#') ? config.positiveBtnColor : '#4F46E5'}
                      onChange={(e) => setConfig({ ...config, positiveBtnColor: e.target.value })}
                      className="w-10 h-9 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                    />
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: CLASSES.DEX SMALI CODE ("আর পারলে এই স্মলি ফাইলটা যাতে ক্লাসেস ডেক্সের ভেতরে থাকে ওইটা করে দাও") */}
          {activePane === 'smali' && (
            <div className="space-y-4">
              
              {/* Dex Location Banner */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4" />
                    <span>Classes.dex লোকেশন এবং ইনজেকশন পয়েন্ট</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    MT MANAGER READY
                  </span>
                </div>
                <div className="bg-slate-900 px-3 py-2 rounded-xl text-xs font-mono text-cyan-300">
                  {dexFilePath}
                </div>
              </div>

              {/* 1-Click onCreate Hook Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>MainActivity.smali -&gt; onCreate মেথড কল:</span>
                  <button
                    onClick={handleCopyHook}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[11px] font-bold cursor-pointer"
                  >
                    {copiedHook ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHook ? 'কপি হয়েছে!' : 'হুক কপি করুন'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 select-all">
                  {hookCode}
                </div>
              </div>

              {/* Complete Smali Code Window */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>সম্পূর্ণ Smali কোড ({smaliClassName}.smali):</span>
                  <button
                    onClick={handleCopySmali}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer"
                  >
                    {copiedSmali ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSmali ? 'স্মলি কপি হয়েছে!' : 'সব স্মলি কপি করুন'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 max-h-72 overflow-y-auto whitespace-pre leading-relaxed select-all">
                  {generateSmaliCode()}
                </div>
              </div>

              {/* Step by Step Guide for MT Manager */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-slate-400">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>MT Manager-এ কিভাবে classes.dex এ যুক্ত করবেন:</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                  <li>MT Manager দিয়ে APK ওপেন করুন এবং <code className="text-cyan-300">classes.dex</code> এ ট্যাপ করুন।</li>
                  <li><b className="text-white">Dex Editor Plus</b> সিলেক্ট করুন।</li>
                  <li>প্যাকেজ ডিরেক্টরি <code className="text-cyan-300">com/nsmods/dialog/</code> এ গিয়ে <code className="text-emerald-300">{smaliClassName}.smali</code> নামে ফাইল তৈরি করে কোডটি পেস্ট করুন।</li>
                  <li><code className="text-cyan-300">MainActivity.smali</code> এর onCreate মেথডে হুক লাইনটি পেস্ট করে সেভ ও কম্পাইল করুন!</li>
                </ol>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
