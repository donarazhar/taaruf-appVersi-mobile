import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// Blue color scheme matching old app
const COLORS = {
    primary: '#0053C5',
    primaryLight: '#0066FF',
    primaryDark: '#003D91',
    success: '#10B981',
    danger: '#EF4444',
    gray100: '#F8F9FA',
    gray200: '#E9ECEF',
    gray600: '#6C757D',
    gray800: '#343A40',
    white: '#FFFFFF',
};

const ProfileScreen = ({ navigation }) => {
    const { user, signOut } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            'Konfirmasi Logout',
            'Apakah Anda yakin ingin keluar?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Keluar',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                    },
                },
            ]
        );
    };

    const menuItems = [
        {
            id: 'biodata',
            title: 'Edit Biodata',
            subtitle: 'Perbarui informasi diri Anda',
            emoji: '📝',
            onPress: () => navigation.navigate('Biodata'),
        },
        {
            id: 'kriteria',
            title: 'Kriteria Pasangan',
            subtitle: 'Tentukan kriteria ideal Anda',
            emoji: '💎',
            onPress: () => navigation.navigate('Kriteria'),
        },
        {
            id: 'photo',
            title: 'Foto Profil',
            subtitle: 'Unggah atau ubah foto Anda',
            emoji: '📷',
            onPress: () => Alert.alert('Info', 'Fitur segera hadir'),
        },
        {
            id: 'password',
            title: 'Ubah Password',
            subtitle: 'Perbarui kata sandi akun',
            emoji: '🔐',
            onPress: () => Alert.alert('Info', 'Fitur segera hadir'),
        },
        {
            id: 'help',
            title: 'Bantuan & FAQ',
            subtitle: 'Tanya jawab seputar aplikasi',
            emoji: '❓',
            onPress: () => Alert.alert('Info', 'Fitur segera hadir'),
        },
        {
            id: 'about',
            title: 'Tentang Aplikasi',
            subtitle: 'Versi dan informasi lainnya',
            emoji: 'ℹ️',
            onPress: () => Alert.alert('Ta\'aruf Jodohku', 'Versi 2.0\nYPI Al-Azhar'),
        },
    ];

    return (
        <View style={styles.container}>
            {/* Header with Profile */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                <Animated.View
                    style={[
                        styles.profileSection,
                        { opacity: fadeAnim }
                    ]}
                >
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarEmoji}>
                            {user?.jenkel === 'L' ? '👨' : '👩'}
                        </Text>
                    </View>

                    <Text style={styles.profileName}>{user?.nama || 'Pengguna'}</Text>
                    <Text style={styles.profileEmail}>{user?.email || ''}</Text>

                    {user?.nip && (
                        <View style={styles.nipBadge}>
                            <Text style={styles.nipText}>{user.nip}</Text>
                        </View>
                    )}

                    <View style={styles.profileBadge}>
                        <Text style={styles.badgeText}>
                            {user?.status === 'approved' ? '✓ Terverifikasi' : '⏳ Pending'}
                        </Text>
                    </View>
                </Animated.View>
            </LinearGradient>

            {/* Menu List */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View
                    style={[
                        styles.menuCard,
                        { opacity: fadeAnim }
                    ]}
                >
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                index < menuItems.length - 1 && styles.menuItemBorder,
                            ]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <View style={styles.menuIconContainer}>
                                    <Text style={styles.menuIcon}>{item.emoji}</Text>
                                </View>
                                <View style={styles.menuText}>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>Keluar dari Akun</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>
                    Ta'aruf Jodohku v2.0 - YPI Al-Azhar
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray100,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -50,
        right: -50,
    },
    decorCircle2: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        bottom: -20,
        left: -30,
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarEmoji: {
        fontSize: 48,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 12,
    },
    nipBadge: {
        backgroundColor: COLORS.gray800,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    nipText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '700',
    },
    profileBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 13,
        color: COLORS.white,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        marginTop: -20,
    },
    scrollContent: {
        padding: 20,
    },
    menuCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.gray100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuIcon: {
        fontSize: 20,
    },
    menuText: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.gray800,
    },
    menuSubtitle: {
        fontSize: 12,
        color: COLORS.gray600,
        marginTop: 2,
    },
    menuArrow: {
        fontSize: 24,
        color: COLORS.gray600,
        marginLeft: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: COLORS.danger,
    },
    logoutIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.danger,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.gray600,
        marginBottom: 20,
    },
});

export default ProfileScreen;
