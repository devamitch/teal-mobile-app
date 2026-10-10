/**
 * @format
 */

import {enableMapSet} from 'immer';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

enableMapSet();

AppRegistry.registerComponent(appName, () => App);
