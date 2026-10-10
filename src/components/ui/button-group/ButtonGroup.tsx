import {TextStyle, View, ViewStyle} from 'react-native';
import {PrimaryButton, SecondaryButton} from '../buttons/button-variants';

interface ButtonGroupProps {
  ContainerStyle?: ViewStyle;
  buttonProps: {text: string; onPress: (text: string) => void}[];
  ButtonStyle?: ViewStyle;
  TextStyle?: TextStyle;
  SelectedButtonStyle?: ViewStyle;
  SelectedTextStyle?: TextStyle;
  condtionFuntion?: (val: string) => boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  ContainerStyle,
  buttonProps,
  ButtonStyle,
  TextStyle,
  SelectedButtonStyle,
  SelectedTextStyle,
  condtionFuntion,
}) => {
  const renderButton = (
    button: {text: string; onPress: (text: string) => void},
    index: number,
    isFullWidth = false,
  ) => {
    const buttonWidth = isFullWidth ? '100%' : '48%';

    return (
      <View key={index} style={{width: buttonWidth}}>
        {condtionFuntion && condtionFuntion(button.text) ? (
          <PrimaryButton
            text={button.text}
            onPress={() => button.onPress(button.text)}
            style={[ButtonStyle, SelectedButtonStyle]}
            textStyle={[TextStyle, SelectedTextStyle]}
          />
        ) : (
          <SecondaryButton
            text={button.text}
            onPress={() => button.onPress(button.text)}
            style={ButtonStyle}
            textStyle={TextStyle}
          />
        )}
      </View>
    );
  };

  const renderRows = () => {
    const rows = [];
    const totalButtons = buttonProps.length;

    for (let i = 0; i < totalButtons; i += 2) {
      const firstButton = buttonProps[i];
      const secondButton = buttonProps[i + 1];
      const isLastRow = i + 2 >= totalButtons;
      const hasOnlyOneButtonInLastRow = isLastRow && totalButtons % 2 === 1;

      if (hasOnlyOneButtonInLastRow && firstButton) {
        // Last button takes full width
        rows.push(
          <View key={`row-${i}`} style={{width: '100%', marginBottom: 10}}>
            {renderButton(firstButton, i, true)}
          </View>,
        );
      } else if (firstButton) {
        // Two buttons in a row
        rows.push(
          <View
            key={`row-${i}`}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 10,
            }}>
            {renderButton(firstButton, i)}
            {secondButton && renderButton(secondButton, i + 1)}
          </View>,
        );
      }
    }

    return rows;
  };

  return (
    <View
      style={[
        {
          width: '100%',
        },
        ContainerStyle,
      ]}>
      {renderRows()}
    </View>
  );
};

export default ButtonGroup;

{
  /*<TouchableOpacity 
                    key={index} 
                    onPress={() => button.onPress(button.text)} 
                    style={[
                        {padding: 8, borderRadius: 14, margin: 5, borderColor: lightTheme.primary, borderWidth: 1, alignItems: 'center', justifyContent: 'center', ...ButtonStyle},
                        (condtionFuntion ? condtionFuntion(button.text) : false) && {backgroundColor: lightTheme.primary, ...SelectedButtonStyle}
                    ]}
                >
                    <Text 
                        style={[
                            {fontSize: 18, fontFamily: FONT_FAMILIES.LatoRegular, textAlign: 'center', ...TextStyle},
                            (condtionFuntion ? condtionFuntion(button.text) : false) && {color: 'white', ...SelectedTextStyle}
                        ]}
                    >{button.text}</Text>
                </TouchableOpacity>*/
}
