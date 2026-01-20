import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { isOnboardingComplete, loadProfile } from '@/lib/storage';

export default function IndexScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    const onboardingDone = await isOnboardingComplete();
    const profile = await loadProfile();

    if (!onboardingDone) {
      router.replace('/onboarding');
    } else if (!profile) {
      router.replace('/profile');
    } else {
      router.replace('/dashboard');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return null;
}