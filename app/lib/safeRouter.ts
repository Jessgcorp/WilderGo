// Lightweight safe navigation helper for expo-router
// Ensures we don't attempt to navigate to unexpected/undefined filesystem routes.
import { Router } from 'expo-router';

const ALLOWED_PREFIXES = ['/(auth)', '/(tabs)', '/(onboarding)', '/'];

export function safeReplace(router: any, path: string, fallback = '/(auth)/login') {
  if (!path || typeof path !== 'string') {
    try {
      router.replace(fallback);
    } catch (e) {
      console.warn('safeReplace: fallback navigation failed', e);
    }
    return;
  }

  const isAllowed = ALLOWED_PREFIXES.some((p) => path.startsWith(p));
  if (!isAllowed) {
    console.warn(`safeReplace: blocked navigating to unexpected path="${path}"; using fallback.`);
    try {
      router.replace(fallback);
    } catch (e) {
      console.warn('safeReplace: fallback navigation failed', e);
    }
    return;
  }

  try {
    router.replace(path);
  } catch (e) {
    console.warn(`safeReplace: navigation to "${path}" failed, falling back`, e);
    try {
      router.replace(fallback);
    } catch (e2) {
      console.warn('safeReplace: fallback navigation failed', e2);
    }
  }
}
