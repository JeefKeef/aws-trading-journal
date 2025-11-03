import { NextRequest, NextResponse } from "next/server";

type ProviderMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_SYSTEM_PROMPT =
  "You are Signal Copilot, an expert trading strategist who combines quantitative insight with pragmatic execution advice. Offer thoughtful, concise answers with clear reasoning, highlight risk considerations, and suggest practical next steps. When relevant, reference how AWS tooling can support the workflow.";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl =
    process.env.OPENAI_BASE_URL?.replace(/\/$/, "") ??
    "https://api.openai.com/v1";

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing OPENAI_API_KEY. Add it to your environment (e.g. .env.local) and restart the dev server.",
      },
      { status: 500 },
    );
  }

  let payload: { model?: string; messages?: ProviderMessage[] } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload.", details: serializeError(error) },
      { status: 400 },
    );
  }

  const { model = DEFAULT_MODEL, messages = [] } = payload;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      {
        error:
          "Messages array is required. Include at least one user message to continue.",
      },
      { status: 400 },
    );
  }

  const filteredMessages = prependSystemMessage(messages);

  try {
    const completionResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: filteredMessages,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      return NextResponse.json(
        {
          error: "The upstream model provider returned an error.",
          details: sanitizeErrorBody(errorText),
          status: completionResponse.status,
        },
        { status: completionResponse.status },
      );
    }

    const data = await completionResponse.json();
    return NextResponse.json({ message: data.choices?.[0]?.message ?? null });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to reach the model provider.",
        details: serializeError(error),
      },
      { status: 502 },
    );
  }
}

function prependSystemMessage(messages: ProviderMessage[]): ProviderMessage[] {
  const existingSystemMessage = messages.find((message) => {
    if (!message || typeof message !== "object") {
      return false;
    }
    return message.role === "system";
  });

  if (existingSystemMessage) {
    return messages;
  }

  return [
    {
      role: "system",
      content: DEFAULT_SYSTEM_PROMPT,
    },
    ...messages,
  ];
}

function sanitizeErrorBody(input: string) {
  try {
    const parsed = JSON.parse(input);
    if (
      parsed &&
      typeof parsed === "object" &&
      "error" in parsed &&
      typeof parsed.error === "object" &&
      parsed.error !== null
    ) {
      const errorObject = parsed.error as Record<string, unknown>;
      const message =
        typeof errorObject.message === "string"
          ? errorObject.message
          : undefined;
      const type =
        typeof errorObject.type === "string" ? errorObject.type : undefined;
      if (!message && !type) {
        return parsed;
      }
      return {
        message,
        type,
      };
    }
    return parsed;
  } catch {
    return input.slice(0, 2_000);
  }
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }
  return String(error);
}
