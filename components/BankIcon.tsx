import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function BankIcon() {
    return (
        <View style={styles.iconWrapper}>
            <Svg width={24} height={24} viewBox="0 0 256 256" fill="black">
                <Path
                    d="M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z"
                ></Path>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        backgroundColor: '#f0f2f4',
        borderRadius: 12,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
