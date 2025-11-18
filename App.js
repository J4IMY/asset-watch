import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import AssetsScreen from './screens/AssetsScreen';
import AssetDetailScreen from './screens/AssetDetailScreen';
import NewAssetScreen from './screens/NewAssetScreen';
import AssignmentsScreen from './screens/AssignmentsScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Import components
import BottomNavigation from './components/BottomNavigation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <BottomNavigation
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            props.navigation.navigate(tab);
          }}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="dashboard" component={DashboardScreen} />
      <Tab.Screen name="assets" component={AssetsScreen} />
      <Tab.Screen name="assignments" component={AssignmentsScreen} />
      <Tab.Screen name="reports" component={ReportsScreen} />
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
            <Stack.Screen name="NewAsset" component={NewAssetScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
