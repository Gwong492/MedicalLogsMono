import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cva, type VariantProps } from '@/lib/cva';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-lg px-6 py-3',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        outline: 'border-2 border-border bg-transparent',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const textVariants = cva('font-semibold text-base', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-white',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ButtonProps = VariantProps<typeof buttonVariants> & {
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  variant,
  fullWidth,
  onPress,
  children,
  disabled,
  loading,
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={buttonVariants({ variant, fullWidth })}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={{ opacity: disabled || loading ? 0.5 : 1 }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? undefined : 'white'} />
      ) : (
        <Text className={textVariants({ variant })}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}