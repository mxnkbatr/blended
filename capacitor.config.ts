import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "mn.achira.app",
  appName: "Achira",
  webDir: "out",
  server: {
    androidScheme: "https",
    iosScheme: "https",
  },
  // FCM requires GoogleService-Info.plist on iOS. Exclude it until Firebase iOS
  // app is registered and the plist is added under ios/App/App/.
  ios: {
    includePlugins: [
      "@capacitor/app",
      "@capacitor/haptics",
      "@capacitor/push-notifications",
      "@capacitor/splash-screen",
      "@capacitor/status-bar",
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#f4efe6",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#f4efe6",
    },
  },
};

export default config;
