import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/theme';
import assetService from '../services/assetService';

const DashboardScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    maintenanceAssets: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const assets = await assetService.getAssets();
      const totalAssets = assets.length;
      const availableAssets = assets.filter(a => a.current_status === 'available').length;
      const assignedAssets = assets.filter(a => a.current_status === 'assigned').length;
      const maintenanceAssets = assets.filter(a => a.current_status === 'maintenance').length;

      setStats({
        totalAssets,
        availableAssets,
        assignedAssets,
        maintenanceAssets,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ title, value, color }) => (
    <View style={[styles.card, { flex: 1, margin: 4 }]}>
      <Text style={[styles.text, { fontSize: 14, marginBottom: 8 }]}>{title}</Text>
      <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold', color }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}>
          Dashboard
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={[styles.text, { fontSize: 18, marginBottom: 16 }]}>
          Asset Overview
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <StatCard
            title="Total Assets"
            value={stats.totalAssets}
            color={colors.primary}
          />
          <StatCard
            title="Available"
            value={stats.availableAssets}
            color={colors.secondary}
          />
          <StatCard
            title="Assigned"
            value={stats.assignedAssets}
            color={colors.primary}
          />
          <StatCard
            title="Maintenance"
            value={stats.maintenanceAssets}
            color={colors.error}
          />
        </View>

        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold', marginBottom: 8 }]}>
            Recent Activity
          </Text>
          <Text style={[styles.text, { color: colors.text + '60' }]}>
            No recent activity to display
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
