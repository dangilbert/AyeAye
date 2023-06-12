import { ThemedText } from "@rn-app/components";
import { setLemmyInstance, useLemmyHttp } from "@rn-app/pods/host/useLemmyHttp";
import { LemmyHttp } from "lemmy-js-client";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Snackbar from "react-native-snackbar";

export const LoginScreen = () => {
  const [serverName, setServerName] = useState("lemmy.dangilbert.eu");
  const [username, setUsername] = useState("perketel");
  const [password, setPassword] = useState("AC@wjYD!4__VMebY");
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isDisabled =
      serverName.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "";
    setIsLoginDisabled(isDisabled);
  }, [serverName, username, password]);

  //   const showLoginError = () => {
  //     Snackbar.show({
  //       text: "Login failed",
  //     });
  //   };

  const handleLogin = async () => {
    setIsLoading(true);
    let serverUrl;
    try {
      if (
        serverName.startsWith("http://") ||
        serverName.startsWith("https://")
      ) {
        serverUrl = new URL(serverName).toString();
      } else {
        serverUrl = new URL(`https://${serverName}`).toString();
      }

      serverUrl = serverUrl.endsWith("/") ? serverUrl.slice(0, -1) : serverUrl;
      const lemmyClient = new LemmyHttp(serverUrl);

      const res = await lemmyClient.login({
        username_or_email: username,
        password,
      });
      if (!res.jwt) {
        // showLoginError();
        console.log("Login failed");
        return;
      }
      setLemmyInstance(serverUrl.toString(), res.jwt);
    } catch (error) {
      //   showLoginError();
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log("Forgot password button pressed");
  };

  useEffect(() => {});

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="lemmy.ml"
        value={serverName}
        placeholderTextColor={"gray"}
        onChangeText={setServerName}
        inputMode="url"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={"gray"}
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={"gray"}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} disabled={isLoginDisabled} />
      <TouchableOpacity onPress={handleForgotPassword}>
        <ThemedText variant={"link"}>Forgot Password?</ThemedText>
      </TouchableOpacity>
      <Modal transparent={true} visible={isLoading}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: "gray",
  },
  forgotPasswordText: {
    color: "blue",
    textAlign: "center",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
