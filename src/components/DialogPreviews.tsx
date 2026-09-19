/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Bell, Gift, AlertTriangle, Ghost, User, X, ExternalLink, Gamepad2, Volume2, Send } from 'lucide-react';
import { DialogConfig, FloatingConfig } from '../types';

interface DialogPreviewsProps {
  config: DialogConfig;
  variant: 'v1' | 'v2' | 'v3' | 'v4' | 'online-floating';
  floatingConfig?: FloatingConfig;
}

export default function DialogPreviews({ config, variant, floatingConfig }: DialogPreviewsProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [toastContent, setToastContent] = useState<React.ReactNode | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localFeatures, setLocalFeatures] = useState(
    floatingConfig?.features || []
  );

  const isDraggingRef = useRef(false);

  const featuresStr = JSON.stringify(floatingConfig?.features);

  useEffect(() => {
    if (floatingConfig?.features) {
      setLocalFeatures(floatingConfig.features);
    }
  }, [featuresStr]);

  // Auto-reset dismissal state when config properties change, so the user can see updates immediately!
  const configStr = JSON.stringify(config);
  useEffect(() => {
    setIsDismissed(false);
  }, [configStr, variant]);

  // Auto clear toast
  useEffect(() => {
    if (toastContent) {
      const timer = setTimeout(() => setToastContent(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastContent]);

  const handlePositiveClick = () => {
    const link = config.positiveBtnLink || "https://t.me/Sharechat_ns_098";
    setToastContent(
      <div className="flex flex-col gap-1 items-center">
        <span className="font-bold text-emerald-400 text-xs">Action Successful!</span>
        <span className="text-[10px] text-slate-300">Redirecting...</span>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors text-[10px] inline-flex items-center gap-1 active:scale-95"
        >
          Open Link <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
    try {
      window.open(link, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error("Popup blocked:", e);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setToastContent(
      <div className="flex flex-col gap-0.5 items-center">
        <span className="font-bold text-rose-400 text-xs">Dialog Dismissed!</span>
        <span className="text-[9px] text-slate-400">Dismiss function triggered successfully.</span>
      </div>
    );
  };

  const renderToast = () => {
    if (!toastContent) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-indigo-500/30 px-3 py-2.5 rounded-xl text-[10px] text-indigo-300 font-semibold text-center z-50 shadow-2xl backdrop-blur-sm"
      >
        {toastContent}
      </motion.div>
    );
  };

  if (isDismissed && variant !== 'online-floating') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-[300px] text-center shadow-2xl relative z-10 animate-fade-in">
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full">
          <X className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Dialog Dismissed!</h4>
          <p className="text-[11px] text-slate-400">Buttons are working. Close / Cancel triggered dismiss function.</p>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl cursor-pointer transition-all active:scale-95 shadow-lg shadow-indigo-600/10"
        >
          Reset Dialog Preview
        </button>
      </div>
    );
  }

  const getIcon = () => {
    const size = config.iconSize || 70;
    const stroke = config.iconStroke || 2;
    const color = config.titleColor || '#FF00FF';

    if (config.iconType === 'custom' && config.customIconUrl) {
      return (
        <img 
          src={config.customIconUrl} 
          alt="icon" 
          referrerPolicy="no-referrer"
          className="rounded-full object-cover shadow-md"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            border: `${stroke}px solid ${color}`
          }}
        />
      );
    }

    const icons = {
      ghost: <Ghost style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px` }} strokeWidth={stroke} />,
      avatar: <User style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px` }} strokeWidth={stroke} />,
      bell: <Bell style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px` }} strokeWidth={stroke} />,
      gift: <Gift style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px` }} strokeWidth={stroke} />,
      warning: <AlertTriangle style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px` }} strokeWidth={stroke} />
    };

    const selectedIcon = icons[config.iconType === 'custom' ? 'ghost' : config.iconType] || icons.ghost;

    return (
      <div 
        className="rounded-full flex items-center justify-center bg-slate-950/20 shadow-inner"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          border: `${stroke}px solid ${color}`,
          color: color
        }}
      >
        {selectedIcon}
      </div>
    );
  };

  const getFontClass = (font?: string) => {
    switch (font) {
      case 'mono': return 'font-mono';
      case 'space': return 'font-space';
      case 'playfair': return 'font-playfair';
      case 'outfit': return 'font-outfit';
      case 'ubuntu': return 'font-ubuntu';
      default: return 'font-sans';
    }
  };

  const renderBanner = () => {
    if (!config.bannerImageUrl) return null;
    return (
      <div className="w-full mb-4 overflow-hidden rounded-2xl border border-white/5 shadow-sm relative group">
        <img 
          src={config.bannerImageUrl} 
          alt="banner" 
          className="w-full h-32 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>
    );
  };

  const getBaseCardStyles = (): React.CSSProperties => {
    const isGlow = config.glowEffect;
    const borderCol = config.borderColor || config.titleColor || '#FF00FF';
    const borderW = config.borderWidth ?? 0;

    return {
      backgroundColor: config.dialogBgColor,
      borderRadius: `${config.dialogCornerRadius}px`,
      backgroundImage: config.dialogBgImage ? `url("${config.dialogBgImage}")` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: borderW > 0 ? `${borderW}px solid ${borderCol}` : 'none',
      boxShadow: isGlow 
        ? `0 0 30px ${borderCol}80, inset 0 0 15px ${borderCol}30` 
        : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    };
  };

  // 1. Dialog V1 (Classic Elegant Dialog)
  const renderV1 = () => {
    const isCustomBg = !!config.dialogBgImage;
    return (
      <div 
        className="w-full max-w-[340px] p-6 relative overflow-hidden transition-all flex flex-col items-center text-center"
        style={getBaseCardStyles()}
      >
        {/* Semi-transparent dark overlay for high-quality background image legibility */}
        {isCustomBg && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] -z-10" />
        )}

        {/* Top Icon wrapper */}
        <div className="mb-4 relative z-10">
          {getIcon()}
        </div>

        {/* Banner image */}
        <div className="w-full relative z-10">
          {renderBanner()}
        </div>

        {/* Title */}
        <h3 
          className={`font-extrabold mb-2 tracking-tight transition-all relative z-10 ${getFontClass(config.titleFont)}`}
          style={{ 
            color: config.titleColor,
            fontSize: `${config.titleSize}px`,
            textShadow: config.glowEffect ? `0 0 8px ${config.titleColor}40` : 'none'
          }}
        >
          {config.title || "Dialog Title"}
        </h3>

        {/* Message */}
        <p 
          className={`mb-6 leading-relaxed transition-all whitespace-pre-wrap max-h-32 overflow-y-auto relative z-10 ${getFontClass(config.messageFont)}`}
          style={{ 
            color: config.messageColor,
            fontSize: `${config.messageSize}px`,
          }}
        >
          {config.message || "Dialog Message Body Content goes here..."}
        </p>

        {/* Buttons */}
        <div className="w-full flex items-center gap-3 relative z-10">
          <button 
            type="button"
            onClick={handleDismiss}
            className="flex-1 font-bold py-2 px-4 transition-all uppercase tracking-wider text-[11px] active:scale-[0.97] hover:brightness-110 cursor-pointer"
            style={{ 
              backgroundColor: config.negativeBtnColor,
              color: config.negativeBtnTextColor || '#E3E5EB',
              borderRadius: `${config.buttonsCornerRadius}px`,
              fontSize: `${config.buttonsSize}px`
            }}
          >
            {config.negativeText || "Cancel"}
          </button>
          <button 
            type="button"
            onClick={handlePositiveClick}
            className="flex-1 font-bold py-2 px-4 transition-all uppercase tracking-wider text-[11px] active:scale-[0.97] hover:brightness-110 shadow-lg cursor-pointer"
            style={{ 
              backgroundColor: config.positiveBtnColor,
              color: config.positiveBtnTextColor || '#15171B',
              borderRadius: `${config.buttonsCornerRadius}px`,
              fontSize: `${config.buttonsSize}px`,
              boxShadow: config.glowEffect ? `0 0 15px ${config.positiveBtnColor}50` : 'none'
            }}
          >
            {config.positiveText || "Join"}
          </button>
        </div>

        {renderToast()}
      </div>
    );
  };

  // 2. Dialog V2 (iOS Style Frosted Glass Dialog)
  const renderV2 = () => {
    const isCustomBg = !!config.dialogBgImage;
    return (
      <div 
        className="w-full max-w-[280px] overflow-hidden transition-all flex flex-col text-center shadow-2xl relative border border-white/10 backdrop-blur-xl"
        style={{
          backgroundColor: config.dialogBgColor || 'rgba(15, 23, 42, 0.85)',
          borderRadius: '16px',
        }}
      >
        {isCustomBg && (
          <div className="absolute inset-0 bg-cover bg-center -z-10 opacity-30" style={{ backgroundImage: `url("${config.dialogBgImage}")` }} />
        )}
        
        <div className="p-5 flex flex-col items-center">
          {/* Top Icon wrapper */}
          {config.iconType !== 'ghost' && (
            <div className="mb-3 relative z-10">
              {getIcon()}
            </div>
          )}

          {/* Banner image */}
          <div className="w-full relative z-10">
            {renderBanner()}
          </div>

          {/* Title */}
          <h3 
            className={`font-semibold tracking-tight transition-all relative z-10 ${getFontClass(config.titleFont)}`}
            style={{ 
              color: config.titleColor || '#FFFFFF',
              fontSize: `${config.titleSize}px`,
            }}
          >
            {config.title || "Confirm Action"}
          </h3>

          {/* Message */}
          <p 
            className={`mt-1.5 leading-normal transition-all whitespace-pre-wrap max-h-24 overflow-y-auto relative z-10 ${getFontClass(config.messageFont)}`}
            style={{ 
              color: config.messageColor || '#CBD5E1',
              fontSize: `${config.messageSize}px`,
            }}
          >
            {config.message || "Are you sure you want to proceed?"}
          </p>
        </div>

        {/* Buttons (iOS standard layout with thin border separators) */}
        <div className="border-t border-white/10 flex items-center h-12 relative z-10">
          <button 
            type="button"
            onClick={handleDismiss}
            className="flex-1 h-full font-medium text-xs transition-colors hover:bg-white/5 active:bg-white/10 flex items-center justify-center cursor-pointer border-r border-white/10"
            style={{ 
              color: config.negativeBtnTextColor || '#38BDF8',
            }}
          >
            {config.negativeText || "Cancel"}
          </button>
          <button 
            type="button"
            onClick={handlePositiveClick}
            className="flex-1 h-full font-bold text-xs transition-colors hover:bg-white/5 active:bg-white/10 flex items-center justify-center cursor-pointer"
            style={{ 
              color: config.positiveBtnColor || '#38BDF8',
            }}
          >
            {config.positiveText || "OK"}
          </button>
        </div>

        {renderToast()}
      </div>
    );
  };

  // 3. Dialog V3 (3D Floating Ghost Layout)
  const renderV3 = () => {
    const isCustomBg = !!config.dialogBgImage;
    return (
      <div className="flex flex-col items-center">
        {/* Floating hanging icon above card */}
        <div className="z-20 -mb-10 transform hover:scale-105 transition-transform duration-300">
          {getIcon()}
        </div>

        {/* Card Body */}
        <div 
          className="w-full max-w-[340px] relative overflow-hidden transition-all flex flex-col items-center text-center p-6 pt-12"
          style={getBaseCardStyles()}
        >
          {/* Semi-transparent overlay for bg image */}
          {isCustomBg && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] -z-10" />
          )}

          {/* Background pastel header strip */}
          <div 
            className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r z-10"
            style={{
              backgroundImage: `linear-gradient(to right, ${config.titleColor}, ${config.positiveBtnColor})`
            }}
          />

          {/* Banner image */}
          <div className="w-full relative z-10">
            {renderBanner()}
          </div>

          {/* Title */}
          <h3 
            className={`font-extrabold mb-3 tracking-tight transition-all relative z-10 ${getFontClass(config.titleFont)}`}
            style={{ 
              color: config.titleColor,
              fontSize: `${config.titleSize}px`,
              textShadow: config.glowEffect ? `0 0 8px ${config.titleColor}40` : 'none'
            }}
          >
            {config.title || "ZenX Modz"}
          </h3>

          {/* Message */}
          <p 
            className={`mb-6 leading-relaxed transition-all whitespace-pre-wrap text-sm max-h-32 overflow-y-auto relative z-10 ${getFontClass(config.messageFont)}`}
            style={{ 
              color: config.messageColor,
              fontSize: `${config.messageSize}px`,
            }}
          >
            {config.message || "Click on the link to open the channel"}
          </p>

          {/* Link box (if matching image 2) */}
          {config.positiveBtnLink && (
            <div className="w-full bg-slate-950/40 border border-white/5 rounded-xl p-2.5 mb-6 text-center select-all relative z-10">
              <span className="text-[10px] md:text-xs font-mono text-indigo-400 break-all leading-tight block">
                {config.positiveBtnLink}
              </span>
            </div>
          )}

          {/* Single Huge Button */}
          <button 
            type="button"
            onClick={handlePositiveClick}
            className="w-full font-extrabold py-3 px-6 transition-all uppercase tracking-widest text-xs active:scale-[0.97] shadow-lg hover:brightness-110 relative z-10 cursor-pointer"
            style={{ 
              backgroundColor: config.positiveBtnColor,
              color: config.positiveBtnTextColor || '#FFFFFF',
              borderRadius: `${config.buttonsCornerRadius}px`,
              fontSize: `${config.buttonsSize}px`,
              boxShadow: config.glowEffect 
                ? `0 0 25px ${config.positiveBtnColor}80` 
                : `0 8px 24px -6px ${config.positiveBtnColor}80`
            }}
          >
            {config.positiveText || "SUBSCRIBE"}
          </button>
        </div>

        {/* Floating cross button at bottom center if enabled */}
        {config.enableCloseBtn !== false && (
          <button 
            type="button"
            onClick={handleDismiss}
            className="mt-6 p-2 rounded-full border border-rose-500 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {renderToast()}
      </div>
    );
  };

  // 4. Dialog V4 (Character Popout / Apk Editor Layout)
  const renderV4 = () => {
    const isCustomBg = !!config.dialogBgImage;
    const bannerUrl = config.bannerImageUrl || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=60";
    
    // Split message by bullet points or newlines for bullet styling like the screenshot
    const messageLines = (config.message || "• LifeTime Membership\n• Premium Feature Unlock\n• No Need Login ( Fucked )\n• No Advertising Remove")
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return (
      <div 
        className="w-full max-w-[280px] mt-24 relative overflow-visible transition-all flex flex-col items-center text-center pb-6 px-5 pt-14 shadow-2xl"
        style={{
          backgroundColor: config.dialogBgColor || '#FFFDFD',
          borderRadius: `${config.dialogCornerRadius || 32}px`,
          border: (config.borderWidth ?? 0) > 0 ? `${config.borderWidth}px solid ${config.borderColor || '#00A3FF'}` : 'none',
          boxShadow: config.glowEffect 
            ? `0 0 30px ${(config.borderColor || '#00A3FF')}80` 
            : '0 20px 40px -10px rgba(0,0,0,0.35)',
          backgroundImage: config.dialogBgImage ? `url("${config.dialogBgImage}")` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlapping Character Portrait */}
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[190px] h-[155px] z-30 pointer-events-none">
          <img 
            src={bannerUrl} 
            alt="Character Popout" 
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Semi-transparent overlay for bg image if exists */}
        {isCustomBg && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-[32px] -z-10" />
        )}

        {/* Title */}
        <h3 
          className={`font-extrabold mb-3 mt-4 tracking-tight text-center w-full truncate leading-tight ${getFontClass(config.titleFont)}`}
          style={{ 
            color: config.titleColor || '#00A3FF',
            fontSize: `${config.titleSize || 18}px`,
          }}
        >
          {config.title || "Apk Editor King"}
        </h3>

        {/* Message Lines (Bullet Points list) */}
        <div className="w-full flex flex-col items-start gap-1.5 mb-6 px-1.5 overflow-y-auto max-h-36 scrollbar-none">
          {messageLines.map((line, idx) => {
            // Clean prefix bullet if exists
            const displayLine = line.startsWith('•') ? line.substring(1).trim() : line;
            return (
              <div key={idx} className="flex items-start gap-2 text-left w-full text-xs">
                <span className="text-[12px] mt-0.5" style={{ color: config.titleColor || '#00A3FF' }}>●</span>
                <span 
                  className={`font-semibold tracking-wide flex-1 leading-snug whitespace-pre-wrap ${getFontClass(config.messageFont)}`}
                  style={{ 
                    color: config.messageColor || '#334155',
                    fontSize: `${config.messageSize || 12}px`
                  }}
                >
                  {displayLine}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pill Buttons (Same as screenshot: high-quality outline or solid border buttons) */}
        <div className="w-full flex items-center gap-3 relative z-10 px-0.5">
          <button 
            type="button"
            onClick={handleDismiss}
            className="flex-1 font-bold py-2 px-2.5 border-2 transition-all uppercase tracking-wider text-[10px] active:scale-[0.96] hover:bg-black/5 cursor-pointer text-center flex items-center justify-center"
            style={{ 
              borderColor: config.negativeBtnColor || '#00A3FF',
              color: config.negativeBtnTextColor || config.negativeBtnColor || '#00A3FF',
              backgroundColor: 'transparent',
              borderRadius: '9999px',
              fontSize: `${config.buttonsSize || 11}px`
            }}
          >
            {config.negativeText || "Cancel"}
          </button>
          <button 
            type="button"
            onClick={handlePositiveClick}
            className="flex-1 font-bold py-2 px-2.5 border-2 transition-all uppercase tracking-wider text-[10px] active:scale-[0.96] hover:brightness-95 cursor-pointer text-center flex items-center justify-center"
            style={{ 
              borderColor: config.positiveBtnColor || '#00A3FF',
              color: config.positiveBtnTextColor || '#FFFFFF',
              backgroundColor: config.positiveBtnColor || '#00A3FF',
              borderRadius: '9999px',
              fontSize: `${config.buttonsSize || 11}px`,
              boxShadow: config.glowEffect ? `0 4px 12px ${(config.positiveBtnColor || '#00A3FF')}40` : 'none'
            }}
          >
            {config.positiveText || "Join Telegram"}
          </button>
        </div>

        {renderToast()}
      </div>
    );
  };

  const toggleLocalFeature = (index: number) => {
    const updated = [...localFeatures];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setLocalFeatures(updated);
  };

  const renderFloating = () => {
    if (!floatingConfig) return null;
    
    // Neon glow style calculations
    const bubbleGlow = floatingConfig.neonEffect
      ? {
          borderColor: floatingConfig.titleColor,
          boxShadow: `0 0 20px ${floatingConfig.titleColor}, 0 0 10px ${floatingConfig.accentColor}`,
          animation: 'pulse 2s infinite'
        }
      : {
          borderColor: floatingConfig.titleColor,
          boxShadow: `0 8px 24px ${floatingConfig.iconBgColor}60`
        };

    const windowGlow = floatingConfig.neonEffect
      ? {
          backgroundColor: floatingConfig.dialogBgColor,
          borderColor: floatingConfig.accentColor,
          boxShadow: `0 0 25px ${floatingConfig.accentColor}80, inset 0 0 12px ${floatingConfig.titleColor}30`
        }
      : {
          backgroundColor: floatingConfig.dialogBgColor,
          borderColor: '#1E293B',
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5)`
        };

    return (
      <div className="w-full max-w-[290px] h-[410px] bg-slate-950 border border-slate-800 rounded-[32px] p-2.5 relative overflow-hidden shadow-2xl flex flex-col justify-between select-none">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-b-lg z-30 flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full mr-1.5" />
          <div className="w-6 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Gaming Wallpaper Background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=60")' }} />
        
        {/* Tint overlay */}
        <div className="absolute inset-0 bg-black/55 z-0" />

        {/* Phone Status Bar */}
        <div className="relative z-10 flex items-center justify-between px-3 pt-1 text-[9px] font-mono text-white/70">
          <div className="flex items-center gap-1.5">
            <span>12:00</span>
            <button 
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-2 py-0.5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded font-sans font-bold text-[8px] transition-colors cursor-pointer active:scale-95 shadow border border-indigo-500/30 flex items-center gap-0.5"
            >
              Toggle Menu ⚡
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-3.5 h-1.5 bg-white/70 rounded-sm" />
          </div>
        </div>

        {/* Draggable Area Bounds */}
        <div className="flex-1 w-full relative z-10 overflow-hidden" id="drag-bounds">
          {/* Draggable Icon Bubble */}
          <motion.div
            drag
            dragConstraints={{ left: 0, right: 210, top: 0, bottom: 280 }}
            onDragStart={() => {
              isDraggingRef.current = true;
            }}
            onDragEnd={() => {
              // Set a tiny timeout so the subsequent tap/click event can be intercepted
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 80);
            }}
            className="absolute cursor-grab active:cursor-grabbing z-25"
            style={{ top: '20px', left: '20px' }}
            onTap={(e) => {
              if (isDraggingRef.current) return;
              setMenuOpen(!menuOpen);
            }}
          >
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (isDraggingRef.current) return;
                setMenuOpen(!menuOpen);
              }}
              className="relative group flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer border-2"
              style={{
                width: `${floatingConfig.iconSize}px`,
                height: `${floatingConfig.iconSize}px`,
                backgroundColor: floatingConfig.iconBgColor,
                ...bubbleGlow
              }}
            >
              {floatingConfig.iconUrl ? (
                <img 
                  src={floatingConfig.iconUrl} 
                  alt="float" 
                  className="w-full h-full rounded-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Ghost className="w-5 h-5 text-white" />
              )}
              {/* Little ping indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full animate-ping" />
            </div>
          </motion.div>

          {/* Floating Mod Menu Window/Dialog when expanded */}
          {menuOpen && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="absolute left-2 right-2 top-[12%] z-30 border rounded-2xl p-2.5 overflow-hidden flex flex-col max-h-[295px]"
              style={windowGlow}
            >
              {/* Card top gradient bar */}
              <div 
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r"
                style={{ backgroundImage: `linear-gradient(to right, ${floatingConfig.titleColor}, ${floatingConfig.accentColor})` }}
              />

              {/* Title & Close button */}
              <div className="flex items-center justify-between pb-1 border-b border-white/5 mb-1.5">
                <h4 
                  className="font-bold text-[10px] truncate max-w-[155px] tracking-tight uppercase"
                  style={{ color: floatingConfig.titleColor }}
                >
                  {floatingConfig.title}
                </h4>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 scrollbar-thin">
                {/* Features Switches List */}
                <div className="space-y-0.5">
                  {localFeatures.map((f: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-0.5 px-1.5 rounded-lg hover:bg-white/5 transition-colors">
                      <span 
                        className="text-[8.5px] font-semibold truncate max-w-[150px]"
                        style={{ color: floatingConfig.textColor }}
                      >
                        {f.name}
                      </span>
                      
                      {/* Switch layout */}
                      <button
                        type="button"
                        onClick={() => toggleLocalFeature(idx)}
                        className="w-6 h-3 rounded-full p-0.5 transition-colors relative cursor-pointer flex items-center"
                        style={{ backgroundColor: f.enabled ? floatingConfig.accentColor : '#1E293B' }}
                      >
                        <motion.div 
                           className="w-2 h-2 bg-white rounded-full shadow-md"
                          animate={{ x: f.enabled ? 11 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* PREMIUM REDIRECT BUTTONS SECTION */}
                <div className="pt-1.5 border-t border-white/5 space-y-1">
                  <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-wider block px-1">PREMIUM REDIRECTS</span>
                  
                  {/* Ludo Game Button */}
                  {floatingConfig.ludoLink && (
                    <a 
                      href={floatingConfig.ludoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 transition-all text-[8.5px] font-medium"
                    >
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="w-2.5 h-2.5 text-indigo-400" />
                        Game Website
                      </span>
                      <ExternalLink className="w-2 h-2" />
                    </a>
                  )}

                  {/* Mic / Voice Room Button */}
                  {floatingConfig.voiceLink && (
                    <a 
                      href={floatingConfig.voiceLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 transition-all text-[8.5px] font-medium"
                    >
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-2.5 h-2.5 text-emerald-400" />
                        Voice Chat Room
                      </span>
                      <ExternalLink className="w-2 h-2" />
                    </a>
                  )}

                  {/* Telegram Channel Button */}
                  {floatingConfig.telegramLink && (
                    <a 
                      href={floatingConfig.telegramLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-all text-[8.5px] font-medium"
                    >
                      <span className="flex items-center gap-1">
                        <Send className="w-2.5 h-2.5 text-rose-400" />
                        Telegram Channel
                      </span>
                      <ExternalLink className="w-2 h-2" />
                    </a>
                  )}
                </div>
              </div>

              {/* Footer Author line */}
              <div className="mt-1.5 pt-1 border-t border-white/5 flex items-center justify-between text-[6.5px] font-mono text-slate-500">
                <span>V6.0 • ONLINE REDIRECT</span>
                <span className="font-bold" style={{ color: floatingConfig.titleColor }}>NSMods Pro</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Home indicator bar */}
        <div className="relative z-10 flex justify-center pb-0.5">
          <div className="w-16 h-0.5 bg-white/30 rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full flex items-center justify-center py-6 px-4 min-h-[360px] bg-slate-950/50 rounded-3xl border border-slate-900/60 shadow-inner">
      {/* Anime Background Sim option inside the viewport */}
      {variant !== 'online-floating' && (
        <div className="absolute inset-0 bg-cover bg-center bg-no-referrer opacity-15 rounded-3xl mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60")' }} />
      )}

      {/* Grid Overlay for transparent look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Actual Render box */}
      <motion.div
        key={`${variant}-${config.dialogAnimation}`}
        initial={
          config.dialogAnimation === 'zoom' 
            ? { scale: 0.5, opacity: 0 } 
            : config.dialogAnimation === 'slide-up' 
            ? { y: 100, opacity: 0 } 
            : config.dialogAnimation === 'slide-down' 
            ? { y: -100, opacity: 0 } 
            : config.dialogAnimation === 'bounce' 
            ? { scale: 0.3, opacity: 0, y: 50 } 
            : { opacity: 0 } // default fade
        }
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0 
        }}
        transition={
          config.dialogAnimation === 'bounce' 
            ? { type: 'spring', bounce: 0.6, duration: 0.8 } 
            : { type: 'spring', damping: 20, stiffness: 260 }
        }
        className="relative z-10 flex items-center justify-center w-full"
      >
        {variant === 'v1' && renderV1()}
        {variant === 'v2' && renderV2()}
        {variant === 'v3' && renderV3()}
        {variant === 'v4' && renderV4()}
        {variant === 'online-floating' && renderFloating()}
      </motion.div>
    </div>
  );
}
