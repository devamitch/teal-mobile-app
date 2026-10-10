import {NavigationContainer} from '@react-navigation/native';
import {enableMapSet} from 'immer';
import React, {useEffect} from 'react';
import {
  LogBox,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import MainNavigation from './src/navigations/MainNavigation';

enableMapSet();

// enableMapSet();
LogBox.ignoreAllLogs();
export const navigationRef: any = React.createRef();

// Custom Error Boundary Component
class AppErrorBoundary extends React.Component {
  state = {hasError: false, error: null};

  static getDerivedStateFromError(error) {
    return {hasError: true, error};
  }

  componentDidCatch(error, errorInfo) {
    // Log error to crashlytics

    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  resetError = () => {
    this.setState({hasError: false, error: null});
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>
            We're sorry for the inconvenience. The app encountered an unexpected
            error.
          </Text>
          <Text style={styles.errorDetails}>
            {this?.state?.error?.toString() || 'Unknown error occurred'}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={this.resetError}>
            <Text style={styles.errorButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this?.props?.children;
  }
}

const App = () => {
  // Completion data is now automatically loaded by Zustand persistence
  useEffect(() => {
    console.log('App started - completion data automatically loaded');
  }, []);

  // console.log('Media Data:', data);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PaperProvider>
        <AppErrorBoundary>
          <NavigationContainer>
            <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />
            <MainNavigation />
          </NavigationContainer>
        </AppErrorBoundary>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#dc3545',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#343a40',
  },
  errorDetails: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6c757d',
    padding: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    width: '90%',
  },
  errorButton: {
    backgroundColor: '#049299',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
