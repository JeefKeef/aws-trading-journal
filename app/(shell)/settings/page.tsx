"use client";

import { useState } from "react";
import { Bell, Zap, Shield, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUserPreferences } from "@/lib/data/mock-data";
import { toast } from "sonner";

export default function SettingsPage() {
  const [preferences, setPreferences] = useState(mockUserPreferences);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updatePreference = <K extends keyof typeof preferences>(
    key: K,
    value: typeof preferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In production, this would save to Supabase
    toast.success("Settings saved", {
      description: "Your preferences have been updated successfully.",
    });
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    setPreferences(mockUserPreferences);
    setHasUnsavedChanges(false);
    toast.info("Settings reset", {
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <>
      <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Settings</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Configure AI assistant, notifications, and workspace preferences.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-6">
        {/* AI Assistant Settings */}
        <section className="rounded-2xl border border-neutral-200 bg-white px-5 py-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              AI Assistant
            </h2>
          </div>

          <div className="space-y-5">
            {/* Default Model */}
            <div className="space-y-2">
              <Label htmlFor="model" className="text-xs font-medium">
                Default Model
              </Label>
              <Select
                value={preferences.defaultModel}
                onValueChange={(value) => updatePreference("defaultModel", value)}
              >
                <SelectTrigger id="model" className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signal-mini-v1">Signal Mini (Fastest)</SelectItem>
                  <SelectItem value="signal-core-v1">Signal Core (Balanced)</SelectItem>
                  <SelectItem value="signal-pro-v1">Signal Pro (Recommended)</SelectItem>
                  <SelectItem value="signal-ultra-v1">Signal Ultra (Most Capable)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Choose the AI model for chat responses and analysis
              </p>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature" className="text-xs font-medium">
                  Creativity (Temperature)
                </Label>
                <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                  {preferences.temperature.toFixed(1)}
                </span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[preferences.temperature]}
                onValueChange={(value) => updatePreference("temperature", value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
                <span>Precise</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Context Window */}
            <div className="space-y-2">
              <Label htmlFor="context" className="text-xs font-medium">
                Context Window (tokens)
              </Label>
              <Input
                id="context"
                type="number"
                min={2000}
                max={32000}
                step={1000}
                value={preferences.contextWindow}
                onChange={(e) => updatePreference("contextWindow", parseInt(e.target.value))}
                className="h-9 text-sm"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                How much conversation history to include (higher = more memory)
              </p>
            </div>

            {/* System Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-xs font-medium">
                System Prompt
              </Label>
              <Textarea
                id="prompt"
                value={preferences.systemPrompt}
                onChange={(e) => updatePreference("systemPrompt", e.target.value)}
                rows={4}
                className="resize-none text-sm"
                placeholder="Customize how the AI assistant behaves..."
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Define the AI&apos;s personality and behavior
              </p>
            </div>

            {/* Auto-suggest */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Auto-suggest</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Show inline suggestions as you type
                </p>
              </div>
              <Switch
                checked={preferences.autoSuggest}
                onCheckedChange={(checked) => updatePreference("autoSuggest", checked)}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-neutral-200 bg-white px-5 py-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Enable Notifications</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Receive desktop notifications
                </p>
              </div>
              <Switch
                checked={preferences.notifications}
                onCheckedChange={(checked) => updatePreference("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Trading Alerts</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Position updates and fills
                </p>
              </div>
              <Switch
                checked={preferences.tradingAlerts}
                onCheckedChange={(checked) => updatePreference("tradingAlerts", checked)}
                disabled={!preferences.notifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Price Alerts</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Target prices and stop losses
                </p>
              </div>
              <Switch
                checked={preferences.priceAlerts}
                onCheckedChange={(checked) => updatePreference("priceAlerts", checked)}
                disabled={!preferences.notifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">News Alerts</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Market events and catalysts
                </p>
              </div>
              <Switch
                checked={preferences.newsAlerts}
                onCheckedChange={(checked) => updatePreference("newsAlerts", checked)}
                disabled={!preferences.notifications}
              />
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="rounded-2xl border border-neutral-200 bg-white px-5 py-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Workflow
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Auto-save</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Automatically save notes and changes
                </p>
              </div>
              <Switch
                checked={preferences.autoSave}
                onCheckedChange={(checked) => updatePreference("autoSave", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Auto-link Trades</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Automatically link trades to journal entries
                </p>
              </div>
              <Switch
                checked={preferences.autoLinkTrades}
                onCheckedChange={(checked) => updatePreference("autoLinkTrades", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Keyboard Shortcuts</Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Enable keyboard shortcuts for faster navigation
                </p>
              </div>
              <Switch
                checked={preferences.enableKeyboardShortcuts}
                onCheckedChange={(checked) => updatePreference("enableKeyboardShortcuts", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-xs font-medium">
                Display Currency
              </Label>
              <Select
                value={preferences.displayCurrency}
                onValueChange={(value: "USD" | "EUR" | "GBP") =>
                  updatePreference("displayCurrency", value)
                }
              >
                <SelectTrigger id="currency" className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Risk Management */}
        <section className="rounded-2xl border border-neutral-200 bg-white px-5 py-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Risk Management
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxPosition" className="text-xs font-medium">
                Max Position Size ($)
              </Label>
              <Input
                id="maxPosition"
                type="number"
                min={0}
                step={1000}
                value={preferences.maxPositionSize}
                onChange={(e) =>
                  updatePreference("maxPositionSize", parseInt(e.target.value))
                }
                className="h-9 text-sm"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Maximum dollar amount per position
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss" className="text-xs font-medium">
                Default Stop Loss (%)
              </Label>
              <Input
                id="stopLoss"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={preferences.defaultStopLoss}
                onChange={(e) =>
                  updatePreference("defaultStopLoss", parseFloat(e.target.value))
                }
                className="h-9 text-sm"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Default stop loss percentage from entry
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskPerTrade" className="text-xs font-medium">
                Risk Per Trade (%)
              </Label>
              <Input
                id="riskPerTrade"
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={preferences.riskPerTrade}
                onChange={(e) =>
                  updatePreference("riskPerTrade", parseFloat(e.target.value))
                }
                className="h-9 text-sm"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Percentage of portfolio to risk per trade
              </p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {hasUnsavedChanges
              ? "You have unsaved changes"
              : "All settings are saved"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
