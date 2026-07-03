"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LangToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex overflow-hidden rounded-full border border-line bg-panel">
      <button
        type="button"
        onClick={() => setLang("ru")}
        className={`px-3 py-[5px] text-xs font-semibold transition-colors ${
          lang === "ru" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
        }`}
      >
        {t.topbar.langRu}
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-[5px] text-xs font-semibold transition-colors ${
          lang === "en" ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
        }`}
      >
        {t.topbar.langEn}
      </button>
    </div>
  );
}
