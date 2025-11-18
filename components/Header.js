import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, onToggleTheme, onProfilePress, onNotificationsPress }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={onToggleTheme} style={styles.iconButton}>
          <Text style={{ color: colors.text }}>🌙</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificationsPress} style={styles.iconButton}>
          <Text style={{ color: colors.text }}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
          <Text style={{ color: colors.text }}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default Header;
