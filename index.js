/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import { AppRegistry, LogBox } from 'react-native';
import { enableExperimentalFragmentVariables } from '@apollo/client';
import { enableScreens } from 'react-native-screens';

import App from './App';
import { name as appName } from './app.json';

enableScreens();
enableExperimentalFragmentVariables();

LogBox.ignoreLogs([
  'Require cycle:',
  'Remote debugger',
  'currentlyFocusedField',
  'Non-serializable values were found in the navigation state',
  'Invariant Violation',
  'useNativeDriver',
  'VirtualizedLists should never be nested',
  'The "UMNativeModulesProxy" native module is not exported',
  'No native ExponentConstants module found,',
  'The native module for Flipper seems unavailable.',
]);

AppRegistry.registerComponent(appName, () => App);
