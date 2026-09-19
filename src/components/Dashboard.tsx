import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles,
  Info,
  FileText,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Image as ImageIcon,
  Layers,
  Terminal,
  Sliders,
  ExternalLink,
  Code2,
  Copy,
  Check,
  LogOut
} from 'lucide-react';
import { ActiveTab } from '../types';

interface DashboardProps {
  onSelectTab: (tab: ActiveTab) => void;
  activeInfoTab: 'none' | 'about' | 'terms' | 'contact';
  setActiveInfoTab: (tab: 'none' | 'about' | 'terms' | 'contact') => void;
  isAdmin?: boolean;
  onToggleAdmin?: () => void;
  onOpenAdminModal?: () => void;
  isAppLocked?: boolean;
  onLogout?: () => void;
}

export interface DialogVersionCard {
  id: ActiveTab;
  versionBadge: string;
  title: string;
  subtitle: string;
  category: 'ios' | 'picture' | 'modern' | 'cyber' | 'sheet';
  tag: string;
  tagColor: string;
  accentColor: string;
  previewBg: string;
}

export default function Dashboard({ 
  onSelectTab, 
  activeInfoTab, 
  setActiveInfoTab,
  isAdmin = false,
  onOpenAdminModal,
  isAppLocked = false,
  onLogout
}: DashboardProps) {
  
  const dialogVersions: DialogVersionCard[] = [
    {
      id: 'dialog-v1-ios',
      versionBadge: 'DIALOG V1',
      title: 'iOS Classic Custom Dialog',
      subtitle: 'Apple iOS alert layout, frosted blur glass backdrop, centered typography, and divider segmented action buttons.',
      category: 'ios',
      tag: 'APPLE iOS STYLE',
      tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      accentColor: '#38BDF8',
      previewBg: 'bg-gradient-to-br from-slate-900 to-slate-800'
    },
    {
      id: 'dialog-v2-picture',
      versionBadge: 'DIALOG V2',
      title: 'Picture & Media Banner Dialog',
      subtitle: 'Top media banner or poster image header, custom photo upload, title, description, and dual action buttons.',
      category: 'picture',
      tag: 'PICTURE / IMAGE HEADER',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      accentColor: '#10B981',
      previewBg: 'bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900'
    },
    {
      id: 'dialog-v3-modern',
      versionBadge: 'DIALOG V3',
      title: 'Modern Material 3 Card Dialog',
      subtitle: 'Android Material 3 card style, header icon badge pill, clean rounded corners, and elevated action buttons.',
      category: 'modern',
      tag: 'MATERIAL 3 DESIGN',
      tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      accentColor: '#818CF8',
      previewBg: 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900'
    },
    {
      id: 'dialog-v4-cyber',
      versionBadge: 'DIALOG V4',
      title: 'Cyber Gaming Dark Neon Dialog',
      subtitle: 'Deep OLED carbon background, electric neon glow borders (Cyan / Pink), futuristic font styling, and cyber aesthetic.',
      category: 'cyber',
      tag: 'CYBER NEON GAMING',
      tagColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      accentColor: '#00FFFF',
      previewBg: 'bg-gradient-to-br from-[#06080E] via-cyan-950/30 to-[#0A0D18]'
    },
    {
      id: 'dialog-v5-bottomsheet',
      versionBadge: 'DIALOG V5',
      title: 'Bottom Sheet Action Dialog',
      subtitle: 'Smooth slide-up bottom sheet modal, top drag handle indicator, multi-action items, and clean modern layout.',
      category: 'sheet',
      tag: 'BOTTOM ACTION SHEET',
      tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      accentColor: '#C084FC',
      previewBg: 'bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900'
    }
  ];

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 overflow-y-auto px-4 py-6 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Developer & Admin Header Card */}
        <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Developer DP & Title Info (Avatar has no admin click trigger anymore) */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`absolute -inset-1 rounded-full ${isAdmin ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 opacity-70' : 'bg-slate-700/50'} blur-xs`} />
                <div className="relative w-16 h-16 rounded-full bg-slate-950 p-0.5 border-2 border-slate-700/80 overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" 
                    alt="NSMods Developer DP" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
                {isAdmin && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                    NSMODS DIALOG PRO
                  </h1>
                  {isAdmin ? (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <span>👑 ADMIN ACTIVE</span>
                    </span>
                  ) : (
                    <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      PRO V5.5
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
                  5 specialized dialog architectures and ready-to-inject Classes.dex Smali code studio for Android app modders.
                </p>
              </div>
            </div>

            {/* Quick Action Button for MT Manager / Telegram & Admin Control */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-400/40 transition shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Admin Controls</span>
                </button>
              )}
              <a
                href="https://t.me/Sharechat_ns_098"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition shadow-sm"
              >
                <span>Telegram Channel</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </a>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-500/25 transition shadow-sm cursor-pointer active:scale-95"
                  title="Sign out of application"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isAdmin ? 'Admin Sign Out' : 'Sign Out'}</span>
                </button>
              )}
            </div>
          </div>

          {/* If App is locked by Admin, show banner for Admin */}
          {isAdmin && isAppLocked && (
            <div className="mt-4 pt-3 border-t border-rose-500/30 flex items-center justify-between bg-rose-950/30 -mx-6 -mb-6 px-6 py-3 text-rose-300 text-xs">
              <span className="font-bold flex items-center gap-1.5">
                🔴 Application is currently LOCKED for normal users (Kill-Switch Active).
              </span>
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="text-[11px] underline text-rose-200 hover:text-white font-semibold cursor-pointer"
              >
                Unlock / Manage
              </button>
            </div>
          )}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Select Dialog Version</span>
            </h2>
            <p className="text-[11px] text-slate-400">Click any dialog card to launch its dedicated editor and live preview studio.</p>
          </div>
          <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
            5 DEDICATED STUDIOS
          </span>
        </div>

        {/* 5 Dialog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dialogVersions.map((dialog, index) => (
            <motion.div
              key={dialog.id}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectTab(dialog.id)}
              className="cursor-pointer group relative overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              {/* Top Card Badge & Action */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${dialog.tagColor} uppercase tracking-wider`}>
                    {dialog.versionBadge} • {dialog.tag}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {dialog.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {dialog.subtitle}
                </p>
              </div>

              {/* Mini Interactive Preview Box */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className={`w-full rounded-2xl p-3.5 ${dialog.previewBg} border border-slate-750 flex items-center justify-between`}>
                  {dialog.category === 'ios' && (
                    <div className="w-full text-center space-y-1">
                      <div className="text-[11px] font-bold text-white font-sans">Hey Guys 👋 (iOS Alert)</div>
                      <div className="text-[9px] text-slate-400 font-sans">Welcome to NSMods Pro iOS Dialog</div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-white/10 text-[10px] font-semibold">
                        <span className="text-rose-400">CANCEL</span>
                        <span className="text-blue-400">JOIN</span>
                      </div>
                    </div>
                  )}

                  {dialog.category === 'picture' && (
                    <div className="w-full space-y-2">
                      <div className="w-full h-12 rounded-xl overflow-hidden relative">
                        <img 
                          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80" 
                          alt="Banner" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center px-2">
                          <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">PHOTO BANNER</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white">Media Dialog V2</span>
                        <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-lg">TELEGRAM</span>
                      </div>
                    </div>
                  )}

                  {dialog.category === 'modern' && (
                    <div className="w-full space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px]">★</div>
                        <span className="text-[10px] font-bold text-white">Material 3 Modern</span>
                      </div>
                      <div className="text-[9px] text-slate-400">Clean card elevation with custom rounded corners</div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <span className="text-[8px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg">Dismiss</span>
                        <span className="text-[8px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-lg">Confirm</span>
                      </div>
                    </div>
                  )}

                  {dialog.category === 'cyber' && (
                    <div className="w-full space-y-1.5 border border-cyan-400/40 p-2 rounded-xl bg-black/50 shadow-[0_0_10px_rgba(0,255,255,0.15)]">
                      <div className="text-[10px] font-mono font-bold text-cyan-300 flex items-center justify-between">
                        <span>SYSTEM CYBER V4</span>
                        <span className="text-[8px] text-emerald-400">● ONLINE</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-300">Bypass sandboxes & custom memory pointers</div>
                      <div className="flex justify-end">
                        <span className="text-[9px] font-mono font-bold bg-cyan-400 text-black px-2 py-0.5 rounded">INJECT</span>
                      </div>
                    </div>
                  )}

                  {dialog.category === 'sheet' && (
                    <div className="w-full space-y-1.5">
                      <div className="w-8 h-1 bg-slate-600 rounded-full mx-auto mb-1" />
                      <div className="text-[10px] font-bold text-white text-center">Bottom Action Sheet V5</div>
                      <div className="space-y-1">
                        <div className="bg-slate-800/80 px-2 py-1 rounded text-[9px] text-slate-300 flex justify-between">
                          <span>Join Telegram</span>
                          <ChevronRight className="w-3 h-3 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 text-[11px] font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Open & Customize Studio</span>
                  <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">EDIT STUDIO →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Classes.dex MT Manager Smali Hub Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">MT Manager Classes.dex Injection Guide</h3>
                <p className="text-xs text-slate-400">Pre-formatted Smali code ready for direct injection into Android classes.dex files.</p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('tutorials')}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              <span>View Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-[11px] text-amber-400 font-bold"># classes.dex Target Path:</div>
            <p className="text-slate-400">classes.dex -&gt; com/nsmods/dialog/NSDialogV1.smali (Dex Editor Plus)</p>
            <div className="text-[11px] text-emerald-400 font-bold pt-1"># Target Activity onCreate Hook:</div>
            <code className="block bg-slate-900 px-3 py-2 rounded-xl text-cyan-300 select-all">
              invoke-static &#123;p0&#125;, Lcom/nsmods/dialog/NSDialogV1;-&gt;show(Landroid/content/Context;)V
            </code>
          </div>
        </div>

        {/* Bottom Author & Terms Toggles */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveInfoTab(activeInfoTab === 'about' ? 'none' : 'about')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
              activeInfoTab === 'about' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About Developer
          </button>
          <button
            onClick={() => setActiveInfoTab(activeInfoTab === 'terms' ? 'none' : 'terms')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
              activeInfoTab === 'terms' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Use
          </button>
        </div>

        {/* Info Drawers */}
        {activeInfoTab !== 'none' && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-xs space-y-2"
          >
            {activeInfoTab === 'about' && (
              <>
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-400" /> About NSMods Developer
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Developed by <span className="text-white font-semibold">NSMods (Telegram: @Sharechat_ns_098)</span>. Engineered for Android app modders and developers to generate clean custom dialog architectures, Smali bytecode, and assets quickly and reliably.
                </p>
              </>
            )}
            {activeInfoTab === 'terms' && (
              <>
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" /> Terms & Guidelines
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  1. Paste the generated Smali code into your APK's classes.dex using MT Manager Dex Editor Plus.<br />
                  2. Ensure your font and image assets are placed into the corresponding <code className="text-indigo-300">assets/</code> directory.<br />
                  3. Use responsibly for legitimate educational and modding workflows.
                </p>
              </>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
