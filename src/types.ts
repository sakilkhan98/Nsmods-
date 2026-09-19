/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DialogConfig {
  title: string;
  message: string;
  negativeText: string;
  positiveText: string;
  titleColor: string;
  messageColor: string;
  negativeBtnColor: string;
  positiveBtnColor: string;
  dialogBgColor: string;
  positiveBtnLink: string;
  iconType: 'ghost' | 'avatar' | 'bell' | 'gift' | 'warning' | 'custom';
  customIconUrl?: string;
  iconSize: number;
  iconStroke: number;
  dialogCornerRadius: number;
  buttonsCornerRadius: number;
  titleSize: number;
  messageSize: number;
  buttonsSize: number;
  showTime: boolean;
  alwaysShow: boolean;
  // V2 Specifics (Picture Dialog)
  headerBgColor?: string;
  positiveBtnTextColor?: string;
  negativeBtnTextColor?: string;
  // V3 Specifics
  ghostColor?: string;
  enableCloseBtn?: boolean;
  // Premium Features
  bannerImageUrl?: string;
  dialogBgImage?: string;
  borderColor?: string;
  borderWidth?: number;
  glowEffect?: boolean;
  dialogAnimation?: 'fade' | 'zoom' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'bounce' | 'scale' | 'rotate';
  titleFont?: 'sans' | 'mono' | 'space' | 'playfair' | 'outfit' | 'ubuntu';
  messageFont?: 'sans' | 'mono' | 'space' | 'playfair' | 'outfit' | 'ubuntu';
  soundEffect?: 'none' | 'beep' | 'laser' | 'bell' | 'retro' | 'chime';
  lightingEffect?: 'none' | 'glint' | 'rgb-flow' | 'neon-pulse' | 'glassmorphism' | 'gradient-border' | 'cyber-matrix' | 'golden-aura' | 'breath-pulse';
  themeAnimation?: 'none' | 'neon-pulse' | 'rgb-flow' | 'cyber-matrix' | 'golden-aura' | 'glass-float' | 'breath';
  lightingColor?: string;
  sideAccentColor?: string;
  messageBorderColor?: string;
  dialogStateOpen?: boolean;
  // Floating Window & Trigger Button Controls
  enableFloatingButton?: boolean;
  floatingButtonPos?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  floatingButtonAnim?: 'pulse' | 'bounce' | 'glow' | 'spin';
  floatingButtonIcon?: 'sparkles' | 'send' | 'gamepad' | 'bell' | 'gift' | 'heart';
  floatingButtonText?: string;
  // Font Styles & Typography
  titleStyle?: 'normal' | 'uppercase' | 'bold' | 'glow';
  messageStyle?: 'normal' | 'uppercase' | 'bold' | 'glow';
  letterSpacing?: 'compact' | 'normal' | 'wide';
  fontFamily?: string;
  titleFontWeight?: string;
  messageFontWeight?: string;
  titleFontSize?: number;
  messageFontSize?: number;
  textAlign?: 'center' | 'left';
  dialogVersion?: 'v1' | 'v2' | 'v3' | 'v4' | 'v5';
  // Extended Features
  imageStyle?: 'banner' | 'circle' | 'square' | 'gif' | 'lottie';
  stylePreset?: 'standard' | 'ios-alert' | 'ios-actionsheet' | 'material3' | 'bottom-sheet' | 'fullscreen' | 'glassmorphism' | 'edge-to-edge';
  buttonCount?: 1 | 2 | 3;
  thirdBtnText?: string;
  thirdBtnLink?: string;
  dialogType?: 'welcome' | 'update' | 'force-update' | 'maintenance' | 'exit' | 'error' | 'success' | 'warning' | 'loading' | 'progress' | 'permission' | 'login' | 'custom';
}

export interface OnlineUpdateConfig {
  title: string;
  message: string;
  updateLink: string;
  versionCode: string;
  forceUpdate: boolean;
  dialogBgColor: string;
  btnColor: string;
  btnTextColor: string;
  titleColor: string;
  messageColor: string;
}

export interface WelcomeOnlineConfig {
  title: string;
  message: string;
  telegramLink: string;
  authorName: string;
  dialogBgColor: string;
  titleColor: string;
  messageColor: string;
  authorColor: string;
  btnText: string;
  cancelBtnText: string;
}

export interface FloatingConfig {
  title: string;
  iconUrl: string;
  iconBgColor: string;
  iconSize: number;
  dialogBgColor: string;
  titleColor: string;
  textColor: string;
  accentColor: string;
  directLink: string;
  ludoLink: string;
  voiceLink: string;
  telegramLink: string;
  neonEffect: boolean;
  features: { name: string; enabled: boolean }[];
}

export type ActiveTab = 
  | 'home'
  | 'dialog-v1-ios'
  | 'dialog-v2-picture'
  | 'dialog-v3-modern'
  | 'dialog-v4-cyber'
  | 'dialog-v5-bottomsheet'
  | 'custom-dialog-v1' 
  | 'custom-dialog-v2' 
  | 'custom-dialog-v3' 
  | 'custom-dialog-v4' 
  | 'online-simple' 
  | 'online-update' 
  | 'online-welcome'
  | 'online-floating'
  | 'smali2dex'
  | 'smali-codegen'
  | 'base64'
  | 'ascii-hex'
  | 'tutorials'
  | 'toast-java-base64'
  | 'toast-java'
  | 'toast-smali-base64'
  | 'toast-smali'
  | 'toast-color'
  | 'check-xposed'
  | 'regex-lib'
  | 'library-regex-smali'
  | 'encrypt-decrypt'
  | 'base-converter'
  | 'save-codety'
  | 'to-millis'
  | 'about'
  | 'terms'
  | 'contact';

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  size?: string;
  children?: FileItem[];
}
