import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

export default function ArrowDownIcon() {
  return (
    <View style={styles.iconWrapper}>
      <Svg width={24} height={24} viewBox="0 0 256 256" fill="green">
        <G transform="rotate(-45 128 128)">
          <Path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    backgroundColor: '#f0f2f4',
    borderRadius: 12,
    width: 48, // size-12 in Tailwind = 3rem = 48px
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
