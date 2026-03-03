import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';

export default function ArrowDownIcon() {
  const { theme } = useTheme();
  return (
    <View style={[styles.iconWrapper, { backgroundColor: theme.colors.border }]}>
      <Svg width={24} height={24} viewBox="0 0 256 256" fill={theme.colors.income}>
        <G transform="rotate(-45 128 128)">
          <Path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    borderRadius: 12,
    width: 48,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
