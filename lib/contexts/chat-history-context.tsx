"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ChatMessage, Conversation } from "@/lib/types/chat";
import {
  mockConversations,
  mockMessages,
  getConversationById,
  getMessagesByConversationId,
  getAllConversations,
  createMockConversation,
  addMockMessage,
} from "@/lib/data/mock-data";

type ChatHistoryContextValue = {
  // Current conversation
  currentConversationId: string | null;
  currentConversation: Conversation | null;
  messages: ChatMessage[];
  
  // All conversations
  conversations: Conversation[];
  
  // Actions
  setCurrentConversation: (conversationId: string | null) => void;
  createNewConversation: (title?: string, model?: string) => string;
  addMessage: (message: Omit<ChatMessage, "id" | "createdAt">) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  deleteConversation: (conversationId: string) => void;
  refreshConversations: () => void;
  
  // Loading states
  isLoading: boolean;
};

const ChatHistoryContext = createContext<ChatHistoryContextValue | undefined>(undefined);

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Welcome back. How can I help move your market workflow forward? Ask for risk framing, automation blueprints, or rapid synthesis.",
  createdAt: new Date().toISOString(),
  status: "complete",
};

export function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(() => getAllConversations());
  const [messagesState, setMessagesState] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading] = useState(false);

  // Compute messages for current conversation
  const messages = useMemo(() => {
    if (!currentConversationId) {
      return [DEFAULT_WELCOME_MESSAGE];
    }
    
    // Check if we have messages in state (for active conversation)
    if (messagesState[currentConversationId]) {
      return messagesState[currentConversationId];
    }
    
    // Otherwise, load from mock data
    const convMessages = getMessagesByConversationId(currentConversationId);
    return convMessages.length > 0 ? convMessages : [DEFAULT_WELCOME_MESSAGE];
  }, [currentConversationId, messagesState]);

  const currentConversation = currentConversationId
    ? getConversationById(currentConversationId) || null
    : null;

  const setCurrentConversation = useCallback((conversationId: string | null) => {
    setCurrentConversationId(conversationId);
  }, []);

  const createNewConversation = useCallback(
    (title?: string, model: string = "signal-mini-v1") => {
      const conversationTitle = title || "New conversation";
      const newConv = createMockConversation(conversationTitle, model);
      setConversations(getAllConversations());
      setCurrentConversationId(newConv.id);
      return newConv.id;
    },
    []
  );

  const refreshConversations = useCallback(() => {
    setConversations(getAllConversations());
  }, []);

  const addMessage = useCallback(
    (message: Omit<ChatMessage, "id" | "createdAt">) => {
      // If no current conversation, create one from the first user message
      let convId = currentConversationId;
      if (!convId && message.role === "user") {
        const title = message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "");
        convId = createNewConversation(title);
      }

      if (convId) {
        const newMessage = addMockMessage(convId, message.role, message.content);
        setMessagesState((prev) => ({
          ...prev,
          [convId!]: [...(prev[convId!] || messages), { ...newMessage, ...message }],
        }));
        refreshConversations();
      } else {
        // Temporary message for current session (no conversation yet)
        const tempMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          role: message.role,
          content: message.content,
          createdAt: new Date().toISOString(),
          status: message.status,
        };
        setMessagesState((prev) => ({
          ...prev,
          temp: [...(prev.temp || [DEFAULT_WELCOME_MESSAGE]), tempMessage],
        }));
      }
    },
    [currentConversationId, createNewConversation, messages, refreshConversations]
  );

  const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
    setMessagesState((prev) => {
      const convId = currentConversationId || "temp";
      const convMessages = prev[convId] || [];
      return {
        ...prev,
        [convId]: convMessages.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
      };
    });
  }, [currentConversationId]);

  const deleteConversation = useCallback((conversationId: string) => {
    // Remove from mock data
    const index = mockConversations.findIndex((c) => c.id === conversationId);
    if (index !== -1) {
      mockConversations.splice(index, 1);
    }
    delete mockMessages[conversationId];

    // Update state
    setMessagesState((prev) => {
      const updated = { ...prev };
      delete updated[conversationId];
      return updated;
    });
    refreshConversations();
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  }, [currentConversationId, refreshConversations]);

  const value: ChatHistoryContextValue = {
    currentConversationId,
    currentConversation,
    messages,
    conversations,
    setCurrentConversation,
    createNewConversation,
    addMessage,
    updateMessage,
    deleteConversation,
    refreshConversations,
    isLoading,
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
}

export function useChatHistory() {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  }
  return context;
}
