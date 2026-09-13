import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { App as CapacitorApp } from '@capacitor/app';

export const initCapacitor = async () => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // 1. Status Bar: Make it transparent and overlay the webview
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setOverlaysWebView({ overlay: true });
    }
    // Set text style depending on theme (can be updated dynamically when theme changes)
    await StatusBar.setStyle({ style: Style.Dark }); // or Style.Light depending on background

    // 2. Keyboard: Prevent the webview from being squished when keyboard opens
    if (Capacitor.getPlatform() === 'android') {
      await Keyboard.setResizeMode({ mode: KeyboardResize.None });
    }

    // 3. App: Listen for back button to handle hardware back natively
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });

    // 4. Hide splash screen once initialized
    await SplashScreen.hide();
  } catch (error) {
    console.warn('Capacitor initialization error:', error);
  }
};
