"use client"

import type React from "react"
import type { StyleProp, ViewStyle, TextStyle } from "react-native"
import Button, { type ButtonProps } from "./button"

// Predefined button variants
export interface ButtonVariantProps extends Omit<ButtonProps, "backgroundColor" | "textColor" | "variant"> {
  size?: "small" | "medium" | "large"
  fullWidth?: boolean
}

// Primary Button (RectButton)
export const PrimaryButton: React.FC<ButtonVariantProps> = ({
  size = "medium",
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyle = getButtonStyle(size, fullWidth)
  const buttonTextStyle = getTextStyle(size)

  return (
    <Button
      {...props}
      variant="rect"
      backgroundColor="#049299"
      textColor="white"
      underlayColor="#049299"
      rippleColor="#B4DEE0"
      style={[buttonStyle, style]}
      textStyle={[buttonTextStyle, textStyle]}
    />
  )
}

// Secondary Button (RectButton with outline)
export const SecondaryButton: React.FC<ButtonVariantProps> = ({
  size = "medium",
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyle = getButtonStyle(size, fullWidth)
  const buttonTextStyle = getTextStyle(size)

  return (
    <Button
      {...props}
      variant="rect"
      backgroundColor="transparent"
      textColor="#049299"
      underlayColor="rgba(90, 103, 242, 0.1)"
      rippleColor="rgba(90, 103, 242, 0.2)"
      style={[
        buttonStyle,
        {
          borderWidth: 2,
          borderColor: "#049299",
        },
        style,
      ]}
      textStyle={[buttonTextStyle, textStyle]}
    />
  )
}

// Danger Button (RectButton)
export const DangerButton: React.FC<ButtonVariantProps> = ({
  size = "medium",
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyle = getButtonStyle(size, fullWidth)
  const buttonTextStyle = getTextStyle(size)

  return (
    <Button
      {...props}
      variant="rect"
      backgroundColor="#FF6B6B"
      textColor="white"
      underlayColor="#FF5252"
      rippleColor="rgba(255, 255, 255, 0.3)"
      style={[buttonStyle, style]}
      textStyle={[buttonTextStyle, textStyle]}
    />
  )
}

// Success Button (RectButton)
export const SuccessButton: React.FC<ButtonVariantProps> = ({
  size = "medium",
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyle = getButtonStyle(size, fullWidth)
  const buttonTextStyle = getTextStyle(size)

  return (
    <Button
      {...props}
      variant="rect"
      backgroundColor="#4ECDC4"
      textColor="white"
      underlayColor="#45B7B8"
      rippleColor="rgba(255, 255, 255, 0.3)"
      style={[buttonStyle, style]}
      textStyle={[buttonTextStyle, textStyle]}
    />
  )
}

// Icon Button (BorderlessButton)
export const IconButton: React.FC<ButtonVariantProps> = ({ size = "medium", style, textStyle, ...props }) => {
  const buttonStyle = getIconButtonStyle(size)
  const buttonTextStyle = getTextStyle(size)

  return (
    <Button
      {...props}
      variant="borderless"
      backgroundColor="transparent"
      textColor="#333"
      borderless={true}
      activeOpacity={0.6}
      style={[buttonStyle, style]}
      textStyle={[buttonTextStyle, textStyle]}
    />
  )
}

// Text Button (BorderlessButton)
export const TextButton: React.FC<ButtonVariantProps> = ({
  size = "medium",
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyle = getTextButtonStyle(size, fullWidth)
  const buttonTextStyle = getTextStyle(size)

  return (
    <Button
      {...props}
      variant="borderless"
      backgroundColor="transparent"
      textColor="#5A67F2"
      borderless={true}
      activeOpacity={0.6}
      style={[buttonStyle, style]}
      textStyle={[buttonTextStyle, textStyle]}
    />
  )
}

// Helper functions for styling
const getButtonStyle = (size: "small" | "medium" | "large", fullWidth: boolean): StyleProp<ViewStyle> => {
  const baseStyle: any = {
    width: fullWidth ? "100%" : "90%",
  }

  switch (size) {
    case "small":
      return { ...baseStyle, height: 40, borderRadius: 20 }
    case "large":
      return { ...baseStyle, height: 60, borderRadius: 30 }
    default:
      return { ...baseStyle, height: 50, borderRadius: 25 }
  }
}

const getIconButtonStyle = (size: "small" | "medium" | "large"): StyleProp<ViewStyle> => {
  switch (size) {
    case "small":
      return { width: 40, height: 40, borderRadius: 20 }
    case "large":
      return { width: 60, height: 60, borderRadius: 30 }
    default:
      return { width: 50, height: 50, borderRadius: 25 }
  }
}

const getTextButtonStyle = (size: "small" | "medium" | "large", fullWidth: boolean): StyleProp<ViewStyle> => {
  const baseStyle: any = {
    width: fullWidth ? "100%" : "auto",
    paddingHorizontal: 16,
  }

  switch (size) {
    case "small":
      return { ...baseStyle, height: 36, borderRadius: 18 }
    case "large":
      return { ...baseStyle, height: 56, borderRadius: 28 }
    default:
      return { ...baseStyle, height: 44, borderRadius: 22 }
  }
}

const getTextStyle = (size: "small" | "medium" | "large"): StyleProp<TextStyle> => {
  switch (size) {
    case "small":
      return { fontSize: 14 }
    case "large":
      return { fontSize: 20 }
    default:
      return { fontSize: 16 }
  }
}
