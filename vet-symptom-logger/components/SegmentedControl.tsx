import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type SegmentedControlProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  segments: { label: string; value: string }[];
};

export function SegmentedControl({
  label,
  value,
  onValueChange,
  segments,
}: SegmentedControlProps) {
  return (
    <View>
      <Text className="text-sm font-medium text-foreground mb-2">{label}</Text>
      <View className="flex-row bg-muted rounded-lg p-1">
        {segments.map((segment) => (
          <TouchableOpacity
            key={segment.value}
            onPress={() => onValueChange(segment.value)}
            className={`flex-1 py-2 rounded-md ${
              value === segment.value ? 'bg-primary' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                value === segment.value ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {segment.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}