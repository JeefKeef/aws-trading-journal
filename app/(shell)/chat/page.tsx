"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles, StopCircle, User, Send } from "lucide-react";
import {
  createDefaultToolState,
  useRightPane,
} from "@/components/layout/right-pane-context";
import type { ToolState } from "@/components/layout/right-pane-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type MessageRole = "user" | "assistant" | "system";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status?: "pending" | "error" | "complete";
};

const defaultAssistantMessage: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Welcome back. How can I help move your market workflow forward? Ask for risk framing, automation blueprints, or rapid synthesis.",
  createdAt: new Date().toISOString(),
  status: "complete",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    defaultAssistantMessage,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeModel, setActiveModel] = useState("signal-mini-v1");
  const viewportRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { setState: setToolState } = useRightPane();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({
      top: node.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isStreaming]);

  useEffect(() => {
    setToolState(createDefaultToolState());
  }, [setToolState]);

  const sendMessage = async (prompt?: string) => {
    const userInput = (prompt ?? inputValue).trim();
    if (!userInput || isStreaming) {
      return;
    }

    const detectedFromUser = detectToolFromInput(userInput);
    setToolState(detectedFromUser);

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: userInput,
      createdAt: new Date().toISOString(),
      status: "complete",
    };

    const optimisticConversation = [...messagesRef.current, userMessage];
    setMessages(optimisticConversation);
    setInputValue("");
    setIsStreaming(true);

    try {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: activeModel,
          messages: optimisticConversation.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const fallbackMessage =
          typeof errorPayload?.error === "string"
            ? errorPayload.error
            : `Request failed with status ${response.status}.`;
        throw new Error(fallbackMessage);
      }

      const payload = await response.json();
      const serializedContent =
        extractAssistantText(payload) ??
        "I couldn't generate a response. Try refining your question.";

      const assistantMessage: ChatMessage = {
        id: createMessageId("assistant"),
        role: "assistant",
        content: serializedContent,
        createdAt: new Date().toISOString(),
        status: "complete",
      };

      const detectedFromAssistant = detectToolFromAssistant(serializedContent);
      if (detectedFromAssistant.mode !== "overview") {
        setToolState(detectedFromAssistant);
      }

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      if (isAbortError(error)) {
        setMessages((current) =>
          current.map((message) =>
            message.id === userMessage.id
              ? {
                  ...message,
                  status: "error",
                  content: `${message.content}\n\n— Request cancelled.`,
                }
              : message,
          ),
        );
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while contacting the model API.";
      const systemMessage: ChatMessage = {
        id: createMessageId("system"),
        role: "system",
        content: message,
        createdAt: new Date().toISOString(),
        status: "error",
      };
      setMessages((current) => [...current, systemMessage]);
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void sendMessage();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)]">
      <div className="flex flex-1 min-h-0 flex-col">
        <div
          ref={viewportRef}
          className="flex-1 overflow-y-scroll px-5 py-6"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isStreaming ? <TypingIndicator /> : null}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-neutral-200 bg-neutral-50 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-700 dark:bg-neutral-800">
            <Textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask for synthesis, automation, or specific trade support…"
              rows={3}
              className="w-full resize-none px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none border-0 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:bg-neutral-800"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              disabled={isStreaming}
            />

            <div className="flex items-center justify-between gap-2 border-t border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
              <Select
                value={activeModel}
                onValueChange={setActiveModel}
                disabled={isStreaming}
              >
                <SelectTrigger size="sm" className="h-9 text-xs w-44 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                  <SelectValue>
                    {activeModel === "signal-mini-v1" && (
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm w-[110px]" style={{ borderColor: "#A0A0A0", backgroundColor: "rgba(160, 160, 160, 0.12)", color: "#B8B8B8", boxShadow: "0 0 4px rgba(160, 160, 160, 0.2), inset 0 0 6px rgba(160, 160, 160, 0.05)" }}>
                        signal-mini-v1
                      </span>
                    )}
                    {activeModel === "signal-core-v1" && (
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm w-[110px]" style={{ borderColor: "#00FFB3", backgroundColor: "rgba(0, 255, 179, 0.12)", color: "#00FFB3", boxShadow: "0 0 6px rgba(0, 255, 179, 0.25), inset 0 0 8px rgba(0, 255, 179, 0.06)" }}>
                        signal-core-v1
                      </span>
                    )}
                    {activeModel === "signal-pro-v1" && (
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm w-[110px]" style={{ borderColor: "#3D7EFF", backgroundColor: "rgba(61, 126, 255, 0.12)", color: "#3D7EFF", boxShadow: "0 0 6px rgba(61, 126, 255, 0.25), inset 0 0 8px rgba(61, 126, 255, 0.06)" }}>
                        signal-pro-v1
                      </span>
                    )}
                    {activeModel === "signal-ultra-v1" && (
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm w-[110px]" style={{ borderColor: "#A55EFF", backgroundColor: "rgba(165, 94, 255, 0.12)", color: "#A55EFF", boxShadow: "0 0 6px rgba(165, 94, 255, 0.25), inset 0 0 8px rgba(165, 94, 255, 0.06)" }}>
                        signal-ultra-v1
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-80">
                  <SelectItem value="signal-mini-v1" className="py-2.5">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-[11px] font-bold w-[110px] shrink-0" style={{ borderColor: "#A0A0A0", backgroundColor: "rgba(160, 160, 160, 0.12)", color: "#B8B8B8", boxShadow: "0 0 4px rgba(160, 160, 160, 0.2), inset 0 0 6px rgba(160, 160, 160, 0.05)" }}>
                        signal-mini-v1
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 flex-1 text-right">Fast & free</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="signal-core-v1" className="py-2.5">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-[11px] font-semibold w-[110px] shrink-0" style={{ borderColor: "#00FFB3", backgroundColor: "rgba(0, 255, 179, 0.12)", color: "#00FFB3", boxShadow: "0 0 6px rgba(0, 255, 179, 0.25), inset 0 0 8px rgba(0, 255, 179, 0.06)" }}>
                        signal-core-v1
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 flex-1 text-right">Advanced analytics</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="signal-pro-v1" className="py-2.5">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-[11px] font-semibold w-[110px] shrink-0" style={{ borderColor: "#3D7EFF", backgroundColor: "rgba(61, 126, 255, 0.12)", color: "#3D7EFF", boxShadow: "0 0 6px rgba(61, 126, 255, 0.25), inset 0 0 8px rgba(61, 126, 255, 0.06)" }}>
                        signal-pro-v1
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 flex-1 text-right">Deep reasoning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="signal-ultra-v1" className="py-2.5">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-[11px] font-semibold w-[110px] shrink-0" style={{ borderColor: "#A55EFF", backgroundColor: "rgba(165, 94, 255, 0.12)", color: "#A55EFF", boxShadow: "0 0 6px rgba(165, 94, 255, 0.25), inset 0 0 8px rgba(165, 94, 255, 0.06)" }}>
                        signal-ultra-v1
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 flex-1 text-right">Maximum intelligence</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <button
                type="submit"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:disabled:bg-neutral-700"
                disabled={isStreaming || inputValue.trim().length === 0}
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {isStreaming ? (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
                onClick={() => {
                  abortControllerRef.current?.abort();
                  setIsStreaming(false);
                }}
              >
                <StopCircle className="h-3.5 w-3.5" />
                Stop
              </button>
            </div>
          ) : null}

        </form>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <article
      className={`flex w-full gap-3 text-sm ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser ? (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 text-white dark:border-neutral-700 dark:bg-neutral-100 dark:text-neutral-900">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      ) : (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
          <User className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed shadow-sm sm:max-w-[70%] ${
          isSystem
            ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300"
            : isUser
              ? "border border-neutral-200 bg-neutral-900 text-white dark:border-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
              : "border border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        <span className="mt-1.5 block text-[10px] uppercase tracking-[0.3em] text-neutral-500" suppressHydrationWarning>
          {formatTimestamp(message.createdAt)}
        </span>
      </div>
    </article>
  );
}

function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Thinking
    </div>
  );
}

function formatTimestamp(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Just now";
  }
  return parsed.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function createMessageId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36)}`;
}

function extractAssistantText(payload: unknown): string | undefined {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    payload.message &&
    typeof payload.message === "object"
  ) {
    const message = payload.message as Record<string, unknown>;
    if (typeof message.content === "string") {
      return message.content;
    }

    if (Array.isArray(message.content)) {
      const textChunk = message.content
        .map((chunk) => {
          if (
            chunk &&
            typeof chunk === "object" &&
            "text" in chunk &&
            typeof (chunk as Record<string, unknown>).text === "string"
          ) {
            return (chunk as Record<string, unknown>).text;
          }
          return "";
        })
        .filter(Boolean)
        .join("\n");
      if (textChunk.trim()) {
        return textChunk.trim();
      }
    }
  }

  if (
    payload &&
    typeof payload === "object" &&
    "choices" in payload &&
    Array.isArray((payload as Record<string, unknown>).choices)
  ) {
    const choice = (payload as { choices: Array<Record<string, unknown>> })
      .choices[0];
    if (
      choice &&
      typeof choice === "object" &&
      "message" in choice &&
      choice.message &&
      typeof choice.message === "object" &&
      "content" in choice.message &&
      Array.isArray(
        (choice.message as Record<string, unknown>).content as unknown[],
      )
    ) {
      const content = (choice.message as Record<string, unknown>).content as unknown[];
      const textPart = content.find(
        (item) =>
          item &&
          typeof item === "object" &&
          "type" in item &&
          (item as Record<string, unknown>).type === "text",
      ) as { text?: string } | undefined;
      if (textPart?.text) {
        return textPart.text;
      }
    }

    if (
      choice &&
      typeof choice === "object" &&
      "message" in choice &&
      choice.message &&
      typeof choice.message === "object" &&
      "content" in choice.message &&
      typeof (choice.message as Record<string, unknown>).content === "string"
    ) {
      return (choice.message as Record<string, unknown>).content as string;
    }
  }
  return undefined;
}

function isAbortError(error: unknown): error is DOMException {
  return error instanceof DOMException && error.name === "AbortError";
}

function detectToolFromInput(input: string): ToolState {
  const normalized = input.toLowerCase();

  if (
    normalized.includes("screener") ||
    normalized.includes("filter") ||
    normalized.includes("scan")
  ) {
    return {
      mode: "screener",
      heading: "Dynamic equity screener",
      description: "Filters aligned with the latest query.",
      payload: [
        {
          symbol: "NVDA",
          name: "NVIDIA Corp.",
          sector: "Semiconductors",
          price: "$874.15",
          change: "+2.4%",
          volume: "1.2x avg",
        },
        {
          symbol: "MSFT",
          name: "Microsoft",
          sector: "Software",
          price: "$428.71",
          change: "+1.1%",
          volume: "0.9x avg",
        },
        {
          symbol: "TSLA",
          name: "Tesla",
          sector: "Automotive",
          price: "$203.14",
          change: "-0.8%",
          volume: "1.5x avg",
        },
      ],
    };
  }

  if (
    normalized.includes("heatmap") ||
    normalized.includes("rotation") ||
    normalized.includes("sector")
  ) {
    return {
      mode: "heatmap",
      heading: "Sector rotation heatmap",
      description: "Performance pockets based on the latest request.",
      payload: [
        { label: "AI Infrastructure", performance: 4.2 },
        { label: "Cybersecurity", performance: 1.8 },
        { label: "Energy", performance: -1.1 },
        { label: "Financials", performance: -0.4 },
        { label: "Healthcare", performance: 0.6 },
        { label: "Industrials", performance: 2.4 },
      ],
    };
  }

  if (
    normalized.includes("headline") ||
    normalized.includes("news") ||
    normalized.includes("catalyst")
  ) {
    return {
      mode: "news",
      heading: "Live catalyst tracker",
      description: "Narratives surfaced based on your prompt.",
      payload: [
        {
          headline: "Chipmakers gear up for next-gen data center spend",
          source: "Signal Desk",
          timestamp: "Now",
          summary:
            "Leadership rotation continues toward AI infrastructure as hyperscalers accelerate orders.",
        },
        {
          headline: "Crude slips on unexpected inventory build",
          source: "Macro Pulse",
          timestamp: "3m ago",
          summary:
            "Energy majors underperform services; VWAP alerts triggered across integrated names.",
        },
        {
          headline: "GBP spikes on BOE hawkish tone",
          source: "FX Radar",
          timestamp: "12m ago",
          summary:
            "Governor highlights inflation persistence; rate path repriced with front-end yields higher.",
        },
      ],
    };
  }

  if (
    normalized.includes("alert") ||
    normalized.includes("risk") ||
    normalized.includes("monitor")
  ) {
    return {
      mode: "alerts",
      heading: "Risk alerts & automation queue",
      description: "Triggered monitors in response to your request.",
      payload: [
        {
          title: "Option skew expansion in SMH",
          detail: "Call skew hitting 95th percentile. Consider gamma scalping adjustments.",
          severity: "high",
          time: "Now",
        },
        {
          title: "AWS data pull scheduled",
          detail:
            "Lambda pipeline ready to ingest options chain every 5 minutes. Awaiting confirmation.",
          severity: "medium",
          time: "2m ago",
        },
        {
          title: "Funding stress monitor",
          detail:
            "Short-term credit spreads widening modestly. Keep liquidity dashboard on standby.",
          severity: "low",
          time: "7m ago",
        },
      ],
    };
  }

  return createDefaultToolState();
}

function detectToolFromAssistant(content: string): ToolState {
  const normalized = content.toLowerCase();

  if (normalized.includes("screener") || normalized.includes("filter")) {
    return detectToolFromInput("screener");
  }
  if (normalized.includes("heatmap") || normalized.includes("rotation")) {
    return detectToolFromInput("heatmap");
  }
  if (normalized.includes("headline") || normalized.includes("news")) {
    return detectToolFromInput("news");
  }
  if (normalized.includes("alert") || normalized.includes("monitor")) {
    return detectToolFromInput("alerts");
  }

  return createDefaultToolState();
}
