import Snackbar from 'react-native-snackbar';

export const Toast = async (text: string) => {
    await new Promise((resolve: any) => setTimeout(resolve, 100))
    return Snackbar.show({
        text: text,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'black',
        textColor: 'white',
    });
};