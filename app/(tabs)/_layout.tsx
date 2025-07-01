import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'gray',
        tabBarInactiveTintColor: 'gray',
        tabBarPressOpacity: 0.6,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 65,
          backgroundColor: 'white',
        },
        tabBarItemStyle: { justifyContent: 'center' },
        tabBarLabelStyle: { fontSize: 10, color: '#555', fontWeight: '400', marginTop: 5 },
        tabBarIconStyle: { marginTop: 5 },
        tabBarIcon: ({ color }) => {
          let size = 30;
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'analytics';
              break;
            case 'SpendHistory':
              iconName = 'swap-vertical-outline';
              break;
            case 'Accounts':
              iconName = 'card';
              break;
            case 'Investments':
              iconName = 'trending-up';
              break;
            case 'AddNewSpend':
              iconName = 'add-circle-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" options={{ title: "Overview" }} />
      <Tabs.Screen name="SpendHistory" options={{ title: "Transactions" }} />
      <Tabs.Screen name="AddNewSpend" options={{ title: "Add New" }} />
      <Tabs.Screen name="Accounts" options={{ title: "Accounts" }} />
      <Tabs.Screen name="Investments" options={{ title: "Investments" }} />
    </Tabs>
  );
};

export default TabLayout;
