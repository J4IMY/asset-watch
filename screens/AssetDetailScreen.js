import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/theme';
import assetService from '../services/assetService';

const AssetDetailScreen = ({ route, navigation }) => {
  const { asset: initialAsset } = route.params;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [asset, setAsset] = useState(initialAsset);

  useEffect(() => {
    loadAssetDetails();
  }, []);

  const loadAssetDetails = async () => {
    try {
      const data = await assetService.getAsset(asset.id);
      setAsset(data);
    } catch (error) {
      console.error('Error loading asset details:', error);
    }
  };

  const handleAssign = () => {
    // Navigate to assignment screen
    navigation.navigate('Assignments');
  };

  const handleReturn = async () => {
    if (!asset.assigned_user_id) return;

    Alert.alert(
      'Return Asset',
      'Are you sure you want to return this asset?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return',
          onPress: async () => {
            try {
              await assetService.returnAsset(asset.id);
              loadAssetDetails();
              Alert.alert('Success', 'Asset returned successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to return asset');
            }
          }
        }
      ]
    );
  };

  const DetailRow = ({ label, value }) => (
    <View style={detailStyles.detailRow}>
      <Text style={[detailStyles.label, { color: colors.text + '80' }]}>
        {label}:
      </Text>
      <Text style={[detailStyles.value, { color: colors.text }]}>
        {value || 'N/A'}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}>
          Asset Details
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        <View style={[styles.card, { marginBottom: 16 }]}>
          <Text style={[styles.text, { fontSize: 20, fontWeight: 'bold', marginBottom: 8 }]}>
            {asset.name}
          </Text>
          <Text style={[styles.text, { color: colors.text + '60' }]}>
            Tag: {asset.asset_tag}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 16 }]}>
            Details
          </Text>

          <DetailRow label="Category" value={asset.category?.name} />
          <DetailRow label="Serial Number" value={asset.serial_number} />
          <DetailRow label="Model" value={asset.model} />
          <DetailRow label="Manufacturer" value={asset.manufacturer} />
          <DetailRow label="Location" value={asset.location} />
          <DetailRow label="Status" value={asset.current_status} />
          <DetailRow label="Purchase Date" value={asset.purchase_date} />
          <DetailRow label="Purchase Price" value={asset.purchase_price ? `$${asset.purchase_price}` : null} />
          <DetailRow label="Warranty Expires" value={asset.warranty_expires} />

          {asset.assigned_user && (
            <DetailRow
              label="Assigned To"
              value={`${asset.assigned_user.first_name} ${asset.assigned_user.last_name}`}
            />
          )}

          {asset.notes && (
            <View style={detailStyles.detailRow}>
              <Text style={[detailStyles.label, { color: colors.text + '80' }]}>
                Notes:
              </Text>
              <Text style={[detailStyles.value, { color: colors.text }]}>
                {asset.notes}
              </Text>
            </View>
          )}
        </View>

        <View style={detailStyles.actionsContainer}>
          {asset.current_status === 'available' ? (
            <TouchableOpacity
              style={[detailStyles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleAssign}
            >
              <Text style={detailStyles.actionButtonText}>Assign Asset</Text>
            </TouchableOpacity>
          ) : asset.current_status === 'assigned' ? (
            <TouchableOpacity
              style={[detailStyles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={handleReturn}
            >
              <Text style={detailStyles.actionButtonText}>Return Asset</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

const detailStyles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: 'right',
  },
  actionsContainer: {
    marginTop: 16,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AssetDetailScreen;
