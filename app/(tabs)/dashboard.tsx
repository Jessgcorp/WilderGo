import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants/theme";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/discovery");
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background.primary,
      }}
    >
      <ActivityIndicator size="large" color={colors.ember[500]} />
    </View>
  );
}
