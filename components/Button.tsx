import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({title, onPress}) => {
    return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={onPress}
        >
          <Text style={styles.text}>
            {title}
          </Text>
        </TouchableOpacity>
      )
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: 'black',
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderRadius: 10,
          alignItems: 'center',
    },
    text: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    }
  })

export default Button