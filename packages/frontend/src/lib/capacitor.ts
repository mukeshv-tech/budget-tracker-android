import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { App as CapacitorApp } from '@capacitor/app';

export const initCapacitor = async () => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  // 1. Status Bar: Make it transparent and overlay the webview
  if (Capacitor.getPlatform() === 'android') {
    try {
      await StatusBar.setOverlaysWebView({ overlay: true });
    } catch (e) {
      console.warn('Capacitor StatusBar.setOverlaysWebView error:', e);
    }
  }

  // Set text style depending on theme (can be updated dynamically when theme changes)
  try {
    await StatusBar.setStyle({ style: Style.Dark }); // or Style.Light depending on background
  } catch (e) {
    console.warn('Capacitor StatusBar.setStyle error:', e);
  }

  // 2. Keyboard: Prevent the webview from being squished when keyboard opens
  if (Capacitor.getPlatform() === 'android') {
    try {
      await Keyboard.setResizeMode({ mode: KeyboardResize.None });
    } catch (e) {
      console.warn('Capacitor Keyboard.setResizeMode error:', e);
    }
  }

  // 3. App: Listen for back button to handle hardware back natively
  try {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
  } catch (e) {
    console.warn('Capacitor App.addListener error:', e);
  }

  // 4. Hide splash screen once initialized
  try {
    await SplashScreen.hide();
  } catch (error) {
    console.warn('Capacitor SplashScreen.hide error:', error);
  }
};
