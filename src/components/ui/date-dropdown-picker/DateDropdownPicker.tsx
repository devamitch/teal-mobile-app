import moment from 'moment';
import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import Feather from 'react-native-vector-icons/Feather';

interface DateDropdownPickerProps {
  label: string;
  onDateChange: (date: moment.Moment | undefined) => void;
  initialDate?: moment.Moment | undefined; // Make initialDate explicitly optional and allow undefined
  required?: boolean;
}

const generateDays = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push({label: String(i), value: String(i)});
  }
  return days;
};

const generateMonths = () => {
  const months = moment.months().map((month, index) => ({
    label: month,
    value: String(index + 1), // moment months are 0-indexed, but we want 1-12
  }));
  return months;
};

const generateYears = () => {
  const currentYear = moment().year();
  const years = [];
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push({label: String(i), value: String(i)});
  }
  return years;
};

const DateDropdownPicker: React.FC<DateDropdownPickerProps> = ({
  label,
  onDateChange,
  initialDate,
  required,
}) => {
  const [selectedDay, setSelectedDay] = useState<string | undefined>(
    initialDate ? String(initialDate.date()) : undefined,
  );
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    initialDate ? String(initialDate.month() + 1) : undefined,
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    initialDate ? String(initialDate.year()) : undefined,
  );

  const dayList = useMemo(() => generateDays(), []);
  const monthList = useMemo(() => generateMonths(), []);
  const yearList = useMemo(() => generateYears(), []);

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const day = parseInt(selectedDay, 10);
      const month = parseInt(selectedMonth, 10);
      const year = parseInt(selectedYear, 10);
      const newDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');

      if (newDate.isValid() && !newDate.isAfter(moment())) {
        onDateChange(newDate);
      } else {
        onDateChange(undefined); // Invalid date
      }
    } else {
      onDateChange(undefined);
    }
  }, [selectedDay, selectedMonth, selectedYear, onDateChange]);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requiredIndicator}> *</Text>}
      </Text>
      <View style={styles.datePickerContainer}>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedDay}
            onValueChange={(itemValue: string | undefined) =>
              setSelectedDay(itemValue)
            }
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'}>
            <Picker.Item label="DD" value={undefined} enabled={false} />
            {dayList.map(item => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue: string | undefined) =>
              setSelectedMonth(itemValue)
            }
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'}>
            <Picker.Item label="MM" value={undefined} enabled={false} />
            {monthList.map(item => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue: string | undefined) =>
              setSelectedYear(itemValue)
            }
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'}>
            <Picker.Item label="YYYY" value={undefined} enabled={false} />
            {yearList.map(item => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    // marginBottom: 25,
    width: '100%', // Ensure the component takes full width
  },
  label: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 16,
    color: lightTheme.textDark,
    marginBottom: 10,
    fontWeight: '600',
  },
  requiredIndicator: {
    color: 'red',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  pickerBox: {
    flex: 1,
    borderRadius: 12,
    borderColor: lightTheme.primary,
    borderWidth: 1,
    backgroundColor: 'white',
    overflow: 'hidden', // Ensures the picker content stays within bounds
    height: 50, // Fixed height for consistency
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50, // iOS picker is taller by default
    width: '100%',
    color: lightTheme.textDark,
  },
  pickerItem: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 16,
    height: Platform.OS === 'ios' ? 150 : 50,
    color: lightTheme.textDark,
  },
});

export default DateDropdownPicker;
