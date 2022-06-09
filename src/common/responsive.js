import { Dimensions, PixelRatio, Platform } from 'react-native';
import * as Constant from '@theme/Metrics';

const pixelRatio = PixelRatio.get();

export const Dimension = {
  viewportWidth: Dimensions.get('window').width,
  viewportHeight: Dimensions.get('window').height,
  screenWidth: Dimensions.get('screen').width,
  screenHeight: Dimensions.get('screen').height,
  roundScreenWidth: Math.round(Dimensions.get('window').width),
};

export const DESIGN_WIDTH = 375;
export const DESIGN_HEIGHT = 667;

export function wp(width) {
  const elemWidth =
    typeof width === 'number'
      ? parseFloat(width / DESIGN_WIDTH)
      : parseFloat(parseFloat(width) / DESIGN_WIDTH);
  return parseInt(PixelRatio.roundToNearestPixel(Dimension.viewportWidth * elemWidth), 10);
}

export function hp(height) {
  const elemHeight =
    typeof height === 'number'
      ? parseFloat(height / DESIGN_HEIGHT)
      : parseFloat(parseFloat(height) / DESIGN_HEIGHT);
  return parseInt(PixelRatio.roundToNearestPixel(Dimension.viewportHeight * elemHeight), 10);
}
export const getAdjustSize = ({ width = 1, height = 1 }) => {
  const aspectRatio = width / height;
  const adjustWidth = wp(width);
  const adjustHeight = adjustWidth / aspectRatio;
  return { width: parseInt(adjustWidth, 10), height: parseInt(adjustHeight, 10) };
};
export const adjustFontSize = size => {
  if (Platform.OS === 'ios') {
    if (pixelRatio === 2) {
      // iphone 5s and older Androids
      if (Dimension.viewportWidth < 360) {
        return size * 0.8;
      }
      // iphone 5
      if (Dimension.viewportHeight < 667) {
        return size * 0.6;
        // iphone 6-6s
      } else if (Dimension.viewportHeight >= 667 && Dimension.viewportHeight <= 735) {
        return size * 1.15;
      }
      // older phablets
      return size * 1.25;
    }
    if (pixelRatio === 3) {
      // catch Android font scaling on small machines
      // where pixel ratio / font scale ratio => 3:3
      if (Dimension.viewportWidth <= 360) {
        return size;
      }
      // Catch other weird android width sizings
      if (Dimension.viewportHeight < 667) {
        return size * 1.15;
        // catch in-between size Androids and scale font up
        // a tad but not too much
      }
      if (Dimension.viewportHeight >= 667 && Dimension.viewportHeight <= 735) {
        return size * 1.2;
      }
      // catch larger devices
      // ie iphone 6s plus / 7 plus / mi note 等等
      return size * 1.27;
    }
    if (pixelRatio === 3.5) {
      // catch Android font scaling on small machines
      // where pixel ratio / font scale ratio => 3:3
      if (Dimension.viewportWidth <= 360) {
        return size;
        // Catch other smaller android height sizings
      }
      if (Dimension.viewportHeight < 667) {
        return size * 1.2;
        // catch in-between size Androids and scale font up
        // a tad but not too much
      }
      if (Dimension.viewportHeight >= 667 && Dimension.viewportHeight <= 735) {
        return size * 1.25;
      }
      // catch larger phablet devices
      return size * 1.4;
    }
    // if older device ie pixelRatio !== 2 || 3 || 3.5
    return size;
  } else {
    return (
      (parseInt(size, 10) *
        Dimension.roundScreenWidth *
        (1.8 - 0.002 * Dimension.roundScreenWidth)) /
      400
    );
  }
};
const types = ['Left', 'Right', 'Top', 'Bottom', 'Horizontal', 'Vertical'];

const getMPStyle = (sizeValues, prefix) =>
  Object.values(sizeValues).reduce((preV, curV, idxV) => {
    const styles = types.reduce(
      (preT, curT) => ({
        ...preT,
        [curT.toLowerCase() + idxV]: { [prefix + curT]: curV },
      }),
      {},
    );
    return {
      ...preV,
      ...styles,
    };
  }, {});
export const Margin = getMPStyle(Constant.MarginSize, 'margin');
export const Padding = getMPStyle(Constant.PaddingSize, 'padding');
