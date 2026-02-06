import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    Animated,
    Dimensions,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

// Blue color scheme matching old app
const COLORS = {
    primary: '#0053C5',
    primaryLight: '#0066FF',
    primaryDark: '#003D91',
    white: '#FFFFFF',
    gray100: '#F8F9FA',
    gray200: '#E9ECEF',
    gray600: '#6C757D',
    gray800: '#343A40',
};

const LoginScreen = ({ navigation }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

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

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Oops!', 'Mohon isi email dan password terlebih dahulu');
            return;
        }

        setLoading(true);
        try {
            const data = await login(email, password);

            if (data.token) {
                await signIn(data.user, data.token);
            } else {
                Alert.alert('Info', data.message || 'Login gagal');
            }
        } catch (error) {
            const msg = error.message || 'Terjadi kesalahan saat login';
            Alert.alert('Login Gagal', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        Alert.alert('Segera Hadir', 'Fitur Google Login untuk mobile sedang dikembangkan');
    };

    return (
        <View style={styles.container}>
            {/* Background Gradient - Blue */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                <SafeAreaView style={styles.headerContent}>
                    <Animated.View
                        style={[
                            styles.headerTextContainer,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        <Text style={styles.welcomeEmoji}>💑</Text>
                        <Text style={styles.headerTitle}>Ta'aruf Jodohku</Text>
                        <Text style={styles.headerSubtitle}>
                            Masuk untuk melanjutkan perjalanan ta'aruf Anda
                        </Text>
                    </Animated.View>
                </SafeAreaView>
            </LinearGradient>

            {/* Form Card */}
            <Animated.View
                style={[
                    styles.formCard,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>📧</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="nama@email.com"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>🔒</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Masukkan password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    <Text style={styles.eyeIcon}>
                                        {showPassword ? '👁️' : '🙈'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={loading ? ['#9CA3AF', '#9CA3AF'] : [COLORS.primary, COLORS.primaryLight]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Text style={styles.loginButtonIcon}>❤️</Text>
                                        <Text style={styles.loginButtonText}>Masuk</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>atau</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Button */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={handleGoogleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.googleIcon}>🌐</Text>
                            <Text style={styles.googleButtonText}>Masuk dengan Google</Text>
                        </TouchableOpacity>

                        {/* Register Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Belum punya akun? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerLink}>Daftar Sekarang</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    headerGradient: {
        height: height * 0.35,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
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
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        bottom: 0,
        left: -30,
    },
    headerContent: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    headerTextContainer: {
        alignItems: 'center',
    },
    welcomeEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 22,
    },
    formCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: -30,
        marginHorizontal: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
        marginBottom: 20,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray800,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray100,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        paddingHorizontal: 16,
    },
    inputIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.gray800,
    },
    eyeButton: {
        padding: 8,
    },
    eyeIcon: {
        fontSize: 18,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
        marginTop: -8,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonDisabled: {
        shadowOpacity: 0,
    },
    loginButtonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.gray200,
    },
    dividerText: {
        marginHorizontal: 16,
        color: COLORS.gray600,
        fontSize: 13,
        fontWeight: '500',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: COLORS.gray200,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 24,
    },
    googleIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    googleButtonText: {
        color: COLORS.gray800,
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.gray600,
        fontSize: 14,
    },
    registerLink: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '700',
    },
});

export default LoginScreen;
