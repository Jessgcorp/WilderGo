import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import { useAuth } from "@/contexts/AuthContext";

export type AppleSignInButtonProps = {
  onSuccess?: (result: {
    identityToken: string;
    authorizationCode: string | null;
    email: string | null;
    fullName: string | null;
    user: string;
  }) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppleSignInButton({
  onSuccess,
  onError,
  disabled = false,
  style,
}: AppleSignInButtonProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { signInWithApple } = useAuth();

  const handleApplePress = async () => {
    if (disabled || isSigningIn) {
      return;
    }

    if (!appleAuth.isSupported || Platform.OS !== "ios") {
      const message = "Sign in with Apple is not available on this device.";
      onError?.(message);
      Alert.alert("Apple Sign-In unavailable", message);
      return;
    }

    setIsSigningIn(true);

    try {
      const response = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const identityToken = response.identityToken;
      if (!identityToken) {
        const message = "Apple did not return an identity token.";
        onError?.(message);
        Alert.alert("Apple Sign-In failed", message);
        return;
      }

      const fullName = response.fullName
        ? [response.fullName.givenName, response.fullName.familyName]
            .filter(Boolean)
            .join(" ")
        : null;

      const loginResult = await signInWithApple({
        identityToken,
        authorizationCode: response.authorizationCode,
        email: response.email,
        fullName,
        appleUserId: response.user,
      });

      if (!loginResult.success) {
        const message =
          loginResult.message ||
          "Unable to complete Apple sign-in. Please try again.";
        onError?.(message);
        Alert.alert("Apple Sign-In failed", message);
        return;
      }

      onSuccess?.({
        identityToken,
        authorizationCode: response.authorizationCode,
        email: response.email,
        fullName,
        user: response.user,
      });
    } catch (error: any) {
      const isCanceled =
        error?.code === appleAuth.Error.CANCELED ||
        String(error?.message).toLowerCase().includes("cancel");

      if (isCanceled) {
        const message = "Apple sign-in was canceled.";
        onError?.(message);
        console.log("[AppleSignInButton] cancelled by user");
      } else {
        const message =
          error?.message || "Unable to sign in with Apple. Please try again.";
        onError?.(message);
        Alert.alert("Apple Sign-In error", message);
        console.warn("[AppleSignInButton] error", error);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  if (!appleAuth.isSupported || Platform.OS !== "ios") {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Text style={styles.fallbackText}>
          Apple Sign-In is not supported on this device.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <AppleButton
        buttonType={AppleButton.Type.SIGN_IN}
        buttonStyle={AppleButton.Style.BLACK}
        cornerRadius={12}
        style={styles.appleButton}
        onPress={handleApplePress}
      />
      {isSigningIn ? (
        <ActivityIndicator size="small" color="white" style={styles.loading} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  appleButton: {
    width: "100%",
    height: 50,
  },
  loading: {
    position: "absolute",
    right: 16,
    top: 13,
  },
  fallbackContainer: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: "#666",
  },
});
