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
    ScrollView,
    Alert,
    ActivityIndicator,
    Animated,
    Dimensions,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { register } from '../services/auth';

const { width, height } = Dimensions.get('window');

// Blue color scheme matching old app
const COLORS = {
    primary: '#0053C5',
    primaryLight: '#0066FF',
    primaryDark: '#003D91',
};

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    // Animations
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

    const validateForm = () => {
        if (!name.trim()) {
            Alert.alert('Oops!', 'Mohon masukkan nama lengkap');
            return false;
        }
        if (!email.trim()) {
            Alert.alert('Oops!', 'Mohon masukkan email');
            return false;
        }
        if (!gender) {
            Alert.alert('Oops!', 'Mohon pilih jenis kelamin');
            return false;
        }
        if (!password) {
            Alert.alert('Oops!', 'Mohon masukkan password');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Oops!', 'Password minimal 6 karakter');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Oops!', 'Konfirmasi password tidak cocok');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const userData = {
                nama: name.trim(),
                email: email.trim().toLowerCase(),
                jenkel: gender,
                password: password,
                password_confirmation: confirmPassword,
                nohp: phone.trim() || null,
            };

            const data = await register(userData);

            Alert.alert(
                'Registrasi Berhasil! 🎉',
                data.message || 'Akun Anda berhasil dibuat dan menunggu persetujuan admin.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
        } catch (error) {
            let errorMessage = 'Terjadi kesalahan saat registrasi';

            if (error.errors) {
                // Handle validation errors from Laravel
                const errorMessages = Object.values(error.errors).flat();
                errorMessage = errorMessages.join('\n');
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('Registrasi Gagal', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getGenderLabel = () => {
        if (gender === 'L') return 'Laki-laki (Ikhwan)';
        if (gender === 'P') return 'Perempuan (Akhwat)';
        return 'Pilih Jenis Kelamin';
    };

    return (
        <View style={styles.container}>
            {/* Background Gradient - Blue theme */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Decorative Elements */}
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                <SafeAreaView style={styles.headerContent}>
                    <Animated.View
                        style={[
                            styles.headerTextContainer,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>← Kembali</Text>
                        </TouchableOpacity>

                        <Text style={styles.headerEmoji}>✨</Text>
                        <Text style={styles.headerTitle}>Buat Akun Baru</Text>
                        <Text style={styles.headerSubtitle}>
                            Mulai perjalanan ta'aruf Anda dengan cara yang mulia
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
                        {/* Name Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nama Lengkap *</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>👤</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Masukkan nama lengkap"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email *</Text>
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

                        {/* Phone Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nomor HP</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>📱</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="08xxxxxxxxxx"
                                    placeholderTextColor="#9CA3AF"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Gender Picker */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Jenis Kelamin *</Text>
                            <TouchableOpacity
                                style={styles.inputContainer}
                                onPress={() => setShowGenderPicker(true)}
                                disabled={loading}
                            >
                                <Text style={styles.inputIcon}>
                                    {gender === 'L' ? '👨' : gender === 'P' ? '👩' : '👥'}
                                </Text>
                                <Text style={[
                                    styles.pickerText,
                                    !gender && styles.placeholderText
                                ]}>
                                    {getGenderLabel()}
                                </Text>
                                <Text style={styles.dropdownIcon}>▼</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password *</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>🔒</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Minimal 6 karakter"
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

                        {/* Confirm Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Konfirmasi Password *</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>🔐</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ulangi password"
                                    placeholderTextColor="#9CA3AF"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeButton}
                                >
                                    <Text style={styles.eyeIcon}>
                                        {showConfirmPassword ? '👁️' : '🙈'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Terms Text */}
                        <Text style={styles.termsText}>
                            Dengan mendaftar, Anda menyetujui{' '}
                            <Text style={styles.termsLink}>Syarat & Ketentuan</Text>
                            {' '}serta{' '}
                            <Text style={styles.termsLink}>Kebijakan Privasi</Text>
                            {' '}kami.
                        </Text>

                        {/* Register Button */}
                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
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
                                    <Text style={styles.registerButtonText}>Daftar Sekarang</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Sudah punya akun? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Masuk</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Animated.View>

            {/* Gender Picker Modal */}
            <Modal
                visible={showGenderPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowGenderPicker(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowGenderPicker(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Pilih Jenis Kelamin</Text>

                        <TouchableOpacity
                            style={[
                                styles.genderOption,
                                gender === 'L' && styles.genderOptionSelected
                            ]}
                            onPress={() => {
                                setGender('L');
                                setShowGenderPicker(false);
                            }}
                        >
                            <Text style={styles.genderEmoji}>👨</Text>
                            <View style={styles.genderTextContainer}>
                                <Text style={styles.genderTitle}>Laki-laki</Text>
                                <Text style={styles.genderSubtitle}>Ikhwan</Text>
                            </View>
                            {gender === 'L' && <Text style={styles.checkmark}>✓</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.genderOption,
                                gender === 'P' && styles.genderOptionSelected
                            ]}
                            onPress={() => {
                                setGender('P');
                                setShowGenderPicker(false);
                            }}
                        >
                            <Text style={styles.genderEmoji}>👩</Text>
                            <View style={styles.genderTextContainer}>
                                <Text style={styles.genderTitle}>Perempuan</Text>
                                <Text style={styles.genderSubtitle}>Akhwat</Text>
                            </View>
                            {gender === 'P' && <Text style={styles.checkmark}>✓</Text>}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    headerGradient: {
        height: height * 0.28,
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
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    headerTextContainer: {
        flex: 1,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    backButtonText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        fontWeight: '500',
    },
    headerEmoji: {
        fontSize: 36,
        textAlign: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 20,
    },
    formCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: -30,
        marginHorizontal: 16,
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
        padding: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
    },
    inputIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    pickerText: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    dropdownIcon: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    eyeButton: {
        padding: 6,
    },
    eyeIcon: {
        fontSize: 16,
    },
    termsText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
        marginTop: 4,
    },
    termsLink: {
        color: '#0053C5',
        fontWeight: '600',
    },
    registerButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#0053C5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonDisabled: {
        shadowOpacity: 0,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    loginLink: {
        color: '#0053C5',
        fontSize: 14,
        fontWeight: '700',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: width * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 20,
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    genderOptionSelected: {
        borderColor: '#0053C5',
        backgroundColor: '#EBF5FF',
    },
    genderEmoji: {
        fontSize: 32,
        marginRight: 16,
    },
    genderTextContainer: {
        flex: 1,
    },
    genderTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    genderSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    checkmark: {
        fontSize: 20,
        color: '#0053C5',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
