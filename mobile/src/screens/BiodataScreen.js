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
    Platform,
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
const GOLONGAN_DARAH = ['A', 'B', 'AB', 'O'];
const STATUS_NIKAH = ['Belum Menikah', 'Janda', 'Duda', 'Cerai Mati', 'Cerai Hidup'];
const PENDIDIKAN = ['SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'];

const BiodataScreen = ({ navigation }) => {
    const { user } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        tempatlahir: '',
        tgllahir: '',
        goldar: '',
        statusnikah: '',
        pekerjaan: '',
        suku: '',
        pendidikan: '',
        hobi: '',
        motto: '',
        nohp: '',
        alamat: '',
        tinggi: '',
        berat: '',
    });

    // Modal states
    const [showGoldarPicker, setShowGoldarPicker] = useState(false);
    const [showStatusNikahPicker, setShowStatusNikahPicker] = useState(false);
    const [showPendidikanPicker, setShowPendidikanPicker] = useState(false);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        loadBiodata();
    }, []);

    const loadBiodata = async () => {
        try {
            const response = await api.get('/biodata');
            if (response.data) {
                // Format date to DD-MM-YYYY for display
                let tgllahir = response.data.tgllahir || '';
                if (tgllahir && tgllahir.includes('T')) {
                    tgllahir = tgllahir.split('T')[0];
                }
                if (tgllahir && tgllahir.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    // Check if it's the default/placeholder date "1990-01-01" and treat as empty
                    if (tgllahir === '1990-01-01') {
                        tgllahir = '';
                    } else {
                        const [year, month, day] = tgllahir.split('-');
                        tgllahir = `${day}-${month}-${year}`;
                    }
                }

                setFormData({
                    tempatlahir: response.data.tempatlahir || '',
                    tgllahir: tgllahir,
                    goldar: response.data.goldar || '',
                    statusnikah: response.data.statusnikah || '',
                    pekerjaan: response.data.pekerjaan || '',
                    suku: response.data.suku || '',
                    pendidikan: response.data.pendidikan || '',
                    hobi: response.data.hobi || '',
                    motto: response.data.motto || '',
                    nohp: response.data.nohp || '',
                    alamat: response.data.alamat || '',
                    tinggi: response.data.tinggi ? String(response.data.tinggi) : '',
                    berat: response.data.berat ? String(response.data.berat) : '',
                });
            }
        } catch (error) {
            console.log('Error loading biodata:', error);
            // Biodata might not exist yet, that's okay
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Convert DD-MM-YYYY to YYYY-MM-DD for API
            let tgllahirToSend = formData.tgllahir;
            if (tgllahirToSend && tgllahirToSend.match(/^\d{2}-\d{2}-\d{4}$/)) {
                const [day, month, year] = tgllahirToSend.split('-');
                tgllahirToSend = `${year}-${month}-${day}`;
            }

            const dataToSend = {
                ...formData,
                tgllahir: tgllahirToSend,
                tinggi: formData.tinggi ? parseInt(formData.tinggi) : null,
                berat: formData.berat ? parseInt(formData.berat) : null,
            };

            await api.post('/biodata', dataToSend);
            Alert.alert('Berhasil! 🎉', 'Biodata berhasil disimpan');
        } catch (error) {
            console.error('Error saving biodata:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan biodata');
        } finally {
            setSaving(false);
        }
    };

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const renderInput = (label, key, options = {}) => (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputContainer}>
                {options.emoji && <Text style={styles.inputIcon}>{options.emoji}</Text>}
                <TextInput
                    style={styles.input}
                    value={formData[key]}
                    onChangeText={(text) => updateFormData(key, text)}
                    placeholder={options.placeholder || `Masukkan ${label.toLowerCase()}`}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={options.keyboardType || 'default'}
                    multiline={options.multiline || false}
                    numberOfLines={options.numberOfLines || 1}
                    editable={!saving}
                />
            </View>
        </View>
    );

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
                <Text style={styles.loadingText}>Memuat biodata...</Text>
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
                    <Text style={styles.headerTitle}>📝 Biodata Saya</Text>
                    <View style={styles.placeholder} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
                    {/* Section: Data Pribadi */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>👤 Data Pribadi</Text>

                        {renderInput('Tempat Lahir', 'tempatlahir', { emoji: '📍', placeholder: 'Contoh: Jakarta' })}
                        {renderInput('Tanggal Lahir', 'tgllahir', { emoji: '📅', placeholder: 'YYYY-MM-DD' })}
                        {renderPicker('Golongan Darah', formData.goldar, () => setShowGoldarPicker(true), '🩸')}
                        {renderPicker('Status Nikah', formData.statusnikah, () => setShowStatusNikahPicker(true), '💍')}
                        {renderInput('Suku', 'suku', { emoji: '🏛️', placeholder: 'Contoh: Jawa' })}
                    </View>

                    {/* Section: Pendidikan & Pekerjaan */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎓 Pendidikan & Pekerjaan</Text>

                        {renderPicker('Pendidikan Terakhir', formData.pendidikan, () => setShowPendidikanPicker(true), '📚')}
                        {renderInput('Pekerjaan', 'pekerjaan', { emoji: '💼', placeholder: 'Contoh: Karyawan Swasta' })}
                    </View>

                    {/* Section: Fisik */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📏 Data Fisik</Text>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.inputLabel}>Tinggi Badan (cm)</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputIcon}>📐</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.tinggi}
                                        onChangeText={(text) => updateFormData('tinggi', text)}
                                        placeholder="170"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        editable={!saving}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.inputLabel}>Berat Badan (kg)</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputIcon}>⚖️</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.berat}
                                        onChangeText={(text) => updateFormData('berat', text)}
                                        placeholder="65"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        editable={!saving}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Section: Kontak */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📞 Kontak</Text>

                        {renderInput('No. HP / WhatsApp', 'nohp', { emoji: '📱', placeholder: '08xxxxxxxxxx', keyboardType: 'phone-pad' })}
                        {renderInput('Alamat', 'alamat', { emoji: '🏠', placeholder: 'Alamat lengkap...', multiline: true, numberOfLines: 3 })}
                    </View>

                    {/* Section: Lainnya */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>✨ Lainnya</Text>

                        {renderInput('Hobi', 'hobi', { emoji: '🎯', placeholder: 'Membaca, olahraga, dll...', multiline: true, numberOfLines: 2 })}
                        {renderInput('Motto Hidup', 'motto', { emoji: '💭', placeholder: 'Motto atau prinsip hidup Anda...', multiline: true, numberOfLines: 2 })}
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
                                    <Text style={styles.saveText}>Simpan Biodata</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            {/* Picker Modals */}
            {renderPickerModal(
                showGoldarPicker,
                setShowGoldarPicker,
                GOLONGAN_DARAH,
                formData.goldar,
                (value) => updateFormData('goldar', value),
                'Pilih Golongan Darah'
            )}
            {renderPickerModal(
                showStatusNikahPicker,
                setShowStatusNikahPicker,
                STATUS_NIKAH,
                formData.statusnikah,
                (value) => updateFormData('statusnikah', value),
                'Pilih Status Nikah'
            )}
            {renderPickerModal(
                showPendidikanPicker,
                setShowPendidikanPicker,
                PENDIDIKAN,
                formData.pendidikan,
                (value) => updateFormData('pendidikan', value),
                'Pilih Pendidikan Terakhir'
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
    inputIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: COLORS.gray800,
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

export default BiodataScreen;
