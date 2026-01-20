import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type PickerFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
};

export function PickerField({ label, value, onValueChange, items }: PickerFieldProps) {
  return (
    <View>
      <Text className="text-sm font-medium text-foreground mb-2">{label}</Text>
      <View className="bg-input border border-border rounded-lg overflow-hidden">
        <Picker selectedValue={value} onValueChange={onValueChange}>
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}