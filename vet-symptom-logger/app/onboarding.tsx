import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AlertCircle, Heart, Activity, TrendingUp } from 'lucide-react-native';
import { setOnboardingComplete } from '@/lib/storage';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    await setOnboardingComplete();
    router.replace('/profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>
        <View className="items-center mb-8 mt-8">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Heart className="text-primary" size={40} />
          </View>
          <Text className="text-3xl font-bold text-foreground text-center">
            Vet Symptom Logger
          </Text>
          <Text className="text-muted-foreground text-center mt-2">
            Track your health symptoms offline
          </Text>
        </View>

        <Card className="mb-4 border-2 border-destructive/20">
          <CardContent className="py-4">
            <View className="flex-row items-start gap-3">
              <AlertCircle className="text-destructive mt-1" size={24} />
              <View className="flex-1">
                <Text className="text-foreground font-semibold mb-1">Important Disclaimer</Text>
                <Text className="text-sm text-muted-foreground leading-5">
                  This app is not for emergency use. It does not provide medical advice. 
                  If you are experiencing a medical emergency, call 911 or visit your nearest emergency room.
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <View className="gap-4 mb-8">
          <Card>
            <CardContent className="py-4">
              <View className="flex-row items-start gap-3">
                <Activity className="text-primary mt-1" size={24} />
                <View className="flex-1">
                  <Text className="text-foreground font-semibold mb-1">Track Symptoms</Text>
                  <Text className="text-sm text-muted-foreground">
                    Log pain, headaches, and blood pressure readings with detailed information.
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4">
              <View className="flex-row items-start gap-3">
                <TrendingUp className="text-primary mt-1" size={24} />
                <View className="flex-1">
                  <Text className="text-foreground font-semibold mb-1">View Trends</Text>
                  <Text className="text-sm text-muted-foreground">
                    See patterns and trends in your symptoms over time with charts and timelines.
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4">
              <View className="flex-row items-start gap-3">
                <Heart className="text-primary mt-1" size={24} />
                <View className="flex-1">
                  <Text className="text-foreground font-semibold mb-1">Export Summaries</Text>
                  <Text className="text-sm text-muted-foreground">
                    Generate VA-friendly summaries to share with your healthcare provider.
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        <View className="bg-muted p-4 rounded-lg mb-8">
          <Text className="text-sm text-muted-foreground text-center">
            All data is stored locally on your device. This app works completely offline.
          </Text>
        </View>

        <Button onPress={handleGetStarted} fullWidth>
          Get Started
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}