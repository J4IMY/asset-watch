import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/theme';
import assetService from '../services/assetService';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const ReportsScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [reportData, setReportData] = useState({
    totalAssets: 0,
    statusBreakdown: [],
    categoryBreakdown: [],
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      const assets = await assetService.getAssets();

      const totalAssets = assets.length;
      const statusBreakdown = [
        { name: 'Available', count: assets.filter(a => a.current_status === 'available').length, color: colors.secondary },
        { name: 'Assigned', count: assets.filter(a => a.current_status === 'assigned').length, color: colors.primary },
        { name: 'Maintenance', count: assets.filter(a => a.current_status === 'maintenance').length, color: colors.error },
      ];

      const categoryMap = {};
      assets.forEach(asset => {
        const category = asset.category?.name || 'Uncategorized';
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });

      const categoryBreakdown = Object.entries(categoryMap).map(([name, count]) => ({
        name,
        count,
        color: colors.primary,
      }));

      setReportData({
        totalAssets,
        statusBreakdown,
        categoryBreakdown,
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}>
          Reports
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        <View style={[styles.card, { marginBottom: 16 }]}>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 16 }]}>
            Asset Status Overview
          </Text>
          <PieChart
            data={reportData.statusBreakdown.map(item => ({
              name: item.name,
              population: item.count,
              color: item.color,
              legendFontColor: colors.text,
              legendFontSize: 15,
            }))}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>

        <View style={[styles.card, { marginBottom: 16 }]}>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 16 }]}>
            Assets by Category
          </Text>
          <BarChart
            data={{
              labels: reportData.categoryBreakdown.map(item => item.name),
              datasets: [{
                data: reportData.categoryBreakdown.map(item => item.count),
              }],
            }}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
        </View>

        <View style={styles.card}>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 16 }]}>
            Summary Statistics
          </Text>
          <View style={reportStyles.statsContainer}>
            <View style={reportStyles.statItem}>
              <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold', color: colors.primary }]}>
                {reportData.totalAssets}
              </Text>
              <Text style={[styles.text, { color: colors.text + '60' }]}>
                Total Assets
              </Text>
            </View>
            <View style={reportStyles.statItem}>
              <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold', color: colors.secondary }]}>
                {reportData.statusBreakdown.find(s => s.name === 'Available')?.count || 0}
              </Text>
              <Text style={[styles.text, { color: colors.text + '60' }]}>
                Available
              </Text>
            </View>
            <View style={reportStyles.statItem}>
              <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold', color: colors.primary }]}>
                {reportData.statusBreakdown.find(s => s.name === 'Assigned')?.count || 0}
              </Text>
              <Text style={[styles.text, { color: colors.text + '60' }]}>
                Assigned
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const reportStyles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
});

export default ReportsScreen;
