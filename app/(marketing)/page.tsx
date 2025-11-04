"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPageRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to screener page - the default entry point
    router.replace("/screener");
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 dark:border-neutral-800 dark:border-t-neutral-100 mx-auto"></div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}
