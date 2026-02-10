import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  slideContainer: {
    width: SIZES.width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  imageBackground: {
    width: SIZES.width,
    height: SIZES.height,
    borderRadius: SIZES.radius,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: '800',
    color: COLORS.light.text,
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: SIZES.description,
    color: COLORS.light.icon,
    textAlign: 'center',
    lineHeight: 26,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.light.tint,
    paddingLeft: 10,
  },
});

