import { generalPrompt, preferencePrompt } from "@/constants/prompts";
import useAppStore from "@/core/stores";
import chatGPTClient from "@/services/api/chat_gpt_client";
import { ChatSchemaProp } from "@/services/sqlite/chat-messages";
import { useNetInfo } from "@react-native-community/netinfo";
import { useCallback, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

interface ChatActionsProps {
  onUpdateMessage: (chat: Omit<ChatSchemaProp, "date">) => Promise<void>;
}

type RoleType = "user" | "assistant";

const useChatActions = ({ onUpdateMessage }: ChatActionsProps) => {
  const [messages, setMessages] = useState<ChatSchemaProp[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUnlockModalVisible, setUnlockModalVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [animatedText, setAnimatedText] = useState(false);

  let chatMemory: { role: RoleType; content: string }[] = [];

  const abortController = useRef<AbortController | null>(null);
  const { isConnected } = useNetInfo();
  const { 
    setMessageCount, 
    setLastGreeted,
    addPreference,
    removePreference } = useAppStore((state) => state.engagement);
  const { 
    messageCount, 
    lastGreeted,
    preferences } = useAppStore(
    useShallow((state) => state.engagement)
  );
  const { userData, paymentStatus } = useAppStore(
    useShallow((state) => state.user)
  );

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const processChatMemory = useCallback(() => {
    chatMemory = [];

    messages.forEach((element) => {
      const role: RoleType = element.role === "assistant" ? "assistant" : "user";

      if (role === "assistant" && chatMemory.length && chatMemory[0].role === "assistant") {
        chatMemory = [{ role: "user", content: "Hi" }, ...chatMemory];
      }

      if (role === "user" && chatMemory.length && chatMemory[0].role === "user") {
        chatMemory = [
          { role: "assistant", content: "Something went wrong. Please try again." },
          ...chatMemory,
        ];
      }

      chatMemory = [{ role, content: element.message }, ...chatMemory];
    });

    if (chatMemory.length && chatMemory[0].role === "assistant") {
      chatMemory = [{ role: "user", content: "Hi" }, ...chatMemory];
    }
  }, [messages]);

  const preferenceManager = useCallback(
    async (userInput: string) => {
      try {
        abortController.current = new AbortController();
        const preference_prompt = `Existing preferences: ${JSON.stringify(preferences)}, Message: ${userInput}`;
        const response = await chatGPTClient.post(
          "",
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: preferencePrompt,
              },
              ...chatMemory,
              {
                role: "user",
                content: `${preference_prompt}\n\n${userInput}`,
              },
            ],
          },
          {
            signal: abortController.current.signal,
          }
        );

        const newPreferences = JSON.parse((response.data.choices[0].message.content as any).text);
        if (newPreferences.success) {
          (addPreference(newPreferences.preference));
          newPreferences.remove.map((item: string) => {
            (removePreference(item));
          });
        }
      } catch (error) {
        if (abortController.current?.signal.aborted) {
          console.log("Request was aborted");
        } else {
          console.error("Error:", error);
        }
        console.log(error);
      } finally{
        abortController.current = null;
      }
    },
    [preferences],
  );

  const generateResponse = useCallback(
    async (message: string) => {
      try {
        processChatMemory();
        setLoading(true);
        abortController.current = new AbortController();

        const response = await chatGPTClient.post(
          "",
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: generalPrompt,
              },
              ...chatMemory,
              {
                role: "user",
                content: message,
              },
            ],
          },
          {
            signal: abortController.current.signal,
          }
        );

        return response.data.choices[0].message.content;
      } catch (error) {
        if (abortController.current?.signal.aborted) {
          console.log("Request was aborted");
        } else {
          console.error("Error:", error);
        }
        return "";
      } finally {
        setLoading(false);
        abortController.current = null;
      }
    },
    [chatMemory, processChatMemory]
  );

  const sendMessage = useCallback(async () => {
    if (!userInput?.trim()) return;

    if (!isConnected) {
      console.log("No internet connection");
      return;
    }

    try {
      if (!paymentStatus) {
        const currentDate = getCurrentDate();
        const currentMessageCount = messageCount.date === currentDate ? messageCount.count : 0;

        if (currentMessageCount >= 5) {
          setUnlockModalVisible(true);
          return;
        }

        setMessageCount({ date: currentDate, count: currentMessageCount + 1 });
      }

      await onUpdateMessage({ role: "user", message: userInput });
      setMessages((prev) => [{ role: "user", message: userInput }, ...prev]);
      setUserInput("");

      preferenceManager(userInput);
      const botResponse = await generateResponse(userInput);
      if (botResponse) {
        setAnimatedText(true);
        await onUpdateMessage({ role: "assistant", message: botResponse });
        setMessages((prev) => [{ role: "assistant", message: botResponse }, ...prev]);
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
    }
  }, [
    userInput,
    isConnected,
    paymentStatus,
    messageCount,
    generateResponse,
    onUpdateMessage,
    setMessageCount,
  ]);

  const handleStop = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  return {
    messages,
    loading,
    isUnlockModalVisible,
    animatedText,
    lastGreeted,
    userData,
    userInput,
    setLastGreeted,
    handleStop,
    sendMessage,
    setLoading,
    setMessages,
    setAnimatedText,
    setUserInput,
  };
};

export default useChatActions;
