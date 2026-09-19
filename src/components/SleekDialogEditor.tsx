import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Type as FontIcon, 
  FolderHeart, 
  ArrowLeft, 
  Upload, 
  Download,
  FileJson,
  Check, 
  ExternalLink,
  Cloud,
  Globe,
  Cpu,
  ChevronRight,
  Sparkle,
  Play,
  RotateCw,
  Sliders,
  Film,
  Activity,
  Code,
  Volume2,
  Zap,
  X,
  Copy,
  Code2,
  Smartphone,
  Layers,
  Send,
  Gamepad2,
  Gift,
  Bell,
  Heart,
  Info,
  HelpCircle,
  Layers3
} from 'lucide-react';
import { DialogConfig, ActiveTab } from '../types';

interface SleekDialogEditorProps {
  activeTab: ActiveTab;
  config: DialogConfig;
  setConfig: React.Dispatch<React.SetStateAction<DialogConfig>>;
  onGenerate: (e: React.FormEvent) => void;
  isGenerating: boolean;
  genProgress: number;
}

// Pre-selected beautiful modding anime character wallpapers
const GALLERY_WALLPAPERS = [
  {
    name: "Classic Anime Boy (Screenshot Style)",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Cyberpunk Hacker",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Neon Glow Ronin",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Minimalist Manga Portrait",
    url: "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Tech Samurai Concept",
    url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80"
  },
  {
    name: "Cosmic Knight",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80"
  }
];

const FONTS_LIST = [
  { id: 'sans', name: 'Inter Sans-Serif', class: 'font-sans' },
  { id: 'space', name: 'Space Grotesk (Tech)', class: 'font-space' },
  { id: 'playfair', name: 'Playfair Display (Luxury)', class: 'font-playfair' },
  { id: 'outfit', name: 'Outfit Geometric', class: 'font-outfit' },
  { id: 'ubuntu', name: 'Ubuntu Smooth', class: 'font-ubuntu' },
  { id: 'mono', name: 'JetBrains Mono (Hacker)', class: 'font-mono' }
];

