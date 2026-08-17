import { useEffect, useState } from "react";
import type { AppLanguage } from "../domain/settings";
import { ptBR, type Translations } from "./locales/pt-BR";
import { enUS } from "./locales/en-US";
import { loadSettings } from "../services/settingsStorage";

export { ptBR, enUS, type Translations };

/**
 * Detecta o idioma padrão do Windows / Navegador:
 * Se começar com "pt" (pt-BR, pt-PT, etc.) -> "pt-BR".
 * Se for qualquer outro idioma -> "en-US".
 */
export function detectSystemLanguage(): AppLanguage {
  try {
    const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || "").toLowerCase();
    if (navLang.startsWith("pt")) {
      return "pt-BR";
    }
  } catch {}
  return "en-US";
}

export function getTranslation(lang?: AppLanguage): Translations {
  const target = lang || loadSettings().language || detectSystemLanguage();
  return target === "pt-BR" ? ptBR : enUS;
}

export function useTranslation() {
  const [lang, setLang] = useState<AppLanguage>(() => {
    try {
      return loadSettings().language || detectSystemLanguage();
    } catch {
      return detectSystemLanguage();
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const current = loadSettings().language;
        if (current && current !== lang) {
          setLang(current);
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("sf-settings-changed" as any, handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("sf-settings-changed" as any, handleStorage);
    };
  }, [lang]);

  const t = getTranslation(lang);
  return { t, language: lang, setLanguage: setLang };
}
