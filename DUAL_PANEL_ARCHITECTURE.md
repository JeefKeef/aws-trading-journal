# Dual-Panel Navigation Architecture

## Overview

The Signal app now uses a **persistent dual-panel system** where:
- **Left Panel** (20% width) - Shows persistent content controlled by toggle buttons in the main sidebar (Chat or Settings)
- **Right Panel** (80% width) - Shows dynamic app content controlled by the hover sidebar (Journal, Screener, Market views)

## Key Principle

**The left panel remains consistent and doesn't change unless the user explicitly toggles between Chat and Settings.** The right panel changes independently based on app selection. For example:
- User is on Chat with Journal open in right panel
- User clicks Settings button → Left panel switches to Settings, Journal stays open in right panel
- User clicks Screener in hover sidebar → Right panel switches to Screener, Settings stays in left panel

## Architecture Changes

### Left Panel: Toggle-Based (No Routes)
Previously, `/chat` and `/settings` were separate routes. Now they are **toggle states** managed by `LeftPanelContext`:
- Click Chat icon → Toggles left panel to Chat mode
- Click Settings icon → Toggles left panel to Settings mode
- **No URL changes** when switching between Chat and Settings
- State persists as long as the app is open

### Right Panel: Query Parameter-Based
- Uses `?app=` query parameter for apps (Journal, Screener)
- Uses `?view=` for Market tabs (Overview, Charts, etc.)
- Full URL state for shareable links

## URL Structure

### Left Panel (Toggle State)
- **State-based:** No routes, managed by React Context
- Clicking Chat or Settings buttons toggles the left panel content
- **No URL changes** when switching between Chat and Settings
- Default: Chat mode

### Right Panel Navigation (Hover Sidebar)
- **Query parameter-based:** Uses `?app=` query parameter
- `?app=journal` - Shows Journal in right panel
- `?app=screener` - Shows Screener in right panel
- No `?app=` parameter - Shows Market tabs (Overview, Charts, Groups, Futures, Forex, Crypto)

### URL Examples
```
/                        → Left: Chat (default) | Right: Market Overview
/?app=journal            → Left: Chat          | Right: Journal
/?app=screener           → Left: Chat          | Right: Screener
/?view=charts            → Left: Chat          | Right: Charts tab
```

**Note:** The left panel state (Chat vs Settings) is NOT reflected in the URL. It's pure UI state that resets when you reload the page.

## Components Architecture

### 1. Left Panel Context (`components/layout/left-panel-context.tsx`)

**New Context for Managing Left Panel State:**
```tsx
export type LeftPanelMode = "chat" | "settings";

// Provider manages which content shows in left panel
<LeftPanelProvider>
  {children}
</LeftPanelProvider>

// Hook to access/update left panel mode
const { mode, setMode } = useLeftPanel();
```

**Key Points:**
- No routing involved
- Pure React state (not persisted in URL)
- Resets to "chat" on page reload
- Single source of truth for left panel content

### 2. Main Sidebar (`components/layout/sidebar.tsx`)

**Toggle buttons instead of navigation links:**
```tsx
// OLD: Navigation links
<Link href="/chat">Chat</Link>
<Link href="/settings">Settings</Link>

// NEW: Toggle buttons
<Button onClick={() => setLeftPanelMode("chat")}>Chat</Button>
<Button onClick={() => setLeftPanelMode("settings")}>Settings</Button>
```

**Main sidebar icons:**
- Click to toggle left panel mode (no navigation)
- Active state based on `leftPanelMode` from context

**Hover sidebar (appears on hover):**
- Shows apps that update right panel via `?app=` query parameter
- Preserves current left panel state
- URL pattern: `/?app=${appId}` (doesn't need pathname since we're always at root)

### 3. Shell Layout (`app/(shell)/layout.tsx`)

**Structure:**
```tsx
<LeftPanelProvider>
  <RightPaneProvider>
    <ShellContent />
  </RightPaneProvider>
</LeftPanelProvider>

// Inside ShellContent:
<ResizablePanelGroup>
  {/* Left Panel - Renders based on toggle state */}
  <ResizablePanel defaultSize={20}>
    <LeftPanelContent mode={leftPanelMode} />
  </ResizablePanel>
  
  {/* Right Panel - Dynamic content based on ?app= */}
  <ResizablePanel defaultSize={80}>
    <RightPane appView={searchParams.get('app')} />
  </ResizablePanel>
</ResizablePanelGroup>
```

**LeftPanelContent component:**
```tsx
function LeftPanelContent({ mode }: { mode: "chat" | "settings" }) {
  switch (mode) {
    case "chat":
      return <ChatPage />;
    case "settings":
      return <SettingsPage />;
  }
}
```

**Key Changes:**
- No `children` prop - content is determined by context
- `ChatPage` and `SettingsPage` are imported as components, not routed to
- Left panel mode comes from `useLeftPanel()` hook

**RightPane logic:**
```tsx
function RightPane({ appView }: { appView: string | null }) {
  // If specific app is selected
  if (appView === 'journal') return <JournalContent />;
  if (appView === 'screener') return <ScreenerContent />;
  
  // Default: Market view with tabs
  // Uses ?view= for sub-navigation (charts, futures, forex, crypto)
  return <MarketViewWithTabs />;
}
```

