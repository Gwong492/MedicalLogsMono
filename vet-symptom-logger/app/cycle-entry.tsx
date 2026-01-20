import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Droplet, Heart } from 'lucide-react-native';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { DateTimePickerField } from '@/components/DateTimePicker';
import { SliderField } from '@/components/SliderField';
import { MultiSelectField } from '@/components/MultiSelectField';
import { Input } from '@/components/Input';
import { saveCycleEntry, type CycleEntry } from '@/lib/storage';

const FLOW_OPTIONS = [
  { label: 'Spotting', value: 'spotting' },
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Heavy', value: 'heavy' },
];

const SYMPTOM_OPTIONS = [
  { label: 'Cramps', value: 'cramps' },
  { label: 'Bloating', value: 'bloating' },
  { label: 'Headache', value: 'headache' },
  { label: 'Mood swings', value: 'mood_swings' },
  { label: 'Fatigue', value: 'fatigue' },
  { label: 'Breast tenderness', value: 'breast_tenderness' },
  { label: 'Nausea', value: 'nausea' },
  { label: 'Back pain', value: 'back_pain' },
];

const MOOD_OPTIONS = [
  { label: 'Happy', value: 'happy' },
  { label: 'Sad', value: 'sad' },
  { label: 'Anxious', value: 'anxious' },
  { label: 'Irritable', value: 'irritable' },
  { label: 'Calm', value: 'calm' },
  { label: 'Energetic', value: 'energetic' },
];

export default function CycleEntryScreen() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [flowIntensity, setFlowIntensity] = useState<'spotting' | 'light' | 'medium' | 'heavy'>('medium');
  const [painLevel, setPainLevel] = useState(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const entry: Omit<CycleEntry, 'id'> = {
        type: 'cycle',
        startDate: startDate.toISOString(),
        endDate: endDate?.toISOString(),
        flowIntensity,
        painLevel,
        symptoms,
        mood,
        notes: notes.trim(),
      };

      await saveCycleEntry(entry as CycleEntry);
      Alert.alert('Success', 'Cycle entry saved', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2"
        >
          <ArrowLeft className="text-foreground" size={24} />
          <Text className="text-xl font-bold text-foreground">Log Cycle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 16 }}>
        {/* Start Date */}
        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Calendar className="text-primary" size={20} />
              <Text className="text-base font-semibold text-foreground">Period Start</Text>
            </View>
            <DateTimePickerField
              value={startDate}
              onChange={setStartDate}
              mode="date"
              label="When did your period start?"
            />
          </CardContent>
        </Card>

        {/* End Date */}
        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Calendar className="text-primary" size={20} />
              <Text className="text-base font-semibold text-foreground">Period End (Optional)</Text>
            </View>
            <DateTimePickerField
              value={endDate || new Date()}
              onChange={setEndDate}
              mode="date"
              label="When did your period end?"
            />
            {endDate && (
              <TouchableOpacity onPress={() => setEndDate(undefined)} className="mt-2">
                <Text className="text-sm text-destructive">Clear end date</Text>
              </TouchableOpacity>
            )}
          </CardContent>
        </Card>

        {/* Flow Intensity */}
        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Droplet className="text-primary" size={20} />
              <Text className="text-base font-semibold text-foreground">Flow Intensity</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {FLOW_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setFlowIntensity(option.value as typeof flowIntensity)}
                  className={`px-4 py-2 rounded-lg border ${
                    flowIntensity === option.value
                      ? 'bg-primary border-primary'
                      : 'bg-card border-border'
                  }`}
                >
                  <Text
                    className={
                      flowIntensity === option.value
                        ? 'text-primary-foreground font-medium'
                        : 'text-foreground'
                    }
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Pain Level */}
        <Card>
          <CardContent className="py-4">
            <SliderField
              label="Pain Level"
              value={painLevel}
              onChange={setPainLevel}
              min={0}
              max={10}
              step={1}
              showValue
            />
            <Text className="text-xs text-muted-foreground text-center mt-2">
              0 = No pain, 10 = Severe pain
            </Text>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card>
          <CardContent className="py-4">
            <Text className="text-base font-semibold text-foreground mb-3">Symptoms</Text>
            <MultiSelectField
              options={SYMPTOM_OPTIONS}
              value={symptoms}
              onChange={setSymptoms}
              placeholder="Select symptoms"
            />
          </CardContent>
        </Card>

        {/* Mood */}
        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Heart className="text-primary" size={20} />
              <Text className="text-base font-semibold text-foreground">Mood</Text>
            </View>
            <MultiSelectField
              options={MOOD_OPTIONS}
              value={mood}
              onChange={setMood}
              placeholder="How are you feeling?"
            />
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardContent className="py-4">
            <Text className="text-base font-semibold text-foreground mb-3">Notes</Text>
            <Input
              placeholder="Additional details (optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onPress={handleSave} fullWidth disabled={saving}>
          {saving ? 'Saving...' : 'Save Entry'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}