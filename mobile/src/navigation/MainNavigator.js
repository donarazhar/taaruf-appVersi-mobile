import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, focused, color }) => (
    <View style={styles.tabIconContainer}>
        <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>
            {emoji}
        </Text>
        {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
    </View>
);

const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarActiveTintColor: '#667eea',
                tabBarInactiveTintColor: '#9CA3AF',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Beranda',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon emoji="🏠" focused={focused} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarLabel: "Ta'aruf",
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon emoji="💕" focused={focused} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Matches"
                component={MatchesScreen}
                options={{
                    tabBarLabel: 'Progress',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon emoji="💘" focused={focused} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profil',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon emoji="👤" focused={focused} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: 70,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 15,
    },
    tabBarLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
    },
    tabIconContainer: {
        alignItems: 'center',
    },
    tabIcon: {
        fontSize: 24,
    },
    activeIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
    },
});

export default MainNavigator;
