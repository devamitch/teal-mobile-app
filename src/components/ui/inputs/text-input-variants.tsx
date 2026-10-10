"use client"

import type React from "react"
import TextInput, { type TextInputProps } from "./text-input"
import { Mail, Lock, User, Phone, Search, CreditCard } from "lucide-react-native"

// Email Input
export const EmailInput: React.FC<Omit<TextInputProps, "inputType" | "leftIcon">> = (props) => (
  <TextInput
    {...props}
    inputType="email"
    leftIcon={<Mail size={20} color="#666" />}
    validationRules={{
      required: true,
      email: true,
      ...props.validationRules,
    }}
    placeholder="Enter your email"
    autoCapitalize="none"
    autoCorrect={false}
  />
)

// Password Input
export const PasswordInput: React.FC<Omit<TextInputProps, "inputType" | "leftIcon" | "showPasswordToggle">> = (
  props,
) => (
  <TextInput
    {...props}
    inputType="password"
    leftIcon={<Lock size={20} color="#666" />}
    showPasswordToggle={true}
    validationRules={{
      required: true,
      minLength: 8,
      ...props.validationRules,
    }}
    placeholder={props.placeholder ?? "Enter your password"}
    autoCapitalize="none"
    autoCorrect={false}
  />
)

// Name Input
export const NameInput: React.FC<Omit<TextInputProps, "leftIcon">> = (props) => (
  <TextInput
    {...props}
    leftIcon={<User size={20} color="#666" />}
    validationRules={{
      required: true,
      minLength: 2,
      ...props.validationRules,
    }}
    placeholder="Enter your name"
    autoCapitalize="words"
  />
)

// Phone Input
export const PhoneInput: React.FC<Omit<TextInputProps, "inputType" | "leftIcon">> = (props) => (
  <TextInput
    {...props}
    inputType="phone"
    leftIcon={<Phone size={20} color="#666" />}
    validationRules={{
      required: true,
      phone: true,
      ...props.validationRules,
    }}
    placeholder="Enter your phone number"
  />
)

// Search Input
export const SearchInput: React.FC<Omit<TextInputProps, "inputType" | "leftIcon" | "clearable">> = (props) => (
  <TextInput
    {...props}
    inputType="search"
    leftIcon={<Search size={20} color="#666" />}
    clearable={true}
    placeholder="Search..."
    returnKeyType="search"
  />
)

// Credit Card Input
export const CreditCardInput: React.FC<Omit<TextInputProps, "leftIcon">> = (props) => (
  <TextInput
    {...props}
    leftIcon={<CreditCard size={20} color="#666" />}
    validationRules={{
      required: true,
      pattern: /^[0-9\s]{13,19}$/,
      ...props.validationRules,
    }}
    placeholder="1234 5678 9012 3456"
    maxLength={19}
    keyboardType="numeric"
  />
)
