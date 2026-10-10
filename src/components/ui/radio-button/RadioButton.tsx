import { lightTheme } from '@/constants';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioButtonGroupProps{
    options: string[];
    selected: string;
    setSelected: (value: string) => void;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
    options,
    selected,
    setSelected
}) => {
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => setSelected(option)}
        >
          <View style={styles.radioCircle}>
            {selected === option && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.label}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: lightTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: lightTheme.primary,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default RadioButtonGroup;
