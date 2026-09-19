/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Cloud, 
  RefreshCw, 
  FileText, 
  Info, 
  Send, 
  MessageSquare, 
  Code, 
  Binary, 
  Hash, 
  PlayCircle,
  ChevronRight,
  Menu,
  X,
  Smartphone,
  Flame,
  LogOut
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose, isAdmin, onLogout }: SidebarProps) {
  const menuGroups = [
    {
      title: "৫-টি স্পেশাল ডায়ালগ স্টুডিও",
      items: [
        { id: "dialog-v1-ios", label: "Dialog V1 (iOS Classic)", icon: Sparkles, badge: "iOS" },
        { id: "dialog-v2-picture", label: "Dialog V2 (Picture Banner)", icon: Flame, badge: "Media" },
        { id: "dialog-v3-modern", label: "Dialog V3 (Material 3 Card)", icon: Sparkles, badge: "Modern" },
        { id: "dialog-v4-cyber", label: "Dialog V4 (Cyber Dark Neon)", icon: Flame, badge: "Neon" },
        { id: "dialog-v5-bottomsheet", label: "Dialog V5 (Bottom Action Sheet)", icon: Sparkles, badge: "Sheet" },
      ]
    },
    {
      title: "ইনজেকশন ও টিউটোরিয়াল",
      items: [
        { id: "tutorials", label: "MT Manager Classes.dex Guide", icon: PlayCircle, badge: "DEX" },
      ]
    },
    {
      title: "অ্যাপ সেটিংস ও তথ্য",
      items: [
        { id: "update-check", label: "Check for update", icon: RefreshCw, action: true },
        { id: "terms", label: "Terms Of Use", icon: FileText },
        { id: "about", label: "About Developer", icon: Info },
        { id: "telegram", label: "Join Telegram", icon: Send, action: true },
      ]
    }
  ];

  const handleItemClick = (id: string, isAction?: boolean) => {
    if (id === 'update-check') {
      onTabChange('about'); // Redirect to about or show dynamic update alert
      setTimeout(() => {
        alert("✨ Check for Updates:\nYou are using NSMods Dialog Pro v5.2 (Latest Build).\nAll servers are online!");
      }, 200);
      return;
    }
    if (id === 'telegram') {
      window.open('https://t.me/Sharechat_ns_098', '_blank');
      return;
    }
    onTabChange(id as ActiveTab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-200">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
          <Smartphone className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            NSMods <span className="text-xs py-0.5 px-2 bg-indigo-500/20 text-indigo-300 font-mono rounded-full font-medium">PRO</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Your Dialog, Your Way</p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id, item.action)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all group/btn cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover/btn:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover/btn:text-indigo-400'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                          isActive 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-slate-850 text-slate-400 border border-slate-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'text-white/80' : 'text-slate-600 group-hover/btn:translate-x-0.5'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Action */}
      {onLogout && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/20">
          <button
            onClick={() => {
              if (onClose) onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAdmin ? '👑 এডমিন লগআউট (Logout)' : 'অ্যাপ থেকে লগআউট (Logout)'}</span>
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-center">
        <p className="text-[10px] text-slate-500 font-mono">
          Engine: <span className="text-slate-400 font-semibold">nsmods v5.2</span>
        </p>
        <p className="text-[9px] text-slate-600 font-mono mt-0.5">
          © 2026 NSMods Official
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:block w-72 h-screen flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer (Overlay) */}
      <div className="lg:hidden">
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
        )}

        {/* Drawer Sliding Body */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 left-0 z-50 w-72 h-full"
        >
          {sidebarContent}
        </motion.div>
      </div>
    </>
  );
}
