# AssetWatch

A professional mobile-first asset management application with real-time tracking, assignment management, and comprehensive reporting. Built with React Native, Expo, and Supabase.

## Features

- **Real-time Asset Tracking**: Monitor asset status, location, and assignments in real-time
- **Dual Theme Support**: Light and dark mode with smooth transitions
- **User Authentication**: Secure login/signup with Supabase Auth
- **Asset Management**: CRUD operations for assets with categories and detailed information
- **Assignment System**: Assign assets to employees with due dates and tracking
- **Maintenance Tracking**: Schedule and track maintenance activities
- **Interactive Reports**: Charts and analytics for asset insights
- **Offline Support**: Basic functionality when offline (planned)

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Navigation**: React Navigation
- **Charts**: react-native-chart-kit
- **State Management**: React Context API
- **Styling**: Theme-aware custom styles

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd assetwatch
npm install
```

### 2. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL schema from `database_schema.sql` in the Supabase SQL editor
4. Enable Row Level Security (RLS) and real-time features

### 3. Environment Configuration

Update `.env` with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the App

```bash
npm start
```

Use Expo Go app on your phone or run in simulator.

## Database Schema

The app uses the following main tables:

- `users` - User profiles linked to Supabase auth
- `asset_categories` - Asset categories
- `assets` - Main asset information
- `asset_assignments` - Asset assignment records
- `maintenance_records` - Maintenance history
- `asset_location_history` - Location change tracking

## Project Structure

```
assetwatch/
├── components/          # Reusable UI components
│   ├── Header.js
│   ├── AssetCard.js
│   └── BottomNavigation.js
├── context/            # React contexts
│   ├── AuthContext.js
│   └── ThemeContext.js
├── hooks/              # Custom React hooks
│   └── useRealtimeAssets.js
├── lib/                # External service configurations
│   └── supabase.js
├── screens/            # App screens
│   ├── LoginScreen.js
│   ├── DashboardScreen.js
│   ├── AssetsScreen.js
│   ├── AssetDetailScreen.js
│   ├── AssignmentsScreen.js
│   ├── ReportsScreen.js
│   └── SettingsScreen.js
├── services/           # Business logic services
│   └── assetService.js
├── styles/             # Theme and styling utilities
│   └── theme.js
├── App.js              # Main app component
├── database_schema.sql # Supabase database schema
└── README.md
```

## Color Schemes

### Light Mode
- Primary: #1976D2
- Secondary: #4CAF50
- Background: #F5F7FA
- Surface: #FFFFFF
- Text: #2D3748
- Error: #E53E3E

### Dark Mode
- Primary: #64B5F6
- Secondary: #81C784
- Background: #1A202C
- Surface: #2D3748
- Text: #E2E8F0
- Error: #FC8181

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
