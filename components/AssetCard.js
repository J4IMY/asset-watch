import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AssetCard = ({ asset, onPress }) => {
  const { colors } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return colors.secondary;
      case 'assigned': return colors.primary;
      case 'maintenance': return colors.error;
      default: return colors.text;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.assetInfo}>
          <Text style={[styles.assetName, { color: colors.text }]}>
            {asset.name}
          </Text>
          <Text style={[styles.assetTag, { color: colors.text + '80' }]}>
            Tag: {asset.asset_tag}
          </Text>
          <Text style={[styles.assetCategory, { color: colors.text + '60' }]}>
            {asset.category?.name || 'No Category'}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(asset.current_status) }
            ]}
          />
          <Text style={[styles.statusText, { color: colors.text }]}>
            {asset.current_status}
          </Text>
        </View>
      </View>
      {asset.image_url && (
        <Image source={{ uri: asset.image_url }} style={styles.assetImage} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  assetTag: {
    fontSize: 14,
    marginBottom: 2,
  },
  assetCategory: {
    fontSize: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  assetImage: {
    width: '100%',
    height: 120,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default AssetCard;
