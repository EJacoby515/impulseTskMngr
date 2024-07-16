export default {
    expo: {
      name: "TskMngr",
      slug: "task-manager",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.yourcompany.taskmanager"
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: "com.yourcompany.taskmanager"
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      extra: {
        firebase: {
          apiKey: process.env.API_KEY,
          authDomain: process.env.AUTH_DOMAIN,
          projectId: process.env.PROJECT_ID,
          storageBucket: process.env.STORAGE_BUCKET,
          messagingSenderId: process.env.MESSAGING_SENDER_ID,
          appId: process.env.APP_ID,
          measurementId: process.env.MEASUREMENT_ID,
        },
        eas: {
          projectId: ""
        }
      },
      plugins: [
        [
          "expo-build-properties",
          {
            ios: {
              useFrameworks: "static"
            }
          }
        ]
      ]
    }
  };