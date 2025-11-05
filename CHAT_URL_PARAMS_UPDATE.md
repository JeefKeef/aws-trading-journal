# Chat History URL Parameters & Sidebar Collapse Implementation

## Overview
Implemented URL parameter tracking for chat conversations, auto-close functionality for the floating sidebar when selecting a chat, and toggle collapse/expand for the left panel.

## Changes Made

### 1. Left Panel Context (`components/layout/left-panel-context.tsx`)
- **Added toggle functionality**: The left panel can now be collapsed/hidden
- **Updated mode type**: `LeftPanelMode` now includes `null` to represent hidden state
- **New `togglePanel` function**: Clicking an active panel mode will collapse it, clicking an inactive mode will show it
- **New `isVisible` property**: Tracks whether the left panel should be displayed

**Key Updates:**
```typescript
export type LeftPanelMode = "chat" | "settings" | null;

type LeftPanelContextValue = {
  mode: LeftPanelMode;
  setMode: (mode: LeftPanelMode) => void;
  isVisible: boolean;
  togglePanel: (mode: LeftPanelMode) => void;
};

const togglePanel = (targetMode: LeftPanelMode) => {
  // If clicking the same mode, collapse the panel
  if (mode === targetMode) {
    setMode(null);
  } else {
    setMode(targetMode);
  }
};
```

### 2. Shell Layout (`app/(shell)/layout.tsx`)
- **Conditional rendering**: Left panel only renders when `isVisible` is true
- **Dynamic sizing**: Right panel expands to 100% width when left panel is hidden
- **ResizableHandle**: Only renders when left panel is visible

**Key Updates:**
```typescript
const { mode: leftPanelMode, isVisible } = useLeftPanel();

{isVisible && (
  <>
    <ResizablePanel defaultSize={15} minSize={15} maxSize={30}>
      <div className="h-full overflow-auto">
        <LeftPanelContent mode={leftPanelMode} />
      </div>
    </ResizablePanel>
    <ResizableHandle className="bg-neutral-200 dark:bg-neutral-800" />
  </>
)}
<ResizablePanel defaultSize={isVisible ? 85 : 100} minSize={50}>
  {/* Right panel content */}
</ResizablePanel>
```

### 3. Chat Page (`app/(shell)/chat/page.tsx`)
- **Added URL parameter sync**: The chat page now reads and writes the `chatId` query parameter
- **Bidirectional sync**: 
  - When a `chatId` is in the URL, it loads that conversation
  - When the active conversation changes, it updates the URL
  - When no conversation is active, it removes the `chatId` from the URL

**URL Pattern:**
```
/chat                    # New/empty chat (no conversation)
/chat?chatId=conv-123    # Specific conversation loaded
```

**Key Logic:**
```typescript
useEffect(() => {
  const chatIdFromUrl = searchParams.get("chatId");
  
  // If URL has chatId different from current, update the conversation
  if (chatIdFromUrl && chatIdFromUrl !== currentConversationId) {
    setCurrentConversation(chatIdFromUrl);
  }
  
  // If we have an active conversation but no chatId in URL, add it
  if (currentConversationId && !chatIdFromUrl) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("chatId", currentConversationId);
    router.replace(`${pathname}?${params.toString()}`);
  }
  
  // If no conversation and no chatId, make sure URL is clean
  if (!currentConversationId && chatIdFromUrl) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("chatId");
    router.replace(`${pathname}?${params.toString()}`);
  }
}, [currentConversationId, searchParams, pathname, router, setCurrentConversation]);
```

### 3. Chat Page (`app/(shell)/chat/page.tsx`)
- **Added URL parameter sync**: The chat page now reads and writes the `chatId` query parameter
- **Bidirectional sync**: 
  - When a `chatId` is in the URL, it loads that conversation
  - When the active conversation changes, it updates the URL
  - When no conversation is active, it removes the `chatId` from the URL

**URL Pattern:**
```
/chat                    # New/empty chat (no conversation)
/chat?chatId=conv-123    # Specific conversation loaded
```

### 4. Sidebar Component (`components/layout/sidebar.tsx`)
- **Added router and searchParams hooks** to the `HoverSidebar` component
- **Auto-close on chat selection**: Calls `onMouseLeave()` when a chat or "New Chat" is clicked
- **Toggle functionality**: Chat and Settings buttons now toggle the left panel visibility
- **URL navigation with chatId**: Uses `router.push()` with the `chatId` parameter

