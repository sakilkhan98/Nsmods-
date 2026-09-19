/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Sparkles, 
  Flame, 
  Cloud, 
  Cpu, 
  Binary, 
  Hash, 
  PlayCircle, 
  Info, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  Download,
  Eye,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  User,
  Heart,
  Send,
  Check,
  Smartphone,
  ArrowLeft,
  Sliders,
  LogOut
} from 'lucide-react';

import { ActiveTab, DialogConfig, OnlineUpdateConfig, WelcomeOnlineConfig } from './types';
import Sidebar from './components/Sidebar';
import DialogPreviews from './components/DialogPreviews';
import SleekDialogEditor from './components/SleekDialogEditor';
import FileExplorer from './components/FileExplorer';
import PasswordLock from './components/PasswordLock';
import Dashboard from './components/Dashboard';
import DedicatedDialogStudio from './components/DedicatedDialogStudio';
import AdminControlModal from './components/AdminControlModal';
import { getAdminSettings, subscribeAdminSettings, AdminSettings } from './utils/adminSettings';
import SmaliCodegen from './components/SmaliCodegen';
import { 
  SmaliToDexCompiler, 
  Base64Converter, 
  AsciiToHexConverter, 
  TutorialsHub,
  ToastJavaBase64,
  ToastJava,
  ToastSmaliBase64,
  ToastSmali,
  ToastColor,
  CheckXposed,
  RegexLib,
  LibraryRegexSmali,
  EncryptDecrypt,
  BaseConverter,
  SaveCodety,
  ToMillis
} from './components/ExtraTools';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');
  const [activeInfoTab, setActiveInfoTab] = useState<'none' | 'about' | 'terms' | 'contact'>('none');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Logout Handler: Exits to lock screen and resets admin privilege
  const handleLogout = () => {
    setIsUnlocked(false);
    setIsAdmin(false);
    setShowAdminModal(false);
    setActiveTab('home');
    setShowFileExplorer(false);
  };

  // Immediate reactive Kill Switch listener:
  // If admin turns off/locks the app (isAppLocked === true), all active non-admin sessions instantly exit to the home lock screen!
  useEffect(() => {
    const evaluateKillSwitch = (currentSettings: AdminSettings) => {
      setAdminSettings(currentSettings);
      if (!isAdmin && currentSettings.isAppLocked && isUnlocked) {
        setIsUnlocked(false);
        setActiveTab('home');
        setShowFileExplorer(false);
        setShowAdminModal(false);
      }
    };

    // 1. Cross-tab & local custom event subscription
    const unsub = subscribeAdminSettings((settings) => {
      evaluateKillSwitch(settings);
    });

    // 2. High-frequency 1-second pulse check for maximum responsiveness across any frame/tab
    const intervalId = setInterval(() => {
      evaluateKillSwitch(getAdminSettings());
    }, 1000);

    // 3. Focus & tab-switch re-verification
    const handleFocusOrVisible = () => {
      evaluateKillSwitch(getAdminSettings());
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    return () => {
      unsub();
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
  }, [isAdmin, isUnlocked]);
  
  // File Explorer view state
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [lastGeneratedZipName, setLastGeneratedZipName] = useState('Simple Dialog');

  // Generator Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // -------------------- DIALOG CREATOR STATES --------------------
  const [config, setConfig] = useState<DialogConfig>({
    title: "NSMods Pro Dialog",
    message: "🔥 Welcome to NSMods Pro! Join @Sharechat_ns_098 for latest updates & codes.",
    negativeText: "EXIT",
    positiveText: "TELEGRAM",
    titleColor: "#FF00FF",
    messageColor: "#E3E5EB",
    negativeBtnColor: "#15171B",
    positiveBtnColor: "#95A6B7",
    dialogBgColor: "#E3E5EB",
    positiveBtnLink: "https://t.me/Sharechat_ns_098",
    iconType: "ghost",
    iconSize: 75,
    iconStroke: 2.5,
    dialogCornerRadius: 30,
    buttonsCornerRadius: 50,
    titleSize: 15,
    messageSize: 14,
    buttonsSize: 12,
    showTime: false,
    alwaysShow: true,
    headerBgColor: "#FF00FF",
    positiveBtnTextColor: "#15171B",
    negativeBtnTextColor: "#E3E5EB",
    ghostColor: "#FF00FF",
    enableCloseBtn: true,
    bannerImageUrl: "",
    dialogBgImage: "",
    borderColor: "#00FFFF",
    borderWidth: 0,
    glowEffect: false,
    dialogAnimation: "fade",
    titleFont: "sans",
    messageFont: "sans"
  });

  // -------------------- ONLINE UPDATE STATES --------------------
  const [updateConfig, setUpdateConfig] = useState<OnlineUpdateConfig>({
    title: "Update V5.2 Available",
    message: "• Added Smali2Dex advanced parser\n• Optimized online dialog generation schemas\n• Bugs resolved & layout performance boosted",
    updateLink: "https://t.me/Sharechat_ns_098",
    versionCode: "5.2",
    forceUpdate: true,
    dialogBgColor: "#0F172A",
    btnColor: "#4F46E5",
    btnTextColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    messageColor: "#94A3B8"
  });

  // -------------------- ONLINE WELCOME STATES --------------------
  const [welcomeConfig, setWelcomeConfig] = useState<WelcomeOnlineConfig>({
    title: "Welcome Dear!",
    message: "Join Telegram Channel Stay updated with the latest modding tools!",
    telegramLink: "https://t.me/Sharechat_ns_098",
    authorName: "Modded by AndroMods",
    dialogBgColor: "#1E1E38",
    titleColor: "#38BDF8",
    messageColor: "#94A3B8",
    authorColor: "#64748B",
    btnText: "Telegram",
    cancelBtnText: "Cancel"
  });

  // -------------------- FLOATING WINDOW PRO STATES --------------------
  const [floatingConfig, setFloatingConfig] = React.useState({
    title: "NSMods Premium Links",
    iconUrl: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=200&auto=format&fit=crop&q=60",
    iconBgColor: "#4F46E5",
    iconSize: 55,
    dialogBgColor: "#0F172A",
    titleColor: "#38BDF8",
    textColor: "#94A3B8",
    accentColor: "#F43F5E",
    directLink: "https://ludoking.com",
    ludoLink: "https://ludoking.com",
    voiceLink: "https://discord.gg/yourvoice",
    telegramLink: "https://t.me/nsmods_channel",
    neonEffect: true,
    features: [
      { name: "Ludo Game Room Portal", enabled: true },
      { name: "Mic & Voice Room Bypass", enabled: true },
      { name: "Premium RGB Lighting Style", enabled: true },
      { name: "Automated Device Optimizer", enabled: false }
    ]
  });

  // Preset quick triggers
  const applyPreset = (presetName: string) => {
    if (presetName === 'neon') {
      setConfig({
        ...config,
        title: "Neon Premium Hook",
        message: "Unlock all unlocked developer options seamlessly.",
        titleColor: "#00FFFF",
        messageColor: "#E2E8F0",
        negativeBtnColor: "#15171B",
        positiveBtnColor: "#FF00FF",
        dialogBgColor: "#0B0F19",
        iconType: "ghost",
        positiveBtnLink: "https://t.me/Sharechat_ns_098",
        glowEffect: true,
        borderColor: "#00FFFF",
        borderWidth: 2,
        dialogAnimation: "bounce",
        titleFont: "space",
        messageFont: "sans"
      });
    } else if (presetName === 'luxury') {
      setConfig({
        ...config,
        title: "ROYAL VIP PASS",
        message: "Congratulations! Your account has been upgraded to Premium Lifetime Tier.",
        titleColor: "#D4AF37",
        messageColor: "#F3F4F6",
        negativeBtnColor: "#1E1E28",
        positiveBtnColor: "#D4AF37",
        dialogBgColor: "#0A0A0F",
        iconType: "gift",
        positiveBtnLink: "https://t.me/Sharechat_ns_098",
        iconStroke: 1.5,
        dialogCornerRadius: 24,
        buttonsCornerRadius: 12,
        glowEffect: true,
        borderColor: "#D4AF37",
        borderWidth: 1.5,
        dialogAnimation: "slide-up",
        titleFont: "playfair",
        messageFont: "outfit"
      });
    } else if (presetName === 'cyberpunk') {
      setConfig({
        ...config,
        title: "SYSTEM INTRUSION DETECTED",
        message: "Loading custom memory pointers... Security sandboxes bypassed successfully.",
        titleColor: "#FFEA00",
        messageColor: "#A7F3D0",
        negativeBtnColor: "#1B1F38",
        positiveBtnColor: "#7E22CE",
        dialogBgColor: "#090B16",
        iconType: "warning",
        positiveBtnLink: "https://t.me/Sharechat_ns_098",
        iconSize: 85,
        dialogCornerRadius: 8,
        buttonsCornerRadius: 4,
        glowEffect: true,
        borderColor: "#FFEA00",
        borderWidth: 2,
        dialogAnimation: "zoom",
        titleFont: "mono",
        messageFont: "mono"
      });
    } else if (presetName === 'sakura') {
      setConfig({
        ...config,
        title: "Aesthetic Sakura",
        message: "Soft pastel memories await. Welcome to a peaceful, high-quality experience.",
        titleColor: "#DB2777",
        messageColor: "#4D3639",
        negativeBtnColor: "#FFF1F2",
        positiveBtnColor: "#FBCFE8",
        dialogBgColor: "#FFFDFD",
        iconType: "avatar",
        positiveBtnLink: "https://t.me/Sharechat_ns_098",
        iconStroke: 2.5,
        dialogCornerRadius: 32,
        buttonsCornerRadius: 99,
        glowEffect: false,
        borderColor: "#FBCFE8",
        borderWidth: 1,
        dialogAnimation: "slide-down",
        titleFont: "outfit",
        messageFont: "ubuntu"
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'customIconUrl' | 'bannerImageUrl' | 'dialogBgImage' | 'floatingIconUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (targetField === 'floatingIconUrl') {
            setFloatingConfig(prev => ({
              ...prev,
              iconUrl: reader.result as string
            }));
          } else {
            setConfig(prev => ({
              ...prev,
              [targetField]: reader.result,
              ...(targetField === 'customIconUrl' ? { iconType: 'custom' } : {})
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenProgress(0);

    const zipTitle = activeTab.includes('update') ? 'Online_Update_Dialog' : 
                     activeTab.includes('welcome') ? 'Welcome_Online_Dialog' :
                     activeTab.includes('simple') ? 'Simple_Online_Dialog' : 
                     activeTab.includes('floating') ? 'Floating_Mod_Menu' :
                     `${config.title.replace(/[^a-zA-Z0-9]/g, '_')}_Dialog`;

    setLastGeneratedZipName(zipTitle);

    const interval = setInterval(() => {
      setGenProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setShowSuccessModal(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleColorPreset = (field: keyof DialogConfig, color: string) => {
    setConfig({ ...config, [field]: color });
  };

  // Preset Colors Palette for modders
  const presetColors = [
    '#FF00FF', // Magenta/Pink
    '#00FFFF', // Cyan
    '#38BDF8', // Sky Blue
    '#F43F5E', // Rose Red
    '#4F46E5', // Indigo
    '#10B981', // Emerald Green
    '#15171B', // Jet Black
    '#E3E5EB', // Soft Gray
    '#FFFFFF', // White
  ];

  if (!isUnlocked) {
    return (
      <PasswordLock 
        onUnlock={(adminGranted?: boolean) => {
          if (adminGranted) setIsAdmin(true);
          else setIsAdmin(false);
          setIsUnlocked(true);
        }} 
      />
    );
  }

  const isDialogTab = [
    'dialog-v1-ios',
    'dialog-v2-picture',
    'dialog-v3-modern',
    'dialog-v4-cyber',
    'dialog-v5-bottomsheet',
    'custom-dialog-v1', 
    'custom-dialog-v2', 
    'custom-dialog-v3', 
    'custom-dialog-v4', 
    'online-simple', 
    'online-update', 
    'online-welcome'
  ].includes(activeTab);

  if (isDialogTab && !showFileExplorer) {
    return (
      <>
        <DedicatedDialogStudio
          activeTab={activeTab}
          config={config}
          setConfig={setConfig}
          onBack={() => {
            setActiveTab('home');
            setShowFileExplorer(false);
          }}
          onOpenExplorer={() => setShowFileExplorer(true)}
          onGenerateZip={() => {
            setShowFileExplorer(true);
          }}
          isAdmin={isAdmin}
          onOpenAdminModal={() => setShowAdminModal(true)}
          onLogout={handleLogout}
        />
        <AdminControlModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          adminSettings={adminSettings}
          onUpdateSettings={(newSettings) => setAdminSettings(newSettings)}
          onExitAdmin={handleLogout}
        />
      </>
    );
  }

  const showSleekEditor = false;

  return (
    <div className={`min-h-screen h-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 ${
      showSleekEditor ? 'bg-[#EDF2F6] text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Dynamic Navigation & Header Bar */}
      <div className={`w-full px-6 py-4 flex items-center justify-between sticky top-0 z-30 h-16 flex-shrink-0 transition-all duration-300 ${
        showSleekEditor 
          ? 'bg-[#EDF2F6] border-b border-[#D2D9E3]/80 text-slate-800' 
          : 'bg-slate-900 border-b border-slate-800 text-slate-100'
      }`}>
        <div className="flex items-center gap-2">
          {activeTab !== 'home' && (
            <button 
              onClick={() => {
                setActiveTab('home');
                setShowFileExplorer(false);
              }}
              className={`mr-3 p-2 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                showSleekEditor
                  ? 'bg-white hover:bg-slate-100 text-[#007D54] border border-[#D2D9E3] shadow-xs'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          )}
          <div className={`p-1.5 rounded-lg border ${
            showSleekEditor
              ? 'bg-[#007D54]/10 text-[#007D54] border-[#007D54]/20'
              : 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'
          }`}>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className={`font-extrabold tracking-tight text-xs md:text-sm ${
            showSleekEditor ? 'text-slate-850' : 'text-white'
          }`}>
            {activeTab === 'home' ? 'NSMods Dialog Pro' : 
             activeTab === 'custom-dialog-v1' ? 'Classic Dialog Creator' :
             activeTab === 'custom-dialog-v2' ? 'iOS Style Dialog Creator' :
             activeTab === 'custom-dialog-v3' ? '3D Ghost Dialog Creator' :
             activeTab === 'online-simple' ? 'Simple Online Dialog Creator' :
             activeTab === 'online-update' ? 'Online Update Dialog Creator' :
             activeTab === 'online-welcome' ? 'Online Welcome Dialog Creator' :
             activeTab === 'smali2dex' ? 'Smali2Dex Compiler' :
             activeTab === 'base64' ? 'Base64 Encrypter' :
             activeTab === 'ascii-hex' ? 'ASCII to Hex Converter' :
             activeTab === 'tutorials' ? 'NSMods Tutorials Hub' :
             activeTab === 'toast-java-base64' ? 'Toast Java Base64 Creator' :
             activeTab === 'toast-java' ? 'Toast Java Creator' :
             activeTab === 'toast-smali-base64' ? 'Toast Smali Base64 Creator' :
             activeTab === 'toast-smali' ? 'Toast Smali Creator' :
             activeTab === 'toast-color' ? 'Toast Color Creator' :
             activeTab === 'check-xposed' ? 'Check Xposed Framework' :
             activeTab === 'regex-lib' ? 'Regex Lib' :
             activeTab === 'library-regex-smali' ? 'Library Regex Smali' :
             activeTab === 'encrypt-decrypt' ? 'String Encrypt & Decrypt' :
             activeTab === 'base-converter' ? 'Base Converter' :
             activeTab === 'save-codety' ? 'save Codety' :
             activeTab === 'to-millis' ? 'To Millis Converter' :
             'Floating Window Pro Creator'}
          </span>
        </div>

        {/* Mobile Tab segmented switcher for Settings / Live Preview inside creators */}
        {activeTab !== 'home' && !showFileExplorer && (
          <div className={`flex lg:hidden items-center p-0.5 rounded-xl border ${
            showSleekEditor 
              ? 'bg-slate-200/50 border-[#D2D9E3]' 
              : 'bg-slate-950 border-slate-850'
          }`}>
            <button
              onClick={() => setMobilePane('edit')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                mobilePane === 'edit' 
                  ? (showSleekEditor ? 'bg-white text-slate-800 shadow-sm' : 'bg-slate-900 text-white shadow')
                  : 'text-slate-400'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobilePane('preview')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                mobilePane === 'preview' 
                  ? (showSleekEditor ? 'bg-white text-slate-800 shadow-sm' : 'bg-slate-900 text-white shadow')
                  : 'text-slate-400'
              }`}
            >
              Preview
            </button>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black cursor-pointer hover:bg-emerald-500 hover:text-slate-950 transition shadow-sm"
              title="Admin Controls (Password & Kill-Switch Settings)"
            >
              <Sliders className="w-3 h-3" />
              <span>👑 Admin Controls</span>
            </button>
          )}
          <span className={`hidden sm:inline-block text-[10px] font-mono py-1 px-2.5 rounded-full font-semibold border ${
            showSleekEditor
              ? 'bg-[#007D54]/10 border-[#007D54]/20 text-[#007D54]'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>PRO ACTIVE ✓</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-[10px] font-bold cursor-pointer transition shadow-sm"
            title="Sign out of application"
          >
            <LogOut className="w-3 h-3" />
            <span>{isAdmin ? 'Admin Sign Out' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content Area */}
      <div className={`flex-1 relative ${
        showSleekEditor ? 'bg-[#EDF2F6] overflow-y-auto scrollbar-thin' : 'bg-slate-950/20 overflow-hidden'
      }`}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full overflow-y-auto scrollbar-thin"
            >
              <Dashboard 
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setShowFileExplorer(false);
                }}
                activeInfoTab={activeInfoTab}
                setActiveInfoTab={setActiveInfoTab}
                isAdmin={isAdmin}
                onToggleAdmin={() => setIsAdmin(prev => !prev)}
                onOpenAdminModal={() => setShowAdminModal(true)}
                isAppLocked={adminSettings.isAppLocked}
                onLogout={handleLogout}
              />
            </motion.div>
          ) : (
            <div className={showSleekEditor ? "" : "h-full overflow-hidden"}>
              {showFileExplorer ? (
                <div className="h-full overflow-y-auto p-4 md:p-6">
                  <FileExplorer 
                    config={config} 
                    generatedZipName={lastGeneratedZipName}
                    onBack={() => setShowFileExplorer(false)} 
                    activeTab={activeTab}
                    floatingConfig={floatingConfig}
                  />
                </div>
              ) : (
                <div className={showSleekEditor ? "" : "h-full overflow-hidden"}>
                  {/* UNIFIED SLEEK DIALOG CREATOR PAGES (Matching Screenshot Design) */}
                  {(activeTab === 'custom-dialog-v1' || 
                    activeTab === 'custom-dialog-v2' || 
                    activeTab === 'custom-dialog-v3' || 
                    activeTab === 'custom-dialog-v4' ||
                    activeTab === 'online-simple' ||
                    activeTab === 'online-update' ||
                    activeTab === 'online-welcome') && (
                      <SleekDialogEditor 
                        activeTab={activeTab}
                        config={config}
                        setConfig={setConfig}
                        onGenerate={handleGenerate}
                        isGenerating={isGenerating}
                        genProgress={genProgress}
                      />
                  )}

                  {/* 1. MAIN CREATOR CHANNELS (Dialog V1, V2, V3, V4) */}
                  {false && (activeTab === 'custom-dialog-v1' || activeTab === 'custom-dialog-v2' || activeTab === 'custom-dialog-v3' || activeTab === 'custom-dialog-v4') && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 h-full overflow-hidden">
                    
                    {/* Left Form Editor: Layout inputs */}
                    <div className={`${mobilePane === 'edit' ? 'flex' : 'hidden'} lg:flex lg:col-span-7 h-full flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl`}>
                      
                      {/* Header title */}
                      <div className="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 p-6 border-b border-slate-850">
                        <div>
                          <h2 className="text-base font-bold text-white flex items-center gap-2">
                            {activeTab === 'custom-dialog-v1' ? "Dialog V1 Configuration" :
                             activeTab === 'custom-dialog-v2' ? "iOS Style Dialog Configuration" : 
                             activeTab === 'custom-dialog-v3' ? "Dialog V3 Configuration" :
                             "Apk Editor Popout V4 Configuration"}
                          </h2>
                          <p className="text-[11px] text-slate-500">Customize dialog colors, typography, background, and font assets.</p>
                        </div>
                        
                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1">
                          <button 
                            type="button"
                            onClick={() => applyPreset('neon')}
                            className="text-[9px] bg-slate-950 hover:bg-cyan-950/40 border border-slate-850 hover:border-cyan-500/20 px-2.5 py-1.5 rounded-xl font-medium text-cyan-400 transition-all cursor-pointer"
                          >
                            ⚡ Neon RGB
                          </button>
                          <button 
                            type="button"
                            onClick={() => applyPreset('luxury')}
                            className="text-[9px] bg-slate-950 hover:bg-yellow-950/40 border border-slate-850 hover:border-yellow-600/20 px-2.5 py-1.5 rounded-xl font-medium text-yellow-500 transition-all cursor-pointer"
                          >
                            👑 Luxury
                          </button>
                          <button 
                            type="button"
                            onClick={() => applyPreset('cyberpunk')}
                            className="text-[9px] bg-slate-950 hover:bg-purple-950/40 border border-slate-850 hover:border-purple-500/20 px-2.5 py-1.5 rounded-xl font-medium text-purple-400 transition-all cursor-pointer"
                          >
                            👾 Cyber
                          </button>
                          <button 
                            type="button"
                            onClick={() => applyPreset('sakura')}
                            className="text-[9px] bg-slate-950 hover:bg-pink-950/40 border border-slate-850 hover:border-pink-500/20 px-2.5 py-1.5 rounded-xl font-medium text-pink-400 transition-all cursor-pointer"
                          >
                            🌸 Sakura
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleGenerate} className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Title input */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Enter Title</label>
                            <input 
                              type="text" 
                              value={config.title}
                              onChange={(e) => setConfig({ ...config, title: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                              placeholder="e.g. Hey guy's"
                            />
                          </div>

                          {/* Message input */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Enter Message</label>
                            <input 
                              type="text" 
                              value={config.message}
                              onChange={(e) => setConfig({ ...config, message: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                              placeholder="hello 👋"
                            />
                          </div>

                          {/* Negative Button text */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Enter Negative Button Text</label>
                            <input 
                              type="text" 
                              value={config.negativeText}
                              onChange={(e) => setConfig({ ...config, negativeText: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                              placeholder="No"
                            />
                          </div>

                          {/* Positive Button text */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Enter Positive Button Text</label>
                            <input 
                              type="text" 
                              value={config.positiveText}
                              onChange={(e) => setConfig({ ...config, positiveText: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                              placeholder="Join"
                            />
                          </div>

                        </div>

                        {/* Colors Palette & Picker Section */}
                        <div className="space-y-4 pt-2 border-t border-slate-850">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">HEX Color Matrix & Color Presets</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Title Color */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400 flex justify-between">
                                <span>Title Color</span>
                                <span className="font-mono text-indigo-400">{config.titleColor}</span>
                              </label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={config.titleColor}
                                  onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
                                />
                                <input 
                                  type="color" 
                                  value={config.titleColor.startsWith('#') ? config.titleColor : '#FF00FF'} 
                                  onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
                                  className="w-10 h-10 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                                />
                              </div>
                            </div>

                            {/* Message Color */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400 flex justify-between">
                                <span>Message Color</span>
                                <span className="font-mono text-indigo-400">{config.messageColor}</span>
                              </label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={config.messageColor}
                                  onChange={(e) => setConfig({ ...config, messageColor: e.target.value })}
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
                                />
                                <input 
                                  type="color" 
                                  value={config.messageColor.startsWith('#') ? config.messageColor : '#E3E5EB'} 
                                  onChange={(e) => setConfig({ ...config, messageColor: e.target.value })}
                                  className="w-10 h-10 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                                />
                              </div>
                            </div>

                            {/* Negative Btn Color */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400 flex justify-between">
                                <span>Negative Button Color</span>
                                <span className="font-mono text-indigo-400">{config.negativeBtnColor}</span>
                              </label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={config.negativeBtnColor}
                                  onChange={(e) => setConfig({ ...config, negativeBtnColor: e.target.value })}
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
                                />
                                <input 
                                  type="color" 
                                  value={config.negativeBtnColor.startsWith('#') ? config.negativeBtnColor : '#15171B'} 
                                  onChange={(e) => setConfig({ ...config, negativeBtnColor: e.target.value })}
                                  className="w-10 h-10 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                                />
                              </div>
                            </div>

                            {/* Positive Btn Color */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400 flex justify-between">
                                <span>Positive Button Color</span>
                                <span className="font-mono text-indigo-400">{config.positiveBtnColor}</span>
                              </label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={config.positiveBtnColor}
                                  onChange={(e) => setConfig({ ...config, positiveBtnColor: e.target.value })}
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
                                />
                                <input 
                                  type="color" 
                                  value={config.positiveBtnColor.startsWith('#') ? config.positiveBtnColor : '#95A6B7'} 
                                  onChange={(e) => setConfig({ ...config, positiveBtnColor: e.target.value })}
                                  className="w-10 h-10 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                                />
                              </div>
                            </div>

                            {/* Dialog Background Color */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400 flex justify-between">
                                <span>Dialog Background Color</span>
                                <span className="font-mono text-indigo-400">{config.dialogBgColor}</span>
                              </label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={config.dialogBgColor}
                                  onChange={(e) => setConfig({ ...config, dialogBgColor: e.target.value })}
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
                                />
                                <input 
                                  type="color" 
                                  value={config.dialogBgColor.startsWith('#') ? config.dialogBgColor : '#E3E5EB'} 
                                  onChange={(e) => setConfig({ ...config, dialogBgColor: e.target.value })}
                                  className="w-10 h-10 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                                />
                              </div>
                            </div>

                            {/* Positive Button Link */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400">Positive Button Link</label>
                              <input 
                                type="text" 
                                value={config.positiveBtnLink}
                                onChange={(e) => setConfig({ ...config, positiveBtnLink: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                                placeholder="https://t.me/Sharechat_ns_098"
                              />
                            </div>

                          </div>

                          {/* Quick Palette triggers */}
                          <div className="flex items-center gap-1.5 pt-1.5 overflow-x-auto whitespace-nowrap">
                            <span className="text-[10px] text-slate-500 font-mono">Palette:</span>
                            {presetColors.map((col, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleColorPreset('titleColor', col)}
                                className="w-5 h-5 rounded-full border border-slate-800 flex-shrink-0 cursor-pointer"
                                style={{ backgroundColor: col }}
                                title={`Set to ${col}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Icon Options Section */}
                        <div className="space-y-4 pt-4 border-t border-slate-850">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Header Icon Configuration</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Icon Type Selection */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400">Select Icon Source</label>
                              <select 
                                value={config.iconType}
                                onChange={(e) => setConfig({ ...config, iconType: e.target.value as any })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                <option value="ghost">3D Translucent Ghost</option>
                                <option value="avatar">Profile Avatar Card</option>
                                <option value="bell">Notification Bell Alert</option>
                                <option value="gift">Reward Gift box</option>
                                <option value="warning">System Warning Alert</option>
                                <option value="custom">Custom Web Image Link</option>
                              </select>
                            </div>

                            {/* Custom Icon Link */}
                            {config.iconType === 'custom' && (
                              <div className="space-y-1.5 md:col-span-2 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                                <label className="text-xs font-semibold text-slate-400 flex justify-between items-center">
                                  <span>Pick an icon (URL or Phone Image)</span>
                                  {config.customIconUrl?.startsWith('data:image') && (
                                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono">Uploaded 📸</span>
                                  )}
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3 items-center mt-1 w-full">
                                  <input 
                                    type="text" 
                                    value={config.customIconUrl?.startsWith('data:image') ? 'Uploaded Local Photo' : (config.customIconUrl || '')}
                                    onChange={(e) => setConfig({ ...config, customIconUrl: e.target.value })}
                                    className="flex-1 w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                                    placeholder="Enter image URL..."
                                    disabled={config.customIconUrl?.startsWith('data:image')}
                                  />
                                  <label className="w-full sm:w-auto flex-shrink-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      onChange={(e) => handleImageUpload(e, 'customIconUrl')} 
                                      className="hidden" 
                                    />
                                    Upload 📸
                                  </label>
                                  {config.customIconUrl && (
                                    <button
                                      type="button"
                                      onClick={() => setConfig({ ...config, customIconUrl: "" })}
                                      className="w-full sm:w-auto p-2.5 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/20 text-rose-400 rounded-xl text-xs"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Dimensions setup */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400">Enter Icon Size (px)</label>
                              <input 
                                type="number" 
                                value={config.iconSize}
                                onChange={(e) => setConfig({ ...config, iconSize: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400">Enter Icon Stroke (px)</label>
                              <input 
                                type="number" 
                                value={config.iconStroke}
                                onChange={(e) => setConfig({ ...config, iconStroke: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                              />
                            </div>

                          </div>
                        </div>

                        {/* Dimensions and layout metrics */}
                        <div className="space-y-4 pt-4 border-t border-slate-850">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sizing, Border Radius & Time rules</h4>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-400">Dialog Radius</label>
                              <input 
                                type="number" 
                                value={config.dialogCornerRadius}
                                onChange={(e) => setConfig({ ...config, dialogCornerRadius: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-400">Buttons Radius</label>
                              <input 
                                type="number" 
                                value={config.buttonsCornerRadius}
                                onChange={(e) => setConfig({ ...config, buttonsCornerRadius: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-400">Title Size (sp)</label>
                              <input 
                                type="number" 
                                value={config.titleSize}
                                onChange={(e) => setConfig({ ...config, titleSize: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-400">Message Size (sp)</label>
                              <input 
                                type="number" 
                                value={config.messageSize}
                                onChange={(e) => setConfig({ ...config, messageSize: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                              />
                            </div>

                          </div>

                          {/* Time Rules Radio Button triggers */}
                          <div className="flex items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                              <input 
                                type="radio" 
                                checked={config.alwaysShow} 
                                onChange={() => setConfig({ ...config, alwaysShow: true, showTime: false })}
                                className="text-indigo-600 focus:ring-indigo-500" 
                              />
                              Show Always
                            </label>
                            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                              <input 
                                type="radio" 
                                checked={config.showTime} 
                                onChange={() => setConfig({ ...config, showTime: true, alwaysShow: false })}
                                className="text-indigo-600 focus:ring-indigo-500" 
                              />
                              Custom Time (Interval display)
                            </label>
                          </div>
                        </div>

                        {/* ⭐ ADVANCED PREMIUM DESIGN STUDIO ⭐ */}
                        <div className="space-y-5 pt-5 border-t border-slate-850 bg-slate-950/20 p-5 rounded-2xl border border-indigo-500/10">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                              ⭐ Premium Design Studio ⭐
                            </h4>
                            <span className="text-[9px] font-mono font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-2 py-0.5 rounded-md uppercase tracking-wider">PREMIUM VIP</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Entrance Animation */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400">Entrance Animation</label>
                              <select 
                                value={config.dialogAnimation || 'fade'}
                                onChange={(e) => setConfig({ ...config, dialogAnimation: e.target.value as any })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                <option value="fade">💨 Smooth Fade-In (Default)</option>
                                <option value="zoom">🔍 Zoom Elastic Pop (Scale Up)</option>
                                <option value="slide-up">⬆️ Slide Up Entrance</option>
                                <option value="slide-down">⬇️ Slide Down Entrance</option>
                                <option value="bounce">🏀 Playful Elastic Bounce</option>
                              </select>
                            </div>

                            {/* Glow Neon Effect Toggle */}
                            <div className="space-y-1.5 flex flex-col justify-between p-1 bg-slate-950/30 rounded-xl border border-slate-850 px-3 py-2">
                              <span className="text-xs font-semibold text-slate-400">Glow Neon Effect</span>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[10px] text-slate-500 font-medium">Adds high-end outer glowing borders</span>
                                <button
                                  type="button"
                                  onClick={() => setConfig({ ...config, glowEffect: !config.glowEffect })}
                                  className="w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer flex items-center"
                                  style={{ backgroundColor: config.glowEffect ? '#6366F1' : '#1E293B' }}
                                >
                                  <motion.div 
                                    layout 
                                    className="w-4 h-4 bg-white rounded-full shadow-md"
                                    animate={{ x: config.glowEffect ? 20 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  />
                                </button>
                              </div>
                            </div>

                            {/* Title Font */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400">Title Font Style</label>
                              <select 
                                value={config.titleFont || 'sans'}
                                onChange={(e) => setConfig({ ...config, titleFont: e.target.value as any })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                <option value="sans">Inter Sans-Serif</option>
                                <option value="space">Space Grotesk (Tech)</option>
                                <option value="playfair">Playfair Display (Luxury)</option>
                                <option value="outfit">Outfit Geometric (Modern)</option>
                                <option value="ubuntu">Ubuntu Smooth (Friendly)</option>
                                <option value="mono">JetBrains Mono (Hacker)</option>
                              </select>
                            </div>

                            {/* Message Font */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400">Message Font Style</label>
                              <select 
                                value={config.messageFont || 'sans'}
                                onChange={(e) => setConfig({ ...config, messageFont: e.target.value as any })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                <option value="sans">Inter Sans-Serif</option>
                                <option value="space">Space Grotesk (Tech)</option>
                                <option value="playfair">Playfair Display (Luxury)</option>
                                <option value="outfit">Outfit Geometric (Modern)</option>
                                <option value="ubuntu">Ubuntu Smooth (Friendly)</option>
                                <option value="mono">JetBrains Mono (Hacker)</option>
                              </select>
                            </div>

                            {/* Custom Border Configuration */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400">Outer Border Width (px)</label>
                              <div className="flex items-center gap-3">
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="8" 
                                  value={config.borderWidth ?? 0}
                                  onChange={(e) => setConfig({ ...config, borderWidth: Number(e.target.value) })}
                                  className="flex-1 accent-indigo-500 cursor-pointer"
                                />
                                <span className="text-xs font-mono text-indigo-400 w-8 text-right">{config.borderWidth ?? 0}px</span>
                              </div>
                            </div>

                            {/* Border Color */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400 flex justify-between">
                                <span>Border Color</span>
                                <span className="font-mono text-indigo-400">{config.borderColor || '#00FFFF'}</span>
                              </label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={config.borderColor || '#00FFFF'}
                                  onChange={(e) => setConfig({ ...config, borderColor: e.target.value })}
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
                                />
                                <input 
                                  type="color" 
                                  value={(config.borderColor && config.borderColor.startsWith('#')) ? config.borderColor : '#00FFFF'} 
                                  onChange={(e) => setConfig({ ...config, borderColor: e.target.value })}
                                  className="w-10 h-10 bg-transparent cursor-pointer rounded-xl border-0 overflow-hidden"
                                />
                              </div>
                            </div>

                            {/* Dialog Banner Image Uploader */}
                            <div className="space-y-1.5 md:col-span-2 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                              <label className="text-xs font-semibold text-slate-400 flex justify-between items-center">
                                <span>Add Top Banner Image (URL or Local Image Upload)</span>
                                {config.bannerImageUrl && (
                                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">Banner Enabled</span>
                                )}
                              </label>
                              <div className="flex flex-col sm:flex-row gap-3 items-center mt-1 w-full">
                                <input 
                                  type="text" 
                                  value={config.bannerImageUrl?.startsWith('data:image') ? 'Uploaded Local Photo' : (config.bannerImageUrl || '')}
                                  onChange={(e) => setConfig({ ...config, bannerImageUrl: e.target.value })}
                                  className="flex-1 w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                                  placeholder="Enter Banner Image URL (e.g. Unsplash link)..."
                                  disabled={config.bannerImageUrl?.startsWith('data:image')}
                                />
                                <label className="w-full sm:w-auto flex-shrink-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageUpload(e, 'bannerImageUrl')} 
                                    className="hidden" 
                                  />
                                  Upload Photo 📸
                                </label>
                                {config.bannerImageUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setConfig({ ...config, bannerImageUrl: "" })}
                                    className="w-full sm:w-auto p-2.5 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/20 text-rose-400 rounded-xl text-xs"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Dialog Background Image Uploader */}
                            <div className="space-y-1.5 md:col-span-2 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                              <label className="text-xs font-semibold text-slate-400 flex justify-between items-center">
                                <span>Dialog Background Cover Image (URL or Local Image Upload)</span>
                                {config.dialogBgImage && (
                                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">Background Enabled</span>
                                )}
                              </label>
                              <div className="flex flex-col sm:flex-row gap-3 items-center mt-1 w-full">
                                <input 
                                  type="text" 
                                  value={config.dialogBgImage?.startsWith('data:image') ? 'Uploaded Local Photo' : (config.dialogBgImage || '')}
                                  onChange={(e) => setConfig({ ...config, dialogBgImage: e.target.value })}
                                  className="flex-1 w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                                  placeholder="Enter Background Image URL..."
                                  disabled={config.dialogBgImage?.startsWith('data:image')}
                                />
                                <label className="w-full sm:w-auto flex-shrink-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageUpload(e, 'dialogBgImage')} 
                                    className="hidden" 
                                  />
                                  Upload Photo 📸
                                </label>
                                {config.dialogBgImage && (
                                  <button
                                    type="button"
                                    onClick={() => setConfig({ ...config, dialogBgImage: "" })}
                                    className="w-full sm:w-auto p-2.5 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/20 text-rose-400 rounded-xl text-xs"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>

                        </div>
                        {/* Submit Button to Generate Package */}
                        <div className="p-5 border-t border-slate-850 bg-slate-950/40 flex-shrink-0">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-indigo-600/10 hover:shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <Sparkles className="w-5 h-5 animate-spin" />
                            Generate Dialog Package (.ZIP)
                          </button>
                        </div>
                      </form>

                    </div>

                    {/* Right Live Preview Frame Column */}
                    <div className={`${mobilePane === 'preview' ? 'flex' : 'hidden'} lg:flex lg:col-span-5 h-full flex-col bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl justify-center items-center relative overflow-hidden space-y-4`}>
                      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-indigo-400" />
                          Live Interactive Preview
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500">Scale: Auto Fit</span>
                      </div>

                      {/* Device preview frame with active configuration */}
                      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                        <DialogPreviews 
                          config={config} 
                          variant={
                            activeTab === 'custom-dialog-v1' ? 'v1' : 
                            activeTab === 'custom-dialog-v2' ? 'v2' : 
                            activeTab === 'custom-dialog-v3' ? 'v3' : 
                            activeTab === 'custom-dialog-v4' ? 'v4' : 'v1'
                          } 
                        />
                      </div>

                      <div className="w-full p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-1 text-slate-400 text-xs font-light">
                        <span className="font-semibold text-white block">Configuration Metrics:</span>
                        <p>• Title Font: {config.titleSize}sp • Background: {config.dialogBgColor}</p>
                        <p>• Font Assets: <span className="font-mono text-indigo-400">dialog_title.ttf</span>, <span className="font-mono text-indigo-400">dialog_msg.ttf</span></p>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. ONLINE DIALOGS: SIMPLE ONLINE CREATOR */}
                {false && activeTab === 'online-simple' && (
                  <div className="h-full w-full overflow-y-auto p-4 md:p-8 flex items-center justify-center scrollbar-thin">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
                      <div className="relative">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Cloud className="w-5 h-5 text-indigo-400" />
                          Simple Online Dialog Creator
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Generate remote dialog configuration files suitable for hosting on CDN, Firebase, or GitHub Pages.</p>
                      </div>

                      <form onSubmit={handleGenerate} className="space-y-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Dialog Title</label>
                            <input 
                              type="text" 
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-sm text-white" 
                              defaultValue="Greetings Member"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Destination Redirect Link</label>
                            <input 
                              type="text" 
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-sm text-white" 
                              defaultValue="https://t.me/Sharechat_ns_098"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Online Message Payload</label>
                          <textarea 
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs text-white" 
                            defaultValue="Welcome to our remote service gateway. Stay tuned for further security updates."
                          />
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl transition-all cursor-pointer">
                          Generate Remote Configuration (JSON & ZIP)
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 3. ONLINE DIALOGS: ONLINE UPDATE V1 */}
                {false && activeTab === 'online-update' && (
                  <div className="h-full w-full overflow-y-auto p-4 md:p-8 flex items-center justify-center scrollbar-thin">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
                      <div className="relative">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Cloud className="w-5 h-5 text-indigo-400" />
                          Online Update Dialog V1 Creator
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Configure remote updates. Force security updates directly from Telegram or Google Play.</p>
                      </div>

                      <form onSubmit={handleGenerate} className="space-y-5 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Update Title</label>
                            <input 
                              type="text" 
                              value={updateConfig.title}
                              onChange={(e) => setUpdateConfig({ ...updateConfig, title: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Latest Version Name/Code</label>
                            <input 
                              type="text" 
                              value={updateConfig.versionCode}
                              onChange={(e) => setUpdateConfig({ ...updateConfig, versionCode: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white font-mono" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Download Link</label>
                            <input 
                              type="text" 
                              value={updateConfig.updateLink}
                              onChange={(e) => setUpdateConfig({ ...updateConfig, updateLink: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Enforce Hard Upgrade (Block app entry)</label>
                            <select 
                              value={updateConfig.forceUpdate ? 'yes' : 'no'}
                              onChange={(e) => setUpdateConfig({ ...updateConfig, forceUpdate: e.target.value === 'yes' })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white cursor-pointer"
                            >
                              <option value="yes">Yes (Force hard update)</option>
                              <option value="no">No (Allow dismiss / cancel)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Release Changelog Notes:</label>
                          <textarea 
                            value={updateConfig.message}
                            onChange={(e) => setUpdateConfig({ ...updateConfig, message: e.target.value })}
                            rows={4}
                            className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs font-mono text-slate-300" 
                          />
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all cursor-pointer">
                          Create Update Payload ZIP
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 4. ONLINE DIALOGS: ONLINE WELCOME V2 */}
                {false && activeTab === 'online-welcome' && (
                  <div className="h-full w-full overflow-y-auto p-4 md:p-8 flex items-center justify-center scrollbar-thin">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
                      <div className="relative">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Cloud className="w-5 h-5 text-indigo-400" />
                          Online Welcome Dialogue V2 Creator
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Configure online welcome dialogs. Display custom credits, Telegram channel links, and author references.</p>
                      </div>

                      <form onSubmit={handleGenerate} className="space-y-5 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Welcome Title</label>
                            <input 
                              type="text" 
                              value={welcomeConfig.title}
                              onChange={(e) => setWelcomeConfig({ ...welcomeConfig, title: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Author Credit Line</label>
                            <input 
                              type="text" 
                              value={welcomeConfig.authorName}
                              onChange={(e) => setWelcomeConfig({ ...welcomeConfig, authorName: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Telegram Link</label>
                            <input 
                              type="text" 
                              value={welcomeConfig.telegramLink}
                              onChange={(e) => setWelcomeConfig({ ...welcomeConfig, telegramLink: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Positive Button Text</label>
                            <input 
                              type="text" 
                              value={welcomeConfig.btnText}
                              onChange={(e) => setWelcomeConfig({ ...welcomeConfig, btnText: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Welcome Message Text:</label>
                          <textarea 
                            value={welcomeConfig.message}
                            onChange={(e) => setWelcomeConfig({ ...welcomeConfig, message: e.target.value })}
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs text-slate-300" 
                          />
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all cursor-pointer">
                          Compile Welcome Dialogue Package
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 4.5. ONLINE FLOATING MENU: FLOATING WINDOW PRO CREATOR */}
                {activeTab === 'online-floating' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 h-full overflow-hidden">
                    
                    {/* Left Form Editor */}
                    <div className={`${mobilePane === 'edit' ? 'flex' : 'hidden'} lg:flex lg:col-span-7 h-full flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl`}>
                      
                      <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-850">
                        <div>
                          <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            Floating Window Pro Creator
                          </h2>
                          <p className="text-[11px] text-slate-500 mt-1">Customize interactive floating mod menu window and features.</p>
                        </div>
                      </div>

                      <form onSubmit={handleGenerate} className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Menu Title */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Menu Title</label>
                            <input 
                              type="text" 
                              value={floatingConfig.title}
                              onChange={(e) => setFloatingConfig({ ...floatingConfig, title: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                            />
                          </div>

                          {/* Floating Icon URL */}
                          <div className="space-y-1.5 md:col-span-2 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                            <label className="text-xs font-semibold text-slate-400 flex justify-between items-center">
                              <span>Floating Bubble Icon (URL or Local Image Upload)</span>
                              {floatingConfig.iconUrl?.startsWith('data:image') && (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono font-bold">Local Uploaded</span>
                              )}
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 items-center mt-1 w-full">
                              <input 
                                type="text" 
                                value={floatingConfig.iconUrl?.startsWith('data:image') ? 'Uploaded Local Photo' : (floatingConfig.iconUrl || '')}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, iconUrl: e.target.value })}
                                className="flex-1 w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                                placeholder="Enter Bubble Icon URL..."
                                disabled={floatingConfig.iconUrl?.startsWith('data:image')}
                              />
                              <label className="w-full sm:w-auto flex-shrink-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleImageUpload(e, 'floatingIconUrl')} 
                                  className="hidden" 
                                />
                                Upload Photo 📸
                              </label>
                              {floatingConfig.iconUrl && (
                                <button
                                  type="button"
                                  onClick={() => setFloatingConfig({ ...floatingConfig, iconUrl: "" })}
                                  className="w-full sm:w-auto p-2.5 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/20 text-rose-400 rounded-xl text-xs"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Icon BG Color */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Bubble BG Color</label>
                            <div className="flex gap-2">
                              <input 
                                type="color" 
                                value={floatingConfig.iconBgColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, iconBgColor: e.target.value })}
                                className="w-12 h-12 bg-slate-950 border border-slate-850 rounded-xl p-1 cursor-pointer"
                              />
                              <input 
                                type="text" 
                                value={floatingConfig.iconBgColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, iconBgColor: e.target.value })}
                                className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-sm text-white font-mono"
                              />
                            </div>
                          </div>

                          {/* Bubble Size */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Bubble Size (px)</label>
                            <input 
                              type="number" 
                              value={floatingConfig.iconSize}
                              onChange={(e) => setFloatingConfig({ ...floatingConfig, iconSize: Number(e.target.value) })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors font-mono"
                            />
                          </div>

                          {/* Dialog BG Color */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Menu BG Color</label>
                            <div className="flex gap-2">
                              <input 
                                type="color" 
                                value={floatingConfig.dialogBgColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, dialogBgColor: e.target.value })}
                                className="w-12 h-12 bg-slate-950 border border-slate-850 rounded-xl p-1 cursor-pointer"
                              />
                              <input 
                                type="text" 
                                value={floatingConfig.dialogBgColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, dialogBgColor: e.target.value })}
                                className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-sm text-white font-mono"
                              />
                            </div>
                          </div>

                          {/* Title Color */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Title Color</label>
                            <div className="flex gap-2">
                              <input 
                                type="color" 
                                value={floatingConfig.titleColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, titleColor: e.target.value })}
                                className="w-12 h-12 bg-slate-950 border border-slate-850 rounded-xl p-1 cursor-pointer"
                              />
                              <input 
                                type="text" 
                                value={floatingConfig.titleColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, titleColor: e.target.value })}
                                className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-sm text-white font-mono"
                              />
                            </div>
                          </div>

                          {/* Text Color */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Features Text Color</label>
                            <div className="flex gap-2">
                              <input 
                                type="color" 
                                value={floatingConfig.textColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, textColor: e.target.value })}
                                className="w-12 h-12 bg-slate-950 border border-slate-850 rounded-xl p-1 cursor-pointer"
                              />
                              <input 
                                type="text" 
                                value={floatingConfig.textColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, textColor: e.target.value })}
                                className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-sm text-white font-mono"
                              />
                            </div>
                          </div>

                          {/* Accent Color (Switches) */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Accent Color (Active Switches)</label>
                            <div className="flex gap-2">
                              <input 
                                type="color" 
                                value={floatingConfig.accentColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, accentColor: e.target.value })}
                                className="w-12 h-12 bg-slate-950 border border-slate-850 rounded-xl p-1 cursor-pointer"
                              />
                              <input 
                                type="text" 
                                value={floatingConfig.accentColor}
                                onChange={(e) => setFloatingConfig({ ...floatingConfig, accentColor: e.target.value })}
                                className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-sm text-white font-mono"
                              />
                            </div>
                          </div>

                          {/* Direct Icon Click Link */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Direct Redirect URL (Opens immediately on tap)</label>
                            <input 
                              type="text" 
                              value={floatingConfig.directLink}
                              onChange={(e) => setFloatingConfig({ ...floatingConfig, directLink: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors font-mono"
                              placeholder="https://yourludosite.com"
                            />
                          </div>

                          {/* Ludo Link */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Game / Website Link</label>
                            <input 
                              type="text" 
                              value={floatingConfig.ludoLink}
                              onChange={(e) => setFloatingConfig({ ...floatingConfig, ludoLink: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors font-mono"
                              placeholder="https://ludoking.com"
                            />
                          </div>

                          {/* Mic Voice Link */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Voice Chat / Discord Link</label>
                            <input 
                              type="text" 
                              value={floatingConfig.voiceLink}
                              onChange={(e) => setFloatingConfig({ ...floatingConfig, voiceLink: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors font-mono"
                              placeholder="https://discord.gg/invite"
                            />
                          </div>

                          {/* Telegram Link */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Telegram Channel Link</label>
                            <input 
                              type="text" 
                              value={floatingConfig.telegramLink}
                              onChange={(e) => setFloatingConfig({ ...floatingConfig, telegramLink: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors font-mono"
                              placeholder="https://t.me/nsmods"
                            />
                          </div>

                          {/* Neon Effect Toggle */}
                          <div className="space-y-1.5 flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-2xl md:col-span-2">
                            <div>
                              <label className="text-xs font-semibold text-white block">Neon Glow Lighting Style</label>
                              <span className="text-[10px] text-slate-500">Enable neon/RGB borders and beautiful lighting animations around the bubble and window.</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={floatingConfig.neonEffect}
                              onChange={(e) => setFloatingConfig({ ...floatingConfig, neonEffect: e.target.checked })}
                              className="w-5 h-5 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                          </div>

                        </div>

                        {/* Mod Features List Editor */}
                        <div className="space-y-3 pt-4 border-t border-slate-850">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Features Switch Settings</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setFloatingConfig({
                                  ...floatingConfig,
                                  features: [...floatingConfig.features, { name: "New Feature Switch", enabled: false }]
                                });
                              }}
                              className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3 rounded-lg transition-all"
                            >
                              + Add Feature
                            </button>
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {floatingConfig.features.map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 bg-slate-950/60 border border-slate-850 rounded-xl">
                                <input 
                                  type="text"
                                  value={feat.name}
                                  onChange={(e) => {
                                    const updated = [...floatingConfig.features];
                                    updated[idx] = { ...updated[idx], name: e.target.value };
                                    setFloatingConfig({ ...floatingConfig, features: updated });
                                  }}
                                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                                />
                                <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer select-none">
                                  <input 
                                    type="checkbox"
                                    checked={feat.enabled}
                                    onChange={(e) => {
                                      const updated = [...floatingConfig.features];
                                      updated[idx] = { ...updated[idx], enabled: e.target.checked };
                                      setFloatingConfig({ ...floatingConfig, features: updated });
                                    }}
                                    className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  Active by default
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = floatingConfig.features.filter((_, i) => i !== idx);
                                    setFloatingConfig({ ...floatingConfig, features: updated });
                                  }}
                                  className="p-1 hover:bg-rose-950/30 text-rose-500 hover:text-rose-400 rounded transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        </div>
                        {/* Submit Button to Generate Package */}
                        <div className="p-5 border-t border-slate-850 bg-slate-950/40 flex-shrink-0">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-indigo-600/10 hover:shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            Generate Floating Window Package (.ZIP)
                          </button>
                        </div>
                      </form>

                    </div>

                    {/* Right Live Preview Frame Column */}
                    <div className={`${mobilePane === 'preview' ? 'flex' : 'hidden'} lg:flex lg:col-span-5 h-full flex-col bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl justify-center items-center relative overflow-hidden space-y-4`}>
                      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-indigo-400" />
                          Live Interactive Preview
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500">Scale: Auto Fit</span>
                      </div>

                      {/* Device preview frame with active configuration */}
                      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                        <DialogPreviews 
                          config={config} 
                          variant="online-floating" 
                          floatingConfig={floatingConfig}
                        />
                      </div>

                      <div className="w-full p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-1.5 text-slate-400 text-xs font-light">
                        <span className="font-semibold text-white block">Interactive Controls:</span>
                        <p>👉 **Drag the bubble icon** anywhere on screen to test custom positioning.</p>
                        <p>👉 **Click the bubble icon** to open the floating mod menu, and toggle features on/off!</p>
                      </div>
                    </div>

                  </div>
                )}

                {/* 5. EXTRA TOOLKITS */}
                {activeTab === 'smali2dex' && <SmaliToDexCompiler />}
                {activeTab === 'smali-codegen' && <SmaliCodegen />}
                {activeTab === 'base64' && <Base64Converter />}
                {activeTab === 'ascii-hex' && <AsciiToHexConverter />}
                {activeTab === 'tutorials' && <TutorialsHub />}
                {activeTab === 'toast-java-base64' && <ToastJavaBase64 />}
                {activeTab === 'toast-java' && <ToastJava />}
                {activeTab === 'toast-smali-base64' && <ToastSmaliBase64 />}
                {activeTab === 'toast-smali' && <ToastSmali />}
                {activeTab === 'toast-color' && <ToastColor />}
                {activeTab === 'check-xposed' && <CheckXposed />}
                {activeTab === 'regex-lib' && <RegexLib />}
                {activeTab === 'library-regex-smali' && <LibraryRegexSmali />}
                {activeTab === 'encrypt-decrypt' && <EncryptDecrypt />}
                {activeTab === 'base-converter' && <BaseConverter />}
                {activeTab === 'save-codety' && <SaveCodety />}
                {activeTab === 'to-millis' && <ToMillis />}

                {/* 6. INFORMATION PAGES: ABOUT DEVELOPER */}
                {activeTab === 'about' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 max-w-2xl mx-auto text-center space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_50%)]" />
                    <div className="relative space-y-6">
                      
                      {/* Avatar design */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-indigo-500/25 blur-2xl rounded-full" />
                          <div className="relative z-10 w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                            <img 
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60" 
                              alt="Developer" 
                              className="w-full h-full rounded-full object-cover bg-slate-950 border border-slate-900"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full border border-slate-900 shadow-lg relative z-20">
                            <Sparkles className="w-4 h-4 animate-spin-slow" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Name & Contact */}
                      <div className="space-y-1">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">NAIM</h2>
                        <p className="text-xs text-indigo-400 font-semibold font-mono tracking-widest uppercase">Senior Lead Developer • NSMods Studio</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">naim799231@gmail.com</p>
                      </div>

                      {/* Bio text */}
                      <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed font-light">
                        Hello! I am Naim, founder and lead developer at NSMods. I specialize in Android reverse-engineering, bytecode manipulation (Smali & DEX), and crafting premium Android dialog user interfaces. All tools and code snippets are meticulously optimized for mobile modding workflows.
                      </p>

                      {/* Developer Skills Grid */}
                      <div className="pt-2">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-3">Core Modding Skills</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-xl mx-auto">
                          <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-xl">
                            <span className="text-[10px] font-semibold text-white block">Smali & Dex</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5">Advanced</span>
                          </div>
                          <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-xl">
                            <span className="text-[10px] font-semibold text-white block">Reverse Eng.</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5">Expert Level</span>
                          </div>
                          <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-xl">
                            <span className="text-[10px] font-semibold text-white block">Java & Kotlin</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5">Intermediate</span>
                          </div>
                          <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-xl">
                            <span className="text-[10px] font-semibold text-white block">Android UI</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5">Hifi Designs</span>
                          </div>
                        </div>
                      </div>

                      {/* Stat Metrics Panel */}
                      <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 max-w-xl mx-auto grid grid-cols-2 gap-4 divide-x divide-slate-850/80">
                        <div className="text-center">
                          <span className="text-lg font-bold text-indigo-400 block font-mono">150K+</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Injected Dialogs</span>
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-bold text-emerald-400 block font-mono">100%</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Smali Compile Rate</span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                        <a 
                          href="https://t.me/Sharechat_ns_098" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-xl cursor-pointer transition-all shadow-lg shadow-indigo-600/10"
                        >
                          Join Telegram Channel <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button 
                          onClick={() => alert("🎉 NSMods PRO v5.2 Active.\nDeveloped with love by NAIM.")}
                          className="w-full sm:w-auto text-xs font-semibold bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 py-3 px-6 rounded-xl cursor-pointer transition-all"
                        >
                          Verify Developer Signature
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* 7. TERMS OF USE */}
                {activeTab === 'terms' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-3xl mx-auto space-y-6 shadow-2xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      Terms & Safety Conditions of Use
                    </h2>
                    <div className="space-y-4 text-slate-400 text-xs leading-relaxed max-h-[350px] overflow-y-auto pr-2">
                      <p className="font-semibold text-slate-200">1. Acceptance of Terms</p>
                      <p>By generating assets or using Smali compilation features on this site, you agree to comply with our open-source, non-destructive guidelines. Our tools are built strictly for research, localized sandboxes, and personal educational modding applications.</p>
                      
                      <p className="font-semibold text-slate-200">2. Reverse Engineering Regulations</p>
                      <p>Reverse-engineering, decompiling, or modifying third-party intellectual property or commercial products without explicit consent must adhere to localized safety and fair-use guidelines. NSMods does not assume liability for misuse.</p>

                      <p className="font-semibold text-slate-200">3. Redistribution Rules</p>
                      <p>You may use and share the compiled .zip structures, classes.dex outputs, and layouts generated through Dialogs Pro. However, embedding malicious, tracking, or deceptive parameters inside injected dialogues violates our community guidelines.</p>
                    </div>
                  </div>
                )}

                {/* 8. CONTACT US */}
                {activeTab === 'contact' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto space-y-6 shadow-2xl">
                    <div className="text-center space-y-2">
                      <MessageSquare className="w-8 h-8 text-indigo-400 mx-auto" />
                      <h2 className="text-xl font-bold text-white">Contact Developer Team</h2>
                      <p className="text-xs text-slate-500">Have suggestions or encounter glitches? We respond within 24 hours.</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); alert("📨 Message Dispatched!\nThank you for reaching out to NSMods Support."); }} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Your Contact Handle (Telegram / Email)</label>
                        <input type="text" required placeholder="@your_handle" className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Brief Message Description</label>
                        <textarea required rows={4} placeholder="Describe the feature request or feedback..." className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-white" />
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-lg transition-all cursor-pointer">
                        Dispatch Message
                      </button>
                    </form>
                  </div>
                )}

                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 1. PROGRESS BAR POPUP / MODAL during dex compilation */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 rounded-full animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Generating Dialog...</h3>
                <p className="text-xs text-slate-500">Injecting layouts, mapping styles & writing Smali structures.</p>
              </div>

              {/* Progress visualizer bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-150"
                    style={{ width: `${genProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400">{genProgress}% Completed</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SUCCESS POPUP / DIALOG (PERFECTLY MATCHES SCENARIOS SHOWN IN THE VIDEO) */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 text-center space-y-6 shadow-2xl relative"
            >
              {/* Giant checkmark icon circle */}
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-12 h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Success</h3>
                <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-widest block mb-1">Generated Location Path:</span>
                  <p className="text-xs font-mono text-indigo-400 break-all leading-relaxed">
                    /storage/emulated/0/Dialogs Pro/{lastGeneratedZipName}(2).zip
                  </p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-2">
                  Feel free to perform advanced customization of the dialog, such as custom hovers, border radius, dialog width, and more!
                </p>
              </div>

              {/* Action buttons (TUTORIAL, OPEN FILE, DOWNLOAD ZIP) */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setActiveTab('tutorials');
                  }}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  Tutorial
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setShowFileExplorer(true);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  Open File
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setShowFileExplorer(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Admin Master Control Modal */}
      <AdminControlModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        adminSettings={adminSettings}
        onUpdateSettings={(newSettings) => setAdminSettings(newSettings)}
        onExitAdmin={handleLogout}
      />

    </div>
  );
}
