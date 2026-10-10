import MainHeader from '@/components/common/headers/MainHeader';
import Colors from '@/constants/colors';
import {IMAGES} from '@/constants/images';
import {
  fetchGeneralMessages,
  insertGeneralMessage,
  clearGeneralMessages,
} from '@/services/sqlite/chat-messages';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {IconButton, TextInput} from 'react-native-paper';
import Spinner from 'react-native-spinkit';
import useAppStore from '@/core/stores';
import {useShallow} from 'zustand/react/shallow';

import {
  LucideSend,
  LucideShare,
  LucideSquare,
  LucideThumbsUp,
  LucideThumbsDown,
  LucideMoreVertical,
} from 'lucide-react-native';
import Share from 'react-native-share';
import {Modal, Portal, Button, Provider} from 'react-native-paper';
import {Menu} from 'react-native-paper';
import {captureRef} from 'react-native-view-shot';

import useChatActions from '@/hooks/use-chat-actions';
import styles from './ChatStyle';

const ChatCard = React.forwardRef<
  any,
  {message: string; dateTime?: string; userName?: string}
>(({message, dateTime, userName}, ref) => (
  <View ref={ref} style={styles.card}>
    <View style={styles.logoContainer}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          height: 48,
          width: 48,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={IMAGES.logo}
          style={[
            styles.logo,
            {
              borderRadius: 18,
              height: 36,
              width: 36,
              resizeMode: 'cover',
            },
          ]}
        />
      </View>
      <Image
        source={require('../../assets/images/AuraCore_logo.png')}
        style={styles.logo}
      />
    </View>
    <View style={styles.messageBubble}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.footerUserText}>
        {userName ? `@${userName}` : ''}
      </Text>
      <Text style={styles.footerDateText}>{dateTime || ''}</Text>
      <Text style={styles.footerBrandText}>MyTeal</Text>
    </View>
  </View>
));

const MAX_NAME_LENGTH = 15;

