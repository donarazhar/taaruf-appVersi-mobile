import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions,
    Alert,
    ActivityIndicator,
    Modal,
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

// Options for dropdowns
const STATUS_NIKAH = ['Belum Menikah', 'Janda', 'Duda', 'Tidak Masalah'];
const PENDIDIKAN = ['SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3', 'Tidak Masalah'];
const USIA_OPTIONS = Array.from({ length: 43 }, (_, i) => String(18 + i)); // 18-60

const KriteriaScreen = ({ navigation }) => {
    const { user } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        usia_min: '',
        usia_max: '',
        status_nikah: '',
        pendidikan: '',
        kriteria_lain: '',
    });

    // Modal states
    const [showUsiaMinPicker, setShowUsiaMinPicker] = useState(false);
    const [showUsiaMaxPicker, setShowUsiaMaxPicker] = useState(false);
    const [showStatusNikahPicker, setShowStatusNikahPicker] = useState(false);
    const [showPendidikanPicker, setShowPendidikanPicker] = useState(false);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        loadKriteria();
    }, []);

    const loadKriteria = async () => {
        try {
            const response = await api.get('/kriteria');
            if (response.data) {
                setFormData({
                    usia_min: response.data.usia_min || '',
                    usia_max: response.data.usia_max || '',
                    status_nikah: response.data.status_nikah || '',
                    pendidikan: response.data.pendidikan || '',
                    kriteria_lain: response.data.kriteria_lain || '',
                });
            }
        } catch (error) {
            console.log('Error loading kriteria:', error);
            // Kriteria might not exist yet, that's okay
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validate usia
        if (formData.usia_min && formData.usia_max) {
            if (parseInt(formData.usia_min) > parseInt(formData.usia_max)) {
                Alert.alert('Perhatian', 'Usia minimal tidak boleh lebih besar dari usia maksimal');
                return;
            }
        }

        setSaving(true);
        try {
            await api.post('/kriteria', formData);
            Alert.alert('Berhasil! 🎉', 'Kriteria pasangan berhasil disimpan');
        } catch (error) {
            console.error('Error saving kriteria:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan kriteria');
        } finally {
            setSaving(false);
        }
    };

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const renderPicker = (label, value, onPress, emoji) => (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TouchableOpacity
                style={styles.inputContainer}
                onPress={onPress}
                disabled={saving}
            >
                <Text style={styles.inputIcon}>{emoji}</Text>
                <Text style={[styles.pickerText, !value && styles.placeholderText]}>
                    {value || `Pilih ${label.toLowerCase()}`}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPickerModal = (visible, setVisible, options, selectedValue, onSelect, title) => (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <ScrollView style={styles.optionsList}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionItem,
                                    selectedValue === option && styles.optionItemSelected
                                ]}
                                onPress={() => {
                                    onSelect(option);
                                    setVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.optionText,
                                    selectedValue === option && styles.optionTextSelected
                                ]}>
                                    {option}
                                </Text>
                                {selectedValue === option && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Memuat kriteria...</Text>
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
                    <Text style={styles.headerTitle}>💎 Kriteria Pasangan</Text>
                    <View style={styles.placeholder} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoEmoji}>💡</Text>
                        <Text style={styles.infoText}>
                            Tentukan kriteria pasangan ideal Anda. Kriteria ini akan membantu sistem menemukan kecocokan yang tepat.
                        </Text>
                    </View>

                    {/* Section: Usia */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📅 Rentang Usia</Text>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.inputLabel}>Usia Minimal</Text>
                                <TouchableOpacity
                                    style={styles.inputContainer}
                                    onPress={() => setShowUsiaMinPicker(true)}
                                    disabled={saving}
                                >
                                    <Text style={styles.inputIcon}>🔽</Text>
                                    <Text style={[styles.pickerText, !formData.usia_min && styles.placeholderText]}>
                                        {formData.usia_min ? `${formData.usia_min} tahun` : 'Min'}
                                    </Text>
                                    <Text style={styles.dropdownIcon}>▼</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.inputLabel}>Usia Maksimal</Text>
                                <TouchableOpacity
                                    style={styles.inputContainer}
                                    onPress={() => setShowUsiaMaxPicker(true)}
                                    disabled={saving}
                                >
                                    <Text style={styles.inputIcon}>🔼</Text>
                                    <Text style={[styles.pickerText, !formData.usia_max && styles.placeholderText]}>
                                        {formData.usia_max ? `${formData.usia_max} tahun` : 'Max'}
                                    </Text>
                                    <Text style={styles.dropdownIcon}>▼</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Section: Status & Pendidikan */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Status & Pendidikan</Text>

                        {renderPicker('Status Nikah', formData.status_nikah, () => setShowStatusNikahPicker(true), '💍')}
                        {renderPicker('Pendidikan Minimal', formData.pendidikan, () => setShowPendidikanPicker(true), '🎓')}
                    </View>

                    {/* Section: Kriteria Lain */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>✨ Kriteria Lainnya</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Kriteria Tambahan</Text>
                            <View style={[styles.inputContainer, styles.textareaContainer]}>
                                <TextInput
                                    style={styles.textarea}
                                    value={formData.kriteria_lain}
                                    onChangeText={(text) => updateFormData('kriteria_lain', text)}
                                    placeholder="Jelaskan kriteria lain yang Anda inginkan, seperti sifat, kepribadian, atau hal lainnya..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline={true}
                                    numberOfLines={5}
                                    textAlignVertical="top"
                                    editable={!saving}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={saving ? ['#9CA3AF', '#9CA3AF'] : [COLORS.primary, COLORS.primaryLight]}
                            style={styles.saveGradient}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text style={styles.saveIcon}>💾</Text>
                                    <Text style={styles.saveText}>Simpan Kriteria</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            {/* Picker Modals */}
            {renderPickerModal(
                showUsiaMinPicker,
                setShowUsiaMinPicker,
                USIA_OPTIONS,
                formData.usia_min,
                (value) => updateFormData('usia_min', value),
                'Pilih Usia Minimal'
            )}
            {renderPickerModal(
                showUsiaMaxPicker,
                setShowUsiaMaxPicker,
                USIA_OPTIONS,
                formData.usia_max,
                (value) => updateFormData('usia_max', value),
                'Pilih Usia Maksimal'
            )}
            {renderPickerModal(
                showStatusNikahPicker,
                setShowStatusNikahPicker,
                STATUS_NIKAH,
                formData.status_nikah,
                (value) => updateFormData('status_nikah', value),
                'Pilih Status Nikah'
            )}
            {renderPickerModal(
                showPendidikanPicker,
                setShowPendidikanPicker,
                PENDIDIKAN,
                formData.pendidikan,
                (value) => updateFormData('pendidikan', value),
                'Pilih Pendidikan Minimal'
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray100,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray600,
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
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#EBF5FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    infoEmoji: {
        fontSize: 20,
        marginRight: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.primary,
        lineHeight: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.gray800,
        marginBottom: 6,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray100,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.gray200,
        paddingHorizontal: 14,
        minHeight: 48,
    },
    textareaContainer: {
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    inputIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    pickerText: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: COLORS.gray800,
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    dropdownIcon: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    textarea: {
        flex: 1,
        fontSize: 15,
        color: COLORS.gray800,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        shadowOpacity: 0,
    },
    saveGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    saveIcon: {
        fontSize: 18,
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        width: width * 0.85,
        maxHeight: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.gray800,
        textAlign: 'center',
        marginBottom: 20,
    },
    optionsList: {
        maxHeight: 300,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        marginBottom: 10,
    },
    optionItemSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#EBF5FF',
    },
    optionText: {
        fontSize: 15,
        color: COLORS.gray800,
    },
    optionTextSelected: {
        fontWeight: '600',
        color: COLORS.primary,
    },
    checkmark: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});

export default KriteriaScreen;
