-- AssetWatch Database Schema for Supabase

-- Users table (using Supabase auth)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'staff', -- admin, manager, staff
    department VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Asset categories
CREATE TABLE asset_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for categories
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated users" ON asset_categories FOR ALL USING (auth.role() = 'authenticated');

-- Assets table
CREATE TABLE assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES asset_categories(id),
    serial_number VARCHAR(100),
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    warranty_expires DATE,
    current_status VARCHAR(20) DEFAULT 'available', -- available, assigned, maintenance, retired
    location VARCHAR(100),
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_user_id UUID REFERENCES users(id),
    maintenance_required BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id)
);

-- RLS for assets
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated users" ON assets FOR ALL USING (auth.role() = 'authenticated');

-- Employee assignments
CREATE TABLE asset_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    assigned_user_id UUID REFERENCES users(id),
    assigned_by_user_id UUID REFERENCES users(id),
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date DATE,
    return_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, returned, overdue
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for assignments
ALTER TABLE asset_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated users" ON asset_assignments FOR ALL USING (auth.role() = 'authenticated');

-- Maintenance records
CREATE TABLE maintenance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    performed_by_user_id UUID REFERENCES users(id),
    maintenance_type VARCHAR(50), -- preventive, repair, upgrade
    description TEXT,
    cost DECIMAL(10,2),
    scheduled_date DATE,
    completed_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for maintenance records
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated users" ON maintenance_records FOR ALL USING (auth.role() = 'authenticated');

-- Asset location history
CREATE TABLE asset_location_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    old_location VARCHAR(100),
    new_location VARCHAR(100),
    changed_by_user_id UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason VARCHAR(200)
);

-- RLS for location history
ALTER TABLE asset_location_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated users" ON asset_location_history FOR ALL USING (auth.role() = 'authenticated');

-- Database Functions & Triggers

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON asset_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username, first_name, last_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Performance indexes
CREATE INDEX idx_assets_status ON assets(current_status);
CREATE INDEX idx_assets_category ON assets(category_id);
CREATE INDEX idx_assets_location ON assets(location);
CREATE INDEX idx_assets_tag ON assets(asset_tag);
CREATE INDEX idx_assignments_user ON asset_assignments(assigned_user_id);
CREATE INDEX idx_assignments_status ON asset_assignments(status);
CREATE INDEX idx_maintenance_asset ON maintenance_records(asset_id);
CREATE INDEX idx_maintenance_date ON maintenance_records(scheduled_date);
CREATE INDEX idx_users_role ON users(role);
