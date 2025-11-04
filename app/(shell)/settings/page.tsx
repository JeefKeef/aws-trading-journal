"use client";

import { useEffect } from "react";
import {
  createDefaultToolState,
  useRightPane,
} from "@/components/layout/right-pane-context";

export default function SettingsPage() {
  const { setState } = useRightPane();

  useEffect(() => {
    setState(createDefaultToolState());
  }, [setState]);

  return (
    <>
      <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Settings</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Configure model providers, data connections, and workspace preferences.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-6">
        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Model routing</h2>
          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
            Choose default providers, fallbacks, and temperature ranges for each workspace.
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">AWS integrations</h2>
          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
            Connect to data lakes, event buses, or analytics pipelines to automate follow-ups.
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Playback & sharing</h2>
          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
            Control retention, exports, and session collaboration settings. Extend this panel to wire real preferences.
          </p>
        </section>
      </div>
    </>
  );
}
