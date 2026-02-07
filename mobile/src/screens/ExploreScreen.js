import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    FlatList,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

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

const ExploreScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadProfiles();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadProfiles = async () => {
        setLoading(true);
        try {
            // Fetch profiles with opposite gender from API
            const response = await api.get('/taaruf');
            if (response.data && response.data.data) {
                setProfiles(response.data.data);
            } else {
                setProfiles([]);
            }
        } catch (error) {
            console.error('Error loading profiles:', error);
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProfiles = profiles.filter(profile =>
        profile.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.nip.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalProfiles = profiles.length;

    const renderProfileCard = ({ item, index }) => (
        <Animated.View
            style={[
                styles.profileCard,
                {
                    opacity: fadeAnim,
                    transform: [{
                        translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0],
                        }),
                    }],
                },
            ]}
        >
            {/* Profile Image */}
            <View style={styles.profileImageWrapper}>
                {item.foto ? (
                    <Image
                        source={{ uri: item.foto }}
                        style={styles.profileImage}
                    />
                ) : (
                    <LinearGradient
                        colors={item.jenkel === 'L'
                            ? [COLORS.primary, COLORS.primaryLight]
                            : ['#EC4899', '#F472B6']}
                        style={styles.profileImagePlaceholder}
                    >
                        <Text style={styles.profileEmoji}>
                            {item.jenkel === 'L' ? '👨' : '👩'}
                        </Text>
                    </LinearGradient>
                )}

                {/* Name Badge */}
                <View style={styles.nameBadge}>
                    <Text style={styles.nameBadgeText} numberOfLines={1}>
                        {item.nama}
                    </Text>
                </View>

                {/* Verified Badge */}
                {item.status === 'approved' && (
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedIcon}>✓</Text>
                    </View>
                )}
            </View>

            {/* Card Body */}
            <View style={styles.cardBody}>
                {/* NIP Badge */}
                <View style={styles.nipBadge}>
                    <Text style={styles.nipText}>{item.nip}</Text>
                </View>

                {/* Referensi */}
                {item.referensi_detail && (
                    <View style={styles.referensiContainer}>
                        <Text style={styles.referensiLabel}>Referensi:</Text>
                        <Text style={styles.referensiText} numberOfLines={2}>
                            {item.referensi_detail}
                        </Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.viewButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            navigation.navigate('ProfileDetail', { profile: item });
                        }}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryLight]}
                            style={styles.viewButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.viewButtonIcon}>👁️</Text>
                            <Text style={styles.viewButtonText}>Lihat</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.likeButton}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.likeIcon}>❤️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Memuat profil...</Text>
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
                <Text style={styles.headerTitle}>Ta'aruf Jodohku</Text>
                <Text style={styles.headerSubtitle}>
                    Temukan pasangan terbaik untuk masa depan Anda
                </Text>
            </LinearGradient>

            {/* Stats Bar */}
            <View style={styles.statsBar}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{totalProfiles}</Text>
                    <Text style={styles.statLabel}>Total Profil</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                        {user?.jenkel === 'L' ? 'Wanita' : 'Pria'}
                    </Text>
                    <Text style={styles.statLabel}>Gender</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>100%</Text>
                    <Text style={styles.statLabel}>Terverifikasi</Text>
                </View>
            </View>

            {/* Search Filter */}
            <View style={styles.filterSection}>
                <View style={styles.filterHeader}>
                    <Text style={styles.filterIcon}>🔍</Text>
                    <Text style={styles.filterTitle}>Filter & Pencarian</Text>
                </View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari berdasarkan nama atau NIP..."
                    placeholderTextColor={COLORS.gray600}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Profile Grid */}
            {filteredProfiles.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>🔍</Text>
                    <Text style={styles.emptyTitle}>Tidak Ada Hasil</Text>
                    <Text style={styles.emptyText}>
                        Tidak ditemukan profil yang sesuai dengan pencarian Anda
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProfiles}
                    renderItem={renderProfileCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.profileGrid}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray600,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: 'center',
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -50,
        right: -50,
    },
    headerEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    statsBar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: 10,
        color: COLORS.gray600,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    filterSection: {
        marginHorizontal: 16,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    searchInput: {
        backgroundColor: COLORS.gray100,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: COLORS.gray800,
    },
    profileGrid: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    profileCard: {
        width: CARD_WIDTH,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        borderRadius: 16,
        overflow: 'hidden',
    },
    profileImageWrapper: {
        width: '100%',
        aspectRatio: 1,
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profileImagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileEmoji: {
        fontSize: 48,
    },
    nameBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        maxWidth: '80%',
    },
    nameBadgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '700',
    },
    verifiedBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedIcon: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardBody: {
        padding: 12,
    },
    nipBadge: {
        backgroundColor: COLORS.gray800,
        padding: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    nipText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: '700',
    },
    referensiContainer: {
        backgroundColor: COLORS.gray100,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
        padding: 8,
        borderRadius: 6,
        marginBottom: 10,
    },
    referensiLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
    },
    referensiText: {
        fontSize: 10,
        color: COLORS.gray600,
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    viewButton: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    viewButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    viewButtonIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    viewButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '700',
    },
    likeButton: {
        width: 42,
        height: 42,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.danger,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    likeIcon: {
        fontSize: 18,
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
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.gray800,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.gray600,
        textAlign: 'center',
    },
});

export default ExploreScreen;
