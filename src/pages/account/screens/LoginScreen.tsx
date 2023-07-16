import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@rn-app/components";
import { useQueryClient } from "@tanstack/react-query";
import { LemmyHttp } from "lemmy-js-client";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Snackbar from "react-native-snackbar";
import { saveAccount, setActiveLemmySession } from "../hooks/useAccount";

export const LoginScreen = () => {
  const [serverName, setServerName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const isDisabled =
      serverName.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "";
    setIsLoginDisabled(isDisabled);
  }, [serverName, username, password]);

  const showLoginError = () => {
    Snackbar.show({
      text: "Login failed",
    });
  };

  const handleLoginSuccess = () => {
    Snackbar.show({
      text: "Login successful",
    });

    navigator.goBack();
  };

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
        showLoginError();
        return;
      }

      const person = await lemmyClient.getPersonDetails({
        auth: res.jwt,
        username: username,
      });

      saveAccount({
        id: person.person_view.person.id,
        username: username,
        jwt: res.jwt,
        instance: serverUrl,
        actorId: person.person_view.person.actor_id,
      });

      setActiveLemmySession(person.person_view.person.actor_id);

      // Invalidate all the queries after account switch
      queryClient.invalidateQueries();

      handleLoginSuccess();
    } catch (error) {
      showLoginError();
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
    <ScrollView keyboardShouldPersistTaps="handled">
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
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={isLoginDisabled}
        />
        <TouchableOpacity onPress={handleForgotPassword}>
          <ThemedText variant={"link"}>Forgot Password?</ThemedText>
        </TouchableOpacity>
        <Modal transparent={true} visible={isLoading}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="gray" />
          </View>
        </Modal>
      </View>
    </ScrollView>
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
