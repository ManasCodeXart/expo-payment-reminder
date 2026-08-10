import { PaymentReminder } from '@/components'
import { StyleSheet, View } from 'react-native'

export default function Index() {
  return (
    <View style={styles.container}>
      <PaymentReminder/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})
