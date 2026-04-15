import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#A5B4FC',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#090D16',
          borderTopColor: '#111827',
          height: 80,
          paddingBottom: 12,
          paddingTop: 10,
          position: 'absolute',
          bottom: insets.bottom + 10,
          left: 20,
          right: 20,
          borderRadius: 25,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          borderWidth: 1,
          borderColor: '#1E293B',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
        tabBarButton: HapticTab,
        contentStyle: {
          paddingBottom: 100 + insets.bottom, // Space for floating tab bar
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: 'Main',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="gamecontroller.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Belajar',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="sparkles" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