### 3. Right Panel Modes

**App Mode** (when `?app=journal` or `?app=screener`):
- Full-screen app interface
- No navigation tabs shown
- Content fills entire right panel

**Market Mode** (when no `?app=` parameter):
- Shows tabbed navigation (Overview, Charts, Groups, Futures, Forex, Crypto)
- Uses `?view=` parameter for tab switching
- Example: `?view=charts`, `?view=futures`

## User Flows

### Flow 1: Opening Journal while on Chat
1. User is at `/` → Left: Chat (default) | Right: Market Overview
2. User hovers over sidebar icon → Hover sidebar appears
3. User clicks "Journal" → URL changes to `/?app=journal`
4. Left panel: **Chat stays open** (toggle state unchanged)
5. Right panel: Switches to Journal

### Flow 2: Switching to Settings with Journal Open
1. User is at `/?app=journal` → Left: Chat | Right: Journal
2. User clicks Settings icon in main sidebar → **No URL change**
3. Left panel: **Switches to Settings** (toggle state changes)
4. Right panel: **Journal stays open** (URL preserved)

### Flow 3: Switching Between Apps
1. User is at `/?app=journal` with Settings toggled → Left: Settings | Right: Journal
2. User hovers sidebar and clicks "Screener" → URL changes to `/?app=screener`
3. Left panel: **Settings stays open** (toggle state unchanged)
4. Right panel: **Switches to Screener**

### Flow 4: Market Tabs Navigation
1. User is at `/` (no app param) → Left: Chat | Right: Market Overview
2. User clicks "Charts" tab → URL changes to `/?view=charts`
3. Left panel: **Chat stays open**
4. Right panel: Shows Charts view

### Flow 5: Toggling Left Panel
1. User is at `/?app=journal` → Left: Chat | Right: Journal  
2. User clicks Settings icon → **No URL change**, still `/?app=journal`
3. Left panel: Switches to Settings
4. Right panel: **Journal stays open** (URL and query params unchanged)
5. User clicks Chat icon → **No URL change**, still `/?app=journal`
6. Left panel: Switches back to Chat
7. Right panel: **Journal still open**

## Migration from Old System

### Before (Route-Based Left Panel)
- Clicking Chat navigated to `/chat` route
- Clicking Settings navigated to `/settings` route
- Left panel content determined by URL
- Browser back/forward affected left panel

### After (Toggle-Based Left Panel)
- Clicking Chat/Settings toggles state (no navigation)
- Left panel content determined by React Context
- URL only reflects right panel state
- Browser back/forward only affects right panel
- **Left panel state resets on page reload**

### Breaking Changes
- `/chat` and `/settings` routes still exist but are not used
- All shell content is now at `/` (root of shell group)
- Old deep links like `/chat?app=journal` redirect to `/?app=journal`
- Left panel preference is not bookmarkable (resets to Chat on reload)

## Benefits

1. **True Persistence** - Left panel never changes unless user explicitly toggles
2. **Simplified URLs** - Single root URL with clean query params
3. **Instant Toggling** - No navigation, no loading states for left panel switches
4. **Right Panel Shareable** - URLs like `/?app=journal&tab=recent` work perfectly
5. **Clean Separation** - Left panel is ephemeral UI state, right panel is bookmarkable URL state
6. **No Router Conflicts** - Toggle state doesn't interfere with Next.js routing

## Trade-offs

### Advantages
- ✅ Instant left panel switching (no navigation)
- ✅ Simpler URL structure (`/` instead of `/chat` or `/settings`)
- ✅ Right panel URLs remain clean and shareable
- ✅ No weird edge cases with router state

### Disadvantages  
- ❌ Left panel state is not bookmarkable (always resets to Chat)
- ❌ Browser back/forward doesn't affect left panel
- ❌ Can't deep link to Settings view (must manually toggle after load)
- ❌ State lost on page refresh (may want localStorage persistence later)

## Technical Notes

### State Management
**Left Panel:**
- Managed by `LeftPanelContext` (React Context API)
- No localStorage persistence (resets on reload)
- To add persistence: `useEffect` to sync with localStorage

**Right Panel:**
- Managed by URL query parameters
- Natural persistence via browser URL
- Works with browser history

### Hover Sidebar URL Building
Since we're always at root, apps just update query params:
```tsx
const href = `/?app=${app.id}`;  // Simple, always root path
```

Previously needed: `const href = `${pathname}?app=${app.id}`;` to preserve `/chat` or `/settings`

### Mobile Layout
On mobile, panels stack vertically:
- Top: Left panel content (children)
- Bottom: Right panel content (RightPane)

Same query parameter logic applies for consistency.

## Future Enhancements

1. **More Apps** - Add more right panel apps (Backtester, Alerts, News)
2. **Panel Layouts** - Allow users to save panel configurations
3. **Multi-Panel** - Support 3+ panels for advanced users
4. **Keyboard Shortcuts** - Quick switching between apps (Cmd+1, Cmd+2, etc.)
5. **Recent Apps** - Track recently used apps for quick access
