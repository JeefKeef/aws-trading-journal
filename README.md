# Signal Copilot

Signal Copilot is an AI-native workspace focused on trading, market research, and AWS-driven analytics. The interface delivers a conversational experience with quick-start prompts, model selection, and a ready-to-wire API layer for large language models.

## Prerequisites

- Node.js 18+
- npm (or pnpm/yarn/bun)
- An OpenAI-compatible API key exposed as `OPENAI_API_KEY`

Optionally set `OPENAI_BASE_URL` if you are proxying requests through a compatible gateway (e.g. OpenRouter, Azure OpenAI, Together).

Create a local `.env.local` file at the project root:

```bash
OPENAI_API_KEY=sk-...
# OPENAI_BASE_URL=https://api.openai.com/v1
```

## Getting Started

Install dependencies and launch the dev server:

```bash
npm install
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) for the landing page. Launch the chat workspace from the hero actions or directly visit [http://localhost:3000/chat](http://localhost:3000/chat). The UI auto-updates while developing, and model calls flow through `app/api/chat/route.ts`.

### Key Features

- Modern chat surface with typing indicator, scrollback, and quick-start prompts
- Model selector with sane defaults (`gpt-4o-mini`, `gpt-4.1`, etc.)
- Abortable requests and optimistic UI updates
- Server route scaffolded for OpenAI-compatible chat completions with optional system prompt injection

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
