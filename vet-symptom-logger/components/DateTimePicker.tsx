import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

type DateTimePickerFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
};

export function DateTimePickerField({
  label,
  value,
  onChange,
  mode = 'datetime',
}: DateTimePickerFieldProps) {
  const [show, setShow] = useState(false);

  const formatDateTime = (date: Date) => {
    if (mode === 'date') {
      return date.toLocaleDateString();
    } else if (mode === 'time') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <Text className="text-sm font-medium text-foreground mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="bg-input border border-border rounded-lg px-4 py-3 flex-row items-center justify-between"
      >
        <Text className="text-foreground">{formatDateTime(value)}</Text>
        <Calendar className="text-primary" size={20} />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}