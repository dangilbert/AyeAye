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
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: ["./plugins/withAnimatedWebPSupport"],
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV
        ? "eu.dangilbert.ayeaye.dev"
        : "eu.dangilbert.ayeaye",
    },
    android: {
      package: IS_DEV ? "eu.dangilbert.ayeaye.dev" : "eu.dangilbert.ayeaye",
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
