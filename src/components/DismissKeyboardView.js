import React from 'react';
import PropTypes from 'prop-types';

import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
  View,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import { ScrollView } from 'react-native-gesture-handler';

function DismissKeyboardView({ children, scrollEnabled, style, contentContainerStyle, ...props }) {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + (StatusBar.currentHeight || 0)}
      style={{ flex: 1 }}
      {...props}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={StyleSheet.flatten([{ flex: 1 }, style || undefined])}>
          {scrollEnabled ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={contentContainerStyle}>
              {children}
            </ScrollView>
          ) : (
            <>{children}</>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
DismissKeyboardView.propTypes = {
  scrollEnabled: PropTypes.bool,
};
DismissKeyboardView.defaultProps = {
  scrollEnabled: true,
};
export default DismissKeyboardView;
