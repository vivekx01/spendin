import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/context/ThemeContext';

type DataItem = {
  label: string;
  value: number;
};

type MonthlyTrendProps = {
  data: DataItem[];
};

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 24;
const chartHeight = 170;

const formatAmountShort = (value: number) => {
  if (value === 0) return '0';
  const abs = Math.abs(value);

  // Thousand
  if (abs < 1_00_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  // Lakh
  if (abs < 1_00_00_000) {
    return `${(value / 1_00_000).toFixed(1)}L`;
  }
  // Crore
  return `${(value / 1_00_00_000).toFixed(1)}Cr`;
};

export default function MonthlyTrendChart({ data }: MonthlyTrendProps) {
  const { theme } = useTheme();
  if (!data.length) {
    return null;
  }

  const labels = data.map(d => d.label);
  const values = data.map(d => d.value);
  const current = values[values.length - 1] || 0;
  const previous = values.length > 1 ? values[values.length - 2] : null;

  let deltaText = '';
  if (previous != null && previous > 0) {
    const diff = current - previous;
    const pct = Math.round((Math.abs(diff) / previous) * 100);
    const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'same as';
    deltaText =
      diff === 0
        ? `Same as last month (₹${previous.toFixed(0)})`
        : `${direction} ${pct}% vs last month`;
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.background,
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    decimalPlaces: 0,
    color: () => theme.colors.text,
    labelColor: () => theme.colors.textSecondary,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.background,
    },
    propsForBackgroundLines: {
      stroke: theme.colors.border,
      strokeDasharray: '4,4',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Monthly spend (last {data.length} months)</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        This month: ₹{formatAmountShort(current)}
        {previous != null ? ` · Last month: ₹${formatAmountShort(previous)}` : ''}
      </Text>
      {deltaText ? (
        <Text style={[styles.delta, { color: theme.colors.textSecondary }]}>{deltaText}</Text>
      ) : null}
      <LineChart
        data={chartData}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        style={styles.chart}
        withInnerLines
        withOuterLines={false}
        bezier
        fromZero
        formatYLabel={(value) => {
          const num = Number(value);
          if (Number.isNaN(num)) return value;
          // Show absolute value with unit, chart already conveys direction via shape
          return formatAmountShort(Math.abs(num));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  delta: {
    marginTop: 2,
    fontSize: 12,
  },
  chart: {
    marginTop: 12,
    borderRadius: 12,
    marginLeft: -28,
  },
});
