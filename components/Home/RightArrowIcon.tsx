// components/RightArrowIcon.tsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RightArrowIcon = ({ size = 24, color = 'black' }) => {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 256 256"
            fill={color}
        >
            <Path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
        </Svg>
    );
};

export default RightArrowIcon;
