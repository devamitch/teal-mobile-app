import { forwardRef } from "react"
import { StyleSheet, View, type ViewStyle } from "react-native"
import type Animated from "react-native-reanimated"
import { useSharedValue } from "react-native-reanimated"
import type { ProgressButtonRef } from "../../../types"
import { ProgressCircle } from "./animated-circle"
import { InnerButton } from "./inner-button"
import { ProgressIndicator } from "./progress-indicator"

interface CircularProgressButtonProps {
  progress: Animated.SharedValue<number>
  size?: number
  strokeWidth?: number
  onPress?: () => void
  accessibilityLabel?: string
  accessibilityHint?: string
  enableHaptics?: boolean
  disabled?: boolean
  showPercentage?: boolean
  progressColor?: string
  backgroundColor?: string
  buttonColor?: string
  iconColor?: string
}

/**
 * A highly optimized circular progress button with granular animations
 * and complete accessibility support using bare React Native.
 */
const CircularProgressButton = forwardRef<ProgressButtonRef, CircularProgressButtonProps>((props, ref) => {
  const {
    progress,
    size = 56,
    strokeWidth = 3,
    onPress = () => {},
    accessibilityLabel = "Next",
    accessibilityHint = "Go to next screen",
    enableHaptics = true,
    disabled = false,
    showPercentage = false,
    progressColor = "#049299",
    backgroundColor = "#E5E7EB",
    buttonColor = "#B4DEE0",
    iconColor = "#049299",
  } = props

  const isPressed = useSharedValue(false)
  const scale = useSharedValue(1)

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    justifyContent: "center",
    alignItems: "center",
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <ProgressIndicator progress={progress} showPercentage={showPercentage} position="top" textColor="#1F2937" />

      <ProgressCircle
        progress={progress}
        size={size}
        strokeWidth={strokeWidth}
        progressColor={progressColor}
        backgroundColor={backgroundColor}
      />

      <InnerButton
        isPressed={isPressed}
        progress={progress}
        scale={scale}
        size={size}
        strokeWidth={strokeWidth}
        buttonColor={buttonColor}
        iconColor={iconColor}
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        enableHaptics={enableHaptics}
      />
    </View>
  )
})

CircularProgressButton.displayName = "CircularProgressButton"

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
})

export default CircularProgressButton
