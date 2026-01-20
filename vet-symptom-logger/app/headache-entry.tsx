import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SliderField } from '@/components/SliderField';
import { DateTimePickerField } from '@/components/DateTimePicker';
import { MultiSelectField } from '@/components/MultiSelectField';
import { ToggleField } from '@/components/ToggleField';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { generateId, saveHeadacheEntry, type HeadacheEntry } from '@/lib/storage';

cssInterop(ArrowLeft, { className: { target: 'style', nativeStyleToProp: { color: true } } });

const SYMPTOM_OPTIONS = [
  'Nausea',
  'Aura',
  'Light sensitivity',
  'Sound sensitivity',
  'Dizziness',
  'Vision changes',
  'Other',
];

export default function HeadacheEntryScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [triggers, setTriggers] = useState('');
  const [medications, setMedications] = useState('');
  const [reliefPercent, setReliefPercent] = useState(0);
  const [requiredLyingDown, setRequiredLyingDown] = useState(false);
  const [missedWork, setMissedWork] = useState(false);
  const [notes, setNotes] = useState('');
  const [hasEndTime, setHasEndTime] = useState(false);

  const handleSave = async () => {
    if (hasEndTime && endDateTime && endDateTime <= startDateTime) {
      Alert.alert('Validation Error', 'End time must be after start time.');
      return;
    }

    setSaving(true);

    const entry: HeadacheEntry = {
      id: generateId(),
      type: 'headache',
      startDateTime: startDateTime.toISOString(),
      endDateTime: hasEndTime && endDateTime ? endDateTime.toISOString() : undefined,
      intensity,
      symptoms,
      triggers: triggers.trim(),
      medications: medications.trim(),
      reliefPercent,
      requiredLyingDown,
      missedWork,
      notes: notes.trim(),
    };

    await saveHeadacheEntry(entry);
    setSaving(false);
    Alert.alert('Success', 'Headache entry saved successfully!', [
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
          <Text className="text-xl font-bold text-foreground">Log Headache</Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 20 }}>
        <DateTimePickerField
          label="Start Date & Time"
          value={startDateTime}
          onChange={setStartDateTime}
        />

        <View className="bg-card border border-border rounded-lg p-4">
          <ToggleField
            label="Add end time"
            value={hasEndTime}
            onValueChange={setHasEndTime}
          />
        </View>

        {hasEndTime && (
          <DateTimePickerField
            label="End Date & Time (Optional)"
            value={endDateTime || new Date()}
            onChange={setEndDateTime}
          />
        )}

        <SliderField
          label="Intensity"
          value={intensity}
          onValueChange={setIntensity}
          minimumValue={0}
          maximumValue={10}
          step={1}
        />

        <MultiSelectField
          label="Symptoms"
          value={symptoms}
          onValueChange={setSymptoms}
          options={SYMPTOM_OPTIONS}
        />

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Triggers</Text>
          <Input
            placeholder="e.g., Stress, bright lights, lack of sleep"
            value={triggers}
            onChangeText={setTriggers}
            multiline
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Medications Taken</Text>
          <Input
            placeholder="e.g., Sumatriptan 50mg"
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

        <View className="bg-card border border-border rounded-lg p-4 gap-2">
          <ToggleField
            label="Required lying down"
            value={requiredLyingDown}
            onValueChange={setRequiredLyingDown}
          />
          <ToggleField
            label="Missed work"
            value={missedWork}
            onValueChange={setMissedWork}
          />
        </View>

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