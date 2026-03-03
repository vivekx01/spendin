import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type DataItem = {
  label: string;
  value: number;
};

type HorizontalBarChartProps = {
  data: DataItem[];
};

const BAR_WIDTH = Dimensions.get('window').width * 0.7 - 50;

export default function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  const { theme } = useTheme();
  if (!data.length) {
    return null;
  }
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Categories with most transactions</Text>
      {data.map((item:any, index:any) => {
        const widthPercent = (item.value / maxValue) * BAR_WIDTH;

        return (
          <View key={index} style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{item.label}</Text>
            <View style={[styles.barContainer, { backgroundColor: theme.colors.card }]}>
              <View style={[styles.bar, { width: widthPercent, backgroundColor: theme.colors.accent }]} />
              <View style={[styles.barEnd, { backgroundColor: theme.colors.border }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    width: '80%'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    width: 100,
    fontSize: 14,
    color: '#555',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    height: 14,
    overflow: 'hidden',
  },
  bar: {
    backgroundColor: '#e8e9eb',
    height: 14,
  },
  barEnd: {
    width: 2,
    height: 14,
    backgroundColor: '#666',
  },
});
