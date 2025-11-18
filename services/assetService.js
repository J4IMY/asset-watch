import { supabase } from '../lib/supabase';

class AssetService {
  // Get all assets
  async getAssets(filters = {}) {
    let query = supabase
      .from('assets')
      .select(`
        *,
        category:asset_categories(name),
        assigned_user:users!assets_assigned_user_id_fkey(username, first_name, last_name),
        created_by_user:users!assets_created_by_fkey(username, first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('current_status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get single asset
  async getAsset(id) {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        category:asset_categories(name),
        assigned_user:users!assets_assigned_user_id_fkey(username, first_name, last_name),
        created_by_user:users!assets_created_by_fkey(username, first_name, last_name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create asset
  async createAsset(assetData) {
    const { data, error } = await supabase
      .from('assets')
      .insert([{
        ...assetData,
        created_by: supabase.auth.user().id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update asset
  async updateAsset(id, assetData) {
    const { data, error } = await supabase
      .from('assets')
      .update(assetData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete asset
  async deleteAsset(id) {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Assign asset to user
  async assignAsset(assetId, userId, dueDate) {
    const { data, error } = await supabase
      .from('asset_assignments')
      .insert([{
        asset_id: assetId,
        assigned_user_id: userId,
        assigned_by_user_id: supabase.auth.user().id,
        due_date: dueDate,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;

    // Update asset status
    await supabase
      .from('assets')
      .update({
        current_status: 'assigned',
        assigned_user_id: userId
      })
      .eq('id', assetId);

    return data;
  }

  // Return asset
  async returnAsset(assetId) {
    // Find the active assignment for this asset
    const { data: assignment, error: findError } = await supabase
      .from('asset_assignments')
      .select('id')
      .eq('asset_id', assetId)
      .eq('status', 'active')
      .single();

    if (findError) throw findError;

    // Update the assignment
    const { data: updatedAssignment, error: updateError } = await supabase
      .from('asset_assignments')
      .update({
        return_date: new Date(),
        status: 'returned'
      })
      .eq('id', assignment.id)
      .select('asset_id')
      .single();

    if (updateError) throw updateError;

    // Update asset status
    await supabase
      .from('assets')
      .update({
        current_status: 'available',
        assigned_user_id: null
      })
      .eq('id', assetId);

    return updatedAssignment;
  }
}

export default new AssetService();
