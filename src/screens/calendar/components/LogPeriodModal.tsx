import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import moment from 'moment';
import {
  Modal,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {useState, useCallback} from 'react';
import useAppStore from '@/core/stores';
import AlertBox from '@/components/ui/modal/alert-box';
import DateDropdownPicker from '@/components/ui/date-dropdown-picker/DateDropdownPicker';

interface LogPeriodModalProps {
  visible: boolean;
  onRequestClose: () => void;
  startDate: Date;
  onStartDateChange: (date: Date) => void;
  isToggleOn?: boolean;
  onTogglePress?: () => void;
  onRequestConfirmation: (pendingSaveData: {
    start: moment.Moment;
    end: moment.Moment;
    totalDays: number;
  }) => void;
  isSaving: boolean;
  isLoading: boolean;
}

const LogPeriodModal: React.FC<LogPeriodModalProps> = ({
  visible,
  onRequestClose,
  startDate,
  onStartDateChange,
  isToggleOn,
  onTogglePress,
  onRequestConfirmation,
  isSaving,
  isLoading,
}) => {
  const Colors = lightTheme;

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [shouldCloseModal, setShouldCloseModal] = useState(false);

  const {getQuizWithID} = useAppStore(state => state.engagement);
  const {resetDailySymptoms} = useAppStore(state => state.recent_symptom);

  const showAlert = (title: string, message: string, shouldClose = false) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShouldCloseModal(shouldClose);
    setAlertVisible(true);
  };

  const handleDateChange = useCallback(
    (date: moment.Moment | undefined) => {
      if (date) {
        onStartDateChange(date.toDate());
      }
    },
    [onStartDateChange],
  );

  const handleSave = async () => {
    try {
      // Validate dates
      const start = moment(startDate);
      const end = moment(startDate).clone().add(4);

      const total_days = getQuizWithID(5)?.answer || 28;

      if (start.isAfter(end)) {
        showAlert('Invalid Dates', 'Start date cannot be after end date');
        return;
      }

      if (start.isAfter(moment())) {
        showAlert('Invalid Date', 'Start date cannot be in the future');
        return;
      }

      // Ask parent to show confirmation modal and close this modal
      onRequestConfirmation({
        start,
        end,
        totalDays: total_days,
      });
      resetDailySymptoms();
      // The parent should now close this modal by setting visible=false
    } catch (error) {
      console.error('Error validating period dates:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      showAlert('Error', errorMessage);
    }
  };

  const menopauseSelected =
    getQuizWithID(4)?.answer ===
    'I am in natural, chemical or surgical menopause';

  return (
    <>
      <Modal
        visible={visible}
        onRequestClose={onRequestClose}
        animationType="slide"
        transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              borderRadius: 20,
              backgroundColor: 'white',
              paddingHorizontal: 15,
              width: '90%',
              paddingVertical: 30,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                paddingBottom: 20,
              }}>
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.YoungSerifRegular,
                  fontSize: 20,
                  width: '80%',
                  paddingLeft: '20%',
                  textAlign: 'center',
                }}>
                Log Period Date
              </Text>
              <TouchableOpacity
                onPress={onRequestClose}
                style={{width: '10%', marginLeft: 'auto'}}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: FONT_FAMILIES.YoungSerifRegular,
                  }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingLeft: 10,
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.LatoRegular,
                  fontSize: 16,
                  marginBottom: 10,
                  fontWeight: '600',
                  color: Colors.textDark,
                }}>
                Cycle Start Date
              </Text>
              {menopauseSelected ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderColor: Colors.primary,
                    borderWidth: 1,
                    borderRadius: 12,
                    backgroundColor: '#eee',
                  }}>
                  <Text style={{marginRight: 12, fontSize: 20}}>📅</Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 16,
                      fontFamily: FONT_FAMILIES.LatoRegular,
                      color: Colors.textDark,
                    }}>
                    Not applicable for menopause
                  </Text>
                </View>
              ) : (
                <DateDropdownPicker
                  label=""
                  onDateChange={handleDateChange}
                  initialDate={moment(startDate)}
                  required
                />
              )}
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.LatoRegular,
                  fontSize: 12,
                  color: Colors.textMild,
                  marginTop: 10,
                  paddingHorizontal: 10,
                }}>
                Note: Logging a new period will start a new cycle and
                recalculate your predictions.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 10,
                paddingBottom: 15,
              }}>
              <Text style={{fontSize: 16, padding: 11}}>Irregular Periods</Text>
              <Switch
                trackColor={{false: '#767577', true: Colors.primary}}
                onValueChange={onTogglePress}
                value={isToggleOn}
                style={{marginLeft: 'auto', marginRight: 45}}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={onRequestClose}
                disabled={isSaving || isLoading}
                style={{
                  width: '40%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  backgroundColor: '#DDF7F4',
                  opacity: isSaving || isLoading ? 0.6 : 1,
                }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.YoungSerifRegular,
                    fontSize: 16,
                    padding: 6,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving || isLoading || menopauseSelected}
                style={{
                  width: '40%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  backgroundColor: menopauseSelected ? '#eee' : Colors.primary,
                  opacity: isSaving || isLoading || menopauseSelected ? 0.6 : 1,
                }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILIES.YoungSerifRegular,
                    fontSize: 16,
                    padding: 6,
                    color: menopauseSelected ? Colors.textDark : 'white',
                  }}>
                  {menopauseSelected
                    ? 'Not applicable'
                    : isSaving || isLoading
                    ? 'Saving...'
                    : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AlertBox
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          if (shouldCloseModal) {
            setShouldCloseModal(false);
          }
        }}
        onModalHide={() => {
          if (shouldCloseModal && onRequestClose) {
            onRequestClose();
          }
        }}
      />
    </>
  );
};

export default LogPeriodModal;
