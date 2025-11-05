# Chat History Quick Reference

## Import the Hook

```typescript
import { useChatHistory } from "@/lib/contexts/chat-history-context";
```

## Common Operations

### Get Current State

```typescript
const {
  messages,                  // Array of messages in current conversation
  currentConversation,       // Current conversation object or null
  conversations,             // List of all conversations
} = useChatHistory();
```

### Create New Chat

```typescript
const { createNewConversation } = useChatHistory();

// Auto-generate title from first message
const newId = createNewConversation();

// Or specify title and model
const newId = createNewConversation("Portfolio Analysis", "signal-pro-v1");
```

### Switch Conversations

```typescript
const { setCurrentConversation } = useChatHistory();

// Load conversation
setCurrentConversation("conv-123");

// New chat (clear current)
setCurrentConversation(null);
```

### Send Message

```typescript
const { addMessage } = useChatHistory();

// User message
addMessage({
  role: "user",
  content: "Analyze AAPL",
  status: "complete",
});

// Assistant response
addMessage({
  role: "assistant",
  content: "Here's the analysis...",
  status: "complete",
});

// System error
addMessage({
  role: "system",
  content: "API request failed",
  status: "error",
});
```

### Update Message

```typescript
const { updateMessage } = useChatHistory();

// Update content
updateMessage("msg-123", {
  content: "Updated text",
});

// Update status
updateMessage("msg-123", {
  status: "error",
});
```

### Delete Conversation

```typescript
const { deleteConversation } = useChatHistory();

deleteConversation("conv-123");
// Automatically updates UI and clears current if was active
```

### Refresh List

```typescript
const { refreshConversations } = useChatHistory();

refreshConversations();
// Usually automatic, but call manually if needed
```

## Display Patterns

### Show Messages

```tsx
const { messages } = useChatHistory();

<div>
  {messages.map((msg) => (
    <div key={msg.id}>
      <strong>{msg.role}:</strong> {msg.content}
      <small>{new Date(msg.createdAt).toLocaleString()}</small>
    </div>
  ))}
</div>
```

### Show Conversation List

```tsx
const { conversations, setCurrentConversation } = useChatHistory();

<div>
  {conversations.map((conv) => (
    <button key={conv.id} onClick={() => setCurrentConversation(conv.id)}>
      <h4>{conv.title}</h4>
      <p>{conv.lastMessage}</p>
      <time>{conv.timestamp}</time>
    </button>
  ))}
</div>
```

### Current Conversation Info

```tsx
const { currentConversation } = useChatHistory();

{currentConversation && (
  <div>
    <h2>{currentConversation.title}</h2>
    <span>Model: {currentConversation.model}</span>
    <span>Updated: {currentConversation.updatedAt}</span>
  </div>
)}
```

## Mock Data Access

### Get All Data

```typescript
import {
  mockConversations,
  mockMessages,
  mockScreenerResults,
  mockHeatmapData,
  mockNewsData,
  mockAlertsData,
} from "@/lib/data/mock-data";
```

### Helper Functions

```typescript
import {
  getConversationById,
  getMessagesByConversationId,
  getAllConversations,
} from "@/lib/data/mock-data";

// Find specific conversation
const conv = getConversationById("conv-1");

// Get messages for conversation
const messages = getMessagesByConversationId("conv-1");

// Get all conversations (sorted by most recent)
const all = getAllConversations();
```

## Type Definitions

```typescript
import type { 
  ChatMessage, 
  Conversation, 
  MessageRole 
} from "@/lib/types/chat";

// Message roles
type MessageRole = "user" | "assistant" | "system";

// Message object
type ChatMessage = {
  id: string;
  conversationId?: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status?: "pending" | "error" | "complete";
};

// Conversation object
type Conversation = {
  id: string;
  title: string;
  timestamp: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  model: string;
};
```

## Common Patterns

### Auto-Create Conversation on First Message

```typescript
const { addMessage, currentConversationId, createNewConversation } = useChatHistory();

// Context handles this automatically
addMessage({ role: "user", content: "Hello" });
// If no current conversation, creates one with "Hello" as title
```

### Optimistic UI Updates

```typescript
const { addMessage } = useChatHistory();

// Add user message immediately
addMessage({ role: "user", content: input, status: "complete" });

// Then make API call
const response = await fetch("/api/chat", { ... });
const data = await response.json();

// Add assistant response when received
addMessage({ role: "assistant", content: data.message, status: "complete" });
```

### Error Handling

```typescript
const { addMessage } = useChatHistory();

try {
  const response = await fetch("/api/chat", { ... });
  addMessage({ role: "assistant", content: response.content });
} catch (error) {
  addMessage({
    role: "system",
    content: error.message,
    status: "error",
  });
}
```

## Performance Tips

✅ **DO:**
- Use the context anywhere in the shell layout
- Let context manage conversation creation automatically
- Call `refreshConversations()` only when external data changes

❌ **DON'T:**
- Create multiple instances of the provider
- Mutate `messages` or `conversations` arrays directly
- Store large amounts of data in message content (use references)

## Debugging

### Check Current State

```typescript
const {
  messages,
  currentConversationId,
  currentConversation,
  conversations,
} = useChatHistory();

console.log("Current conversation:", currentConversationId);
console.log("Messages count:", messages.length);
console.log("Total conversations:", conversations.length);
```

### Verify Provider is Mounted

```typescript
// This error means provider is missing
// Error: useChatHistory must be used within a ChatHistoryProvider

// Fix: Ensure layout.tsx has:
<ChatHistoryProvider>
  {/* your components */}
</ChatHistoryProvider>
```

### Check Message Updates

```typescript
useEffect(() => {
  console.log("Messages changed:", messages);
}, [messages]);
```

## Migration Checklist

When connecting to Supabase:

- [ ] Replace `getAllConversations()` with Supabase query
- [ ] Replace `createMockConversation()` with insert
- [ ] Replace `addMockMessage()` with insert
- [ ] Add user authentication context
- [ ] Update types with database schema
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Set up Realtime subscriptions

## Related Documentation

- Full guide: `CHAT_HISTORY_IMPLEMENTATION.md`
- Copilot instructions: `.github/copilot-instructions.md`
- Type definitions: `lib/types/chat.ts`
- Mock data: `lib/data/mock-data.ts`
