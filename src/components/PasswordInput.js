import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { InputElement } from '@src/common/StyledComponents';
import { Colors } from '@theme';

const PasswordInput = (props, ref) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const inputRef = useRef(null);
  const onToggleVisiblePass = () => {
    setVisiblePassword(visible => !visible);
  };
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef?.current?.focus();
    },
  }));
  return (
    <InputElement
      ref={inputRef}
      secureTextEntry={!visiblePassword}
      rightIcon={{
        type: 'ionicon',
        name: visiblePassword ? 'eye' : 'eye-off',
        onPress: onToggleVisiblePass,
        color: Colors.placeholderColor,
      }}
      {...props}
    />
  );
};
export default forwardRef(PasswordInput);
