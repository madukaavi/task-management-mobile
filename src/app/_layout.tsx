
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#101828",
          },
          headerTintColor: "#ffffff",
          contentStyle: {
            backgroundColor: "#f3f6fc",
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Login",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="register"
          options={{
            title: "Create Account",
          }}
        />

        <Stack.Screen
          name="dashboard"
          options={{
            title: "My Tasks",
          }}
        />
      </Stack>

      <Toast />
    </>
  );
}
