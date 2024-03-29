const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  expo: {
    name: IS_DEV ? "AyeAye (Dev)" : "AyeAye",
    slug: "ayeaye",
    version: "0.0.1",
    runtimeVersion: "1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    plugins: [
      ["./plugins/withAnimatedWebPSupport"],
      ["./plugins/withFastImageWebPSupportIOS.js"],
      ["./plugins/withFastImageWebPSupportAndroid.js"],
      [
        "expo-build-properties",
        {
          ios: {
            flipper: true,
          },
        },
      ],
    ],
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV
        ? "eu.dangilbert.ayeaye.dev"
        : "eu.dangilbert.ayeaye",
      splash: {
        image: "./assets/splash-light.png",
        resizeMode: "cover",
        backgroundColor: "#ffffff",
        dark: {
          image: "./assets/splash-dark.png",
          resizeMode: "cover",
          backgroundColor: "#1d2433",
        },
      },
    },
    android: {
      package: IS_DEV ? "eu.dangilbert.ayeaye.dev" : "eu.dangilbert.ayeaye",
      splash: {
        image: "./assets/splash-light.png",
        resizeMode: "cover",
        backgroundColor: "#ffffff",
        dark: {
          image: "./assets/splash-dark.png",
          resizeMode: "cover",
          backgroundColor: "#1d2433",
        },
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon-foreground.png",
        backgroundColor: "#1d2433",
      },
    },
    extra: {
      eas: {
        projectId: "5abd0b3c-4752-4ae7-bf66-bfa58530a529",
      },
    },
    owner: "perketel",
    runtimeVersion: {
      policy: "sdkVersion",
    },
    updates: {
      url: "https://u.expo.dev/5abd0b3c-4752-4ae7-bf66-bfa58530a529",
    },
  },
};
