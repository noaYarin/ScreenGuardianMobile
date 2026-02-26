import { I18nManager, StyleSheet } from 'react-native';

import { COLORS, Fonts, SIZES } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  content: {
    width: SIZES.width - SIZES.padding * 2,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding * 1.5,
    paddingHorizontal: SIZES.padding,
    backgroundColor: '#EEF2F7',
  },
  title: {
    fontSize: SIZES.title,
    color: COLORS.light.text,
    fontFamily: Fonts.rounded,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  cardsContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  cardWrapper: {
    marginVertical: SIZES.padding / 2,
  },
});