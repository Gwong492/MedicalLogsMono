import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { DateTimePickerField } from '@/components/DateTimePicker';
import { PickerField } from '@/components/PickerField';
import { SegmentedControl } from '@/components/SegmentedControl';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { generateId, saveBPEntry, type BloodPressureEntry } from '@/lib/storage';

cssInterop(ArrowLeft, { className: { target: 'style', nativeStyleToProp: { color: true } } });

const DEVICE_TYPES = [
  { label: 'Select device...', value: '' },
  { label: 'Automatic cuff', value: 'automatic' },
  { label: 'Manual', value: 'manual' },
  { label: 'Other', value: 'other' },
];

export default function BPEntryScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [dateTime, setDateTime] = useState(new Date());
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [posture, setPosture] = useState<'sitting' | 'standing'>('sitting');
  const [armUsed, setArmUsed] = useState<'left' | 'right'>('left');
  const [deviceType, setDeviceType] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!systolic.trim() || isNaN(Number(systolic)) || Number(systolic) < 50 || Number(systolic) > 250) {
      Alert.alert('Validation Error', 'Please enter a valid systolic value (50-250).');
      return;
    }
    if (!diastolic.trim() || isNaN(Number(diastolic)) || Number(diastolic) < 30 || Number(diastolic) > 150) {
      Alert.alert('Validation Error', 'Please enter a valid diastolic value (30-150).');
      return;
    }
    if (pulse.trim() && (isNaN(Number(pulse)) || Number(pulse) < 30 || Number(pulse) > 220)) {
      Alert.alert('Validation Error', 'Please enter a valid pulse value (30-220) or leave it empty.');
      return;
    }
    if (!deviceType) {
      Alert.alert('Validation Error', 'Please select a device type.');
      return;
    }

    setSaving(true);

    const entry: BloodPressureEntry = {
      id: generateId(),
      type: 'bloodPressure',
      dateTime: dateTime.toISOString(),
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: pulse.trim() ? Number(pulse) : undefined,
      posture,
      armUsed,
      deviceType,
      notes: notes.trim(),
    };

    await saveBPEntry(entry);
    setSaving(false);
    Alert.alert('Success', 'Blood pressure entry saved successfully!', [
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
          <Text className="text-xl font-bold text-foreground">Log Blood Pressure</Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 20 }}>
        <DateTimePickerField label="Date & Time" value={dateTime} onChange={setDateTime} />

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Systolic (mmHg)</Text>
          <Input
            placeholder="e.g., 120"
            value={systolic}
            onChangeText={setSystolic}
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Diastolic (mmHg)</Text>
          <Input
            placeholder="e.g., 80"
            value={diastolic}
            onChangeText={setDiastolic}
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Pulse (bpm) - Optional</Text>
          <Input
            placeholder="e.g., 72"
            value={pulse}
            onChangeText={setPulse}
            keyboardType="numeric"
          />
        </View>

        <SegmentedControl
          label="Posture"
          value={posture}
          onValueChange={(val) => setPosture(val as 'sitting' | 'standing')}
          segments={[
            { label: 'Sitting', value: 'sitting' },
            { label: 'Standing', value: 'standing' },
          ]}
        />

        <SegmentedControl
          label="Arm Used"
          value={armUsed}
          onValueChange={(val) => setArmUsed(val as 'left' | 'right')}
          segments={[
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ]}
        />

        <PickerField
          label="Device Type"
          value={deviceType}
          onValueChange={setDeviceType}
          items={DEVICE_TYPES}
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