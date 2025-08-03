import { View, Text } from 'react-native'
import React from 'react'
import RightArrowIcon from './RightArrowIcon'

const SettingItem = ({label}) => {
    return (
        <View style={{flexDirection: 'row', padding:16, backgroundColor:'white', justifyContent:'space-between'}}>
            <Text style={{fontSize:16}}>{label}</Text>
            <RightArrowIcon></RightArrowIcon>
        </View>
    )
}

export default SettingItem