const Chat = (props: any) => {
  // Menu state for three-dot menu
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnchorRef = useRef(null);
  const flatListRef = useRef<FlatList>(null);

  // Helper to truncate user name if too long
  const getDisplayName = (name?: string) => {
    if (!name) return 'Jane';
    if (name.length > MAX_NAME_LENGTH) {
      return `${name.slice(0, MAX_NAME_LENGTH)}...`;
    }
    return name;
  };

  // Clear chat handler
  const handleClearChat = async () => {
    try {
      await clearGeneralMessages();
    } catch (e) {
      console.error('Failed to clear chat history:', e);
    }
    // Show greeting message immediately
    const capitalizeFirstLetter = (name: string) =>
      name.charAt(0).toUpperCase() + name.slice(1);
    const getTimeOfDayGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return 'Good Morning';
      else if (currentHour < 18) return 'Good Afternoon';
      else return 'Good Evening';
    };
    const firstName = getDisplayName(rawDisplayName).replace(
      /\w\S*/g,
      w => w.charAt(0).toUpperCase() + w.slice(1),
    );
    const greetingTime = getTimeOfDayGreeting();
    const greetingMessage = `${greetingTime}, ${firstName}! 🌟\n\nI'm here to help you with your health and wellness questions. How can I assist you today?`;
    await insertGeneralMessage({
      role: 'assistant',
      message: greetingMessage,
    });
    setMessages([{role: 'assistant', message: greetingMessage}]);
    setShowPredefinedQuestions(true);
  };

  // Predefined questions state
  const [showPredefinedQuestions, setShowPredefinedQuestions] = useState(true);

  // Get userData and engagement quizData from store
  const {appStoreUserData, engagement} = useAppStore(
    useShallow(state => ({
      appStoreUserData: state.user.userData,
      engagement: state.engagement,
    })),
  );

  // Try to get the name answer from quizData (id: 1)
  let onboardingName: string | undefined;
  if (engagement?.quiz && Array.isArray(engagement.quiz)) {
    const nameQuiz = engagement.quiz.find(q => q.id === 1 && q.answer);
    if (
      nameQuiz &&
      typeof nameQuiz.answer === 'string' &&
      nameQuiz.answer.trim() !== ''
    ) {
      onboardingName = nameQuiz.answer.trim();
    }
  }

  // Fallback: use displayName from appStoreUserData
  const rawDisplayName = onboardingName
    ? onboardingName
    : appStoreUserData?.displayName
    ? appStoreUserData.displayName
    : undefined;

  const {
    messages,
    loading,
    lastGreeted,
    userData, // This userData is from useChatActions, not useAppStore
    userInput,
    setLastGreeted,
    handleStop,
    sendMessage,
    setMessages,
    setAnimatedText,
    setUserInput,
  } = useChatActions({onUpdateMessage: insertGeneralMessage});

  // Feedback state for each AI message (by index)
  const [feedback, setFeedback] = useState<{
    [key: number]: 'up' | 'down' | null;
  }>({});

  // Feedback modal state
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'up' | 'down' | null>(null);
  const [feedbackMessageIndex, setFeedbackMessageIndex] = useState<
    number | null
  >(null);
  const [feedbackText, setFeedbackText] = useState('');

  // For sharing as image
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const cardRef = useRef<View>(null);

  // Abuse report modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{
    index: number;
    message: string;
  } | null>(null);

  // Track last user message for regeneration
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  // When messages update: capture latest user message for regeneration
  useEffect(() => {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') {
        setLastUserMessage(messages[i].message);
        break;
      }
    }
  }, [messages]);

  // Appreciation logic (can be expanded for backend or prompt enhancement)
  const appreciateReply = (message: string) => {
    // Example: Show a toast, or save message as preferred style in local storage or DB
    // Alert.alert("Thanks!", "We'll show more replies like this!");
    // You may add analytics or context logic here.
    console.log('Appreciated reply:', message);
  };

  // Depreciate logic for thumbs down
  const depreciateReply = (message: string) => {
    // Example: Show a toast, or save message as less preferred style in local storage or DB
    // Alert.alert("Noted!", "We'll show fewer replies like this!");
    // You may add analytics or context logic here.
    console.log('Depreciated reply:', message);
  };

  // Feedback handler (opens modal)
  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setFeedbackType(type);
    setFeedbackMessageIndex(index);
    setFeedbackText('');
    setFeedbackModalVisible(true);
  };

  // Submit feedback (from modal)
  const submitFeedback = () => {
    if (feedbackMessageIndex !== null && feedbackType) {
      setFeedback(prev => ({...prev, [feedbackMessageIndex]: feedbackType}));
      // Log or send feedback to backend
      const msg = messages[feedbackMessageIndex];
      console.log('Feedback submitted:', {
        type: feedbackType,
        message: msg?.message,
        index: feedbackMessageIndex,
        text: feedbackText,
      });
      // Thumbs up: appreciate
      if (feedbackType === 'up' && msg?.role === 'assistant') {
        appreciateReply(msg.message);
      }
      // Thumbs down: depreciate
      if (feedbackType === 'down' && msg?.role === 'assistant') {
        depreciateReply(msg.message);
      }
    }
    setFeedbackModalVisible(false);
    setFeedbackType(null);
    setFeedbackMessageIndex(null);
    setFeedbackText('');
  };

  const submitReport = () => {
    if (selectedMessage) {
      console.log(
        `Reported abuse for message (index: ${selectedMessage.index}): "${selectedMessage.message}"`,
      );
      // You can send the report to backend here
    }
    setModalVisible(false);
    setSelectedMessage(null);
  };

  // Hide predefined questions when user types
  useEffect(() => {
    if (userInput.trim()) setShowPredefinedQuestions(false);
  }, [userInput]);

  useEffect(() => {
    if (messages.length === 0) setShowPredefinedQuestions(true);
    else setShowPredefinedQuestions(false);
  }, [messages.length]);

  // Initial load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const records = await fetchGeneralMessages();
        setMessages(records);
      } catch (error) {
        console.error(error);
      }
    };
    loadMessages();
  }, []);

  // Greeting message logic
  const capitalizeFirstLetter = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);
  const getCurrentDate = (): string => {
    const date = new Date();
    return date.toISOString().split('T')[0] || '';
  };
  const getTimeOfDayGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    else if (currentHour < 18) return 'Good Afternoon';
    else return 'Good Evening';
  };
  useEffect(() => {
    const checkAndShowGreetingMessage = async () => {
      try {
        const currentDate = getCurrentDate();
        if (lastGreeted !== currentDate) {
          setAnimatedText(true);
          const firstName = getDisplayName(rawDisplayName).replace(
            /\w\S*/g,
            w => w.charAt(0).toUpperCase() + w.slice(1),
          );
          const greetingTime = getTimeOfDayGreeting();
          const greetingMessage = `${greetingTime}, ${firstName}! 🌟\n\nI'm here to help you with your health and wellness questions. How can I assist you today?`;
          await insertGeneralMessage({
            role: 'assistant',
            message: greetingMessage,
          });
          setMessages(prevState => [
            {role: 'assistant', message: greetingMessage},
            ...prevState,
          ]);
          setLastGreeted(currentDate);
        }
      } catch (error) {
        console.error('Error checking/storing greeting message date:', error);
      }
    };
    setTimeout(() => {
      checkAndShowGreetingMessage();
    }, 1000);
  }, []);

  // Share as image
  const handleShareAsImage = async (message: string) => {
    setShareMessage(message);
    setTimeout(async () => {
      try {
        if (!cardRef.current) return;
        const uri = await captureRef(cardRef, {format: 'png', quality: 1});
        await Share.open({url: uri, type: 'image/png'});
      } catch (error) {
        console.error('Error capturing and sharing:', error);
      } finally {
        setShareMessage(null);
      }
    }, 100);
  };

  // Message rendering
  const renderMessage = (item: any, index: number) => {
    const reversedIndex = messages.length - 1 - index;
    const isAssistant = item.role === 'assistant';
    return (
      <View
        key={reversedIndex}
        style={[
          styles.messageContainer,
          item.role === 'user' && styles.userMessageContainer,
        ]}>
        <View
          style={[
            styles.chatBubble,
            item.role === 'user' && styles.sentBubble,
          ]}>
          <Text
            style={[styles.chatText, item.role === 'user' && styles.sentText]}>
            {item.message}
          </Text>
        </View>
        {isAssistant && (
          <View style={styles.feedbackRowWrapper}>
            <View style={styles.feedbackRow}>
              <IconButton
                icon={() => (
                  <LucideThumbsUp
                    size={20}
                    color={
                      feedback[index] === 'up' ? Colors.lightGreen : '#6B7280'
                    }
                  />
                )}
                size={24}
                onPress={() => handleFeedback(index, 'up')}
                style={styles.feedbackButton}
              />
              <IconButton
                icon={() => (
                  <LucideThumbsDown
                    size={20}
                    color={feedback[index] === 'down' ? '#EF4444' : '#6B7280'}
                  />
                )}
                size={24}
                onPress={() => handleFeedback(index, 'down')}
                style={styles.feedbackButton}
              />
              <IconButton
                icon={() => <LucideShare size={16} color="#6B7280" />}
                size={20}
                onPress={() => handleShareAsImage(item.message)}
                style={styles.shareButton}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <Provider>
      <Portal>
        {/* Abuse Report Modal */}
        <Modal
          visible={isModalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Report Abuse</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to report this message for abuse?
          </Text>
          <View style={styles.modalActions}>
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
            <Button onPress={submitReport}>Report</Button>
          </View>
        </Modal>
        {/* Feedback Modal for thumbs up/down */}
        <Modal
          visible={isFeedbackModalVisible}
          onDismiss={() => setFeedbackModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: '#fff',
            padding: 28,
            borderRadius: 18,
            marginHorizontal: 24,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 8,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: Colors.lightGreen,
              marginBottom: 10,
              textAlign: 'center',
            }}>
            Your feedback is important to us.
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#6B7280',
              marginBottom: 18,
              textAlign: 'center',
            }}>
            {feedbackType === 'up'
              ? 'Let us know what you liked. (Optional)'
              : 'Let us know what could do better. (Optional)'}
          </Text>
          <TextInput
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder={
              feedbackType === 'up'
                ? 'What did you like?'
                : 'What could be improved?'
            }
            mode="outlined"
            outlineStyle={{
              borderColor: Colors.lightGreen,
              borderWidth: 1.5,
              borderRadius: 12,
            }}
            style={{
              minHeight: 60,
              width: 260,
              backgroundColor: '#F3F4F6',
              borderRadius: 12,
              marginBottom: 18,
              fontSize: 15,
              paddingHorizontal: 12,
              paddingTop: 10,
              color: '#222',
            }}
            multiline={true}
            dense={true}
            contentStyle={{minHeight: 40, fontSize: 15, color: '#222'}}
            placeholderTextColor="#9CA3AF"
          />
          <View
            style={{flexDirection: 'row', justifyContent: 'center', gap: 12}}>
            <Button
              mode="outlined"
              onPress={() => setFeedbackModalVisible(false)}
              style={{
                borderRadius: 10,
                borderColor: '#6B7280',
                borderWidth: 1,
                marginRight: 6,
              }}
              labelStyle={{color: '#6B7280', fontWeight: '600', fontSize: 15}}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={submitFeedback}
              style={{
                borderRadius: 10,
                backgroundColor: Colors.lightGreen,
                marginLeft: 6,
              }}
              labelStyle={{color: '#fff', fontWeight: '700', fontSize: 15}}>
              Submit
            </Button>
          </View>
        </Modal>
      </Portal>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
        <StatusBar
          backgroundColor={Colors.lightGreen}
          barStyle={'light-content'}
        />
        <MainHeader
          isEmodeOn={true}
          onPressEmode={() => props.navigation.goBack()}
          isChatBarHide={false}
          showBackButton={false}
          nextButtonText="Back to Home"
          onNextPress={() => {
            props.navigation.goBack();
          }}
        />
        {/* Disclaimer Overlay */}
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            marginBottom: 8,
            borderRadius: 8,
            alignSelf: 'stretch',
          }}>
          <Text
            style={{
              color: '#ababab',
              fontSize: 13,
              textAlign: 'center',
            }}>
            Replies are generated by AI and can be wrong. Please follow the
            instructions carefully or report abuse.
          </Text>
        </View>
        {/* Predefined Questions */}
        {/* {showPredefinedQuestions && (
        <View style={styles.predefinedQuestionsContainer}>
          <Text style={styles.predefinedQuestionsTitle}>
            Quick Start Questions
          </Text>
          {PREDEFINED_QUESTIONS.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.predefinedQuestionButton}
              onPress={() => handlePredefinedQuestion(question)}>
              <Text style={styles.predefinedQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}
        <FlatList
          ref={flatListRef}
          data={messages}
          initialScrollIndex={0}
          getItemLayout={(_, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
          inverted
          renderItem={({item, index}) => renderMessage(item, index)}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <Spinner
              isVisible={true}
              size={32}
              type={'ThreeBounce'}
              color={Colors.lightGreen}
            />
          </View>
        )}
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            {/* Three-dot menu on the left */}
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  ref={menuAnchorRef}
                  icon={() => <LucideMoreVertical size={24} color="#6B7280" />}
                  onPress={() => setMenuVisible(true)}
                  // --- MODIFICATION HERE ---
                  // Replaced inline style with a style from the stylesheet
                  style={styles.menuButton}
                />
              }>
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  handleClearChat();
                }}
                title="Clear Chat"
                leadingIcon="delete"
              />
            </Menu>
            <TextInput
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type your message..."
              mode="outlined"
              outlineStyle={styles.textInputOutline}
              style={styles.textInput}
              multiline={true}
              dense={true}
              contentStyle={styles.textInputContent}
              placeholderTextColor="#9CA3AF"
            />
            {loading ? (
              <IconButton
                icon={() => <LucideSquare size={24} color="#FFFFFF" />} // Increased icon size for better look in a 48x48 button
                onPress={handleStop}
                style={[styles.sendButton, styles.stopButton]}
              />
            ) : (
              <IconButton
                icon={() => <LucideSend size={24} color="#FFFFFF" />} // Increased icon size
                onPress={() => {
                  setFeedback({}); // Reset feedbacks
                  sendMessage();
                }}
                style={styles.sendButton}
              />
            )}
          </View>
        </View>
        {shareMessage ? (
          <>
            <View style={styles.hiddenCard}>
              <ChatCard
                ref={cardRef}
                message={shareMessage}
                userName={getDisplayName(rawDisplayName) || ''}
              />
            </View>
          </>
        ) : null}
      </KeyboardAvoidingView>
    </Provider>
  );
};

export default Chat;
