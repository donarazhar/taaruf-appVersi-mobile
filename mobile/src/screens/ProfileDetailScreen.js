import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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

const ProfileDetailScreen = ({ navigation, route }) => {
    const { profile } = route.params || {};
    const { user } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(false);
    const [progressLoading, setProgressLoading] = useState(false);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleStartProgress = async () => {
        if (!profile?.email) {
            Alert.alert('Error', 'Email profil tidak tersedia');
            return;
        }

        setProgressLoading(true);
        try {
            const response = await api.post('/progress', {
                email_target: profile.email,
            });

            if (response.data) {
                Alert.alert(
                    'Berhasil! 🎉',
                    'Progress Ta\'aruf berhasil dibuat. Silakan cek halaman Progress.',
                    [
                        {
                            text: 'Lihat Progress',
                            onPress: () => navigation.navigate('MainTabs', { screen: 'Matches' }),
                        },
                        { text: 'OK' },
                    ]
                );
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Terjadi kesalahan';
            Alert.alert('Info', message);
        } finally {
            setProgressLoading(false);
        }
    };

    if (!profile) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorEmoji}>👤</Text>
                    <Text style={styles.errorText}>Profil tidak ditemukan</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Kembali</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detail Profil</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={profile.jenkel === 'L'
                            ? ['#4F46E5', '#7C3AED']
                            : ['#EC4899', '#F472B6']}
                        style={styles.avatarGradient}
                    >
                        <Text style={styles.avatarEmoji}>
                            {profile.jenkel === 'L' ? '👨' : '👩'}
                        </Text>
                    </LinearGradient>
                    {profile.status === 'approved' && (
                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedIcon}>✓</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.profileName}>{profile.nama}</Text>
                <View style={styles.nipBadge}>
                    <Text style={styles.nipText}>{profile.nip}</Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                    {/* Biodata Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Biodata</Text>

                        {profile.biodata ? (
                            <>
                                {profile.biodata.tempatlahir && (
                                    <InfoRow label="Tempat Lahir" value={profile.biodata.tempatlahir} />
                                )}
                                {profile.biodata.pekerjaan && (
                                    <InfoRow label="Pekerjaan" value={profile.biodata.pekerjaan} />
                                )}
                                {profile.biodata.pendidikan && (
                                    <InfoRow label="Pendidikan" value={profile.biodata.pendidikan} />
                                )}
                                {profile.biodata.alamat && (
                                    <InfoRow label="Alamat" value={profile.biodata.alamat} />
                                )}
                            </>
                        ) : (
                            <Text style={styles.noDataText}>Biodata belum lengkap</Text>
                        )}
                    </View>

                    {/* Referensi Section */}
                    {profile.referensi_detail && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📝 Referensi</Text>
                            <View style={styles.referensiCard}>
                                <Text style={styles.referensiText}>{profile.referensi_detail}</Text>
                            </View>
                        </View>
                    )}
                </Animated.View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.progressButton, progressLoading && styles.buttonDisabled]}
                        onPress={handleStartProgress}
                        disabled={progressLoading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={progressLoading ? ['#9CA3AF', '#9CA3AF'] : [COLORS.success, '#059669']}
                            style={styles.progressGradient}
                        >
                            {progressLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text style={styles.progressIcon}>💑</Text>
                                    <Text style={styles.progressText}>Mulai Progress Ta'aruf</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.likeButton}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.likeIcon}>❤️</Text>
                        <Text style={styles.likeText}>Suka Profil Ini</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray100,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 20,
        color: COLORS.white,
        fontWeight: '700',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
    },
    placeholder: {
        width: 40,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    avatarEmoji: {
        fontSize: 50,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    verifiedIcon: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 8,
    },
    nipBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    nipText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.gray600,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray800,
        flex: 1,
        textAlign: 'right',
    },
    noDataText: {
        fontSize: 14,
        color: COLORS.gray600,
        fontStyle: 'italic',
    },
    referensiCard: {
        backgroundColor: COLORS.gray100,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
    },
    referensiText: {
        fontSize: 14,
        color: COLORS.gray800,
        lineHeight: 22,
    },
    actionButtons: {
        gap: 12,
    },
    progressButton: {
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        shadowOpacity: 0,
    },
    progressGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    progressIcon: {
        fontSize: 20,
    },
    progressText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.danger,
        borderRadius: 14,
        paddingVertical: 14,
        gap: 10,
    },
    likeIcon: {
        fontSize: 20,
    },
    likeText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.danger,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.gray600,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileDetailScreen;
