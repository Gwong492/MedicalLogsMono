import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SliderField } from '@/components/SliderField';
import { DateTimePickerField } from '@/components/DateTimePicker';
import { PickerField } from '@/components/PickerField';
import { ToggleField } from '@/components/ToggleField';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { generateId, savePainEntry, type PainEntry } from '@/lib/storage';

cssInterop(ArrowLeft, { className: { target: 'style', nativeStyleToProp: { color: true } } });

const BODY_REGIONS = [
  { label: 'Select region...', value: '' },
  { label: 'Head', value: 'head' },
  { label: 'Neck', value: 'neck' },
  { label: 'Shoulder', value: 'shoulder' },
  { label: 'Back', value: 'back' },
  { label: 'Hip', value: 'hip' },
  { label: 'Knee', value: 'knee' },
  { label: 'Ankle', value: 'ankle' },
  { label: 'Other', value: 'other' },
];

const PAIN_TYPES = [
  { label: 'Select type...', value: '' },
  { label: 'Sharp', value: 'sharp' },
  { label: 'Dull', value: 'dull' },
  { label: 'Burning', value: 'burning' },
  { label: 'Throbbing', value: 'throbbing' },
  { label: 'Aching', value: 'aching' },
  { label: 'Radiating', value: 'radiating' },
  { label: 'Other', value: 'other' },
];

export default function PainEntryScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [dateTime, setDateTime] = useState(new Date());
  const [painLevel, setPainLevel] = useState(5);
  const [location, setLocation] = useState('');
  const [bodyRegion, setBodyRegion] = useState('');
  const [painType, setPainType] = useState('');
  const [duration, setDuration] = useState('');
  const [triggers, setTriggers] = useState('');
  const [medications, setMedications] = useState('');
  const [reliefPercent, setReliefPercent] = useState(0);
  const [notes, setNotes] = useState('');
  const [functionalImpact, setFunctionalImpact] = useState({
    sleep: false,
    work: false,
    walking: false,
    lifting: false,
  });

  const handleSave = async () => {
    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please enter a pain location.');
      return;
    }
    if (!bodyRegion) {
      Alert.alert('Validation Error', 'Please select a body region.');
      return;
    }
    if (!painType) {
      Alert.alert('Validation Error', 'Please select a pain type.');
      return;
    }
    if (!duration.trim() || isNaN(Number(duration)) || Number(duration) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid duration in minutes.');
      return;
    }

    setSaving(true);

    const entry: PainEntry = {
      id: generateId(),
      type: 'pain',
      dateTime: dateTime.toISOString(),
      painLevel,
      location: location.trim(),
      bodyRegion,
      painType,
      duration: Number(duration),
      triggers: triggers.trim(),
      functionalImpact,
      medications: medications.trim(),
      reliefPercent,
      notes: notes.trim(),
    };

    await savePainEntry(entry);
    setSaving(false);
    Alert.alert('Success', 'Pain entry saved successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <View className="flex-row items-center gap-3">
          <Button variant="outline" onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={20} />
          </Button>
          <Text className="text-xl font-bold text-foreground">Log Pain</Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 20 }}>
        <DateTimePickerField label="Date & Time" value={dateTime} onChange={setDateTime} />

        <SliderField
          label="Pain Level"
          value={painLevel}
          onValueChange={setPainLevel}
          minimumValue={0}
          maximumValue={10}
          step={1}
        />

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Location</Text>
          <Input
            placeholder="e.g., Lower back, left side"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <PickerField
          label="Body Region"
          value={bodyRegion}
          onValueChange={setBodyRegion}
          items={BODY_REGIONS}
        />

        <PickerField
          label="Pain Type"
          value={painType}
          onValueChange={setPainType}
          items={PAIN_TYPES}
        />

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Duration (minutes)</Text>
          <Input
            placeholder="e.g., 30"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Triggers</Text>
          <Input
            placeholder="e.g., Heavy lifting, prolonged sitting"
            value={triggers}
            onChangeText={setTriggers}
            multiline
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-foreground mb-3">Functional Impact</Text>
          <View className="bg-card border border-border rounded-lg p-4 gap-2">
            <ToggleField
              label="Affected sleep"
              value={functionalImpact.sleep}
              onValueChange={(val) => setFunctionalImpact({ ...functionalImpact, sleep: val })}
            />
            <ToggleField
              label="Affected work"
              value={functionalImpact.work}
              onValueChange={(val) => setFunctionalImpact({ ...functionalImpact, work: val })}
            />
            <ToggleField
              label="Affected walking"
              value={functionalImpact.walking}
              onValueChange={(val) => setFunctionalImpact({ ...functionalImpact, walking: val })}
            />
            <ToggleField
              label="Affected lifting"
              value={functionalImpact.lifting}
              onValueChange={(val) => setFunctionalImpact({ ...functionalImpact, lifting: val })}
            />
          </View>
        </View>

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Medications Taken</Text>
          <Input
            placeholder="e.g., Ibuprofen 400mg"
            value={medications}
            onChangeText={setMedications}
            multiline
          />
        </View>

        <SliderField
          label="Relief Percent"
          value={reliefPercent}
          onValueChange={setReliefPercent}
          minimumValue={0}
          maximumValue={100}
          step={5}
          unit="%"
        />

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Notes</Text>
          <Input
            placeholder="Additional notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <View className="flex-row gap-3 mt-4">
          <Button variant="outline" fullWidth onPress={() => router.back()}>
            Cancel
          </Button>
          <Button fullWidth onPress={handleSave} loading={saving}>
            Save
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}