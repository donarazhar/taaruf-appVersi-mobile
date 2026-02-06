import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Image,
    Linking,
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
    warning: '#F59E0B',
    gray100: '#F8F9FA',
    gray200: '#E9ECEF',
    gray600: '#6C757D',
    gray800: '#343A40',
    white: '#FFFFFF',
};

const HomeScreen = ({ navigation }) => {
    const { user } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    // Mock data for news
    const [newsItems] = useState([
        {
            id: 1,
            title: 'Tips Memilih Pasangan Hidup dalam Islam',
            excerpt: 'Beberapa kriteria penting yang perlu diperhatikan...',
            date: '21 Jan 2025',
            emoji: '📰',
        },
        {
            id: 2,
            title: 'Adab Ta\'aruf Sesuai Sunnah',
            excerpt: 'Panduan lengkap proses ta\'aruf yang syar\'i...',
            date: '20 Jan 2025',
            emoji: '📖',
        },
        {
            id: 3,
            title: 'Persiapan Menuju Pernikahan',
            excerpt: 'Hal-hal yang perlu dipersiapkan sebelum menikah...',
            date: '19 Jan 2025',
            emoji: '💍',
        },
    ]);

    // Mock data for videos
    const [videoItems] = useState([
        {
            id: 1,
            title: 'Kajian: Memilih Pasangan Hidup',
            channel: 'Ta\'aruf Jodohku',
            duration: '15:30',
            thumbnail: null,
            url: 'https://youtube.com',
        },
        {
            id: 2,
            title: 'Tips Sukses Ta\'aruf',
            channel: 'Ta\'aruf Jodohku',
            duration: '12:45',
            thumbnail: null,
            url: 'https://youtube.com',
        },
        {
            id: 3,
            title: 'Kisah Sukses Alumni Ta\'aruf',
            channel: 'Ta\'aruf Jodohku',
            duration: '20:10',
            thumbnail: null,
            url: 'https://youtube.com',
        },
    ]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const menuItems = [
        {
            id: 'taaruf',
            title: 'Ta\'aruf Jodohku',
            subtitle: 'Temukan pasangan ideal',
            emoji: '💑',
            colors: [COLORS.primary, COLORS.primaryLight],
            screen: 'Explore'
        },
        {
            id: 'biodata',
            title: 'Biodata Saya',
            subtitle: 'Lengkapi profil Anda',
            emoji: '📝',
            colors: ['#10B981', '#059669'],
            screen: 'Biodata'
        },
        {
            id: 'kriteria',
            title: 'Kriteria Pasangan',
            subtitle: 'Tentukan kriteria ideal',
            emoji: '💎',
            colors: ['#8B5CF6', '#7C3AED'],
            screen: 'Kriteria'
        },
        {
            id: 'progress',
            title: 'Progress Ta\'aruf',
            subtitle: 'Lihat status perkembangan',
            emoji: '📊',
            colors: ['#F59E0B', '#D97706'],
            screen: 'Matches'
        },
    ];

    const statsItems = [
        { label: 'Dilihat', value: '0', emoji: '👀' },
        { label: 'Disukai', value: '0', emoji: '❤️' },
        { label: 'Match', value: '0', emoji: '💕' },
    ];

    const openVideo = (url) => {
        Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
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
                        styles.headerContent,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.greetingRow}>
                        <View>
                            <Text style={styles.greeting}>Assalamu'alaikum,</Text>
                            <Text style={styles.userName}>
                                {user?.nama || 'Pengguna'} 👋
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.avatarContainer}>
                            {user?.foto ? (
                                <Image
                                    source={{ uri: user.foto }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarEmoji}>
                                        {user?.jenkel === 'L' ? '👨' : '👩'}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.tagline}>
                        Temukan pasangan sempurna Anda melalui aplikasi ini
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Stats Card */}
                <Animated.View
                    style={[
                        styles.statsCard,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <Text style={styles.statsTitle}>Statistik Profil</Text>
                    <View style={styles.statsRow}>
                        {statsItems.map((stat, index) => (
                            <View key={index} style={styles.statItem}>
                                <Text style={styles.statEmoji}>{stat.emoji}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Quick Menu */}
                <Animated.View
                    style={[
                        styles.menuSection,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <Text style={styles.sectionTitle}>Menu Utama</Text>
                    <View style={styles.menuGrid}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuCard}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate(item.screen)}
                            >
                                <LinearGradient
                                    colors={item.colors}
                                    style={styles.menuCardGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.menuEmoji}>{item.emoji}</Text>
                                </LinearGradient>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Hadits Card */}
                <Animated.View
                    style={[
                        styles.haditsCard,
                        { opacity: fadeAnim }
                    ]}
                >
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryDark]}
                        style={styles.haditsGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.haditsTitle}>💡 Hadits Harian</Text>
                        <Text style={styles.haditsText}>
                            "Barangsiapa yang Allah kehendaki kebaikan baginya, maka Allah akan
                            memahamkan dia dalam masalah agama."
                        </Text>
                        <Text style={styles.haditsSource}>
                            (HR. Bukhari & Muslim)
                        </Text>
                    </LinearGradient>
                </Animated.View>

                {/* Berita Section */}
                <Animated.View
                    style={[
                        styles.newsSection,
                        { opacity: fadeAnim }
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📰 Berita Terbaru</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllLink}>Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.newsScroll}
                    >
                        {newsItems.map((news, index) => (
                            <TouchableOpacity
                                key={news.id}
                                style={styles.newsCard}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('NewsDetail', { news })}
                            >
                                <View style={styles.newsImagePlaceholder}>
                                    <Text style={styles.newsEmoji}>{news.emoji}</Text>
                                </View>
                                <View style={styles.newsContent}>
                                    <Text style={styles.newsTitle} numberOfLines={2}>
                                        {news.title}
                                    </Text>
                                    <Text style={styles.newsExcerpt} numberOfLines={2}>
                                        {news.excerpt}
                                    </Text>
                                    <Text style={styles.newsDate}>{news.date}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Video Section */}
                <Animated.View
                    style={[
                        styles.videoSection,
                        { opacity: fadeAnim }
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🎬 Video Terbaru</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllLink}>Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.videoScroll}
                    >
                        {videoItems.map((video, index) => (
                            <TouchableOpacity
                                key={video.id}
                                style={styles.videoCard}
                                activeOpacity={0.8}
                                onPress={() => openVideo(video.url)}
                            >
                                <View style={styles.videoThumbnail}>
                                    <LinearGradient
                                        colors={[COLORS.primaryDark, COLORS.primary]}
                                        style={styles.thumbnailGradient}
                                    >
                                        <Text style={styles.playIcon}>▶️</Text>
                                    </LinearGradient>
                                    <View style={styles.durationBadge}>
                                        <Text style={styles.durationText}>{video.duration}</Text>
                                    </View>
                                </View>
                                <View style={styles.videoContent}>
                                    <Text style={styles.videoTitle} numberOfLines={2}>
                                        {video.title}
                                    </Text>
                                    <Text style={styles.videoChannel}>
                                        {video.channel}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 24,
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
    headerContent: {
        zIndex: 1,
    },
    greetingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    greeting: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 4,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: {
        fontSize: 28,
    },
    tagline: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.85)',
        lineHeight: 20,
    },
    content: {
        flex: 1,
        marginTop: -10,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    statsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: COLORS.gray200,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.gray600,
        marginTop: 4,
    },
    menuSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllLink: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primaryLight,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuCard: {
        width: (width - 52) / 2,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: COLORS.gray200,
    },
    menuCardGradient: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    menuEmoji: {
        fontSize: 24,
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.gray800,
        marginBottom: 4,
    },
    menuSubtitle: {
        fontSize: 11,
        color: COLORS.gray600,
        lineHeight: 16,
    },
    haditsCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    haditsGradient: {
        padding: 24,
    },
    haditsTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 12,
    },
    haditsText: {
        fontSize: 14,
        color: COLORS.white,
        lineHeight: 22,
        fontStyle: 'italic',
        marginBottom: 12,
    },
    haditsSource: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },
    // News Section Styles
    newsSection: {
        marginBottom: 20,
    },
    newsScroll: {
        paddingRight: 20,
    },
    newsCard: {
        width: width * 0.7,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginRight: 12,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        overflow: 'hidden',
    },
    newsImagePlaceholder: {
        height: 120,
        backgroundColor: COLORS.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newsEmoji: {
        fontSize: 48,
    },
    newsContent: {
        padding: 16,
    },
    newsTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.gray800,
        marginBottom: 6,
        lineHeight: 20,
    },
    newsExcerpt: {
        fontSize: 12,
        color: COLORS.gray600,
        lineHeight: 18,
        marginBottom: 8,
    },
    newsDate: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '600',
    },
    // Video Section Styles
    videoSection: {
        marginBottom: 20,
    },
    videoScroll: {
        paddingRight: 20,
    },
    videoCard: {
        width: width * 0.65,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginRight: 12,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        overflow: 'hidden',
    },
    videoThumbnail: {
        height: 130,
        position: 'relative',
    },
    thumbnailGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        fontSize: 48,
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    durationText: {
        fontSize: 11,
        color: COLORS.white,
        fontWeight: '600',
    },
    videoContent: {
        padding: 14,
    },
    videoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.gray800,
        marginBottom: 6,
        lineHeight: 20,
    },
    videoChannel: {
        fontSize: 12,
        color: COLORS.gray600,
    },
});

export default HomeScreen;

