import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { useColorScheme } from 'nativewind';

type SliderFieldProps = {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  unit?: string;
};

export function SliderField({
  label,
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 10,
  step = 1,
  unit = '',
}: SliderFieldProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        <Text className="text-lg font-bold text-primary">
          {value}
          {unit}
        </Text>
      </View>
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={isDark ? '#52d1b8' : '#14b8a6'}
        maximumTrackTintColor={isDark ? '#3f3f46' : '#e4e4e7'}
        thumbTintColor={isDark ? '#52d1b8' : '#14b8a6'}
      />
      <View className="flex-row justify-between">
        <Text className="text-xs text-muted-foreground">{minimumValue}</Text>
        <Text className="text-xs text-muted-foreground">{maximumValue}</Text>
      </View>
    </View>
  );
}