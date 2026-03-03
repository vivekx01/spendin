import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Investments = () => {
  const { theme } = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.background, height: '100%', paddingHorizontal: 16 }}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Investments</Text>
      <Text style={[styles.comingsoontitle, { color: theme.colors.text }]}>Work in Progress</Text>
      <View style={{ marginTop: 10 }}>
        <Text style={[styles.comingsoon, { color: theme.colors.textSecondary }]}>
          This section is currently under development.
        </Text>
        <Text style={[styles.comingsoon, { color: theme.colors.textSecondary }]}>
          Please check back later for updates.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingTop: 16 },
  comingsoon: { fontSize: 16, textAlign: 'center' },
  comingsoontitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 25 },
});

export default Investments;