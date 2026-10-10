import type React from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"

interface LoadingOverlayProps {
  text?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2D7D7A" />
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
})

export default LoadingOverlay
