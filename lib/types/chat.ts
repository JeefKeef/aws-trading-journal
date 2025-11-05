/**
 * Chat Types
 * 
 * Shared type definitions for chat functionality.
 * These types will remain consistent when migrating to Supabase.
 */

export type MessageRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  conversationId?: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status?: "pending" | "error" | "complete";
};

export type Conversation = {
  id: string;
  title: string;
  timestamp: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  model: string;
};
