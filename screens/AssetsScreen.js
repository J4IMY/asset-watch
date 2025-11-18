import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/theme';
import AssetCard from '../components/AssetCard';
import assetService from '../services/assetService';

const AssetsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadAssets();
  }, [filters]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await assetService.getAssets(filters);
      setAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetPress = (asset) => {
    navigation.navigate('AssetDetail', { asset });
  };

  const FilterButton = ({ title, active, onPress }) => (
    <TouchableOpacity
      style={[
        filterStyles.filterButton,
        active && { backgroundColor: colors.primary }
      ]}
      onPress={onPress}
    >
      <Text style={[
        filterStyles.filterText,
        { color: active ? 'white' : colors.text }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderAsset = ({ item }) => (
    <AssetCard asset={item} onPress={() => handleAssetPress(item)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}>
          Assets
        </Text>
      </View>

      <View style={filterStyles.filtersContainer}>
        <FilterButton
          title="All"
          active={!filters.status}
          onPress={() => setFilters({})}
        />
        <FilterButton
          title="Available"
          active={filters.status === 'available'}
          onPress={() => setFilters({ status: 'available' })}
        />
        <FilterButton
          title="Assigned"
          active={filters.status === 'assigned'}
          onPress={() => setFilters({ status: 'assigned' })}
        />
        <FilterButton
          title="Maintenance"
          active={filters.status === 'maintenance'}
          onPress={() => setFilters({ status: 'maintenance' })}
        />
      </View>

      <FlatList
        data={assets}
        renderItem={renderAsset}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadAssets}
        ListEmptyComponent={
          <View style={filterStyles.emptyContainer}>
            <Text style={[styles.text, { color: colors.text + '60' }]}>
              {loading ? 'Loading assets...' : 'No assets found'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[filterStyles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('NewAsset')}
      >
        <Text style={filterStyles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const filterStyles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterText: {
    fontSize: 14,
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

export default AssetsScreen;
