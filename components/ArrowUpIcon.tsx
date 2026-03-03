import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';

export default function ArrowUpIcon() {
  const { theme } = useTheme();
  return (
    <View style={[styles.iconWrapper, { backgroundColor: theme.colors.border }]}>
      <Svg width={24} height={24} viewBox="0 0 256 256" fill={theme.colors.expense}>
        <Path d="M192,192a8,8,0,0,1-11.31,0L79.31,90.34V152a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H168a8,8,0,0,1,0,16H90.34L192,180.69A8,8,0,0,1,192,192Z" />
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
