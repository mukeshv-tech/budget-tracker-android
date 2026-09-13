import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moneymatter.app',
  appName: 'MoneyMatter a budget tracker ',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f7f6f4', // Matches CSS --background in light mode
      showSpinner: false,
      androidSplashResourceName: 'splash'
    },
    Keyboard: {
      resize: 'none'
    }
  }
};

export default config;
