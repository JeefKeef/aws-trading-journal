"use client";

import Link from "next/link";
import { Sparkles, Settings, BookOpen, Plus, MoreHorizontal, TrendingUp, BarChart3, LineChart, Calendar, Trash2, LayoutDashboard, Menu } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLeftPanel } from "@/components/layout/left-panel-context";
import type { LeftPanelMode } from "@/components/layout/left-panel-context";
import { useChatHistory } from "@/lib/contexts/chat-history-context";

// Left panel toggle items (persistent content)
const leftPanelItems = [
	{
		mode: "chat" as LeftPanelMode,
		label: "AI Chat",
		icon: Sparkles,
	},
	{
		mode: "settings" as LeftPanelMode,
		label: "Settings",
		icon: Settings,
	},
];

// Right panel apps (dynamic content via query params)
const rightPanelApps = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
		href: "/dashboard", // Direct route to dashboard page
	},
	{
		id: "journal",
		label: "Journal",
		icon: BookOpen,
		href: "/journal", // Direct route to journal page
	},
	{
		id: "trades",
		label: "Trades",
		icon: LineChart,
		href: "/trades", // Direct route to trades page
	},
	{
		id: "analytics",
		label: "Analytics",
		icon: BarChart3,
		href: "/analytics", // Direct route to analytics page
	},
	{
		id: "calendar",
		label: "Calendar",
		icon: Calendar,
		href: "/calendar", // Direct route to calendar page
	},
];

export function AppSidebar() {
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const { mode: leftPanelMode, togglePanel } = useLeftPanel();

	const handleLeftPanelClick = (mode: LeftPanelMode) => {
		togglePanel(mode);
		// Close the floating sidebar when clicking chat or settings
		setIsHistoryOpen(false);
	};

	return (
		<>
			<aside className="hidden border-r border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80 lg:flex lg:w-14 lg:flex-col lg:items-center lg:py-5 relative z-40">
				<div
					onMouseEnter={() => setIsHistoryOpen(true)}
					className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 text-white shadow-sm cursor-pointer transition-transform hover:scale-110 dark:border-neutral-700 dark:bg-neutral-800"
				>
					<Menu className="h-4 w-4" />
				</div>

				<nav className="mt-6 flex flex-1 flex-col items-center gap-3">
					{leftPanelItems.map((item) => {
						const Icon = item.icon;
						const active = leftPanelMode === item.mode;

						return (
							<Tooltip key={item.mode}>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleLeftPanelClick(item.mode)}
										aria-label={item.label}
										className={cn(
											"h-10 w-10 rounded-full border border-transparent text-neutral-500 transition hover:border-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100",
											active &&
												"border-neutral-900 bg-neutral-900 text-white hover:border-neutral-900 hover:text-white hover:bg-neutral-900 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:border-neutral-100 dark:hover:text-neutral-900 dark:hover:bg-neutral-100"
										)}
									>
										<Icon className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="right" className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
									{item.label}
								</TooltipContent>
							</Tooltip>
						);
					})}
				</nav>

				<div className="mt-auto text-[10px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-600">
					v1.0
				</div>
			</aside>

			{/* Workspace Sidebar - Appears on hover */}
			{isHistoryOpen && (
				<HoverSidebar
					onMouseEnter={() => setIsHistoryOpen(true)}
					onMouseLeave={() => setIsHistoryOpen(false)}
				/>
			)}
		</>
	);
}

// Hover sidebar component for apps and chat history
function HoverSidebar({
	onMouseEnter,
	onMouseLeave,
}: {
	onMouseEnter: () => void;
	onMouseLeave: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { togglePanel } = useLeftPanel();
  const { conversations, setCurrentConversation, createNewConversation, deleteConversation } = useChatHistory();
  const [deleteHoverId, setDeleteHoverId] = useState<string | null>(null);

	const handleNewChat = () => {
		createNewConversation();
		togglePanel("chat");
		// Close the sidebar
		onMouseLeave();
		
		// Navigate to chat without chatId (will be a new conversation)
		const params = new URLSearchParams(searchParams.toString());
		params.delete("chatId");
		router.push(`/chat?${params.toString()}`);
	};

	const handleChatClick = (conversationId: string) => {
		setCurrentConversation(conversationId);
		togglePanel("chat");
		// Close the sidebar
		onMouseLeave();
		
		// Navigate to chat with chatId
		const params = new URLSearchParams(searchParams.toString());
		params.set("chatId", conversationId);
		router.push(`/chat?${params.toString()}`);
	};

	const handleDeleteChat = (e: React.MouseEvent, conversationId: string) => {
		e.preventDefault();
		e.stopPropagation();
		deleteConversation(conversationId);
	};

	return (
		<div
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className="fixed left-14 top-0 z-100 h-screen w-72 border-r border-neutral-200 bg-white shadow-xl animate-in slide-in-from-left duration-200 dark:border-neutral-800 dark:bg-neutral-950"
		>
			<div className="flex h-full flex-col">
				{/* Header */}
				<div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
					<div className="flex items-center justify-between">
						<button
							onClick={handleNewChat}
							className="flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-700 transition dark:text-neutral-100 dark:hover:text-neutral-300"
						>
							<Sparkles className="h-4 w-4" />
							<span>New Chat</span>
						</button>
						<button
							onClick={handleNewChat}
							className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
						>
							<Plus className="h-4 w-4" />
						</button>
					</div>
				</div>

				{/* Apps - Right panel navigation */}
				<div className="border-b border-neutral-200 px-3 py-3 dark:border-neutral-800">
					<div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
						Apps
					</div>
					<div className="space-y-1">
						{rightPanelApps.map((app) => {
							const Icon = app.icon;
							const isActive = pathname === app.href;

							return (
								<Link
									key={app.id}
									href={app.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
										isActive
											? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
											: "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
									)}
								>
									<Icon className="h-4 w-4" />
									<span>{app.label}</span>
								</Link>
							);
						})}
					</div>
				</div>

				{/* Recent Chats - Scrollable */}
				<div className="flex-1 overflow-y-auto px-3 py-3">
					<div className="mb-2 flex items-center justify-between px-2">
						<div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
							Recent Chats
						</div>
						{conversations.length > 5 && (
							<button className="text-[10px] font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
								See all
							</button>
						)}
					</div>
					<div className="space-y-0.5">
						{conversations.slice(0, 7).map((conv) => (
							<div
								key={conv.id}
								onClick={() => handleChatClick(conv.id)}
								onMouseEnter={() => setDeleteHoverId(conv.id)}
								onMouseLeave={() => setDeleteHoverId(null)}
								className="group w-full block rounded-lg px-3 py-2 text-sm cursor-pointer transition hover:bg-neutral-100 dark:hover:bg-neutral-900"
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleChatClick(conv.id);
									}
								}}
							>
								<div className="flex items-start justify-between gap-2">
									<p className="flex-1 font-medium text-neutral-900 line-clamp-1 dark:text-neutral-100">
										{conv.title}
									</p>
									{deleteHoverId === conv.id && (
										<button
											onClick={(e) => handleDeleteChat(e, conv.id)}
											className="text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
											aria-label="Delete conversation"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									)}
									{deleteHoverId !== conv.id && (
										<button className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
											<MoreHorizontal className="h-3.5 w-3.5" />
										</button>
									)}
								</div>
								<p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{conv.timestamp}</p>
							</div>
						))}
					</div>
				</div>

				{/* Footer */}
				<div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
					<div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
						<TrendingUp className="h-3.5 w-3.5" />
						<span>Signal v1.0</span>
					</div>
				</div>
			</div>
		</div>
	);
}
