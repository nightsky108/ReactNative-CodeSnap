import { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { Keyboard } from 'react-native';

const useComponentWillMount = func => {
  const willMount = useRef(true);
  if (willMount.current) {
    func();
  }
  useComponentDidMount(() => {
    willMount.current = false;
  });
};

const useComponentDidMount = func => useEffect(func, []);

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardDidShow = useCallback(e => {
    setKeyboardHeight(e.endCoordinates.height);
  }, []);

  const onKeyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
    };
  }, [onKeyboardDidHide, onKeyboardDidShow]);

  return [keyboardHeight];
};
export const useIsMountedRef = () => {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  });
  return isMountedRef;
};
export const useComponentSize = () => {
  const [size, setSize] = useState(null);

  const onLayout = useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};
export const useUpdateLayoutEffect = (effect = () => {}, dependencies = []) => {
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
  }, dependencies);
};
export const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
};
