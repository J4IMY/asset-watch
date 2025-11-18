import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../styles/theme';
import assetService from '../services/assetService';
import { supabase } from '../lib/supabase';

const NewAssetScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [formData, setFormData] = useState({
    asset_tag: '',
    name: '',
    description: '',
    category_id: '',
    serial_number: '',
    model: '',
    manufacturer: '',
    purchase_date: '',
    purchase_price: '',
    warranty_expires: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.asset_tag || !formData.name) {
      Alert.alert('Error', 'Asset tag and name are required');
      return;
    }

    setLoading(true);
    try {
      const assetData = {
        ...formData,
        category_id: formData.category_id || null,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        current_status: 'available',
      };

      await assetService.createAsset(assetData);
      Alert.alert('Success', 'Asset created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  const FormField = ({ label, field, placeholder, keyboardType = 'default', multiline = false }) => (
    <View style={formStyles.fieldContainer}>
      <Text style={[formStyles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[formStyles.input, {
          borderColor: colors.text + '40',
          color: colors.text,
          backgroundColor: colors.surface
        }]}
        placeholder={placeholder}
        placeholderTextColor={colors.text + '60'}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  const CategorySelector = () => {
    const selectedCategory = categories.find(cat => cat.id === formData.category_id);

    return (
      <View style={formStyles.fieldContainer}>
        <Text style={[formStyles.label, { color: colors.text }]}>Category</Text>
        <TouchableOpacity
          style={[formStyles.categorySelector, {
            backgroundColor: colors.surface,
            borderColor: colors.text + '40'
          }]}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={[formStyles.categoryText, {
            color: selectedCategory ? colors.text : colors.text + '60'
          }]}>
            {selectedCategory ? selectedCategory.name : 'Select Category'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CategoryModal = () => (
    <Modal
      visible={showCategoryModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={formStyles.modalOverlay}>
        <View style={[formStyles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[formStyles.modalTitle, { color: colors.text }]}>Select Category</Text>
          <FlatList
            data={[{ id: '', name: 'None' }, ...categories]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[formStyles.categoryItem, {
                  backgroundColor: formData.category_id === item.id ? colors.primary + '20' : 'transparent'
                }]}
                onPress={() => {
                  handleInputChange('category_id', item.id);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={[formStyles.categoryItemText, { color: colors.text }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[formStyles.closeButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowCategoryModal(false)}
          >
            <Text style={formStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: 'bold' }]}>
            New Asset
          </Text>
        </View>

        <View style={{ padding: 16 }}>
          <View style={styles.card}>
            <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 16 }]}>
              Asset Information
            </Text>

            <FormField
              label="Asset Tag *"
              field="asset_tag"
              placeholder="Enter unique asset tag"
            />

            <FormField
              label="Name *"
              field="name"
              placeholder="Enter asset name"
            />

            <FormField
              label="Description"
              field="description"
              placeholder="Enter asset description"
              multiline
            />

            <CategorySelector />

            <FormField
              label="Serial Number"
              field="serial_number"
              placeholder="Enter serial number"
            />

            <FormField
              label="Model"
              field="model"
              placeholder="Enter model"
            />

            <FormField
              label="Manufacturer"
              field="manufacturer"
              placeholder="Enter manufacturer"
            />

            <FormField
              label="Purchase Date"
              field="purchase_date"
              placeholder="YYYY-MM-DD"
            />

            <FormField
              label="Purchase Price"
              field="purchase_price"
              placeholder="Enter price"
              keyboardType="numeric"
            />

            <FormField
              label="Warranty Expires"
              field="warranty_expires"
              placeholder="YYYY-MM-DD"
            />

            <FormField
              label="Location"
              field="location"
              placeholder="Enter location"
            />

            <FormField
              label="Notes"
              field="notes"
              placeholder="Additional notes"
              multiline
            />

            <TouchableOpacity
              style={[formStyles.submitButton, {
                backgroundColor: colors.primary,
                opacity: loading ? 0.6 : 1
              }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={formStyles.submitButtonText}>
                {loading ? 'Creating...' : 'Create Asset'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <CategoryModal />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const formStyles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categorySelector: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryItemText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewAssetScreen;