**Updated Features:**

#### Main Sidebar Icons (Left Icons)
- Click Chat icon → Toggle chat panel (show if hidden, hide if already showing chat)
- Click Settings icon → Toggle settings panel (show if hidden, hide if already showing settings)
- Clicking an active button will collapse the left panel
- Clicking an inactive button will expand the left panel with that mode

#### Workspace Section in Floating Sidebar
The floating sidebar includes a "Workspace" section with Chat and Settings buttons that also toggle:
```typescript
<button
  onClick={() => {
    togglePanel(item.mode);
    onMouseLeave(); // Close the floating sidebar
    router.push(`/${item.mode}`);
  }}
>
  <Icon className="h-4 w-4" />
  <span>{item.label}</span>
</button>
```
```typescript
const handleNewChat = () => {
  createNewConversation();
  setMode("chat");
  // Close the sidebar
  onMouseLeave();
  
  // Navigate to chat without chatId (will be a new conversation)
  const params = new URLSearchParams(searchParams.toString());
  params.delete("chatId");
  router.push(`/chat?${params.toString()}`);
};
```

#### `handleChatClick(conversationId)`
```typescript
const handleChatClick = (conversationId: string) => {
  setCurrentConversation(conversationId);
  setMode("chat");
  // Close the sidebar
  onMouseLeave();
  
  // Navigate to chat with chatId
  const params = new URLSearchParams(searchParams.toString());
  params.set("chatId", conversationId);
  router.push(`/chat?${params.toString()}`);
};
```

## Benefits

### 1. **Shareable Links**
Users can now share or bookmark specific conversations:
```
https://app.signaljournal.ai/chat?chatId=conv-abc123
```

### 2. **Browser Navigation**
- Back/forward buttons work correctly with chat history
- Refreshing the page maintains the active conversation

### 3. **Better UX**
- Sidebar automatically closes when selecting a chat (no manual close needed)
- **Left panel toggle**: Click Chat or Settings button again to collapse/hide the left panel
- **Full-width mode**: Right panel expands to full width when left panel is collapsed
- **Visual feedback**: Active button styling shows which panel mode is active
- Clear feedback that the selection was processed
- Workspace section in floating sidebar provides quick access to Chat and Settings

### 4. **Future Backend Integration**
When integrating with Supabase:
- The `chatId` can directly map to conversation IDs in the database
- URL can be used for deep linking from notifications or emails
- Analytics can track which conversations are most accessed

## Testing Checklist

- [x] Click a chat history item → sidebar closes and URL updates
- [x] Click "New Chat" → sidebar closes and URL clears `chatId`
- [x] Click "Chat" button in floating sidebar → sidebar closes and toggles chat panel
- [x] Click "Settings" button in floating sidebar → sidebar closes and toggles settings panel
- [x] Click Chat icon on main sidebar → toggles left panel visibility
- [x] Click Settings icon on main sidebar → toggles left panel visibility
- [x] Click active Chat icon again → collapses left panel
- [x] Click active Settings icon again → collapses left panel
- [x] Left panel collapsed → right panel expands to full width
- [x] Navigate to `/chat?chatId=xxx` → loads that conversation
- [x] Create new message → `chatId` appears in URL
- [x] Browser back/forward → conversations switch correctly
- [x] Refresh page with `chatId` → conversation persists
- [x] Delete active conversation → URL clears `chatId`

## Future Enhancements

1. **Query Param Preservation**
   - Other query params (like `?view=screener`) are preserved when switching chats
   - Example: `/chat?chatId=conv-123&view=screener`

2. **Conversation Metadata in URL**
   - Could add `?chatId=conv-123&title=My+Trading+Setup` for better SEO

3. **Supabase Integration**
   - Validate `chatId` against database on page load
   - Show 404 or redirect if conversation doesn't exist or user lacks permission

4. **Analytics Tracking**
   - Track which conversations are opened most frequently
   - Monitor sidebar interaction patterns (open, close, select)

## Notes

- **URL Strategy**: Uses `router.push()` instead of `router.replace()` so users can use browser back button
- **Sidebar Close**: Implemented via existing `onMouseLeave` callback for consistency with hover behavior
- **Context Sync**: Chat history context automatically syncs with URL changes
- **No Breaking Changes**: Existing chat functionality remains unchanged, just enhanced with URL params
