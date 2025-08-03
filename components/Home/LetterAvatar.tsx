// components/LetterAvatar.tsx
import React from 'react';
import { Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const COLORS = [
    '#F44336', '#E91E63', '#9C27B0',
    '#3F51B5', '#03A9F4', '#009688',
    '#4CAF50', '#FF9800', '#795548'
];

// Helper to pick a color based on the letter
const getColorFromLetter = (letter: string) => {
    const charCode = letter.toUpperCase().charCodeAt(0);
    return COLORS[charCode % COLORS.length];
};

const LetterAvatar = ({ letter = 'A', size = 64, fontSize = 30}: { letter?: string; size?: number; fontSize?: number; }) => {
    const bgColor = getColorFromLetter(letter);

    return (
        <Svg width={size} height={size}>
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2}
                fill={bgColor}
            />
            <Text
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize,
                    fontWeight: 'bold',
                    color: 'white',
                }}
            >
                {letter.toUpperCase()}
            </Text>
        </Svg>
    );
};

export default LetterAvatar;
