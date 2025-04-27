import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarPressOpacity: 0.6,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: 'black',
        },
        tabBarItemStyle: { justifyContent: 'center' },
        tabBarLabelStyle: { fontSize: 14, color: 'white', fontWeight: 'normal' },
        tabBarIconStyle: { marginTop: 5 },
        tabBarIcon: ({ color }) => {
          let size = 30;
          let iconName;
          switch (route.name) {
            case 'Home/index':
              iconName = 'analytics-outline';
              break;
            case 'SpendHistory/index':
              iconName = 'swap-vertical-outline';
              break;
            case 'Accounts/index':
              iconName = 'wallet-outline';
              break;
            case 'Investments/index':
              iconName = 'trending-up';
              break;
            case 'AddNewSpend/index':
              iconName = 'add-circle-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home/index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="SpendHistory/index" options={{ title: "Spends" }} />
      <Tabs.Screen name="AddNewSpend/index" options={{ title: "Add" }} />
      <Tabs.Screen name="Accounts/index" options={{ title: "Accounts" }} />
      <Tabs.Screen name="Investments/index" options={{ title: "Investments" }} />
    </Tabs>
  );
};

export default TabLayout;
