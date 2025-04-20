import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

const SplashScreen = () => {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Spendin - Spend wisely!</Text>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20,
    },
    loader: {
      marginTop: 10,
    },
  });
export default SplashScreen