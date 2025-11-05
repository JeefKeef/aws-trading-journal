# Chat History Implementation Guide

## Overview

This document explains the efficient, performant chat history system implemented for the Signal trading terminal. The architecture uses React Context for state management with centralized mock data that's ready to swap with Supabase when needed.

## Architecture

### 1. **Centralized Mock Data Store** (`lib/data/mock-data.ts`)

Single source of truth for all dummy data across the app. This ensures:
- **Consistency**: Same data structure used everywhere
- **Maintainability**: One place to update mock data
- **Easy migration**: Simple to swap with Supabase queries later

```typescript
// Example usage
import { mockConversations, getConversationById } from '@/lib/data/mock-data';
```

**Key exports:**
- `mockConversations`: Array of conversation objects
- `mockMessages`: Record of messages keyed by conversationId
- `getConversationById()`: Helper to find conversation
- `getMessagesByConversationId()`: Get messages for a conversation
- `createMockConversation()`: Simulate creating new chat
- `addMockMessage()`: Simulate adding message to conversation

### 2. **Type Definitions** (`lib/types/chat.ts`)

Shared TypeScript types that will remain consistent when migrating to Supabase:

```typescript
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
```

### 3. **Chat History Context** (`lib/contexts/chat-history-context.tsx`)

Global state management for chat functionality using React Context:

**State:**
- `currentConversationId`: Active conversation
- `currentConversation`: Full conversation object
- `messages`: Messages for current conversation
- `conversations`: List of all conversations

**Actions:**
- `setCurrentConversation(id)`: Switch to a conversation
- `createNewConversation(title, model)`: Start new chat
- `addMessage(message)`: Add user/assistant/system message
- `updateMessage(id, updates)`: Update existing message
- `deleteConversation(id)`: Remove conversation
- `refreshConversations()`: Reload conversation list

**Performance Optimizations:**
- Uses `useMemo` to compute derived state (prevents unnecessary re-renders)
- Lazy initialization with function form of `useState`
- Messages loaded on-demand per conversation
- Conversation list cached and only refreshed when needed

## Integration Points

### Shell Layout (`app/(shell)/layout.tsx`)

Chat history provider wraps the entire shell layout:

```tsx
<ChatHistoryProvider>
  <LeftPanelProvider>
    <RightPaneProvider>
      <ShellContent>{children}</ShellContent>
    </RightPaneProvider>
  </LeftPanelProvider>
</ChatHistoryProvider>
```

**Why**: Makes chat history accessible to both sidebar (for history list) and chat page (for messages).

### Chat Page (`app/(shell)/chat/page.tsx`)

Uses the context to manage chat state:

```tsx
const { messages, addMessage, updateMessage } = useChatHistory();

// When sending a message
addMessage({
  role: "user",
  content: userInput,
  status: "complete",
});

// When receiving assistant response
addMessage({
  role: "assistant",
  content: aiResponse,
  status: "complete",
});
```

**Benefits:**
- No need for local state management
- Messages persist across navigation
- Automatic conversation creation on first user message
- Error handling with system messages

### Sidebar (`components/layout/sidebar.tsx`)

Displays conversation list and handles navigation:

```tsx
const { conversations, setCurrentConversation, createNewConversation, deleteConversation } = useChatHistory();

// New chat button
<button onClick={handleNewChat}>New Chat</button>

// Recent chats list
{conversations.slice(0, 7).map((conv) => (
  <button onClick={() => handleChatClick(conv.id)}>
    {conv.title}
  </button>
))}
```

