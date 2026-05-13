import React from "react";
import PaywallScreen from "@/components/PaywallScreen";
import { useAuth } from "@/contexts/AuthContext";

export default function OnboardingPaywall() {
  const { updateProfile } = useAuth();

  const handleComplete = async () => {
    await updateProfile({ onboardingComplete: true });
  };

  return <PaywallScreen onComplete={handleComplete} showSkip={true} />;
}
