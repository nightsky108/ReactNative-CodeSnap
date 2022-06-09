import React, { useMemo } from 'react';
import { Icon } from 'react-native-elements';
import { useCartContext } from '@contexts/CartContext';
import { wp } from '@src/common/responsive';

import { Colors } from '@theme';
// eslint-disable-next-line import/no-extraneous-dependencies
import WithBadge from './WithBadge';

const CartIcon = () => {
  const { cart } = useCartContext();
  const cartSum = useMemo(() => cart?.items?.length || 0, [cart]);
  const CartBadgedIcon = cartSum > 0 ? WithBadge(cartSum, { top: 0, right: -20 })(Icon) : Icon;
  return <CartBadgedIcon name="shoppingcart" type="antdesign" color={Colors.white} size={wp(25)} />;
};

CartIcon.propTypes = {};
CartIcon.defaultProps = {};
export default CartIcon;
