import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
    return (
        <View style={styles.drawerWrapper}>
            {/* Header */}
            <View style={styles.drawerHeader}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>🌸</Text>
                </View>
                <Text style={styles.drawerName}>Bonjour!</Text>
                <Text style={styles.drawerSubtitle}>Continue comme ça 💪</Text>

                {/* Mini stats */}

            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Nav items */}
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.drawerScroll}
            >
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            {/* Footer */}
            <View style={styles.drawerFooter}>
                <Text style={styles.footerText}>
                    "Tu es plus forte que tu ne le crois." 🌸
                </Text>
                <Text style={styles.footerVersion}>FitMe v1.0</Text>
            </View>
        </View>
    );
}

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: '#FFF0F2' },
                headerTintColor: '#C04040',
                headerTitleStyle: {
                    fontFamily: 'Georgia',
                    fontWeight: '700',
                    fontSize: 18,
                    color: '#3D2C2C',
                },
                headerShadowVisible: false,
                drawerStyle: styles.drawer,
                drawerActiveTintColor: '#C04040',
                drawerInactiveTintColor: '#B07070',
                drawerActiveBackgroundColor: '#FDE8EC',
                drawerLabelStyle: {
                    fontFamily: 'Georgia',
                    fontSize: 15,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                },
                drawerItemStyle: {
                    borderRadius: 14,
                    marginHorizontal: 10,
                    marginVertical: 2,
                },
            }}
        >
            <Drawer.Screen
                name="Home"
                component={TabNavigator}
                options={{ title: '🏠 Accueil' }}
            />
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: '👤 Mon Profil' }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: '⚙ Paramètres' }}
            />
            <Drawer.Screen
                name="About"
                component={AboutScreen}
                options={{ title: 'ℹ À propos' }}
            />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#FFF8F9',
        width: 290,
        borderTopRightRadius: 28,
        borderBottomRightRadius: 28,
    },
    drawerWrapper: {
        flex: 1,
        backgroundColor: '#FFF8F9',
    },
    drawerHeader: {
        backgroundColor: '#FFF0F2',
        paddingTop: 52,
        paddingBottom: 24,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 32,
    },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FDE8EC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#E8A4A0',
        marginBottom: 12,
        shadowColor: '#E8A4A0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
    },
    avatarEmoji: {
        fontSize: 34,
    },
    drawerName: {
        fontFamily: 'Georgia',
        fontSize: 20,
        fontWeight: '700',
        color: '#3D2C2C',
        marginBottom: 4,
    },
    drawerSubtitle: {
        fontFamily: 'Georgia',
        fontSize: 13,
        color: '#C48B8B',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    miniStats: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 8,
        width: '100%',
        borderWidth: 1,
        borderColor: '#F5E6E8',
    },
    miniStat: {
        flex: 1,
        alignItems: 'center',
    },
    miniStatValue: {
        fontFamily: 'Georgia',
        fontSize: 17,
        fontWeight: '700',
        color: '#C04040',
    },
    miniStatLabel: {
        fontFamily: 'Georgia',
        fontSize: 10,
        color: '#C4A0A0',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    miniStatDivider: {
        width: 1,
        height: '70%',
        alignSelf: 'center',
        backgroundColor: '#F0D0D3',
    },
    divider: {
        height: 1,
        backgroundColor: '#F5E6E8',
        marginVertical: 8,
        marginHorizontal: 20,
    },
    drawerScroll: {
        paddingTop: 8,
    },
    drawerFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F5E6E8',
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        fontFamily: 'Georgia',
        fontSize: 12,
        color: '#C48B8B',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 18,
    },
    footerVersion: {
        fontFamily: 'Georgia',
        fontSize: 11,
        color: '#D4A8A8',
        marginTop: 2,
    },
});