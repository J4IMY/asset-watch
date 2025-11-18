import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const { colors } = useTheme();

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'assets', label: 'Assets', icon: '📦' },
    { key: 'assignments', label: 'Assignments', icon: '📋' },
    { key: 'reports', label: 'Reports', icon: '📈' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
        >
          <Text style={[styles.icon, activeTab === tab.key && styles.activeIcon]}>
            {tab.icon}
          </Text>
          <Text
            style={[
              styles.label,
              { color: colors.text },
              activeTab === tab.key && styles.activeLabel
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeIcon: {
    color: '#1976D2',
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
  activeLabel: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
