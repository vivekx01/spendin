import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const index = () => {
  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <Text style={styles.title}>Investments</Text>
      <Text style={styles.comingsoontitle}>Work in Progress</Text>
      <View style={{marginTop: 10}}>
        <Text style={styles.comingsoon}>
        This section is currently under development.
      </Text>
      <Text style={styles.comingsoon}>
        Please check back later for updates.
      </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white', paddingTop: 16 },
  comingsoon : {fontSize: 16, textAlign: 'center', backgroundColor: 'white', paddingHorizontal: 10},
  comingsoontitle : {fontSize: 28, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white', marginTop: 25}
});


export default index 