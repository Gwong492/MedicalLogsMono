import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useColorScheme } from 'nativewind';

type ToggleFieldProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function ToggleField({ label, value, onValueChange }: ToggleFieldProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-foreground font-medium">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: isDark ? '#3f3f46' : '#e4e4e7', true: isDark ? '#52d1b8' : '#14b8a6' }}
        thumbColor={value ? '#ffffff' : '#f4f4f5'}
      />
    </View>
  );
}