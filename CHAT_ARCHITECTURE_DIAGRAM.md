```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Chat History Architecture                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  lib/data/mock-data.ts                                                       │
│  ┌────────────────────────────────────────────────────────────────┐         │
│  │ mockConversations[]           mockMessages{}                   │         │
│  │ ├─ conv-1: "Market analysis"  ├─ conv-1: [msg1, msg2, ...]    │         │
│  │ ├─ conv-2: "Options strategy" ├─ conv-2: [msg1, msg2, ...]    │         │
│  │ ├─ conv-3: "Risk assessment"  ├─ conv-3: [msg1, msg2, ...]    │         │
│  │ └─ ...                        └─ ...                           │         │
│  │                                                                │         │
│  │ Helper Functions:                                              │         │
│  │ • getConversationById(id)                                      │         │
│  │ • getMessagesByConversationId(id)                             │         │
│  │ • getAllConversations()                                        │         │
│  │ • createMockConversation(title, model)                        │         │
│  │ • addMockMessage(convId, role, content)                       │         │
│  └────────────────────────────────────────────────────────────────┘         │
│                                     ▲                                        │
│                                     │                                        │
└─────────────────────────────────────┼────────────────────────────────────────┘
                                      │
                                      │ imports & uses
                                      │
┌─────────────────────────────────────┼────────────────────────────────────────┐
│                            CONTEXT LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  lib/contexts/chat-history-context.tsx                                       │
│  ┌────────────────────────────────────────────────────────────────┐         │
│  │ ChatHistoryProvider                                             │         │
│  │                                                                 │         │
│  │ State:                          Actions:                        │         │
│  │ • currentConversationId         • setCurrentConversation()      │         │
│  │ • currentConversation           • createNewConversation()       │         │
│  │ • messages (memoized)           • addMessage()                  │         │
│  │ • conversations                 • updateMessage()               │         │
│  │ • isLoading                     • deleteConversation()          │         │
│  │                                 • refreshConversations()        │         │
│  │                                                                 │         │
│  │ Performance Optimizations:                                      │         │
│  │ ✓ useMemo for derived state                                   │         │
│  │ ✓ Lazy initialization                                          │         │
│  │ ✓ Message caching per conversation                             │         │
│  │ ✓ Ref for latest state in callbacks                           │         │
│  └────────────────────────────────────────────────────────────────┘         │
│                                     ▲                                        │
│                                     │                                        │
│                                     │ provides context                       │
│                                     │                                        │
└─────────────────────────────────────┼────────────────────────────────────────┘
                                      │
                                      │
┌─────────────────────────────────────┼────────────────────────────────────────┐
│                          COMPONENT LAYER                                     │
├─────────────────────────────────────┴────────────────────────────────────────┤
│                                                                              │
│  app/(shell)/layout.tsx                                                      │
│  ┌────────────────────────────────────────────────────────────────┐         │
│  │ <ChatHistoryProvider>                                           │         │
│  │   <LeftPanelProvider>                                          │         │
│  │     <RightPaneProvider>                                        │         │
│  │       <ShellContent>{children}</ShellContent>                  │         │
│  │     </RightPaneProvider>                                       │         │
│  │   </LeftPanelProvider>                                         │         │
│  │ </ChatHistoryProvider>                                          │         │
│  └────────────────────────────────────────────────────────────────┘         │
│              │                                    │                          │
│              │                                    │                          │
│              ▼                                    ▼                          │
│  ┌─────────────────────────┐        ┌──────────────────────────┐           │
│  │ components/layout/      │        │ app/(shell)/chat/        │           │
│  │ sidebar.tsx             │        │ page.tsx                 │           │
│  │                         │        │                          │           │
│  │ const {                 │        │ const {                  │           │
│  │   conversations,        │        │   messages,              │           │
│  │   setCurrentConv,       │        │   addMessage,            │           │
│  │   createNewConv,        │        │   updateMessage,         │           │
│  │   deleteConv            │        │   currentConv            │           │
│  │ } = useChatHistory();   │        │ } = useChatHistory();    │           │
│  │                         │        │                          │           │
│  │ Renders:                │        │ Renders:                 │           │
│  │ • Conversation list     │        │ • Message bubbles        │           │
│  │ • New chat button       │        │ • Input textarea         │           │
│  │ • Delete buttons        │        │ • Model selector         │           │
│  │ • Hover sidebar         │        │ • Typing indicator       │           │
│  └─────────────────────────┘        └──────────────────────────┘           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA FLOW DIAGRAM                                 │
└─────────────────────────────────────────────────────────────────────────────┘

User Action: "New Chat"
     │
     ▼
[Sidebar: New Chat Button]
     │
     ├─ calls: createNewConversation()
     │
     ▼
[ChatHistoryContext]
     │
     ├─ calls: createMockConversation()
     │         ↓
     │    [mock-data.ts]
     │         ├─ creates new conversation object
     │         ├─ adds to mockConversations[]
     │         └─ initializes mockMessages[newId] = []
     │         ↓
     ├─ updates: conversations state
     ├─ sets: currentConversationId
     │
     ▼
[Components Re-render]
     │
     ├─ Sidebar: shows new conversation in list
     └─ ChatPage: displays welcome message


User Action: "Send Message"
     │
     ▼
[ChatPage: Send Button]
     │
     ├─ calls: addMessage({ role: "user", content: "..." })
     │
     ▼
[ChatHistoryContext]
     │
     ├─ if no currentConversationId:
     │    └─ auto-creates conversation from message
     │
     ├─ calls: addMockMessage(convId, role, content)
     │         ↓
     │    [mock-data.ts]
     │         ├─ creates new message object
     │         ├─ adds to mockMessages[convId][]
     │         └─ updates conversation.lastMessage
     │         ↓
     ├─ updates: messagesState
     ├─ calls: refreshConversations()
     │
     ▼
[Components Re-render]
     │
     ├─ ChatPage: new message appears in chat
     └─ Sidebar: updated lastMessage shows


User Action: "Switch Conversation"
     │
     ▼
[Sidebar: Click Conversation]
     │
     ├─ calls: setCurrentConversation(id)
     │
     ▼
[ChatHistoryContext]
     │
     ├─ updates: currentConversationId state
     │
     ├─ useMemo recomputes:
     │    ├─ calls: getMessagesByConversationId(id)
     │    │         ↓
     │    │    [mock-data.ts]
     │    │         └─ returns mockMessages[id]
     │    │         ↓
     │    └─ returns: messages array
     │
     ▼
[ChatPage Re-renders]
     │
     └─ displays: new conversation's messages


User Action: "Delete Conversation"
     │
     ▼
[Sidebar: Delete Button]
     │
     ├─ calls: deleteConversation(id)
     │
     ▼
[ChatHistoryContext]
     │
     ├─ removes from mockConversations[]
     ├─ deletes mockMessages[id]
     ├─ calls: refreshConversations()
     ├─ if was current: setCurrentConversationId(null)
     │
     ▼
[Components Re-render]
     │
     ├─ Sidebar: conversation removed from list
     └─ ChatPage: if was active, shows welcome message


┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Mock Data   │ ← Single source of truth (will become Supabase)
│  (Static)    │
└──────┬───────┘
       │
       │ read/write via helper functions
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│           ChatHistoryContext (React State)               │
│                                                          │
│  conversations ──────────┐                              │
│  (cached list)           │                              │
│                          │                              │
│  currentConversationId ──┼─► useMemo ──► messages      │
│  (selected ID)           │   (compute)   (active msgs) │
│                          │                              │
│  messagesState ──────────┘                              │
│  (per-conversation cache)                               │
└──────────────────────────────────────────────────────────┘
       │
       │ context.Provider
       │
       ▼
┌────────────────────────────────────────────────┐
│            Components (Consumers)              │
│                                                │
│  Sidebar        ChatPage      TopNav          │
│  useChatHistory useChatHistory useChatHistory │
└────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                      PERFORMANCE OPTIMIZATION                                │
└─────────────────────────────────────────────────────────────────────────────┘

1. Memoized Messages Computation
   ┌─────────────────────────────────────────────────────────────┐
   │ const messages = useMemo(() => {                            │
   │   if (!currentConversationId) return [WELCOME_MSG];        │
   │   return getMessagesByConversationId(currentConversationId);│
   │ }, [currentConversationId, messagesState]);                │
   └─────────────────────────────────────────────────────────────┘
   Benefits:
   • Only recomputes when conversation changes
   • Prevents unnecessary API calls
   • No re-render on unrelated state changes

2. Message State Caching
   ┌─────────────────────────────────────────────────────────────┐
   │ messagesState: Record<string, ChatMessage[]>                │
   │ {                                                           │
   │   "conv-1": [msg1, msg2, ...],                            │
   │   "conv-2": [msg1, msg2, ...],                            │
   │   "temp": [msg1, msg2, ...]   // for no conversation      │
   │ }                                                           │
   └─────────────────────────────────────────────────────────────┘
   Benefits:
   • Keeps messages in memory across switches
   • Fast conversation switching (no re-fetch)
   • Isolated updates (only active conversation)

3. Ref for Latest State
   ┌─────────────────────────────────────────────────────────────┐
   │ const messagesRef = useRef(messages);                       │
   │ useEffect(() => { messagesRef.current = messages }, [msgs]);│
   └─────────────────────────────────────────────────────────────┘
   Benefits:
   • API calls always use latest messages
   • Avoids stale closure issues
   • No dependency problems in callbacks

4. Lazy Initialization
   ┌─────────────────────────────────────────────────────────────┐
   │ const [conversations] = useState(() => getAllConversations());│
   └─────────────────────────────────────────────────────────────┘
   Benefits:
   • Computed only once on mount
   • Faster initial render
   • No wasted computation


┌─────────────────────────────────────────────────────────────────────────────┐
│                          MIGRATION PATH                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Current (Mock Data)                    Future (Supabase)
─────────────────────────────────────────────────────────────────────────────

getAllConversations()            →     supabase.from('conversations')
                                        .select('*')
                                        .order('updated_at', desc)

createMockConversation()         →     supabase.from('conversations')
                                        .insert({ title, model, user_id })

addMockMessage()                 →     supabase.from('messages')
                                        .insert({ conversation_id, role, content })

getMessagesByConversationId()    →     supabase.from('messages')
                                        .select('*')
                                        .eq('conversation_id', id)

deleteConversation()             →     supabase.from('conversations')
                                        .delete()
                                        .eq('id', conversationId)

No changes needed to:
• Component code
• Type definitions
• UI rendering
• Context structure
```
