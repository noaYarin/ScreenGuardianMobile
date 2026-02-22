import { StyleSheet } from 'react-native';

import { COLORS, Fonts, SIZES } from '../../../constants/theme';

export const roleCardStyles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.title,
    color: COLORS.light.text,
    fontFamily: Fonts.rounded,
    textAlign: 'center',
  },
  description: {
    fontSize: SIZES.description,
    color: COLORS.light.text,
    fontFamily: Fonts.rounded,
    textAlign: 'center',
    marginTop: 12,
  },
});