export default function SleekDialogEditor({ 
  activeTab, 
  config, 
  setConfig, 
  onGenerate,
  isGenerating,
  genProgress 
}: SleekDialogEditorProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importJsonInputRef = useRef<HTMLInputElement>(null);

  // Export Dialog Configuration as a portable JSON file
  const exportPortableJsonConfig = () => {
    const exportData = {
      appName: "Nsmods Dialogue Pro",
      exportedAt: new Date().toISOString(),
      version: versionName || "2.1",
      config: config
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nsmods_dialog_config_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Dialog Configuration from a portable JSON file
  const handleImportJsonConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedConfig = parsed.config || parsed;
        if (importedConfig && typeof importedConfig === 'object') {
          setConfig(prev => ({
            ...prev,
            ...importedConfig
          }));
          if (parsed.version) {
            setVersionName(parsed.version);
          }
          alert("✅ Dialog Configuration successfully loaded!");
        } else {
          alert("❌ Invalid JSON config file structure.");
        }
      } catch (err) {
        alert("❌ Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Helper to ensure JSON image_url is clean and concise
  const getCleanImageUrl = (url?: string) => {
    if (!url) return "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80";
    if (url.startsWith("data:image")) {
      return "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80";
    }
    return url;
  };

  // Online Update JSON state variables
  const [versionName, setVersionName] = useState("2.1");
  const [rawJsonUrl, setRawJsonUrl] = useState("https://pastebin.com/raw/Sharechat_ns_098");
  const [copiedJson, setCopiedJson] = useState(false);

  // Integration & Attachment Guide Modal state
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [integrationTab, setIntegrationTab] = useState<'sketchware' | 'android' | 'web' | 'json'>('sketchware');
  const [copiedCode, setCopiedCode] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Collapsible state for Preset Catalog & Animation Lab
  const [isPresetCatalogOpen, setIsPresetCatalogOpen] = useState(true);
  const [activeCatalogTab, setActiveCatalogTab] = useState<'types' | 'media' | 'ios' | 'android' | 'effects' | 'anim'>('types');
  const [isAnimationLabOpen, setIsAnimationLabOpen] = useState(false);

  // Animation Playback states
  const [selectedAnim, setSelectedAnim] = useState<'fade' | 'bounce' | 'zoom' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate'>(config.dialogAnimation || 'bounce');
  const [duration, setDuration] = useState<number>(0.6); // in seconds
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [previewKey, setPreviewKey] = useState<number>(0);

  // Web Audio API Synthesizer
  const playSound = (soundType: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (soundType === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5 note
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (soundType === 'laser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (soundType === 'bell') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

        // Overtone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1100 * 2.4, now);
        gain2.gain.setValueAtTime(0.04, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc.start(now);
        osc.stop(now + 1.0);
        osc2.start(now);
        osc2.stop(now + 0.5);
      } else if (soundType === 'retro') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.setValueAtTime(520, now + 0.07);
        osc.frequency.setValueAtTime(1040, now + 0.14);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (soundType === 'chime') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.warn("Audio Context init or playback failed:", e);
    }
  };

  // Loop trigger effect
  useEffect(() => {
    if (!isLooping) return;
    const interval = setInterval(() => {
      setPreviewKey(prev => prev + 1);
      if (config.soundEffect && config.soundEffect !== 'none') {
        playSound(config.soundEffect);
      }
    }, (duration * 1000) + 1200); // Wait for animation duration + 1.2s stay delay
    return () => clearInterval(interval);
  }, [isLooping, duration, config.soundEffect]);

  const selectAnimation = (anim: 'fade' | 'bounce' | 'zoom' | 'slide-up' | 'slide-down') => {
    setSelectedAnim(anim);
    setConfig(prev => ({
      ...prev,
      dialogAnimation: anim
    }));
    setPreviewKey(prev => prev + 1);
    if (config.soundEffect && config.soundEffect !== 'none') {
      playSound(config.soundEffect);
    }
  };

  const triggerManualReplay = () => {
    setPreviewKey(prev => prev + 1);
    if (config.soundEffect && config.soundEffect !== 'none') {
      playSound(config.soundEffect);
    }
  };

  const getAnimationInitial = () => {
    switch (selectedAnim) {
      case 'fade': return { opacity: 0 };
      case 'bounce': return { scale: 0.3, opacity: 0 };
      case 'zoom': return { scale: 0.6, opacity: 0 };
      case 'slide-up': return { y: 120, opacity: 0 };
      case 'slide-down': return { y: -120, opacity: 0 };
      case 'slide-left': return { x: -140, opacity: 0 };
      case 'slide-right': return { x: 140, opacity: 0 };
      case 'scale': return { scale: 0.1, opacity: 0 };
      case 'rotate': return { rotate: -180, scale: 0.4, opacity: 0 };
      default: return { opacity: 0 };
    }
  };

  const getAnimationAnimate = () => {
    switch (selectedAnim) {
      case 'fade': return { opacity: 1 };
      case 'bounce': return { scale: [0.3, 1.08, 0.96, 1], opacity: 1 };
      case 'zoom': return { scale: 1, opacity: 1 };
      case 'slide-up': return { y: 0, opacity: 1 };
      case 'slide-down': return { y: 0, opacity: 1 };
      case 'slide-left': return { x: 0, opacity: 1 };
      case 'slide-right': return { x: 0, opacity: 1 };
      case 'scale': return { scale: 1, opacity: 1 };
      case 'rotate': return { rotate: 0, scale: 1, opacity: 1 };
      default: return { opacity: 1 };
    }
  };

  const getAnimationTransition = () => {
    const transitionOpts: any = { duration: duration, ease: "easeOut" };
    if (selectedAnim === 'bounce') {
      transitionOpts.ease = "easeInOut";
    }
    return transitionOpts;
  };

  const getSmaliCodeForAnimation = () => {
    const durationMs = Math.round(duration * 1000);
    const durationHex = "0x" + durationMs.toString(16).toUpperCase();
    switch (selectedAnim) {
      case 'fade':
        return `# --- Injected Fade In Animation ---
    const v0, 0x010a0001  # android.R.anim.fade_in
    invoke-static {p0, v0}, Landroid/view/animation/AnimationUtils;->loadAnimation(Landroid/content/Context;I)Landroid/view/animation/Animation;
    move-result-object v1
    const-wide/th16 v2, ${durationHex}  # ${durationMs}ms duration
    invoke-virtual {v1, v2, v3}, Landroid/view/animation/Animation;->setDuration(J)V`;
      case 'bounce':
        return `# --- Injected Spring Bounce Animation ---
    const v0, 0x010a0003  # android.R.anim.bounce_interpolator
    invoke-static {p0, v0}, Landroid/view/animation/AnimationUtils;->loadInterpolator(Landroid/content/Context;I)Landroid/view/animation/Interpolator;
    move-result-object v1
    invoke-virtual {v2, v1}, Landroid/view/animation/Animation;->setInterpolator(Landroid/view/animation/Interpolator;)V`;
      case 'zoom':
      case 'scale':
        return `# --- Injected Scale Zoom Animation ---
    const v0, 0x010a0004  # android.R.anim.overshoot_interpolator
    invoke-static {p0, v0}, Landroid/view/animation/AnimationUtils;->loadInterpolator(Landroid/content/Context;I)Landroid/view/animation/Interpolator;
    move-result-object v1
    const-wide/th16 v2, ${durationHex}  # ${durationMs}ms zoom transition`;
      case 'slide-up':
        return `# --- Injected Slide Up (Bottom) ---
    const v0, 0x010a0005  # android.R.anim.slide_in_bottom
    const-wide/th16 v2, ${durationHex}  # ${durationMs}ms slide duration`;
      case 'slide-down':
        return `# --- Injected Slide Down (Top) ---
    const v0, 0x010a0006  # android.R.anim.slide_in_top
    const-wide/th16 v2, ${durationHex}  # ${durationMs}ms slide duration`;
      case 'slide-left':
        return `# --- Injected Slide Left ---
    const v0, 0x010a0007  # android.R.anim.slide_in_left
    const-wide/th16 v2, ${durationHex}  # ${durationMs}ms slide duration`;
      case 'slide-right':
        return `# --- Injected Slide Right ---
    const v0, 0x010a0008  # android.R.anim.slide_in_right
    const-wide/th16 v2, ${durationHex}  # ${durationMs}ms slide duration`;
      case 'rotate':
        return `# --- Injected Rotate Spinner Transition ---
    const v0, 0x010a0009  # android.R.anim.accelerate_decelerate_interpolator
    const-wide/th16 v2, ${durationHex}  # ${durationMs}ms rotation duration`;
      default:
        return `# Default Fade Animation`;
    }
  };

  // Default portrait fallback if empty
  const bannerUrl = config.bannerImageUrl || GALLERY_WALLPAPERS[0].url;

  const handleImageUploadLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setConfig(prev => ({
            ...prev,
            bannerImageUrl: reader.result as string,
            // also set dialogBgImage if they want it
          }));
          setShowGallery(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetImage = (url: string) => {
    setConfig(prev => ({
      ...prev,
      bannerImageUrl: url
    }));
    setShowGallery(false);
  };

  const selectFont = (fontId: string) => {
    setConfig(prev => ({
      ...prev,
      titleFont: fontId as any,
      messageFont: fontId as any
    }));
    setShowFontPicker(false);
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

  const getFontStyles = (style?: string, spacing?: string) => {
    let classes = '';
    if (style === 'uppercase') classes += ' uppercase';
    else if (style === 'bold') classes += ' font-black';
    
    if (spacing === 'compact') classes += ' tracking-tighter';
    else if (spacing === 'wide') classes += ' tracking-widest';
    else classes += ' tracking-tight';

    return classes;
  };

  const getLightingStyle = () => {
    const color = config.lightingColor || '#00FF66';
    const effect = config.themeAnimation || config.lightingEffect || 'none';

    if (effect === 'neon-pulse') {
      return {
        borderColor: color,
        boxShadow: `0 0 20px ${color}88, inset 0 0 10px ${color}33`,
        animation: 'pulse 1.8s infinite alternate'
      };
    }
    if (effect === 'rgb-flow') {
      return {
        borderColor: 'transparent',
        borderWidth: '2px',
        backgroundImage: 'linear-gradient(#000, #000), linear-gradient(to right, #ff007f, #7f00ff, #00f0ff, #00ff66, #ff007f)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: '0 0 25px rgba(127, 0, 255, 0.4)'
      };
    }
    if (effect === 'cyber-matrix') {
      return {
        borderColor: '#00FF66',
        borderWidth: '2px',
        backgroundColor: 'rgba(5, 20, 10, 0.95)',
        boxShadow: '0 0 30px rgba(0,255,102,0.5), inset 0 0 15px rgba(0,255,102,0.2)',
        animation: 'pulse 2s infinite alternate'
      };
    }
    if (effect === 'golden-aura') {
      return {
        borderColor: '#FFD700',
        borderWidth: '2px',
        backgroundColor: 'rgba(20, 15, 5, 0.95)',
        boxShadow: '0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.15)'
      };
    }
    if (effect === 'breath-pulse' || effect === 'breath') {
      return {
        borderColor: color,
        boxShadow: `0 0 30px ${color}aa, inset 0 0 15px ${color}33`,
        animation: 'pulse 2.2s infinite ease-in-out'
      };
    }
    if (effect === 'glint') {
      return {
        borderColor: color,
        borderWidth: '1.5px',
        boxShadow: `0 0 15px ${color}33`
      };
    }
    if (effect === 'glassmorphism' || effect === 'glass-float') {
      return {
        borderColor: 'rgba(255,255,255,0.25)',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      };
    }
    // Default standard green border
    return {
      borderColor: 'rgba(0, 255, 102, 0.35)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 25px rgba(0,255,102,0.12)'
    };
  };

  const applyCatalogPreset = (key: string) => {
    if (key === 'welcome') {
      setConfig(prev => ({
        ...prev,
        title: "Welcome Dear Modder!",
        message: "Thank you for installing Nsmods Dialogue Pro. All features unlocked!",
        positiveText: "GET STARTED",
        negativeText: "DISMISS",
        iconType: "gift",
        imageStyle: "banner",
        stylePreset: "standard",
        dialogType: "welcome",
        buttonCount: 2
      }));
    } else if (key === 'update') {
      setConfig(prev => ({
        ...prev,
        title: "New Update v2.1 Available",
        message: "• Added Smali2Dex compiler\n• Fixed layout rendering\n• 1-Click DEX injection ready",
        positiveText: "UPDATE NOW",
        negativeText: "LATER",
        alwaysShow: false,
        dialogType: "update",
        buttonCount: 2
      }));
    } else if (key === 'force-update') {
      setConfig(prev => ({
        ...prev,
        title: "Mandatory Update Required!",
        message: "This version has expired. Please update immediately to continue.",
        positiveText: "UPDATE IMMEDIATELY",
        negativeText: "",
        alwaysShow: true,
        dialogType: "force-update",
        buttonCount: 1
      }));
    } else if (key === 'maintenance') {
      setConfig(prev => ({
        ...prev,
        title: "Server Under Maintenance 🛠️",
        message: "We are performing scheduled database upgrades. Check Telegram for live status.",
        positiveText: "TELEGRAM CHANNEL",
        negativeText: "CLOSE",
        dialogType: "maintenance",
        buttonCount: 2
      }));
    } else if (key === 'exit') {
      setConfig(prev => ({
        ...prev,
        title: "Confirm Exit?",
        message: "Do you really want to close the application?",
        positiveText: "EXIT APP",
        negativeText: "CANCEL",
        dialogType: "exit",
        buttonCount: 2
      }));
    } else if (key === 'error') {
      setConfig(prev => ({
        ...prev,
        title: "Connection Error ⚠️",
        message: "Unable to connect to remote server. Please check network connection.",
        positiveText: "RETRY",
        negativeText: "CANCEL",
        titleColor: "#FF3B30",
        dialogType: "error",
        buttonCount: 2
      }));
    } else if (key === 'success') {
      setConfig(prev => ({
        ...prev,
        title: "Success! 🎉",
        message: "Dialog configuration & classes.dex compiled successfully.",
        positiveText: "AWESOME",
        negativeText: "CLOSE",
        titleColor: "#34C759",
        dialogType: "success",
        buttonCount: 2
      }));
    } else if (key === 'warning') {
      setConfig(prev => ({
        ...prev,
        title: "Warning Notice 🛡️",
        message: "Replacing classes.dex requires MT Manager. Make a backup first.",
        positiveText: "UNDERSTOOD",
        negativeText: "BACK",
        titleColor: "#FF9500",
        dialogType: "warning",
        buttonCount: 2
      }));
    } else if (key === 'loading') {
      setConfig(prev => ({
        ...prev,
        title: "Loading Resources...",
        message: "Please wait while we initialize application assets.",
        positiveText: "PLEASE WAIT",
        negativeText: "CANCEL",
        dialogType: "loading",
        buttonCount: 1
      }));
    } else if (key === 'progress') {
      setConfig(prev => ({
        ...prev,
        title: "Downloading Patch...",
        message: "Progress: 85% completed. Do not close during injection.",
        positiveText: "BACKGROUND",
        negativeText: "CANCEL",
        dialogType: "progress",
        buttonCount: 2
      }));
    } else if (key === 'permission') {
      setConfig(prev => ({
        ...prev,
        title: "Storage Permission Needed",
        message: "App requires file access to read classes.dex & save ZIP files.",
        positiveText: "GRANT PERMISSION",
        negativeText: "DENY",
        dialogType: "permission",
        buttonCount: 2
      }));
    } else if (key === 'login') {
      setConfig(prev => ({
        ...prev,
        title: "Account Login Required 🔑",
        message: "Please sign in with your credentials to unlock custom dialog features.",
        positiveText: "LOGIN NOW",
        negativeText: "GUEST MODE",
        dialogType: "login",
        buttonCount: 2
      }));
    } else if (key === '3buttons') {
      setConfig(prev => ({
        ...prev,
        positiveText: "YES",
        negativeText: "NO",
        thirdBtnText: "MAYBE",
        buttonCount: 3
      }));
    } else if (key === 'img-circle') {
      setConfig(prev => ({ ...prev, imageStyle: 'circle' }));
    } else if (key === 'img-square') {
      setConfig(prev => ({ ...prev, imageStyle: 'square' }));
    } else if (key === 'img-banner') {
      setConfig(prev => ({ ...prev, imageStyle: 'banner' }));
    } else if (key === 'img-gif') {
      setConfig(prev => ({ ...prev, imageStyle: 'gif' }));
    } else if (key === 'img-lottie') {
      setConfig(prev => ({ ...prev, imageStyle: 'lottie' }));
    } else if (key === 'ios-alert') {
      setConfig(prev => ({ ...prev, stylePreset: 'ios-alert', lightingEffect: 'glassmorphism', dialogCornerRadius: 20 }));
    } else if (key === 'ios-actionsheet') {
      setConfig(prev => ({ ...prev, stylePreset: 'ios-actionsheet', dialogAnimation: 'slide-up', buttonCount: 3 }));
    } else if (key === 'ios-permission') {
      setConfig(prev => ({ ...prev, stylePreset: 'ios-alert', title: '"Nsmods Pro" Access Photos', message: 'Allows selecting custom wallpapers for dialog banners.', positiveText: 'Allow Access', negativeText: "Don't Allow" }));
    } else if (key === 'ios-success') {
      setConfig(prev => ({ ...prev, stylePreset: 'ios-alert', title: 'Saved to Library', message: 'The generated image has been saved to your photo library.', positiveText: 'Done', negativeText: '' }));
    } else if (key === 'material3') {
      setConfig(prev => ({ ...prev, stylePreset: 'material3', dialogCornerRadius: 28 }));
    } else if (key === 'bottom-sheet') {
      setConfig(prev => ({ ...prev, stylePreset: 'bottom-sheet', dialogAnimation: 'slide-up' }));
    } else if (key === 'fullscreen') {
      setConfig(prev => ({ ...prev, stylePreset: 'fullscreen', dialogAnimation: 'slide-up' }));
    } else if (key === 'edge-to-edge') {
      setConfig(prev => ({ ...prev, stylePreset: 'edge-to-edge' }));
    } else if (key === 'glassmorphism') {
      setConfig(prev => ({ ...prev, lightingEffect: 'glassmorphism', lightingColor: '#00E5FF' }));
    } else if (key === 'blur') {
      setConfig(prev => ({ ...prev, lightingEffect: 'glassmorphism', dialogBgColor: 'rgba(0,0,0,0.85)' }));
    } else if (key === 'neon') {
      setConfig(prev => ({ ...prev, lightingEffect: 'neon-pulse', lightingColor: '#FF00FF' }));
    } else if (key === 'gradient-border') {
      setConfig(prev => ({ ...prev, lightingEffect: 'rgb-flow' }));
    }
    setPreviewKey(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#EDF2F6] min-h-full pb-32 flex flex-col items-center p-4 select-none relative font-sans text-slate-800 scrollbar-none">
      
      {/* Top Embedded Live Preview Frame (Matching Screenshot Layout) */}
      <div className="w-full flex justify-center py-4 relative min-h-[320px] items-center">
        {/* Interactive Floating Trigger Button */}
        {config.enableFloatingButton !== false && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playSound(config.soundEffect || 'chime');
              setConfig(prev => ({ ...prev, dialogStateOpen: !prev.dialogStateOpen }));
              setActionToast(config.dialogStateOpen !== false ? "Floating Widget: Dialog Closed" : "Floating Widget: Dialog Opened!");
            }}
            className={`absolute z-30 flex items-center gap-1.5 px-3 py-2 rounded-full font-black text-[10px] text-white shadow-2xl cursor-pointer border ${
              config.floatingButtonPos === 'bottom-left' ? 'bottom-2 left-2' :
              config.floatingButtonPos === 'top-right' ? 'top-2 right-2' :
              config.floatingButtonPos === 'top-left' ? 'top-2 left-2' :
              'bottom-2 right-2'
            } ${
              config.dialogStateOpen !== false 
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 border-rose-400' 
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 border-emerald-300'
            } ${
              config.floatingButtonAnim === 'bounce' ? 'animate-bounce' :
              config.floatingButtonAnim === 'glow' ? 'animate-pulse shadow-emerald-500/50' :
              config.floatingButtonAnim === 'spin' ? 'hover:rotate-180 transition-transform' :
              'animate-pulse'
            }`}
          >
            {config.floatingButtonIcon === 'send' ? <Send className="w-3.5 h-3.5" /> :
             config.floatingButtonIcon === 'gamepad' ? <Gamepad2 className="w-3.5 h-3.5" /> :
             config.floatingButtonIcon === 'bell' ? <Bell className="w-3.5 h-3.5" /> :
             config.floatingButtonIcon === 'gift' ? <Gift className="w-3.5 h-3.5" /> :
             config.floatingButtonIcon === 'heart' ? <Heart className="w-3.5 h-3.5" /> :
             <Sparkles className="w-3.5 h-3.5" />}
            <span>{config.floatingButtonText || (config.dialogStateOpen !== false ? "CLOSE FLOATING" : "OPEN FLOATING")}</span>
          </motion.button>
        )}

        {/* Action Toast Feedback Overlay */}
        <AnimatePresence>
          {actionToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              onAnimationComplete={() => {
                setTimeout(() => setActionToast(null), 2500);
              }}
              className="absolute top-1 z-40 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{actionToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {config.dialogStateOpen !== false ? (
            <motion.div 
              key={previewKey}
              initial={getAnimationInitial()}
              animate={getAnimationAnimate()}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={getAnimationTransition()}
              style={getLightingStyle()}
              className="w-[280px] bg-black text-white rounded-[28px] overflow-hidden border flex flex-col items-center pb-5 relative shadow-2xl"
            >
              {config.lightingEffect === 'glint' && (
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-20 rounded-[28px]">
                  <motion.div 
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-0 bottom-0 w-1/2 skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                  />
                </div>
              )}

              {/* Top image or media display */}
              {config.imageStyle === 'circle' ? (
                <div className="pt-5 pb-2 flex justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-400/50 shadow-lg">
                    <img src={bannerUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : config.imageStyle === 'square' ? (
                <div className="pt-4 pb-2 flex justify-center">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/20 shadow-lg">
                    <img src={bannerUrl} alt="Square" className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : config.imageStyle === 'gif' ? (
                <div className="pt-4 pb-2 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-pink-500/60 shadow-xl relative bg-slate-900 flex items-center justify-center">
                    <img src={bannerUrl} alt="GIF" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-pink-600 text-white text-[8px] font-black px-1 rounded">GIF</span>
                  </div>
                </div>
              ) : config.imageStyle === 'lottie' ? (
                <div className="pt-4 pb-2 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-indigo-950/80 border-2 border-indigo-400/60 flex items-center justify-center shadow-xl relative">
                    <Sparkles className="w-10 h-10 text-indigo-400 animate-spin" />
                    <span className="absolute bottom-1 right-1 bg-indigo-600 text-white text-[8px] font-black px-1 rounded">LOTTIE</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[180px] overflow-hidden bg-slate-900 relative">
                  <img 
                    src={bannerUrl} 
                    alt="Anime Portrait" 
                    className="w-full h-full object-cover transition-all"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent" />
                </div>
              )}

              {/* Title Header if present */}
              {config.title && (
                <h4 
                  className={`text-sm font-extrabold px-5 pt-2 text-center transition-all ${getFontClass(config.titleFont)} ${getFontStyles(config.titleStyle, config.letterSpacing)}`}
                  style={{ 
                    color: config.titleColor || '#38BDF8',
                    textShadow: config.titleStyle === 'glow' ? `0 0 12px ${config.titleColor || '#38BDF8'}` : 'none'
                  }}
                >
                  {config.title}
                </h4>
              )}

              {/* Message Area with optional side accent border */}
              <div className="w-full px-5 py-3 text-center">
                <div 
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 transition-all text-center relative overflow-hidden"
                  style={{
                    borderLeftWidth: config.sideAccentColor ? '4px' : '1px',
                    borderLeftColor: config.sideAccentColor || 'rgba(255,255,255,0.1)'
                  }}
                >
                  <p 
                    className={`text-xs leading-snug whitespace-pre-wrap max-h-16 overflow-y-auto transition-all ${getFontClass(config.messageFont)} ${getFontStyles(config.messageStyle, config.letterSpacing)}`}
                    style={{
                      color: config.messageColor || config.lightingColor || '#00FF66',
                      textShadow: config.messageStyle === 'glow' ? `0 0 12px ${(config.messageColor || config.lightingColor || '#00FF66')}` : `0 0 10px ${(config.messageColor || config.lightingColor || '#00FF66')}44`
                    }}
                  >
                    {config.message || "Follow our Telegram channel 📲"}
                  </p>
                </div>
              </div>

              {/* Divider and Buttons (1, 2, or 3 buttons with active working handlers!) */}
              {config.buttonCount === 3 ? (
                <div className="w-full px-4 pt-3 border-t border-white/10 flex items-center justify-between gap-1 text-[10px] font-extrabold uppercase">
                  <button 
                    type="button" 
                    onClick={() => {
                      playSound(config.soundEffect || 'beep');
                      setConfig(prev => ({ ...prev, dialogStateOpen: false }));
                      setActionToast("Negative Option Chosen (Closed)");
                    }}
                    className="text-[#FF007F] hover:brightness-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    {config.negativeText || "NO"}
                  </button>
                  <span className="text-zinc-700">|</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      playSound(config.soundEffect || 'chime');
                      if (config.thirdBtnLink) window.open(config.thirdBtnLink, '_blank');
                      setActionToast("Option 3 Selected!");
                    }}
                    className="text-[#FFB800] hover:brightness-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    {config.thirdBtnText || "MAYBE"}
                  </button>
                  <span className="text-zinc-700">|</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      playSound(config.soundEffect || 'chime');
                      if (config.positiveBtnLink) window.open(config.positiveBtnLink, '_blank');
                      setActionToast("Opening Link: " + (config.positiveBtnLink || "Telegram"));
                    }}
                    className="text-[#00E5FF] hover:brightness-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    {config.positiveText || "YES"}
                  </button>
                </div>
              ) : config.buttonCount === 1 ? (
                <div className="w-full px-5 pt-3 border-t border-white/10 flex justify-center">
                  <button 
                    type="button" 
                    onClick={() => {
                      playSound(config.soundEffect || 'chime');
                      if (config.positiveBtnLink) window.open(config.positiveBtnLink, '_blank');
                      setConfig(prev => ({ ...prev, dialogStateOpen: false }));
                      setActionToast("OK Button Clicked!");
                    }}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold text-[11px] rounded-xl uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    {config.positiveText || "OK"}
                  </button>
                </div>
              ) : (
                <div className="w-full px-5 pt-3 border-t border-white/10 flex items-center justify-center gap-1">
                  {config.negativeText && (
                    <>
                      <button 
                        type="button" 
                        onClick={() => {
                          playSound(config.soundEffect || 'beep');
                          setConfig(prev => ({ ...prev, dialogStateOpen: false }));
                          setActionToast("Dialog Closed!");
                        }}
                        className="font-extrabold text-[11px] uppercase tracking-wider text-[#FF007F] hover:brightness-110 active:scale-95 transition-all bg-transparent border-0 outline-none cursor-pointer"
                      >
                        {config.negativeText || "EXIT"}
                      </button>
                      <span className="text-zinc-700 mx-4 text-xs font-light">|</span>
                    </>
                  )}
                  <button 
                    type="button" 
                    onClick={() => {
                      playSound(config.soundEffect || 'chime');
                      if (config.positiveBtnLink) window.open(config.positiveBtnLink, '_blank');
                      setActionToast("Opening Telegram Link...");
                    }}
                    className="font-extrabold text-[11px] uppercase tracking-wider text-[#00E5FF] hover:brightness-110 active:scale-95 transition-all bg-transparent border-0 outline-none cursor-pointer"
                  >
                    {config.positiveText || "TELEGRAM"}
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="closed-state"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="w-[280px] h-[260px] bg-slate-900/90 border-2 border-dashed border-rose-500/40 rounded-[28px] flex flex-col items-center justify-center p-6 text-center text-white relative shadow-2xl backdrop-blur-md"
            >
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-full mb-2 border border-rose-500/30 animate-pulse">
                <X className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-300">Dialog Closed State 🔴</h4>
              <p className="text-[10px] text-slate-400 mt-1 mb-4 leading-relaxed">The dialog is currently closed. Click the button below to re-open.</p>
              <button
                type="button"
                onClick={() => {
                  playSound(config.soundEffect || 'chime');
                  setConfig(prev => ({ ...prev, dialogStateOpen: true }));
                  setActionToast("Dialog Opened!");
                }}
                className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-[11px] rounded-xl uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-400/40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPEN DIALOG PREVIEW</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button to Open App Attachment & Code Integration Tutorial */}
      <button
        type="button"
        onClick={() => setShowIntegrationModal(true)}
        className="w-full max-w-[420px] mb-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-indigo-400/30 cursor-pointer"
      >
        <Code2 className="w-4 h-4 text-pink-300" />
        <span>📱 HOW TO ATTACH TO YOUR APP (INTEGRATION GUIDE)</span>
        <span className="py-0.5 px-1.5 bg-white/20 rounded text-[9px] font-mono">GUIDE + CODE</span>
      </button>

      {/* Main Buttons Row: GO TO GALLERY and FONT */}
      <div className="w-full grid grid-cols-2 gap-3.5 mt-2 max-w-[420px]">
        {/* GO TO GALLERY BUTTON */}
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="py-4 px-3 bg-gradient-to-r from-[#FF9E00] via-[#FF4D00] to-[#E60026] text-white font-black text-sm tracking-wide rounded-xl shadow-md hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer"
        >
          <ImageIcon className="w-4 h-4" />
          <span>GO TO GALLERY</span>
        </button>

        {/* FONT BUTTON */}
        <button
          type="button"
          onClick={() => setShowFontPicker(true)}
          className="py-4 px-3 bg-gradient-to-r from-[#FF9E00] via-[#FF4D00] to-[#E60026] text-white font-black text-sm tracking-wide rounded-xl shadow-md hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer"
        >
          <FontIcon className="w-4 h-4" />
          <span>FONT</span>
        </button>
      </div>

      {/* Hidden file input for file uploading */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleImageUploadLocal} 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={importJsonInputRef} 
        accept=".json" 
        onChange={handleImportJsonConfig} 
        className="hidden" 
      />

      {/* ==================== SUB-PANE: PORTABLE JSON CONFIG EXPORT & IMPORT ==================== */}
      <div className="w-full max-w-[420px] mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden text-white text-left">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                💾 Portable JSON Backup & Restore
                <span className="text-[9px] py-0.5 px-1.5 bg-indigo-500/20 text-indigo-300 font-mono rounded">
                  .JSON File
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Export or import your dialog configuration as a .json file</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3">
          <button
            type="button"
            onClick={exportPortableJsonConfig}
            className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CONFIG (.JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => importJsonInputRef.current?.click()}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-emerald-500/30"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>IMPORT CONFIG (.JSON)</span>
          </button>
        </div>
      </div>

      {/* ==================== SUB-PANE: PRESET CATALOG & DIALOG MAKER (COLLAPSIBLE) ==================== */}
      <div className="w-full max-w-[420px] mt-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
        
        {/* Collapsible Header */}
        <button
          type="button"
          onClick={() => setIsPresetCatalogOpen(!isPresetCatalogOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-950/40 hover:bg-slate-950/60 transition-colors text-left focus:outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                💎 Preset Catalog & Style Maker
                <span className="text-[9px] py-0.5 px-1.5 bg-emerald-500/20 text-emerald-300 font-bold font-mono rounded-full uppercase">
                  {isPresetCatalogOpen ? "28 PRESETS" : "EXPAND"}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">1-Click load Dialog Types, iOS & Android 15 Styles</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 hover:text-white transition-colors">
            {isPresetCatalogOpen ? "▲ CLOSE" : "▼ OPEN"}
          </span>
        </button>

        {isPresetCatalogOpen && (
          <div className="p-4 pt-2 border-t border-slate-800/50 space-y-3">
            {/* Catalog Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-none text-[10px] font-extrabold uppercase">
              {[
                { id: 'types', label: '💎 Types' },
                { id: 'media', label: '🖼️ Media' },
                { id: 'ios', label: '🍎 iOS' },
                { id: 'android', label: '🤖 Android 15' },
                { id: 'effects', label: '✨ Effects' },
                { id: 'anim', label: '🎭 Anim' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCatalogTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    activeCatalogTab === tab.id 
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105' 
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Catalog Items Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {activeCatalogTab === 'types' && (
                <>
                  <button type="button" onClick={() => applyCatalogPreset('welcome')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    ✅ Welcome Dialog
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('update')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    ✅ Update Dialog
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('force-update')} className="p-2 bg-slate-950/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left text-[11px] font-bold text-rose-300 cursor-pointer transition-all">
                    ✅ Force Update
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('maintenance')} className="p-2 bg-slate-950/80 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left text-[11px] font-bold text-amber-300 cursor-pointer transition-all">
                    ✅ Maintenance
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('exit')} className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    ✅ Exit Confirm
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('error')} className="p-2 bg-slate-950/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left text-[11px] font-bold text-rose-300 cursor-pointer transition-all">
                    ✅ Error Dialog
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('success')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left text-[11px] font-bold text-emerald-300 cursor-pointer transition-all">
                    ✅ Success Dialog
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('warning')} className="p-2 bg-slate-950/80 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left text-[11px] font-bold text-amber-300 cursor-pointer transition-all">
                    ✅ Warning Notice
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('loading')} className="p-2 bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left text-[11px] font-bold text-indigo-300 cursor-pointer transition-all">
                    ✅ Loading Spinner
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('progress')} className="p-2 bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left text-[11px] font-bold text-indigo-300 cursor-pointer transition-all">
                    ✅ Progress Dialog
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('permission')} className="p-2 bg-slate-950/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left text-[11px] font-bold text-cyan-300 cursor-pointer transition-all">
                    ✅ Permission Popup
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('login')} className="p-2 bg-slate-950/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left text-[11px] font-bold text-purple-300 cursor-pointer transition-all">
                    ✅ Login Required
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('3buttons')} className="p-2 col-span-2 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 rounded-xl text-center text-[11px] font-extrabold text-emerald-300 cursor-pointer transition-all">
                    🔘 Custom 3-Button Layout (Yes / Maybe / No)
                  </button>
                </>
              )}

              {activeCatalogTab === 'media' && (
                <>
                  <button type="button" onClick={() => applyCatalogPreset('img-circle')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    🖼️ Circular Avatar
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('img-square')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    🖼️ Square Image
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('img-banner')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    🖼️ Top Banner Image
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('img-gif')} className="p-2 bg-slate-950/80 hover:bg-pink-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-pink-300 cursor-pointer transition-all">
                    🎬 Animated GIF Frame
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('img-lottie')} className="p-2 col-span-2 bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-500/40 rounded-xl text-center text-[11px] font-bold text-indigo-300 cursor-pointer transition-all">
                    ✨ Lottie Animation Container
                  </button>
                </>
              )}

              {activeCatalogTab === 'ios' && (
                <>
                  <button type="button" onClick={() => applyCatalogPreset('ios-alert')} className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    🍎 iOS Frosted Alert
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('ios-actionsheet')} className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    🍎 iOS Action Sheet
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('ios-permission')} className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    🍎 iOS Permission Dialog
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('ios-success')} className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    🍎 iOS Success Popup
                  </button>
                </>
              )}

              {activeCatalogTab === 'android' && (
                <>
                  <button type="button" onClick={() => applyCatalogPreset('material3')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-emerald-300 cursor-pointer transition-all">
                    🤖 Material 3 Surface
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('bottom-sheet')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-emerald-300 cursor-pointer transition-all">
                    🤖 Bottom Sheet Panel
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('fullscreen')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-emerald-300 cursor-pointer transition-all">
                    🤖 Full Screen Dialog
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('edge-to-edge')} className="p-2 bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-emerald-300 cursor-pointer transition-all">
                    🤖 Edge-to-Edge Canvas
                  </button>
                </>
              )}

              {activeCatalogTab === 'effects' && (
                <>
                  <button type="button" onClick={() => applyCatalogPreset('glassmorphism')} className="p-2 bg-slate-950/80 hover:bg-cyan-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-cyan-300 cursor-pointer transition-all">
                    ✨ Glassmorphism UI
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('blur')} className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-slate-200 cursor-pointer transition-all">
                    ✨ Blur Background
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('neon')} className="p-2 bg-slate-950/80 hover:bg-pink-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-pink-300 cursor-pointer transition-all">
                    ✨ Neon Cyber Glow
                  </button>
                  <button type="button" onClick={() => applyCatalogPreset('gradient-border')} className="p-2 bg-slate-950/80 hover:bg-purple-950/40 border border-slate-800 rounded-xl text-left text-[11px] font-bold text-purple-300 cursor-pointer transition-all">
                    ✨ RGB Gradient Flow
                  </button>
                </>
              )}

              {activeCatalogTab === 'anim' && (
                <>
                  {[
                    { id: 'fade', label: '🎭 Fade Transition' },
                    { id: 'bounce', label: '🎭 Spring Bounce' },
                    { id: 'zoom', label: '🎭 Zoom In Scale' },
                    { id: 'slide-up', label: '🎭 Slide Up' },
                    { id: 'slide-down', label: '🎭 Slide Down' },
                    { id: 'slide-left', label: '🎭 Slide Left' },
                    { id: 'slide-right', label: '🎭 Slide Right' },
                    { id: 'scale', label: '🎭 OverScale 3D' },
                    { id: 'rotate', label: '🎭 Rotate Entrance' },
                  ].map(a => (
                    <button 
                      key={a.id}
                      type="button" 
                      onClick={() => {
                        setSelectedAnim(a.id as any);
                        setPreviewKey(prev => prev + 1);
                      }} 
                      className={`p-2 border rounded-xl text-left text-[11px] font-bold cursor-pointer transition-all ${
                        selectedAnim === a.id 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' 
                          : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-emerald-500/40'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== SUB-PANE: DIALOG ANIMATION LAB (COLLAPSIBLE) ==================== */}
      <div className="w-full max-w-[420px] mt-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        
        {/* Toggleable Collapsible Header */}
        <button
          type="button"
          onClick={() => setIsAnimationLabOpen(!isAnimationLabOpen)}
          className="w-full flex items-center justify-between p-5 bg-slate-950/20 hover:bg-slate-950/40 transition-colors text-left focus:outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                Animation Control Lab
                <span className="text-[9px] py-0.5 px-1.5 bg-indigo-500/20 text-indigo-300 font-semibold font-mono rounded-full uppercase tracking-tight">
                  {isAnimationLabOpen ? "OPENED" : "COLLAPSED"}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Expand this tab to customize dialog animation speed</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-400 hover:text-white transition-colors">
            {isAnimationLabOpen ? "▲ CLOSE" : "▼ OPEN"}
          </span>
        </button>

        {isAnimationLabOpen && (
          <div className="p-5 pt-2 border-t border-slate-800/50 space-y-4">
            {/* Playback status indicator */}
            <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[11px] text-slate-400">Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isLooping ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                  {isLooping ? "Looping" : "Paused"}
                </span>
              </div>
            </div>

            {/* Animation Selector Grid */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                1. Select Animation Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['bounce', 'zoom', 'fade', 'slide-up', 'slide-down'] as const).map((anim) => {
                  const isActive = selectedAnim === anim;
                  return (
                    <button
                      key={anim}
                      type="button"
                      onClick={() => selectAnimation(anim)}
                      className={`py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-center flex flex-col items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="capitalize">{anim.replace('-', ' ')}</span>
                      {isActive && <span className="text-[8px] py-0.5 px-1 bg-indigo-500 text-white rounded font-mono uppercase font-black text-[7px] tracking-tight">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Speed Slider & Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-indigo-400" />
                  2. Playback Speed (Duration)
                </label>
                <span className="text-[10px] font-mono font-extrabold text-indigo-300">
                  {Math.round(duration * 1000)}ms ({duration}s)
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <input 
                  type="range"
                  min="0.2"
                  max="1.8"
                  step="0.05"
                  value={duration}
                  onChange={(e) => {
                    setDuration(parseFloat(e.target.value));
                    setPreviewKey(prev => prev + 1); // instantly re-evaluate with new duration
                  }}
                  className="flex-1 accent-indigo-500 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Speed description tag */}
              <div className="text-[9px] text-slate-400 font-light flex items-center justify-between bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
                <span>⚡ Min: 200ms</span>
                <span className="font-bold text-indigo-300">
                  {duration <= 0.4 ? "⚡ Super Fast (Gamer Style)" :
                   duration <= 0.8 ? "🎯 Balanced (Standard Android)" :
                   duration <= 1.3 ? "🎬 Cinematic & Smooth" : "❄️ Slow Motion"}
                </span>
                <span>❄️ Max: 1800ms</span>
              </div>
            </div>

            {/* Playback State Controls */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Loop Mode Switch */}
              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold cursor-pointer ${
                  isLooping
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin' : ''}`} style={{ animationDuration: isLooping ? `${duration * 3}s` : '0s' }} />
                <span>{isLooping ? "Auto Loop: ON" : "Auto Loop: OFF"}</span>
              </button>

              {/* Manual Replay Trigger */}
              <button
                type="button"
                onClick={triggerManualReplay}
                className="py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-indigo-400 hover:text-white flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Replay Animation</span>
              </button>
            </div>

            {/* Smali Preview Code Box */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Code className="w-3 h-3 text-indigo-400" />
                Smali bytecode parameter projection:
              </span>
              <div className="bg-slate-950 p-3 rounded-xl font-mono text-[9px] text-emerald-400 border border-slate-800/80 overflow-x-auto whitespace-pre select-all max-h-24 scrollbar-thin">
                {getSmaliCodeForAnimation()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== SUB-PANE: DIALOG STATE & LIGHTING FX LAB ==================== */}
      <div className="w-full max-w-[420px] mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden text-white text-left">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center gap-2 pb-3.5 border-b border-slate-800/80">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              Dialog Open/Close & Lighting Lab
              <span className="text-[9px] py-0.5 px-1.5 bg-emerald-500/20 text-emerald-300 font-semibold font-mono rounded-full uppercase tracking-tight">Pro V5.2</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Configure dialog open/close state and custom accent colors</p>
          </div>
        </div>

        {/* 1. OPEN / CLOSE TOGGLE BUTTON */}
        <div className="space-y-2 pt-4">
          <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span>Open/Close Dialog Control</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${config.dialogStateOpen !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              {config.dialogStateOpen !== false ? 'STATE: OPEN 🟢' : 'STATE: CLOSED 🔴'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, dialogStateOpen: true }))}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                config.dialogStateOpen !== false
                  ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>OPEN DIALOG</span>
            </button>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, dialogStateOpen: false }))}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                config.dialogStateOpen === false
                  ? 'bg-rose-600/30 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>CLOSE DIALOG</span>
            </button>
          </div>
        </div>

        {/* 2. MESSAGE SIDE ACCENT COLOR SELECTOR */}
        <div className="space-y-2 pt-4 border-t border-slate-800/60 mt-4">
          <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span>Message Side Accent Color</span>
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { color: '#00FF66', name: 'Emerald' },
              { color: '#00E5FF', name: 'Cyan' },
              { color: '#FF007F', name: 'Pink' },
              { color: '#FFB800', name: 'Amber' },
              { color: '#9D4EDD', name: 'Purple' },
              { color: '#FF3B30', name: 'Red' }
            ].map(c => (
              <button
                key={c.color}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, sideAccentColor: c.color }))}
                style={{ backgroundColor: c.color }}
                className={`w-7 h-7 rounded-full border-2 flex-shrink-0 cursor-pointer transition-transform active:scale-90 ${
                  config.sideAccentColor === c.color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                title={c.name}
              />
            ))}
            <div className="flex items-center gap-1 pl-2">
              <input 
                type="color"
                value={config.sideAccentColor || '#00FF66'}
                onChange={(e) => setConfig(prev => ({ ...prev, sideAccentColor: e.target.value }))}
                className="w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. LIGHTING & THEME ANIMATION SECTION */}
        <div className="space-y-3 pt-4 border-t border-slate-800/60 mt-4">
          <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Theme Animation & Lighting Effect</span>
            <span className="text-[9px] font-mono text-emerald-300">REAL-TIME</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: '❌ Standard Border' },
              { id: 'glint', label: '✨ Glint Reflection' },
              { id: 'neon-pulse', label: '💥 Neon Pulse' },
              { id: 'rgb-flow', label: '🌈 RGB Spectrum' },
              { id: 'cyber-matrix', label: '💻 Cyber Matrix' },
              { id: 'golden-aura', label: '🌟 Golden Luxury' },
              { id: 'glassmorphism', label: '❄️ Glassmorphism' },
              { id: 'breath-pulse', label: '🫁 Breath Pulse' }
            ].map((lit) => {
              const isActive = (config.themeAnimation || config.lightingEffect || 'none') === lit.id;
              return (
                <button
                  key={lit.id}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, lightingEffect: lit.id as any, themeAnimation: lit.id as any }))}
                  className={`py-2 px-2.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {lit.label}
                </button>
              );
            })}
          </div>

          {/* LIGHTING COLOR PICKER */}
          {(config.lightingEffect === 'neon-pulse' || config.lightingEffect === 'glint' || config.lightingEffect === 'breath-pulse') && (
            <div className="space-y-1.5 pt-2 flex items-center justify-between bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
              <span className="text-[10px] text-slate-400">Custom Glow Color:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="color"
                  value={config.lightingColor || '#00FF66'}
                  onChange={(e) => setConfig(prev => ({ ...prev, lightingColor: e.target.value }))}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <span className="text-[10px] font-mono text-emerald-300 font-bold">
                  {config.lightingColor || '#00FF66'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== SUB-PANE: FLOATING TRIGGER BUTTON & OVERLAY LAB ==================== */}
      <div className="w-full max-w-[420px] mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden text-white text-left">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <Layers3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                Floating Window & Trigger Button Lab
                <span className="text-[9px] py-0.5 px-1.5 bg-cyan-500/20 text-cyan-300 font-semibold font-mono rounded-full uppercase">NEW V5.5</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Configure floating button widget and trigger overlay</p>
            </div>
          </div>
        </div>

        {/* 1. ENABLE / DISABLE FLOATING TRIGGER WIDGET */}
        <div className="space-y-2 pt-4">
          <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
            <span>Floating Button Trigger</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${config.enableFloatingButton !== false ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}>
              {config.enableFloatingButton !== false ? 'ACTIVE 🎈' : 'DISABLED ⚪'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, enableFloatingButton: true }))}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                config.enableFloatingButton !== false
                  ? 'bg-cyan-600/30 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ENABLE FLOATING</span>
            </button>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, enableFloatingButton: false }))}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                config.enableFloatingButton === false
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
              <span>HIDE FLOATING</span>
            </button>
          </div>
        </div>

        {/* 2. FLOATING BUTTON POSITION PICKER */}
        <div className="space-y-2 pt-4 border-t border-slate-800/60 mt-4">
          <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            Floating Widget Position
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'bottom-right', label: '↘️ Bottom Right' },
              { id: 'bottom-left', label: '↙️ Bottom Left' },
              { id: 'top-right', label: '↗️ Top Right' },
              { id: 'top-left', label: '↖️ Top Left' },
            ].map(pos => (
              <button
                key={pos.id}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, floatingButtonPos: pos.id as any }))}
                className={`py-2 px-2.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-left ${
                  (config.floatingButtonPos || 'bottom-right') === pos.id
                    ? 'bg-cyan-600/30 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. FLOATING BUTTON ICON & ANIMATION */}
        <div className="space-y-2 pt-4 border-t border-slate-800/60 mt-4">
          <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            Widget Animation & Icon
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'pulse', label: '💥 Pulse' },
              { id: 'bounce', label: '🏀 Bounce' },
              { id: 'glow', label: '🌟 Glow' },
              { id: 'spin', label: '🔄 Spin' }
            ].map(anim => (
              <button
                key={anim.id}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, floatingButtonAnim: anim.id as any }))}
                className={`py-1.5 px-1 rounded-xl text-[9px] font-extrabold border transition-all cursor-pointer text-center ${
                  (config.floatingButtonAnim || 'pulse') === anim.id
                    ? 'bg-cyan-500/30 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {anim.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            {[
              { id: 'sparkles', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: 'send', icon: <Send className="w-3.5 h-3.5" /> },
              { id: 'gamepad', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
              { id: 'bell', icon: <Bell className="w-3.5 h-3.5" /> },
              { id: 'gift', icon: <Gift className="w-3.5 h-3.5" /> },
              { id: 'heart', icon: <Heart className="w-3.5 h-3.5" /> }
            ].map(ic => (
              <button
                key={ic.id}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, floatingButtonIcon: ic.id as any }))}
                className={`p-2 rounded-xl border cursor-pointer transition-all ${
                  (config.floatingButtonIcon || 'sparkles') === ic.id
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {ic.icon}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CUSTOM FLOATING BUTTON TEXT */}
        <div className="space-y-1.5 pt-4 border-t border-slate-800/60 mt-4">
          <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            Floating Button Label
          </label>
          <input
            type="text"
            value={config.floatingButtonText || ''}
            onChange={(e) => setConfig(prev => ({ ...prev, floatingButtonText: e.target.value }))}
            placeholder="e.g. OPEN MOD / OPEN DIALOG"
            className="w-full py-2 px-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* ==================== SUB-PANE: TEXT FONT & FONT STYLES STUDIO ==================== */}
      <div className="w-full max-w-[420px] mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden text-white text-left">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <FontIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                Text Font & Font Styles Studio
                <span className="text-[9px] py-0.5 px-1.5 bg-amber-500/20 text-amber-300 font-semibold font-mono rounded-full uppercase">PRO STYLES</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Customize title and message font family, spacing, and styling</p>
            </div>
          </div>
        </div>

        {/* 1. Title Font Family & Style Controls */}
        <div className="space-y-2.5 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">1. Title Font Family</span>
            <span className="text-[10px] text-slate-400 font-mono uppercase">{config.titleFont || 'sans'}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
            {FONTS_LIST.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, titleFont: f.id as any }))}
                className={`p-2 rounded-xl border truncate text-center cursor-pointer transition-all ${
                  (config.titleFont || 'sans') === f.id
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-md font-extrabold'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Title Style Toggles: Bold / Uppercase / Glow */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, titleStyle: prev.titleStyle === 'bold' ? 'normal' : 'bold' }))}
              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all text-center ${
                config.titleStyle === 'bold' ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <b>B</b> BOLD
            </button>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, titleStyle: prev.titleStyle === 'uppercase' ? 'normal' : 'uppercase' }))}
              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all text-center ${
                config.titleStyle === 'uppercase' ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              AA UPPERCASE
            </button>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, titleStyle: prev.titleStyle === 'glow' ? 'normal' : 'glow' }))}
              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all text-center ${
                config.titleStyle === 'glow' ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              ✨ GLOW
            </button>
          </div>
        </div>

        {/* 2. Message Font Family & Spacing Controls */}
        <div className="space-y-2.5 pt-4 border-t border-slate-800/60 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">2. Message Font Family</span>
            <span className="text-[10px] text-slate-400 font-mono uppercase">{config.messageFont || 'sans'}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
            {FONTS_LIST.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, messageFont: f.id as any }))}
                className={`p-2 rounded-xl border truncate text-center cursor-pointer transition-all ${
                  (config.messageFont || 'sans') === f.id
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-md font-extrabold'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Message Style Toggles: Bold / Uppercase / Glow */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, messageStyle: prev.messageStyle === 'bold' ? 'normal' : 'bold' }))}
              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all text-center ${
                config.messageStyle === 'bold' ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <b>B</b> BOLD
            </button>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, messageStyle: prev.messageStyle === 'uppercase' ? 'normal' : 'uppercase' }))}
              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all text-center ${
                config.messageStyle === 'uppercase' ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              AA UPPERCASE
            </button>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, messageStyle: prev.messageStyle === 'glow' ? 'normal' : 'glow' }))}
              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all text-center ${
                config.messageStyle === 'glow' ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              ✨ GLOW
            </button>
          </div>

          {/* Letter Spacing Options */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Letter Spacing:</span>
            <div className="flex items-center gap-1.5">
              {(['compact', 'normal', 'wide'] as const).map(sp => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, letterSpacing: sp }))}
                  className={`px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase cursor-pointer transition-all ${
                    (config.letterSpacing || 'normal') === sp
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-black'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Fields Container (Form) */}
      <form onSubmit={onGenerate} className="w-full max-w-[420px] mt-6 space-y-3.5">
        
        {/* Conditionally Render Input Fields Based on ActiveTab */}
        {activeTab === 'online-update' ? (
          <>
            {/* Form Header */}
            <div className="flex items-center justify-between px-2 pt-2 pb-1 border-b border-slate-800/80">
              <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Online Dialog V2 (Config Editor)
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                PRO V5.2
              </span>
            </div>

            {/* Title Input */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold text-slate-300 pl-1 uppercase tracking-wider">
                Enter Title
              </label>
              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-inner focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                <input 
                  type="text" 
                  value={config.title || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Update Available!"
                  className="w-full bg-transparent border-none outline-none text-emerald-400 font-bold text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold text-slate-300 pl-1 uppercase tracking-wider">
                Enter Message
              </label>
              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-inner focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                <input 
                  type="text" 
                  value={config.message || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Please update your app to enjoy new features(°•°)"
                  className="w-full bg-transparent border-none outline-none text-emerald-400 font-bold text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Positive Button Input */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold text-slate-300 pl-1 uppercase tracking-wider">
                Enter Positive Button Text
              </label>
              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-inner focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                <input 
                  type="text" 
                  value={config.positiveText || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, positiveText: e.target.value }))}
                  placeholder="Update Now"
                  className="w-full bg-transparent border-none outline-none text-emerald-400 font-bold text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Negative Button Input */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold text-slate-300 pl-1 uppercase tracking-wider">
                Enter Negative Button Text
              </label>
              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-inner focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                <input 
                  type="text" 
                  value={config.negativeText || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, negativeText: e.target.value }))}
                  placeholder="Later"
                  className="w-full bg-transparent border-none outline-none text-emerald-400 font-bold text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Download Link Input */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold text-slate-300 pl-1 uppercase tracking-wider">
                Enter Positive Button Link / Download URL
              </label>
              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-inner focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                <input 
                  type="text" 
                  value={config.positiveBtnLink || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, positiveBtnLink: e.target.value }))}
                  placeholder="https://t.me/Sharechat_ns_098"
                  className="w-full bg-transparent border-none outline-none text-indigo-400 font-mono text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Raw JSON Link Input Field */}
            <div className="space-y-1 text-left bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  Pastebin / GitHub Raw Link
                </label>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Dex Injection Ready
                </span>
              </div>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 shadow-inner focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400/50 transition-all">
                <input 
                  type="text" 
                  value={rawJsonUrl}
                  onChange={(e) => setRawJsonUrl(e.target.value)}
                  placeholder="https://pastebin.com/raw/Sharechat_ns_098"
                  className="w-full bg-transparent border-none outline-none text-emerald-300 font-mono text-xs placeholder:text-slate-600"
                />
              </div>
              <p className="text-[10px] text-slate-400 pl-1 pt-0.5">
                💡 <strong>Pro Tip:</strong> This link will be automatically configured in the <code>simpledialog.smali</code> inside your downloaded ZIP file!
              </p>
            </div>

            {/* App Version Code */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold text-slate-300 pl-1 uppercase tracking-wider">
                Enter Version Code
              </label>
              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-inner focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                <input 
                  type="text" 
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="2.1"
                  className="w-full bg-transparent border-none outline-none text-emerald-400 font-bold text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Color Selectors with Palette Icons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 pl-1 uppercase">Title Color</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                  <input 
                    type="color" 
                    value={config.titleColor || "#FF00FF"} 
                    onChange={(e) => setConfig(prev => ({ ...prev, titleColor: e.target.value }))}
                    className="w-6 h-6 rounded-md bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-300">{config.titleColor || "#FF00FF"}</span>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 pl-1 uppercase">Message Color</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                  <input 
                    type="color" 
                    value={config.messageColor || "#E3E5EB"} 
                    onChange={(e) => setConfig(prev => ({ ...prev, messageColor: e.target.value }))}
                    className="w-6 h-6 rounded-md bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-300">{config.messageColor || "#E3E5EB"}</span>
                </div>
              </div>
            </div>

            {/* Force update checkbox */}
            <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 shadow-inner">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>Force Update (forceUpdate)?</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${config.alwaysShow !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {config.alwaysShow !== false ? 'true' : 'false'}
                </span>
              </span>
              <input 
                type="checkbox" 
                checked={config.alwaysShow !== false}
                onChange={(e) => setConfig(prev => ({ ...prev, alwaysShow: e.target.checked }))}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Live server JSON config container */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left shadow-xl space-y-3 mt-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider font-mono">Compact JSON Payload</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const compactJson = {
                        version: versionName || "2.1",
                        title: config.title || "Update Available!",
                        downloadLink: config.positiveBtnLink || "https://t.me/Sharechat_ns_098",
                        positivebtn: config.positiveText || "Update Now",
                        message: config.message || "Please update your app to enjoy new features(°•°)",
                        negativebtn: config.negativeText || "Later",
                        forceUpdate: config.alwaysShow !== false
                      };
                      const jsonStr = JSON.stringify(compactJson, null, 2);
                      navigator.clipboard.writeText(jsonStr).then(() => {
                        setCopiedJson(true);
                        setTimeout(() => setCopiedJson(false), 2000);
                      });
                    }}
                    className="p-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-[10px] font-extrabold text-emerald-300 border border-emerald-500/40 rounded-lg cursor-pointer transition-colors shadow-sm"
                  >
                    {copiedJson ? "COPIED!" : "COPY JSON"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const compactJson = {
                        version: versionName || "2.1",
                        title: config.title || "Update Available!",
                        downloadLink: config.positiveBtnLink || "https://t.me/Sharechat_ns_098",
                        positivebtn: config.positiveText || "Update Now",
                        message: config.message || "Please update your app to enjoy new features(°•°)",
                        negativebtn: config.negativeText || "Later",
                        forceUpdate: config.alwaysShow !== false
                      };
                      const jsonStr = JSON.stringify(compactJson, null, 2);
                      const blob = new Blob([jsonStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'update.json';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-1.5 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-[10px] font-extrabold text-indigo-300 border border-indigo-500/40 rounded-lg cursor-pointer transition-colors shadow-sm"
                  >
                    DOWNLOAD
                  </button>
                </div>
              </div>

              <pre className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-3 rounded-xl overflow-x-auto max-h-52 scrollbar-thin border border-slate-800/80 relative z-10">
                {JSON.stringify({
                  version: versionName || "2.1",
                  title: config.title || "Update Available!",
                  downloadLink: config.positiveBtnLink || "https://t.me/Sharechat_ns_098",
                  positivebtn: config.positiveText || "Update Now",
                  message: config.message || "Please update your app to enjoy new features(°•°)",
                  negativebtn: config.negativeText || "Later",
                  forceUpdate: config.alwaysShow !== false
                }, null, 2)}
              </pre>

              {/* Step-by-Step Guidance Box for Classes.dex editing */}
              <div className="bg-slate-950/90 border border-emerald-500/40 rounded-xl p-3.5 text-[11px] text-emerald-200 space-y-2 mt-2 relative z-10 shadow-2xl">
                <div className="font-extrabold text-emerald-400 flex items-center justify-between uppercase tracking-wide border-b border-slate-800/80 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    📌 Where to paste the Pastebin Raw Link?
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono text-emerald-300 border border-emerald-500/30">
                    MT Manager Guide
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <p className="leading-relaxed">
                    <strong className="text-amber-300">Step 1 (Host on Pastebin):</strong> Click <strong className="text-emerald-400">COPY JSON</strong> above, post it on <strong className="text-indigo-300">Pastebin.com</strong>, and copy the <strong>Raw</strong> link.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-emerald-300">Step 2 (Inject into DEX):</strong> In <strong>MT Manager</strong>, open your app's <code className="text-white bg-slate-900 px-1 py-0.5 rounded">classes.dex</code> with <strong>Dex Editor Plus</strong> and search:
                  </p>
                  <div className="bg-black/90 p-2.5 rounded-lg font-mono text-[10px] text-emerald-300 border border-emerald-900/60 select-all space-y-1.5">
                    <div className="text-slate-400"># Search Path: com/nsmods/dialog/simpledialog</div>
                    <div className="text-slate-400"># Open File: simpledialog.smali</div>
                    <div className="text-slate-400"># Look for showDialog() method:</div>
                    <div className="text-indigo-300 font-bold bg-indigo-950/50 p-1.5 rounded border border-indigo-500/30">
                      const-string v0, "{rawJsonUrl || 'https://pastebin.com/raw/Sharechat_ns_098'}"
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic pt-0.5">
                    💡 <strong>Tip:</strong> If you enter your link in the "Pastebin / GitHub Raw Link" box above, it will be automatically injected into your downloaded ZIP's Smali file!
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'online-welcome' ? (
          <>
            {/* Welcome message title */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider">
                Welcome Title
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-full px-6 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors">
                <input 
                  type="text" 
                  value={config.title || "Welcome Modder!"}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Welcome Modder!"
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300"
                />
              </div>
            </div>

            {/* Welcome message body */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider">
                Welcome Body Message
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-full px-6 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors">
                <input 
                  type="text" 
                  value={config.message}
                  onChange={(e) => setConfig(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Thanks for using our premium mod. Join Telegram to support the coder."
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300"
                />
              </div>
            </div>

            {/* Author Credit Name */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider">
                Author Credit/Name
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-full px-6 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors">
                <input 
                  type="text" 
                  value={config.negativeText}
                  onChange={(e) => setConfig(prev => ({ ...prev, negativeText: e.target.value }))}
                  placeholder="NSMods (Sharechat_ns_098)"
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300"
                />
              </div>
            </div>

            {/* Telegram channel link */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider">
                Telegram Link
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-full px-6 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors">
                <input 
                  type="text" 
                  value={config.positiveBtnLink}
                  onChange={(e) => setConfig(prev => ({ ...prev, positiveBtnLink: e.target.value }))}
                  placeholder="https://t.me/Sharechat_ns_098"
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300 font-mono"
                />
              </div>
            </div>

            {/* Join Telegram button text */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider">
                Join Telegram Button Text
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-full px-6 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors">
                <input 
                  type="text" 
                  value={config.positiveText}
                  onChange={(e) => setConfig(prev => ({ ...prev, positiveText: e.target.value }))}
                  placeholder="JOIN TELEGRAM"
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Professional Message Quick Presets */}
            <div className="w-full space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider pl-2 flex items-center justify-between">
                <span>Select Quick Message Presets</span>
                <span className="text-[10px] text-indigo-600 font-semibold">Pro Templates</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '🔥 New Update v5.2', text: '🔥 New Update v5.2 is Live! Upgrade now to get anti-ban bypass & VIP features.' },
                  { label: '⚡ NSMods Pro Access', text: '⚡ Welcome to NSMods Pro! Access all premium injectors and floating tools.' },
                  { label: '📢 Notice & Maintenance', text: '📢 Important Notice: Server maintenance completed successfully.' },
                  { label: '🎉 Join Telegram VIP', text: '🎉 Join our official Telegram channel @Sharechat_ns_098 for free codes!' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, message: preset.text }))}
                    className="p-2.5 text-left bg-white border border-slate-200 hover:border-indigo-500 rounded-xl text-[10px] font-bold text-slate-700 hover:text-indigo-600 shadow-xs transition-all cursor-pointer leading-tight"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SET MESSAGE */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider flex items-center justify-between w-full pr-2">
                <span>SET MESSAGE</span>
                <span className="text-[10px] text-indigo-600 font-normal">NSMods Pro</span>
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-2xl px-5 py-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors flex items-center gap-2">
                <input 
                  type="text" 
                  value={config.message}
                  onChange={(e) => setConfig(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="🔥 Welcome to NSMods Pro! Join @Sharechat_ns_098 for updates."
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300"
                />
              </div>
            </div>

            {/* SET TELEGRAM BUTTON TEXT */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider">
                SET POSITIVE BUTTON (TELEGRAM)
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-full px-6 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors">
                <input 
                  type="text" 
                  value={config.positiveText}
                  onChange={(e) => setConfig(prev => ({ ...prev, positiveText: e.target.value }))}
                  placeholder="TELEGRAM"
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300 uppercase"
                />
              </div>
            </div>

            {/* SET CANCEL BUTTON TEXT */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider">
                SET NEGATIVE BUTTON (CLOSE)
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-full px-6 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors">
                <input 
                  type="text" 
                  value={config.negativeText}
                  onChange={(e) => setConfig(prev => ({ ...prev, negativeText: e.target.value }))}
                  placeholder="CLOSE"
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300 uppercase"
                />
              </div>
            </div>

            {/* YOUR TELEGRAM LINK */}
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-xs font-extrabold text-[#007D54] pl-5 uppercase tracking-wider">
                TELEGRAM CHANNEL LINK
              </label>
              <div className="w-full bg-[#EEF1F6] border border-[#D2D9E3] rounded-full px-6 py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-emerald-500/50 transition-colors">
                <input 
                  type="text" 
                  value={config.positiveBtnLink}
                  onChange={(e) => setConfig(prev => ({ ...prev, positiveBtnLink: e.target.value }))}
                  placeholder="https://t.me/Sharechat_ns_098"
                  className="w-full bg-transparent border-none outline-none text-[#FF3B30] font-black text-sm placeholder:text-red-300 font-mono"
                />
              </div>
            </div>
          </>
        )}

        {/* Floating/Bottom Action Bar for compiling/exporting */}
        <div className="pt-4 flex flex-col items-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-widest rounded-full shadow-lg flex items-center justify-center gap-2 uppercase cursor-pointer active:scale-95 transition-all shadow-emerald-600/10"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Compiling ({genProgress}%)
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-bounce" />
                <span>COMPILE DIALOG PACKAGE (.ZIP)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ==================== MODAL: GO TO GALLERY ==================== */}
      <AnimatePresence>
        {showGallery && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-slate-900 border border-slate-800 rounded-t-[32px] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Character Wallpaper</h3>
                    <p className="text-[10px] text-slate-500">Pick an elegant modding image or upload your own</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGallery(false)}
                  className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Grid content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 grid grid-cols-2 gap-3.5 scrollbar-thin">
                {/* Upload Custom Card option */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="col-span-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-2xl cursor-pointer transition-all gap-1.5"
                >
                  <Upload className="w-6 h-6 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Upload Custom Device Photo</span>
                  <span className="text-[9px] text-slate-500 font-medium">Supports PNG, JPG, JPEG, WEBP formats</span>
                </div>

                {GALLERY_WALLPAPERS.map((wp, idx) => (
                  <div 
                    key={idx}
                    onClick={() => selectPresetImage(wp.url)}
                    className="group relative h-28 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all shadow-md flex flex-col justify-end"
                  >
                    <img 
                      src={wp.url} 
                      alt={wp.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
                    
                    {bannerUrl === wp.url && (
                      <div className="absolute top-2 right-2 p-1 bg-indigo-500 rounded-full text-white shadow-lg">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    
                    <span className="relative z-10 p-2 text-[9px] font-bold text-white truncate w-full tracking-wide">
                      {wp.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL: FONT PICKER ==================== */}
      <AnimatePresence>
        {showFontPicker && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-slate-900 border border-slate-800 rounded-t-[32px] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg">
                    <FontIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Premium Typography</h3>
                    <p className="text-[10px] text-slate-500">Pick a font for the dialogue text</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFontPicker(false)}
                  className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* List */}
              <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin">
                {FONTS_LIST.map((font) => (
                  <div 
                    key={font.id}
                    onClick={() => selectFont(font.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      config.titleFont === font.id 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/5' 
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider font-mono">Font ID: {font.id}</span>
                      <p className={`text-sm font-extrabold ${font.class}`}>
                        {font.name}
                      </p>
                      <p className={`text-[11px] text-slate-400 leading-none mt-1 ${font.class}`}>
                        Follow our Telegram channel 📲
                      </p>
                    </div>

                    {config.titleFont === font.id && (
                      <div className="p-1.5 bg-indigo-500 rounded-full text-white shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL: HOW TO ATTACH TO YOUR APP (INTEGRATION TUTORIAL) ==================== */}
      <AnimatePresence>
        {showIntegrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl text-left text-white max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-pink-500 text-white rounded-xl shadow-lg">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      App Attachment & Integration Guide
                      <span className="text-[9px] py-0.5 px-2 bg-indigo-500/20 text-indigo-300 font-mono rounded-full">FULL TUTORIAL</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">How to integrate this dialog and floating button into your Android app or website</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIntegrationModal(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
                {[
                  { id: 'sketchware', label: '🛠️ Sketchware Pro', sub: 'Block / Source Code' },
                  { id: 'android', label: '📱 Android Studio', sub: 'Java / Overlay Service' },
                  { id: 'web', label: '🌐 Web / React', sub: 'HTML & JS Component' },
                  { id: 'json', label: '📄 Raw JSON', sub: 'Firebase / Remote URL' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setIntegrationTab(tab.id as any);
                      setCopiedCode(false);
                    }}
                    className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center flex-1 min-w-[110px] cursor-pointer ${
                      integrationTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[9px] opacity-70 font-mono">{tab.sub}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content Body */}
              <div className="p-5 overflow-y-auto scrollbar-thin space-y-4 max-h-[60vh]">
                {integrationTab === 'sketchware' && (
                  <div className="space-y-4 text-xs text-slate-300">
                    <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-2xl space-y-1">
                      <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        Sketchware Pro - How to Integrate (Step-by-Step)
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed pt-1">
                        <li>Open the Sketchware app and open your project.</li>
                        <li>Go to the <b>OnCreate</b> event or any button's <b>OnClick</b> block.</li>
                        <li>From the <b>Operator</b> tab, drag the <code>Add Source Directly</code> block.</li>
                        <li>Paste the Java code into the block and save!</li>
                      </ol>
                    </div>

                    <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                        <span>Sketchware_CustomDialog.java</span>
                        <button
                          type="button"
                          onClick={() => {
                            const code = `// Sketchware Custom Dialog & Floating Trigger Code
AlertDialog.Builder builder = new AlertDialog.Builder(this);
View dialogView = getLayoutInflater().inflate(R.layout.custom_dialog, null);
builder.setView(dialogView);
AlertDialog dialog = builder.create();
dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));

// Trigger Button OnClick
findViewById(R.id.btn_open_dialog).setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        dialog.show();
    }
});`;
                            navigator.clipboard.writeText(code);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-1 transition-all"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? "COPIED!" : "COPY CODE"}</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap">{`// Sketchware Custom Dialog & Floating Trigger Code
AlertDialog.Builder builder = new AlertDialog.Builder(this);
View dialogView = getLayoutInflater().inflate(R.layout.custom_dialog, null);
builder.setView(dialogView);
AlertDialog dialog = builder.create();
dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));

// Trigger Button OnClick
findViewById(R.id.btn_open_dialog).setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        dialog.show();
    }
});`}</pre>
                    </div>
                  </div>
                )}

                {integrationTab === 'android' && (
                  <div className="space-y-4 text-xs text-slate-300">
                    <div className="bg-purple-950/40 border border-purple-500/30 p-3.5 rounded-2xl space-y-1">
                      <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-pink-400" />
                        Android Studio - System Floating Window Service
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        This service displays a floating button widget on top of any game or app screen. Tapping it pops up the customized dialog!
                      </p>
                    </div>

                    <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[10px] text-cyan-300 overflow-x-auto">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                        <span>FloatingWindowService.java</span>
                        <button
                          type="button"
                          onClick={() => {
                            const code = `package com.app.dialog;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;

public class FloatingWindowService extends Service {
    private WindowManager windowManager;
    private View floatingView;

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onCreate() {
        super.onCreate();
        floatingView = LayoutInflater.from(this).inflate(R.layout.layout_floating_widget, null);

        int layoutType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O 
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY 
            : WindowManager.LayoutParams.TYPE_PHONE;

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.BOTTOM | Gravity.END;
        params.x = 30;
        params.y = 100;

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        windowManager.addView(floatingView, params);

        floatingView.setOnClickListener(v -> {
            // Open Dialog Code Here
        });
    }
}`;
                            navigator.clipboard.writeText(code);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold flex items-center gap-1 transition-all"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? "COPIED!" : "COPY JAVA SERVICE"}</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap">{`package com.app.dialog;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;

public class FloatingWindowService extends Service {
    private WindowManager windowManager;
    private View floatingView;

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onCreate() {
        super.onCreate();
        floatingView = LayoutInflater.from(this).inflate(R.layout.layout_floating_widget, null);

        int layoutType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O 
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY 
            : WindowManager.LayoutParams.TYPE_PHONE;

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.BOTTOM | Gravity.END;
        params.x = 30;
        params.y = 100;

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        windowManager.addView(floatingView, params);

        floatingView.setOnClickListener(v -> {
            // Open Dialog Code
        });
    }
}`}</pre>
                    </div>
                  </div>
                )}

                {integrationTab === 'web' && (
                  <div className="space-y-4 text-xs text-slate-300">
                    <div className="bg-cyan-950/40 border border-cyan-500/30 p-3.5 rounded-2xl space-y-1">
                      <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        HTML / JS / React Floating Button Widget
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Embed this custom HTML/JS snippet directly inside your website or Android WebView's <code>index.html</code> file.
                      </p>
                    </div>

                    <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[10px] text-amber-300 overflow-x-auto">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                        <span>web_floating_dialog.html</span>
                        <button
                          type="button"
                          onClick={() => {
                            const code = `<!-- Floating Button Trigger -->
<div id="floatingBtn" onclick="toggleCustomDialog()" style="position:fixed;bottom:24px;right:24px;z-index:999;background:linear-gradient(135deg,#00FF66,#00E5FF);padding:12px 20px;border-radius:50px;color:#000;font-weight:900;cursor:pointer;box-shadow:0 10px 30px rgba(0,255,102,0.4);">
  ✨ ${config.floatingButtonText || "OPEN DIALOG"}
</div>

<!-- Modal Container -->
<div id="customDialogModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:1000;align-items:center;justify-content:center;">
  <div style="background:${config.dialogBgColor};padding:24px;border-radius:${config.dialogCornerRadius}px;width:300px;text-align:center;color:#fff;">
    <h3 style="color:${config.titleColor}">${config.title}</h3>
    <p style="color:${config.messageColor}">${config.message}</p>
    <button onclick="toggleCustomDialog()" style="background:${config.positiveBtnColor};color:#fff;padding:10px 20px;border:0;border-radius:12px;font-weight:bold;cursor:pointer;margin-top:12px;">
      ${config.positiveText}
    </button>
  </div>
</div>

<script>
function toggleCustomDialog() {
  var modal = document.getElementById('customDialogModal');
  modal.style.display = (modal.style.display === 'none' || !modal.style.display) ? 'flex' : 'none';
}
</script>`;
                            navigator.clipboard.writeText(code);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-1 transition-all"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? "COPIED!" : "COPY HTML CODE"}</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap">{`<!-- Floating Button Trigger -->
<div id="floatingBtn" onclick="toggleCustomDialog()" style="position:fixed;bottom:24px;right:24px;z-index:999;background:linear-gradient(135deg,#00FF66,#00E5FF);padding:12px 20px;border-radius:50px;color:#000;font-weight:900;cursor:pointer;box-shadow:0 10px 30px rgba(0,255,102,0.4);">
  ✨ ${config.floatingButtonText || "OPEN DIALOG"}
</div>

<!-- Modal Container -->
<div id="customDialogModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:1000;align-items:center;justify-content:center;">
  <div style="background:${config.dialogBgColor};padding:24px;border-radius:${config.dialogCornerRadius}px;width:300px;text-align:center;color:#fff;">
    <h3 style="color:${config.titleColor}">${config.title}</h3>
    <p style="color:${config.messageColor}">${config.message}</p>
    <button onclick="toggleCustomDialog()" style="background:${config.positiveBtnColor};color:#fff;padding:10px 20px;border:0;border-radius:12px;font-weight:bold;cursor:pointer;margin-top:12px;">
      ${config.positiveText}
    </button>
  </div>
</div>

<script>
function toggleCustomDialog() {
  var modal = document.getElementById('customDialogModal');
  modal.style.display = (modal.style.display === 'none' || !modal.style.display) ? 'flex' : 'none';
}
</script>`}</pre>
                    </div>
                  </div>
                )}

                {integrationTab === 'json' && (
                  <div className="space-y-4 text-xs text-slate-300">
                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl space-y-1">
                      <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <FileJson className="w-4 h-4 text-emerald-400" />
                        Current Dialog Configuration Payload (.JSON)
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Host this JSON payload on Firebase Remote Config, Pastebin, or your server to update dialog content dynamically over the air.
                      </p>
                    </div>

                    <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                        <span>dialog_config.json</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 transition-all"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? "COPIED!" : "COPY JSON"}</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap">{JSON.stringify(config, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
