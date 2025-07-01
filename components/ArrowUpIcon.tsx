import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function ArrowUpIcon() {
  return (
    <View style={styles.iconWrapper}>
      <Svg width={24} height={24} viewBox="0 0 256 256" fill="red">
        <Path d="M192,192a8,8,0,0,1-11.31,0L79.31,90.34V152a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H168a8,8,0,0,1,0,16H90.34L192,180.69A8,8,0,0,1,192,192Z" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    backgroundColor: '#f0f2f4',
    borderRadius: 12,
    width: 48,  // size-12 = 48px
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
