import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions,
    ActivityIndicator,
    Image,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// Blue color scheme matching old app
const COLORS = {
    primary: '#0053C5',
    primaryLight: '#0066FF',
    primaryDark: '#003D91',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    gray100: '#F8F9FA',
    gray200: '#E9ECEF',
    gray600: '#6C757D',
    gray800: '#343A40',
    white: '#FFFFFF',
};

const MatchesScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [progresses, setProgresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadProgresses();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadProgresses = async () => {
        setLoading(true);
        try {
            // Fetch progress from API
            const response = await api.get('/progress');
            if (response.data && response.data.data) {
                // Transform API data to match component structure
                const formattedData = response.data.data.map(item => ({
                    id: item.id,
                    userStatus: item.user_status || 'pending',
                    partnerStatus: item.partner_status || 'pending',
                    isMatched: item.is_matched || false,
                    partner: item.partner ? {
                        nama: item.partner.nama,
                        nip: item.partner.nip,
                        jenkel: item.partner.jenkel,
                        foto: item.partner.foto,
                    } : null,
                    currentUser: item.current_user,
                    isInitiator: item.is_initiator,
                }));
                setProgresses(formattedData);
            } else {
                setProgresses([]);
            }
        } catch (error) {
            console.error('Error loading progresses:', error);
            setProgresses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (progressId) => {
        try {
            await api.put(`/progress/${progressId}`, { status: 'like' });
            Alert.alert('Berhasil! 💚', 'Anda telah menyetujui ta\'aruf ini');
            loadProgresses(); // Refresh data
        } catch (error) {
            console.error('Error liking progress:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan');
        }
    };

    const handleDislike = async (progressId) => {
        Alert.alert(
            'Konfirmasi',
            'Apakah Anda yakin ingin menolak ta\'aruf ini? Progress akan dihapus.',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Ya, Tolak',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.put(`/progress/${progressId}`, { status: 'dislike' });
                            Alert.alert('Info', 'Progress ta\'aruf telah ditolak');
                            loadProgresses(); // Refresh - will remove from list
                        } catch (error) {
                            console.error('Error disliking progress:', error);
                            Alert.alert('Gagal', 'Terjadi kesalahan');
                        }
                    },
                },
            ]
        );
    };

    const getMatchStatus = (userStatus, partnerStatus, isMatched) => {
        if (isMatched) {
            return { type: 'match', emoji: '💚', text: 'Selamat! Kalian Saling Cocok!', color: COLORS.success };
        }
        if (userStatus === 'like' && partnerStatus === 'pending') {
            return { type: 'waiting', emoji: '⏳', text: 'Menunggu Respon Pasangan', color: COLORS.warning };
        }
        if (userStatus === 'pending' && partnerStatus === 'like') {
            return { type: 'respond', emoji: '💕', text: 'Pasangan Tertarik! Silakan Respon', color: COLORS.primary };
        }
        return { type: 'pending', emoji: '⏳', text: 'Menunggu Keputusan', color: COLORS.gray600 };
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'like':
                return { text: '✓ Sudah Cocok', color: COLORS.success };
            case 'dislike':
                return { text: '✗ Tidak Cocok', color: COLORS.danger };
            default:
                return { text: '⏳ On Progress', color: COLORS.gray600 };
        }
    };

    const renderProgressItem = ({ item, index }) => {
        const matchStatus = getMatchStatus(item.userStatus, item.partnerStatus, item.isMatched);
        const userBadge = getStatusBadge(item.userStatus);
        const partnerBadge = getStatusBadge(item.partnerStatus);
        const isChatEnabled = item.isMatched;

        return (
            <Animated.View
                style={[
                    styles.progressCard,
                    { opacity: fadeAnim },
                ]}
            >
                {/* Match Indicator */}
                <View style={[styles.matchIndicator, { borderColor: matchStatus.color }]}>
                    <Text style={styles.matchEmoji}>{matchStatus.emoji}</Text>
                    <Text style={styles.matchText}>{matchStatus.text}</Text>
                </View>

                {/* User Profile Section */}
                <View style={styles.profileSection}>
                    <Text style={styles.profileLabel}>👤 Profil Anda</Text>
                    <View style={styles.profileContent}>
                        <View style={styles.avatarWrapper}>
                            <LinearGradient
                                colors={user?.jenkel === 'L'
                                    ? [COLORS.primary, COLORS.primaryLight]
                                    : ['#EC4899', '#F472B6']}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarEmoji}>
                                    {user?.jenkel === 'L' ? '👨' : '👩'}
                                </Text>
                            </LinearGradient>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: userBadge.color }]}>
                            <Text style={styles.statusBadgeText}>{userBadge.text}</Text>
                        </View>
                        <Text style={styles.profileName}>{user?.nama || 'Anda'}</Text>
                        <Text style={styles.profileNip}>NIP: {user?.nip || '-'}</Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>💑 PASANGAN</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Partner Profile Section */}
                <View style={styles.profileSection}>
                    <Text style={styles.profileLabel}>💕 Profil Pasangan</Text>
                    <View style={styles.profileContent}>
                        <View style={styles.avatarWrapper}>
                            <LinearGradient
                                colors={item.partner.jenkel === 'L'
                                    ? [COLORS.primary, COLORS.primaryLight]
                                    : ['#EC4899', '#F472B6']}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarEmoji}>
                                    {item.partner.jenkel === 'L' ? '👨' : '👩'}
                                </Text>
                            </LinearGradient>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: partnerBadge.color }]}>
                            <Text style={styles.statusBadgeText}>{partnerBadge.text}</Text>
                        </View>
                        <Text style={styles.profileName}>{item.partner.nama}</Text>
                        <Text style={styles.profileNip}>NIP: {item.partner.nip}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.likeBtn,
                            item.userStatus === 'like' && styles.actionBtnDisabled
                        ]}
                        disabled={item.userStatus === 'like'}
                        onPress={() => handleLike(item.id)}
                    >
                        <Text style={styles.actionBtnIcon}>👍</Text>
                        <Text style={styles.actionBtnText}>
                            {item.userStatus === 'like' ? 'Sudah Menyukai' : 'Saya Cocok'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.dislikeBtn,
                            item.userStatus === 'dislike' && styles.actionBtnDisabled
                        ]}
                        disabled={item.userStatus === 'dislike'}
                        onPress={() => handleDislike(item.id)}
                    >
                        <Text style={styles.actionBtnIcon}>💔</Text>
                        <Text style={styles.actionBtnText}>
                            {item.userStatus === 'dislike' ? 'Sudah Tidak' : 'Tidak Cocok'}
                        </Text>
                    </TouchableOpacity>

                    {/* Chat Button - Only active when matched */}
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.chatBtn,
                            !isChatEnabled && styles.actionBtnDisabled
                        ]}
                        disabled={!isChatEnabled}
                        onPress={() => {
                            if (isChatEnabled) {
                                navigation.navigate('Chat', { progressId: item.id, partner: item.partner });
                            }
                        }}
                    >
                        <LinearGradient
                            colors={isChatEnabled
                                ? [COLORS.primary, COLORS.primaryLight]
                                : [COLORS.gray600, COLORS.gray600]}
                            style={styles.chatBtnGradient}
                        >
                            <Text style={styles.chatBtnIcon}>💬</Text>
                            <Text style={styles.chatBtnText}>
                                {isChatEnabled ? 'Mulai Chat' : 'Chat Terkunci'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Memuat progress...</Text>
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
                <View style={styles.decorCircle} />
                <Text style={styles.headerEmoji}>💑</Text>
                <Text style={styles.headerTitle}>Status Progress Ta'aruf</Text>
                <Text style={styles.headerSubtitle}>
                    Lihat status perkembangan ta'aruf Anda
                </Text>
            </LinearGradient>

            {progresses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>💔</Text>
                    <Text style={styles.emptyTitle}>Belum Ada Progress</Text>
                    <Text style={styles.emptyText}>
                        Anda belum memiliki progress ta'aruf saat ini.
                        Silakan ajukan progress dari halaman ta'aruf.
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => navigation.navigate('Explore')}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryLight]}
                            style={styles.exploreBtnGradient}
                        >
                            <Text style={styles.exploreBtnText}>Mulai Jelajahi</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={progresses}
                    renderItem={renderProgressItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray600,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: 'center',
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -30,
        right: -30,
    },
    headerEmoji: {
        fontSize: 36,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 6,
    },
    listContent: {
        padding: 16,
    },
    progressCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    matchIndicator: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
    },
    matchEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    matchText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.gray800,
        textAlign: 'center',
    },
    profileSection: {
        borderWidth: 2,
        borderColor: COLORS.gray200,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        position: 'relative',
    },
    profileLabel: {
        position: 'absolute',
        top: -12,
        left: 16,
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.gray600,
        textTransform: 'uppercase',
    },
    profileContent: {
        alignItems: 'center',
    },
    avatarWrapper: {
        marginBottom: 12,
    },
    avatarGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarEmoji: {
        fontSize: 36,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    statusBadgeText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '700',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.gray800,
        marginBottom: 4,
    },
    profileNip: {
        fontSize: 13,
        color: COLORS.gray600,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    dividerLine: {
        flex: 1,
        height: 2,
        backgroundColor: COLORS.gray200,
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    },
    actionButtons: {
        gap: 12,
    },
    actionButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    likeBtn: {
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    dislikeBtn: {
        backgroundColor: COLORS.danger,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    chatBtn: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    chatBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    actionBtnDisabled: {
        opacity: 0.5,
    },
    actionBtnIcon: {
        fontSize: 18,
    },
    actionBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
    chatBtnIcon: {
        fontSize: 18,
    },
    chatBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.gray800,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 15,
        color: COLORS.gray600,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    exploreButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    exploreBtnGradient: {
        paddingHorizontal: 32,
        paddingVertical: 14,
    },
    exploreBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default MatchesScreen;
