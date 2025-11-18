import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/theme';
import assetService from '../services/assetService';

const AssignmentsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      // For now, we'll get assigned assets and show them as assignments
      const assets = await assetService.getAssets({ status: 'assigned' });
      setAssignments(assets);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetPress = (asset) => {
    navigation.navigate('AssetDetail', { asset });
  };

  const AssignmentCard = ({ asset }) => (
    <TouchableOpacity
      style={[styles.card, { margin: 8 }]}
      onPress={() => handleAssetPress(asset)}
    >
      <View style={assignmentStyles.cardContent}>
        <View style={assignmentStyles.assetInfo}>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>
            {asset.name}
          </Text>
          <Text style={[styles.text, { color: colors.text + '60' }]}>
            Tag: {asset.asset_tag}
          </Text>
          {asset.assigned_user && (
            <Text style={[styles.text, { color: colors.text + '80' }]}>
              Assigned to: {asset.assigned_user.first_name} {asset.assigned_user.last_name}
            </Text>
          )}
        </View>
        <View style={assignmentStyles.statusContainer}>
          <Text style={[assignmentStyles.statusText, { color: colors.primary }]}>
            Active
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}>
          Assignments
        </Text>
      </View>

      <FlatList
        data={assignments}
        renderItem={({ item }) => <AssignmentCard asset={item} />}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadAssignments}
        ListEmptyComponent={
          <View style={assignmentStyles.emptyContainer}>
            <Text style={[styles.text, { color: colors.text + '60' }]}>
              {loading ? 'Loading assignments...' : 'No active assignments'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[assignmentStyles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('NewAssignment')}
      >
        <Text style={assignmentStyles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const assignmentStyles = StyleSheet.create({
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetInfo: {
    flex: 1,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AssignmentsScreen;
