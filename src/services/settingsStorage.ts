import { defaultSettings, type AppSettings } from "../domain/settings";
import { emit } from "@tauri-apps/api/event";

const SETTINGS_KEY = "sf-downloader.settings.v1";

import { invoke } from "@tauri-apps/api/core";

export function syncExtensionTheme(settings: AppSettings): void {
  try {
    const accentMap: Record<string, string> = {
      cyan: "#06b6d4",
      emerald: "#10b981",
      amber: "#f59e0b",
      red: "#ef4444",
      blue: "#3b82f6",
      violet: "#8b5cf6",
      pink: "#ec4899",
      coral: "#f97316",
      ember: "#00b884",
      green: "#10b981",
      gradient_sunset: "#ff4500",
      gradient_cyberpunk: "#ec4899",
      gradient_ocean: "#06b6d4",
      gradient_aurora: "#10b981",
      gradient_flow: "#7928ca",
    };

    let accent = accentMap[settings.accentColor] || "#00b884";
    let bg = "linear-gradient(135deg, #12151b, #0b0d10)";

    if (settings.interfaceGradient?.enabled && settings.interfaceGradient.stops?.length) {
      const firstStop = settings.interfaceGradient.stops[0]?.color.toLowerCase() || "";
      if (firstStop === "#0b1638") {
        accent = "#3b82f6";
        bg = "linear-gradient(135deg, #0b1638, #040714)";
      } else if (firstStop === "#320938") {
        accent = "#8b5cf6";
        bg = "linear-gradient(135deg, #320938, #050a1e)";
      } else if (firstStop === "#0a0c10") {
        accent = "#eab308";
        bg = "linear-gradient(135deg, #0a0c10, #040507)";
      } else if (firstStop === "#41010d") {
        accent = "#ef4444";
        bg = "linear-gradient(135deg, #41010d, #080204)";
      } else if (firstStop === "#0a2818") {
        accent = "#10b981";
        bg = "linear-gradient(135deg, #0a2818, #040d08)";
      } else {
        const stops = settings.interfaceGradient.stops;
        if (stops.length >= 2) {
          bg = `linear-gradient(135deg, ${stops[0].color}, ${stops[1].color})`;
        }
      }
    }

    void invoke("update_extension_theme", { accent, bg, language: settings.language }).catch(() => {});
  } catch {}
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || "").toLowerCase();
    const defaultLang = navLang.startsWith("pt") ? "pt-BR" : "en-US";
    const baseDefaults: AppSettings = { ...defaultSettings, language: defaultLang };

    const settings = !raw ? baseDefaults : { ...baseDefaults, ...JSON.parse(raw) };
    syncExtensionTheme(settings);
    return settings;
  } catch {
    syncExtensionTheme(defaultSettings);
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  const json = JSON.stringify(settings);
  localStorage.setItem(SETTINGS_KEY, json);
  try {
    window.dispatchEvent(
      new StorageEvent("storage", { key: SETTINGS_KEY, newValue: json }),
    );
  } catch {}
  syncExtensionTheme(settings);
  void emit("settings-changed", settings).catch(() => {});
}
