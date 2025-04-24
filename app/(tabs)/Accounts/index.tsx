import { View, Text } from 'react-native'
import React from 'react'
import Button from '@/components/Button'

const index = () => {
  return (
    <View>
      <Text>Accounts</Text>
      <Button title="Add Account" onPress={""} color={'black'} />
    </View>
  )
}

export default index