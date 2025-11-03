import Link from "next/link";
import { ArrowRight, LineChart, ShieldCheck, Sparkles } from "lucide-react";

const featureHighlights = [
  {
    title: "Market intelligence, distilled",
    description:
      "Surface the most relevant price action, macro context, and risk levels in a single prompt.",
    icon: LineChart,
  },
  {
    title: "AWS-native workflows",
    description:
      "Connect to your lakes, warehouses, and analytics stacks — automate data pulls with ease.",
    icon: Sparkles,
  },
  {
    title: "Guardrails for execution",
    description:
      "Bake process into every insight with checklists, risk constraints, and templated documentation.",
    icon: ShieldCheck,
  },
];

const quickStats = [
  { label: "Latency", value: "<400ms", caption: "Streaming responses" },
  { label: "Models", value: "4+", caption: "OpenAI compatible" },
  { label: "Playbooks", value: "Infinite", caption: "Custom prompt kits" },
];

const currentYear = new Date().getFullYear();

export default function LandingPage() {
  return (
    <main className="bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
        <section className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-neutral-500">
              <Sparkles className="h-3.5 w-3.5 text-neutral-700" />
              Market copilots, reimagined
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
                Run your trading research with an AI partner that remembers the
                process.
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                Signal Copilot helps you synthesize market structure, map trade
                ideas, and wire AWS data workflows — all in one conversational
                workspace. Fast, opinionated, and built for operators who do not
                have time for noise.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-medium">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                GPT-4o mini · GPT-4.1 · o-series
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-medium">
                Real-time streaming
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-medium">
                Guardrails & playbooks
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Start a session
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300"
              >
                Explore the workflow
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-neutral-100 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Workspace preview
                  </p>
                  <p className="text-xs text-neutral-500">
                    Compact UI with sidebar + live model selection
                  </p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                  Streaming
                </span>
              </div>
              <div className="space-y-4 px-5 py-6 text-sm text-neutral-600">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="font-medium text-neutral-900">Risk framing</p>
                  <p className="mt-2 text-neutral-600">
                    “Highlight key risks for a short-term NVDA trade around earnings,
                    then suggest an automated AWS ingest to monitor implied vol.”
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="font-medium text-neutral-900">Next steps</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-600">
                    <li>Quantify skew using last 6 earnings releases.</li>
                    <li>Draft checklist for execution playbook.</li>
                    <li>Deploy lambda alert if IV crush exceeds 20%.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mt-20 grid gap-8 rounded-3xl border border-neutral-200 bg-neutral-50 px-8 py-10 md:grid-cols-3"
        >
          {featureHighlights.map(({ title, description, icon: Icon }) => (
            <div key={title} className="space-y-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white">
                <Icon className="h-5 w-5 text-neutral-700" />
              </span>
              <p className="text-base font-semibold text-neutral-900">{title}</p>
              <p className="text-sm leading-relaxed text-neutral-600">
                {description}
              </p>
            </div>
          ))}
        </section>

        <section
          id="workflow"
          className="mt-20 flex flex-col gap-10 rounded-3xl border border-neutral-200 bg-white px-8 py-10 lg:flex-row lg:items-center"
        >
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-semibold text-neutral-900">
              A workflow that keeps signal high
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Every conversation is a workspace. Pin your prompts, track
              iterations, and export the playbook to your data or execution stack.
              Switch models without losing context, or hand off the conversation to
              collaborators.
            </p>
          </div>
          <div className="flex flex-1 flex-wrap gap-4">
            {quickStats.map(({ label, value, caption }) => (
              <div
                key={label}
                className="min-w-[180px] flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                  {label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-neutral-900">
                  {value}
                </p>
                <p className="mt-2 text-sm text-neutral-600">{caption}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="faq"
          className="mt-20 rounded-3xl border border-neutral-200 bg-neutral-50 px-8 py-10"
        >
          <h2 className="text-2xl font-semibold text-neutral-900">FAQ</h2>
          <div className="mt-8 grid gap-6 text-sm leading-relaxed text-neutral-600 md:grid-cols-2">
            <div>
              <p className="font-medium text-neutral-900">
                Can I bring my own foundation models?
              </p>
              <p className="mt-2">
                Yes. Plug in any OpenAI-compatible endpoint via environment
                variables. The workspace automatically adapts to the available
                models.
              </p>
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                Does the chat store sensitive data?
              </p>
              <p className="mt-2">
                No data is persisted by default. Only the prompts you share are sent
                to your configured provider, and you can layer in your own storage if
                required.
              </p>
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                How does AWS integration work?
              </p>
              <p className="mt-2">
                Use the conversation to generate step-by-step automation, then deploy
                with your preferred AWS services. S3, Lambda, Step Functions, and
                EventBridge are all supported via recipes.
              </p>
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                Can teams collaborate on a session?
              </p>
              <p className="mt-2">
                Absolutely. Share the session link, maintain context for reviewers,
                and track suggestions directly in the chat stream.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-neutral-200 bg-white/80 px-6 py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-xs text-neutral-500 sm:flex-row">
          <p>© {currentYear} Signal Copilot. Crafted for market operators.</p>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-neutral-700">
              Features
            </a>
            <a href="#workflow" className="hover:text-neutral-700">
              Workflow
            </a>
            <Link href="/chat" className="hover:text-neutral-700">
              Launch workspace
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
