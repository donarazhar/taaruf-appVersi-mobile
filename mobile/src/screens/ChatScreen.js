import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const COLORS = {
    primary: '#0053C5',
    primaryLight: '#0066FF',
    primaryDark: '#003D91',
    gray100: '#F8F9FA',
    gray200: '#E9ECEF',
    gray600: '#6C757D',
    gray800: '#343A40',
    white: '#FFFFFF',
    myMessage: '#DCF8C6',
};

const ChatScreen = ({ route, navigation }) => {
    const { progressId, partner } = route.params;
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        loadMessages();

        // Poll for new messages every 5 seconds
        intervalRef.current = setInterval(loadMessages, 5000); // 5s interval

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const loadMessages = async () => {
        try {
            const response = await api.get(`/chat/${progressId}`);
            if (response.data && response.data.data) {
                // If new messages came in, update state
                setMessages(prevMessages => {
                    // Check if length is different to avoid unnecessary re-renders or only if content changed
                    // For simplicity, just updating if length differs or assume optimized by React
                    if (prevMessages.length !== response.data.data.length) {
                        // Scroll to bottom effectively handled by onContentSizeChange or similar
                        return response.data.data;
                    }
                    return prevMessages; // If no change, return prev to skip re-render
                });
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const messageToSend = inputText.trim();
        setInputText('');
        setSending(true);

        try {
            const response = await api.post('/chat', {
                progress_id: progressId,
                message: messageToSend,
            });

            if (response.data && response.data.data) {
                setMessages(prev => [...prev, response.data.data]);
                // Scroll to bottom
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Gagal', 'Gagal mengirim pesan');
            setInputText(messageToSend); // Restore text if failed
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }) => {
        const isMe = item.is_me;
        return (
            <View style={[
                styles.messageBubbleContainer,
                isMe ? styles.myMessageContainer : styles.theirMessageContainer
            ]}>
                {!isMe && (
                    <View style={styles.avatarSmall}>
                        <Text style={styles.avatarEmoji}>{partner.jenkel === 'L' ? '👨' : '👩'}</Text>
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isMe ? styles.myMessageBubble : styles.theirMessageBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isMe ? styles.myMessageText : styles.theirMessageText
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={[
                        styles.messageTime,
                        isMe ? styles.myMessageTime : styles.theirMessageTime
                    ]}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
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
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>{partner.nama}</Text>
                        <Text style={styles.headerSubtitle}>Ta'aruf Chat</Text>
                    </View>
                    <View style={styles.avatarHeader}>
                        <Text style={styles.avatarEmoji}>{partner.jenkel === 'L' ? '👨' : '👩'}</Text>
                    </View>
                </View>
            </LinearGradient>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.chatList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ketik pesan..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Text style={styles.sendIcon}>➤</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    backIcon: {
        fontSize: 24,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    avatarHeader: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatList: {
        padding: 15,
        paddingBottom: 20,
    },
    messageBubbleContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-end',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    theirMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.gray200,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarEmoji: {
        fontSize: 16,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
        elevation: 1,
    },
    myMessageBubble: {
        backgroundColor: COLORS.primaryLight,
        borderBottomRightRadius: 2,
    },
    theirMessageBubble: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    messageText: {
        fontSize: 15,
    },
    myMessageText: {
        color: COLORS.white,
    },
    theirMessageText: {
        color: COLORS.gray800,
    },
    messageTime: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myMessageTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    theirMessageTime: {
        color: COLORS.gray600,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.gray100,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 15,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.gray600,
    },
    sendIcon: {
        fontSize: 18,
        color: COLORS.white,
    },
});

export default ChatScreen;
