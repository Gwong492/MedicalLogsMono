import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, Database, Trash2, ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cssInterop } from 'nativewind';
import {
  generateId,
  savePainEntry,
  saveHeadacheEntry,
  saveBPEntry,
  loadPainEntries,
  loadHeadacheEntries,
  loadBPEntries,
  type PainEntry,
  type HeadacheEntry,
  type BloodPressureEntry,
} from '@/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

cssInterop(Settings, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Database, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Trash2, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(ArrowLeft, { className: { target: 'style', nativeStyleToProp: { color: true } } });

export default function DevSettingsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const generateSeedData = async () => {
    setLoading(true);

    const now = new Date();
    const seedPain: PainEntry[] = [];
    const seedHeadache: HeadacheEntry[] = [];
    const seedBP: BloodPressureEntry[] = [];

    // Generate 10 pain entries over the last 30 days
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      seedPain.push({
        id: generateId(),
        type: 'pain',
        dateTime: date.toISOString(),
        painLevel: Math.floor(Math.random() * 8) + 2,
        location: ['Lower back, left side', 'Right knee', 'Shoulder, right', 'Neck'][Math.floor(Math.random() * 4)],
        bodyRegion: ['back', 'knee', 'shoulder', 'neck'][Math.floor(Math.random() * 4)],
        painType: ['sharp', 'dull', 'aching', 'throbbing'][Math.floor(Math.random() * 4)],
        duration: Math.floor(Math.random() * 120) + 30,
        triggers: ['Heavy lifting', 'Prolonged sitting', 'Exercise', 'Weather change'][Math.floor(Math.random() * 4)],
        functionalImpact: {
          sleep: Math.random() > 0.5,
          work: Math.random() > 0.7,
          walking: Math.random() > 0.6,
          lifting: Math.random() > 0.5,
        },
        medications: ['Ibuprofen 400mg', 'Acetaminophen 500mg', 'Naproxen 220mg', ''][Math.floor(Math.random() * 4)],
        reliefPercent: Math.floor(Math.random() * 80) + 10,
        notes: 'Sample pain entry for testing',
      });
    }

    // Generate 8 headache entries over the last 30 days
    for (let i = 0; i < 8; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      const symptoms = ['Nausea', 'Aura', 'Light sensitivity', 'Sound sensitivity', 'Dizziness'];
      const selectedSymptoms = symptoms.filter(() => Math.random() > 0.5);

      seedHeadache.push({
        id: generateId(),
        type: 'headache',
        startDateTime: date.toISOString(),
        intensity: Math.floor(Math.random() * 8) + 2,
        symptoms: selectedSymptoms,
        triggers: ['Stress', 'Bright lights', 'Lack of sleep', 'Weather'][Math.floor(Math.random() * 4)],
        medications: ['Sumatriptan 50mg', 'Ibuprofen 600mg', 'Excedrin Migraine', ''][Math.floor(Math.random() * 4)],
        reliefPercent: Math.floor(Math.random() * 70) + 20,
        requiredLyingDown: Math.random() > 0.6,
        missedWork: Math.random() > 0.8,
        notes: 'Sample headache entry for testing',
      });
    }

    // Generate 15 BP entries over the last 30 days
    for (let i = 0; i < 15; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      const systolic = Math.floor(Math.random() * 50) + 110; // 110-160
      const diastolic = Math.floor(Math.random() * 30) + 70; // 70-100

      seedBP.push({
        id: generateId(),
        type: 'bloodPressure',
        dateTime: date.toISOString(),
        systolic,
        diastolic,
        pulse: Math.floor(Math.random() * 40) + 60,
        posture: Math.random() > 0.5 ? 'sitting' : 'standing',
        armUsed: Math.random() > 0.5 ? 'left' : 'right',
        deviceType: ['automatic', 'manual'][Math.floor(Math.random() * 2)],
        notes: 'Sample BP reading for testing',
      });
    }

    // Save all seed data
    try {
      for (const entry of seedPain) {
        await savePainEntry(entry);
      }
      for (const entry of seedHeadache) {
        await saveHeadacheEntry(entry);
      }
      for (const entry of seedBP) {
        await saveBPEntry(entry);
      }

      setLoading(false);
      Alert.alert(
        'Success',
        `Generated ${seedPain.length} pain entries, ${seedHeadache.length} headache entries, and ${seedBP.length} BP entries.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to generate seed data.');
    }
  };

  const handleGenerateSeedData = () => {
    Alert.alert(
      'Generate Seed Data',
      'This will add sample entries to your database. Existing entries will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: generateSeedData },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete ALL entries (pain, headache, and blood pressure). This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await AsyncStorage.multiRemove([
                '@vet_logger_pain',
                '@vet_logger_headache',
                '@vet_logger_bp',
              ]);
              setLoading(false);
              Alert.alert('Success', 'All entries have been deleted.', [{ text: 'OK' }]);
            } catch (error) {
              setLoading(false);
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const getDataStats = async () => {
    setLoading(true);
    const [pain, headache, bp] = await Promise.all([
      loadPainEntries(),
      loadHeadacheEntries(),
      loadBPEntries(),
    ]);
    setLoading(false);
    Alert.alert(
      'Data Statistics',
      `Pain Entries: ${pain.length}\nHeadache Entries: ${headache.length}\nBlood Pressure Entries: ${bp.length}\nTotal: ${pain.length + headache.length + bp.length}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <View className="flex-row items-center gap-3">
          <Button variant="outline" onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={20} />
          </Button>
          <Text className="text-xl font-bold text-foreground">Developer Settings</Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 16 }}>
        {/* Info Card */}
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="py-4">
            <View className="flex-row items-start gap-3">
              <Settings className="text-amber-600 dark:text-amber-400 mt-1" size={20} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Developer Tools
                </Text>
                <Text className="text-xs text-amber-800 dark:text-amber-200">
                  These tools are for testing and development purposes. Use with caution.
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Data Statistics */}
        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-3 mb-3">
              <Database className="text-primary" size={24} />
              <Text className="text-lg font-bold text-foreground">Data Statistics</Text>
            </View>
            <Text className="text-sm text-muted-foreground mb-4">
              View current database entry counts
            </Text>
            <Button onPress={getDataStats} loading={loading} variant="outline" fullWidth>
              View Statistics
            </Button>
          </CardContent>
        </Card>

        {/* Generate Seed Data */}
        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-3 mb-3">
              <Database className="text-blue-600 dark:text-blue-400" size={24} />
              <Text className="text-lg font-bold text-foreground">Generate Sample Data</Text>
            </View>
            <Text className="text-sm text-muted-foreground mb-4">
              Add 33 sample entries (10 pain, 8 headache, 15 BP) spread over the last 30 days for
              testing charts and exports.
            </Text>
            <Button onPress={handleGenerateSeedData} loading={loading} fullWidth>
              Generate Seed Data
            </Button>
          </CardContent>
        </Card>

        {/* Clear All Data */}
        <Card className="border-destructive/30">
          <CardContent className="py-4">
            <View className="flex-row items-center gap-3 mb-3">
              <Trash2 className="text-destructive" size={24} />
              <Text className="text-lg font-bold text-destructive">Danger Zone</Text>
            </View>
            <Text className="text-sm text-muted-foreground mb-4">
              Permanently delete all entries from the database. This action cannot be undone.
            </Text>
            <Button
              onPress={handleClearAllData}
              loading={loading}
              variant="destructive"
              fullWidth
            >
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}