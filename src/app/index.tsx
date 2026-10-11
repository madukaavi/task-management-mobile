
import { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

import api from "../api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // Check whether the user is already logged in
  useEffect(() => {
    let active = true;

    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (!active) return;

        if (token) {
          try {
            await api.get("/tasks?page=1&limit=1");

            if (active) {
              router.replace("/dashboard");
              return;
            }
          } catch (error: any) {
            if (!active) return;

            if (error.response?.status === 401) {
              await SecureStore.deleteItemAsync("token");
            } else {
              Toast.show({
                type: "error",
                text1: "Connection Error",
                text2: "Please check your backend connection.",
              });
            }
          }
        }
      } catch {
        // Keep the login screen visible if storage fails.
      } finally {
        if (active) {
          setCheckingToken(false);
        }
      }
    };

    checkToken();

    return () => {
      active = false;
    };
  }, []);

  // Login function
  const handleLogin = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your email and password.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: cleanEmail,
        password,
      });

      const token = response.data?.token;

      if (typeof token !== "string" || !token) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "The server did not return a token.",
        });
        return;
      }

      await SecureStore.setItemAsync("token", token);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });

      router.replace("/dashboard");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2:
          error.response?.data?.message ??
          "Please check your email and password.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading screen while checking saved token
  if (checkingToken) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#2563eb" />

        <Text style={styles.loadingText}>
          Checking your session...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>T</Text>
          </View>

          <Text style={styles.title}>Welcome Back!</Text>

          <Text style={styles.subtitle}>
            Login to manage your daily tasks.
          </Text>

          <Text style={styles.label}>Email Address</Text>

          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#98a2b3"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#98a2b3"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />

          <Pressable
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
            </Text>

            <Link href="/register" style={styles.link}>
              Register
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f6fc",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eaecf0",
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  logoText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#101828",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#101828",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 26,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    flexWrap: "wrap",
  },

  footerText: {
    color: "#667085",
  },

  link: {
    color: "#2563eb",
    fontWeight: "bold",
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#f3f6fc",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#667085",
    marginTop: 12,
  },
});
