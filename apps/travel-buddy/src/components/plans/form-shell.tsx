import type { ReactNode } from 'react';

import { Button, Text, View } from '../ui';

type PlanFormShellProps = {
  children: ReactNode;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  onSubmit: () => void;
  submitLabel: string;
  title: string;
};

export const PlanFormShell = ({
  children,
  description,
  disabled = false,
  loading = false,
  onSubmit,
  submitLabel,
  title,
}: PlanFormShellProps) => {
  return (
    <View className="gap-4 rounded-3xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
      <View className="gap-1">
        <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
          {title}
        </Text>
        {description ? (
          <Text className="text-sm text-muted dark:text-muted-dark">
            {description}
          </Text>
        ) : null}
      </View>
      <View className="gap-3">{children}</View>
      <Button
        label={submitLabel}
        loading={loading}
        disabled={disabled}
        size="lg"
        variant="secondary"
        onPress={onSubmit}
      />
    </View>
  );
};
