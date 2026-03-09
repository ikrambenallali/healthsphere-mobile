import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExercisesScreen from '../screens/ExercisesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

type TabIconProps = {
  iconName: string;
  label: string;
  focused: boolean;
};

function TabIcon({ iconName, label, focused }: TabIconProps) {
  const color = focused ? '#C04040' : '#C4A0A0';
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      <Ionicons name={iconName} size={20} color={color} />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {label}
      </Text>
      {focused && <View style={styles.tabDot} />}
    </View>
  );
}

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 62 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: insets.bottom + 6,
          },
        ],
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={focused ? 'home' : 'home-outline'} label="Accueil" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Exercices"
        component={ExercisesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={focused ? 'barbell' : 'barbell-outline'} label="Exercices" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={focused ? 'calendar' : 'calendar-outline'} label="Historique" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5E6E8',
    paddingTop: 6,
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 16,
  },
  tabItemFocused: {
    // backgroundColor: '#FDE8EC',
  },
  tabEmoji: {
    fontSize: 20,
  },
tabLabel: {
  fontFamily: 'Georgia',
  fontSize: 10,
  color: '#C4A0A0',
  letterSpacing: 0.3,
  textAlign: 'center',
  width: '100%',
},
  tabLabelFocused: {
    color: '#C04040',
    fontWeight: '700',
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8A4A0',
    marginTop: 1,
  },
});