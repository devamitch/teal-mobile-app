import { FONT_FAMILIES, lightTheme } from "@/constants";
import moment from "moment";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native"

interface SelectCycleProps{
    visible?: boolean;
    onRequestClose?: () => void;
    cycles: {start: moment.Moment, end: moment.Moment}[];
    onContinuePress?: (cycle: {start: moment.Moment, end: moment.Moment}) => void;
}

const SelectCycleModal: React.FC<SelectCycleProps> = ({
    visible,
    onRequestClose,
    cycles,
    onContinuePress,
}) => {
    const [selectedModalIndex, setSelectedModalIndex] = useState<number | null>(null);
    const [error, setError] = useState('');

    return(
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
                    }}
                >
                    <View
                        style={{
                            borderRadius: 20,
                            backgroundColor: 'white',
                            paddingHorizontal: 30,
                            width: '90%',
                            paddingVertical: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT_FAMILIES.YoungSerifRegular,
                                fontSize: 20,
                                width: '100%',
                                textAlign: 'center',
                                marginBottom: 10
                        }}>
                            Please Select Cycle From The Below Options
                        </Text>
                        {cycles?.map(({start, end}, index) => (
                            <TouchableOpacity 
                                onPress={() => setSelectedModalIndex(index)}
                                style={[
                                    {
                                        flexDirection: 'row', 
                                        paddingVertical: 10, 
                                        borderWidth: 1, 
                                        borderColor: lightTheme.primary,
                                        marginVertical: 5, 
                                        borderRadius: 10
                                    }, 
                                    index === selectedModalIndex && {
                                        backgroundColor: lightTheme.primary,
                                    }
                                ]}
                                key={index}
                            >
                                <Text style={[
                                    {fontSize: 16, width: '100%', textAlign: 'center'}, 
                                    index === selectedModalIndex && {color: 'white', fontWeight: 'bold'}
                                ]}>
                                    {`${start.format('MMM DD YYYY')}   -    ${end.format('MMM DD YYYY')}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        {error && 
                            <Text style={{color: 'red'}}>{error}</Text>
                        }
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 20}}>
                            <TouchableOpacity
                                onPress={() => {
                                    if(onRequestClose){
                                        setError('');
                                        onRequestClose();
                                    }
                                }}
                                style={{
                                width: '40%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 12,
                                backgroundColor: '#DDF7F4',
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
                                onPress={() => {
                                    if (
                                        selectedModalIndex !== null &&
                                        selectedModalIndex >= 0 &&
                                        selectedModalIndex < cycles.length &&
                                        onContinuePress
                                    ){
                                        setError('');
                                        onContinuePress(cycles[selectedModalIndex])
                                    } else{
                                        setError('Something went wrong. Please try again.')
                                    }
                                }}
                                style={{
                                width: '40%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 12,
                                backgroundColor: lightTheme.primary,
                                }}>
                                <Text
                                style={{
                                    fontFamily: FONT_FAMILIES.YoungSerifRegular,
                                    fontSize: 16,
                                    padding: 6,
                                    color: 'white',
                                }}>
                                Continue
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        </Modal>
    )
}

export default SelectCycleModal;