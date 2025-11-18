import { StyleSheet } from 'react-native';

export const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.text + '20',
  },
  text: {
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  card: {
    backgroundColor: colors.surface,
    margin: 8,
    borderRadius: 8,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  }
});
