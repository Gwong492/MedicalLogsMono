import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  className?: string;
};

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      className={`bg-input border border-border rounded-lg px-4 py-3 text-foreground ${className || ''}`}
      placeholderTextColor="#a1a1aa"
      {...props}
    />
  );
}