**Features:**
- Hover-to-expand sidebar (doesn't use routing)
- Delete conversations with confirmation
- Shows last 7 recent chats
- Real-time updates when new chats are created

## Usage Examples

### Starting a New Conversation

```typescript
const { createNewConversation } = useChatHistory();

// Create with auto-generated title
const newId = createNewConversation();

// Or with custom title and model
const newId = createNewConversation("Portfolio Analysis", "signal-pro-v1");
```

### Switching Between Conversations

```typescript
const { setCurrentConversation, currentConversationId } = useChatHistory();

// Load a specific conversation
setCurrentConversation("conv-123");

// Start fresh (no conversation selected)
setCurrentConversation(null);
```

### Accessing Messages

```typescript
const { messages, currentConversation } = useChatHistory();

// Messages array is always current
messages.map(msg => (
  <div key={msg.id}>{msg.content}</div>
));

// Current conversation metadata
if (currentConversation) {
  console.log(currentConversation.title);
  console.log(currentConversation.model);
}
```

### Deleting Conversations

```typescript
const { deleteConversation } = useChatHistory();

// Remove conversation and all its messages
deleteConversation("conv-123");

// Context automatically:
// - Removes from state
// - Clears current if was active
// - Updates conversations list
```

## Performance Considerations

### Efficient Rendering

1. **Memoized Messages**: Uses `useMemo` to prevent recalculating messages on every render
2. **Lazy Loading**: Messages only loaded when conversation is selected
3. **Optimistic Updates**: UI updates immediately before API calls complete
4. **Ref for Latest State**: `messagesRef` ensures API calls always use current messages

### State Updates

```typescript
// ✅ Good: Batched updates
addMessage({ role: "user", content: "Hello" });
addMessage({ role: "assistant", content: "Hi!" });

// ❌ Avoid: Direct state mutation
messages.push(newMessage); // Won't trigger re-render
```

### Memory Management

- Conversations stored in centralized mock data (not duplicated in state)
- Message cache per conversation (only active conversation messages in state)
- Delete removes both conversation and all associated messages

## Migration Path to Supabase

When ready to connect to Supabase, update these functions in `chat-history-context.tsx`:

### 1. Load Conversations

```typescript
// Current (mock)
const [conversations, setConversations] = useState(() => getAllConversations());

// With Supabase
const [conversations, setConversations] = useState<Conversation[]>([]);

useEffect(() => {
  const loadConversations = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    setConversations(data || []);
  };
  loadConversations();
}, []);
```

### 2. Create Conversation

```typescript
// Current (mock)
const newConv = createMockConversation(title, model);

// With Supabase
const { data } = await supabase
  .from('conversations')
  .insert({ title, model, user_id: userId })
  .select()
  .single();
```

### 3. Add Message

```typescript
// Current (mock)
const newMessage = addMockMessage(convId, role, content);

// With Supabase
const { data } = await supabase
  .from('messages')
  .insert({
    conversation_id: convId,
    role,
    content,
    user_id: userId
  })
  .select()
  .single();
```

### 4. Delete Conversation

```typescript
// Current (mock)
mockConversations.splice(index, 1);

// With Supabase
await supabase
  .from('conversations')
  .delete()
  .eq('id', conversationId);
```

## Troubleshooting

### Messages Not Persisting

**Issue**: Messages disappear on page refresh  
**Cause**: Using mock data (not persisted)  
**Solution**: This is expected until Supabase integration. For now, conversations only exist in current session.

### Conversation List Not Updating

**Issue**: New conversations don't appear in sidebar  
**Cause**: Forgot to call `refreshConversations()`  
**Solution**: Context automatically calls this in `addMessage` and `createNewConversation`

### TypeScript Errors

**Issue**: `Cannot find module '@/lib/types/chat'`  
**Cause**: VSCode TypeScript server needs reload  
**Solution**: Run "TypeScript: Restart TS Server" in command palette

### Performance Issues with Many Messages

**Issue**: Chat becomes slow with 100+ messages  
**Cause**: Re-rendering entire message list  
**Solution**: Already optimized with `useMemo`. For 1000+ messages, consider virtualization with `react-window`.

## Testing Checklist

- [ ] Create new conversation from sidebar
- [ ] Send messages in chat
- [ ] Switch between conversations
- [ ] Delete conversations
- [ ] Messages persist within same session
- [ ] Sidebar shows correct recent chats
- [ ] Hover sidebar shows/hides smoothly
- [ ] No console errors or warnings
- [ ] Dark mode works correctly
- [ ] Mobile responsive (if applicable)

## Next Steps

1. **Supabase Schema**: Create tables for conversations and messages
2. **Authentication**: Add user context to associate conversations with users
3. **Real-time Updates**: Use Supabase Realtime for live message updates
4. **Search**: Add conversation search functionality
5. **Export**: Allow exporting conversation history
6. **Archive**: Move old conversations to archive instead of deleting

## Related Files

- `lib/data/mock-data.ts` - Centralized data store
- `lib/types/chat.ts` - TypeScript definitions
- `lib/contexts/chat-history-context.tsx` - State management
- `app/(shell)/layout.tsx` - Provider setup
- `app/(shell)/chat/page.tsx` - Chat interface
- `components/layout/sidebar.tsx` - Conversation list
- `components/layout/left-panel-context.tsx` - Left panel toggle state

## Additional Resources

- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [useMemo Optimization](https://react.dev/reference/react/useMemo)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [TypeScript with React](https://react.dev/learn/typescript)
