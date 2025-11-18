import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { createStyles } from '../styles/theme';

const SettingsScreen = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const styles = createStyles(colors);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  const SettingItem = ({ title, subtitle, onPress, rightText }) => (
    <TouchableOpacity style={settingStyles.settingItem} onPress={onPress}>
      <View style={settingStyles.settingContent}>
        <Text style={[styles.text, { fontSize: 16 }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.text, { color: colors.text + '60', fontSize: 14 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightText && (
        <Text style={[styles.text, { color: colors.primary }]}>
          {rightText}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}>
          Settings
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        <View style={[styles.card, { marginBottom: 16 }]}>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 16 }]}>
            Account
          </Text>
          <SettingItem
            title="Email"
            subtitle={user?.email}
          />
          <SettingItem
            title="User ID"
            subtitle={user?.id}
          />
        </View>

        <View style={[styles.card, { marginBottom: 16 }]}>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 16 }]}>
            Appearance
          </Text>
          <SettingItem
            title="Theme"
            subtitle={`Current: ${theme === 'light' ? 'Light' : 'Dark'}`}
            rightText={theme === 'light' ? 'Dark' : 'Light'}
            onPress={toggleTheme}
          />
        </View>

        <View style={[styles.card, { marginBottom: 16 }]}>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 16 }]}>
            Support
          </Text>
          <SettingItem
            title="Help & Support"
            subtitle="Get help with using AssetWatch"
            onPress={() => Alert.alert('Help', 'Help functionality coming soon!')}
          />
          <SettingItem
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'AssetWatch - Professional Asset Management')}
          />
        </View>

        <TouchableOpacity
          style={[settingStyles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <Text style={settingStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const settingStyles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
