import { Slot } from 'expo-router';
import { AuthProvider } from './contexts/AuthContext';

// Root layout should render children (Slot). We wrap with AuthProvider so that
// `useAuth()` is available to all routes. Avoid unconditional Redirect here
// because redirecting during render can cause navigation loops or attempt to
// navigate to routes that are not mounted yet.
export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
