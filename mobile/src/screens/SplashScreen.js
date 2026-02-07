import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Blue color scheme matching old app
const COLORS = {
    primary: '#0053C5',
    primaryLight: '#0066FF',
    primaryDark: '#003D91',
};

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        console.log('SplashScreen mounted, navigation:', !!navigation);
        
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            console.log('SplashScreen timer fired, attempting navigation to Login');
            try {
                if (navigation && navigation.replace) {
                    navigation.replace('Login');
                    console.log('Navigation successful');
                } else {
                    console.error('Navigation prop is undefined or missing replace method');
                }
            } catch (error) {
                console.error('Navigation error:', error);
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [fadeAnim, scaleAnim, slideAnim, navigation]);

    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Decorative circles */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
            <View style={styles.decorCircle3} />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: slideAnim },
                        ],
                    },
                ]}
            >
                {/* Logo Container */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>💑</Text>
                    </View>
                </View>

                {/* App Name */}
                <Text style={styles.appName}>Ta'aruf Jodohku</Text>

                {/* Version */}
                <Text style={styles.version}>v.2.0</Text>

                {/* Tagline */}
                <Text style={styles.tagline}>
                    Temukan pasangan sempurna Anda{'\n'}diantara karyawan YPI Al Azhar
                </Text>

                {/* Subtitle */}
                <View style={styles.subtitleContainer}>
                    <View style={styles.subtitleLine} />
                    <Text style={styles.subtitle}>YPI Al-Azhar</Text>
                    <View style={styles.subtitleLine} />
                </View>
            </Animated.View>

            {/* Loading indicator */}
            <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
                <View style={styles.loadingDots}>
                    <LoadingDot delay={0} />
                    <LoadingDot delay={200} />
                    <LoadingDot delay={400} />
                </View>
            </Animated.View>
        </LinearGradient>
    );
};

const LoadingDot = ({ delay }) => {
    const pulseAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 400,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.4,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [pulseAnim, delay]);

    return (
        <Animated.View
            style={[
                styles.dot,
                { opacity: pulseAnim, transform: [{ scale: pulseAnim }] },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    decorCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -100,
        right: -100,
    },
    decorCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        bottom: 100,
        left: -50,
    },
    decorCircle3: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        top: '40%',
        right: -40,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    logoContainer: {
        marginBottom: 24,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    logoEmoji: {
        fontSize: 56,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
        letterSpacing: 0.5,
    },
    version: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '700',
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 20,
    },
    tagline: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    subtitleLine: {
        width: 30,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 12,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 80,
    },
    loadingDots: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        marginHorizontal: 4,
    },
});

export default SplashScreen;
