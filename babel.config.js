module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          cwd: "packagejson",
          extensions: [".ts", ".tsx", ".js", ".ios.js", ".android.js"],
          root: ["./src"],
          alias: {
            "@rn-app": "./src",
            "@pages": "./src/pages",
            "~": "./",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
