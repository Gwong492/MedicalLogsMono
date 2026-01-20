import React from 'react';
import { View } from 'react-native';
import { cva, type VariantProps } from '@/lib/cva';

const cardVariants = cva('bg-card rounded-lg border border-border', {
  variants: {},
  defaultVariants: {},
});

type CardProps = VariantProps<typeof cardVariants> & {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <View className={`${cardVariants()} ${className || ''}`}>{children}</View>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={`p-4 ${className || ''}`}>{children}</View>;
}