/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AdminSettings {
  userPassword: string;
  adminPassword: string;
  isAppLocked: boolean;
  maintenanceMessage: string;
}

const STORAGE_KEYS = {
  USER_PASS: 'nsmods_user_password',
  ADMIN_PASS: 'nsmods_admin_password',
  APP_LOCKED: 'nsmods_app_locked_state',
  MAINTENANCE_MSG: 'nsmods_maintenance_message'
};

const DEFAULT_SETTINGS: AdminSettings = {
  userPassword: 'nsmods',
  adminPassword: 'admin',
  isAppLocked: false,
  maintenanceMessage: 'The application is currently locked for maintenance by the administrator. Please check back shortly.'
};

export const getAdminSettings = (): AdminSettings => {
  try {
    const pass = localStorage.getItem(STORAGE_KEYS.USER_PASS) || DEFAULT_SETTINGS.userPassword;
    const adminPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || DEFAULT_SETTINGS.adminPassword;
    const locked = localStorage.getItem(STORAGE_KEYS.APP_LOCKED) === 'true';
    const msg = localStorage.getItem(STORAGE_KEYS.MAINTENANCE_MSG) || DEFAULT_SETTINGS.maintenanceMessage;
    return {
      userPassword: pass,
      adminPassword: adminPass,
      isAppLocked: locked,
      maintenanceMessage: msg
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const ADMIN_SYNC_EVENT = 'nsmods_admin_sync';

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('nsmods_admin_channel');
  }
} catch (e) {
  // BroadcastChannel fallback
}

const notifyChange = (settings: AdminSettings) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ADMIN_SYNC_EVENT, { detail: settings }));
    try {
      broadcastChannel?.postMessage(settings);
    } catch {
      // ignore
    }
  }
};

export const subscribeAdminSettings = (callback: (settings: AdminSettings) => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e: Event) => {
    const cust = e as CustomEvent<AdminSettings>;
    if (cust.detail) {
      callback(cust.detail);
    } else {
      callback(getAdminSettings());
    }
  };

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data) {
      callback(e.data);
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
      callback(getAdminSettings());
    }
  };

  window.addEventListener(ADMIN_SYNC_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener(ADMIN_SYNC_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
};

export const saveAdminSettings = (settings: Partial<AdminSettings>): AdminSettings => {
  try {
    if (settings.userPassword !== undefined) {
      localStorage.setItem(STORAGE_KEYS.USER_PASS, settings.userPassword.trim());
    }
    if (settings.adminPassword !== undefined) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, settings.adminPassword.trim());
    }
    if (settings.isAppLocked !== undefined) {
      localStorage.setItem(STORAGE_KEYS.APP_LOCKED, settings.isAppLocked ? 'true' : 'false');
    }
    if (settings.maintenanceMessage !== undefined) {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE_MSG, settings.maintenanceMessage.trim());
    }
  } catch (err) {
    console.error('Failed to persist admin settings:', err);
  }
  const updated = getAdminSettings();
  notifyChange(updated);
  return updated;
};

export const resetAdminSettings = (): AdminSettings => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PASS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PASS);
    localStorage.removeItem(STORAGE_KEYS.APP_LOCKED);
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE_MSG);
  } catch (err) {
    console.error('Failed to reset admin settings:', err);
  }
  const def = DEFAULT_SETTINGS;
  notifyChange(def);
  return def;
};
