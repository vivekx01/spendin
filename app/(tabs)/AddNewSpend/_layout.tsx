// app/Accounts/layout.tsx
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function AddNewSpendLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
