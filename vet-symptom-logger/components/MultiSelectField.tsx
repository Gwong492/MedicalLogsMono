import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(Check, { className: { target: 'style', nativeStyleToProp: { color: true } } });

type MultiSelectFieldProps = {
  label: string;
  value: string[];
  onValueChange: (value: string[]) => void;
  options: string[];
};

export function MultiSelectField({ label, value, onValueChange, options }: MultiSelectFieldProps) {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onValueChange(value.filter((v) => v !== option));
    } else {
      onValueChange([...value, option]);
    }
  };

  return (
    <View>
      <Text className="text-sm font-medium text-foreground mb-2">{label}</Text>
      <View className="gap-2">
        {options.map((option) => {
          const isSelected = value.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => toggleOption(option)}
              className={`flex-row items-center justify-between p-3 rounded-lg border ${
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-input border-border'
              }`}
            >
              <Text className={isSelected ? 'text-primary font-medium' : 'text-foreground'}>
                {option}
              </Text>
              {isSelected && <Check className="text-primary" size={20} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}