import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Blue color scheme matching old app
const COLORS = {
    primary: '#0053C5',
    primaryLight: '#0066FF',
    primaryDark: '#003D91',
    gray100: '#F8F9FA',
    gray200: '#E9ECEF',
    gray600: '#6C757D',
    gray800: '#343A40',
    white: '#FFFFFF',
};

const NewsDetailScreen = ({ navigation, route }) => {
    const { news } = route.params || {};
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    // If no news data, show fallback
    if (!news) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorEmoji}>📰</Text>
                    <Text style={styles.errorText}>Berita tidak ditemukan</Text>
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
                    <Text style={styles.headerTitle}>Detail Berita</Text>
                    <View style={styles.placeholder} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View style={[styles.articleContainer, { opacity: fadeAnim }]}>
                    {/* Article Image/Emoji */}
                    <View style={styles.imageContainer}>
                        <Text style={styles.articleEmoji}>{news.emoji || '📰'}</Text>
                    </View>

                    {/* Article Meta */}
                    <View style={styles.metaContainer}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>Artikel</Text>
                        </View>
                        <Text style={styles.dateText}>{news.date}</Text>
                    </View>

                    {/* Article Title */}
                    <Text style={styles.articleTitle}>{news.title}</Text>

                    {/* Article Content */}
                    <View style={styles.articleBody}>
                        <Text style={styles.articleText}>
                            {news.content || `${news.excerpt}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`}
                        </Text>
                    </View>

                    {/* Share Button */}
                    <TouchableOpacity style={styles.shareButton}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryLight]}
                            style={styles.shareGradient}
                        >
                            <Text style={styles.shareIcon}>📤</Text>
                            <Text style={styles.shareText}>Bagikan Artikel</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
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
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    articleContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    imageContainer: {
        height: 200,
        backgroundColor: COLORS.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    articleEmoji: {
        fontSize: 80,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 0,
    },
    categoryBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.white,
    },
    dateText: {
        fontSize: 13,
        color: COLORS.gray600,
    },
    articleTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.gray800,
        lineHeight: 30,
        padding: 20,
        paddingTop: 16,
        paddingBottom: 0,
    },
    articleBody: {
        padding: 20,
    },
    articleText: {
        fontSize: 15,
        color: COLORS.gray800,
        lineHeight: 26,
        textAlign: 'justify',
    },
    shareButton: {
        margin: 20,
        marginTop: 0,
        borderRadius: 14,
        overflow: 'hidden',
    },
    shareGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    shareIcon: {
        fontSize: 18,
    },
    shareText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
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

export default NewsDetailScreen;
