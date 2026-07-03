"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { Avatar } from "@/components/ui/Avatar";
import { TonePill } from "@/components/ui/TonePill";

type Tone = "neutral" | "friendly" | "formal";

export function ChatPanel() {
  const t = useT();
  const [tone, setTone] = useState<Tone>("neutral");

  const tones: { key: Tone; label: string }[] = [
    { key: "neutral", label: t.chat.tones.neutral },
    { key: "friendly", label: t.chat.tones.friendly },
    { key: "formal", label: t.chat.tones.formal },
  ];

  const chips = [t.chat.chips.hints, t.chat.chips.refocus, t.chat.chips.constraint, t.chat.chips.status];

  return (
    <section className="flex w-[388px] flex-none flex-col border-l border-line bg-panel">
      <div className="flex items-center gap-[11px] border-b border-line px-[18px] py-4">
        <Avatar variant="a" size="lg" initial={t.brand.mark} status="on" />
        <div>
          <div className="font-display text-base tracking-wide">{t.chat.title}</div>
          <div className="text-xs text-ink-muted">{t.chat.subtitle}</div>
        </div>
      </div>

      <div className="scroll-thin flex flex-1 flex-col gap-[14px] overflow-y-auto p-[18px]">
        <div className="flex max-w-[86%] flex-col items-end gap-1 self-end">
          <div className="rounded-2xl rounded-br-[4px] bg-brand px-[13px] py-[10px] text-[13.5px] leading-normal text-white">
            {t.chat.userMessage}
          </div>
          <div className="px-1 text-[11px] text-ink-muted">{t.chat.userWho}</div>
        </div>

        <div className="flex max-w-[86%] flex-col gap-1">
          <div className="px-1 text-[11px] text-ink-muted">{t.chat.aliceWho}</div>
          <div className="rounded-2xl rounded-bl-[4px] bg-surface px-[13px] py-[10px] text-[13.5px] leading-normal">
            {t.chat.aliceMessage}
          </div>
        </div>

        <div className="flex max-w-[86%] flex-col gap-1">
          <div className="px-1 text-[11px] text-ink-muted">{t.chat.bobWho}</div>
          <div className="rounded-2xl rounded-bl-[4px] bg-surface px-[13px] py-[10px] text-[13.5px] leading-normal">
            <span className="mr-1 inline-flex items-center gap-1 align-middle">
              <i className="animate-typing-blink h-[6px] w-[6px] rounded-full bg-ink-muted opacity-50" />
              <i
                className="animate-typing-blink h-[6px] w-[6px] rounded-full bg-ink-muted opacity-50"
                style={{ animationDelay: "0.2s" }}
              />
              <i
                className="animate-typing-blink h-[6px] w-[6px] rounded-full bg-ink-muted opacity-50"
                style={{ animationDelay: "0.4s" }}
              />
            </span>
            {t.chat.bobTyping}
          </div>
        </div>
      </div>

      <div className="flex gap-[7px] px-[14px] pt-[10px]">
        {tones.map((item) => (
          <TonePill
            key={item.key}
            label={item.label}
            active={tone === item.key}
            onClick={() => setTone(item.key)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-[7px] px-[14px] py-[10px]">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            className="rounded-lg bg-surface px-[10px] py-[5px] text-xs text-ink-muted hover:bg-brand-tint hover:text-brand-dark"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[10px] border-t border-line px-[14px] py-3">
        <textarea
          rows={2}
          placeholder={t.chat.composerPlaceholder}
          className="scroll-thin min-h-[44px] resize-none rounded-xl border border-line px-3 py-[11px] text-[13.5px] text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
        />
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            className="flex items-center gap-[6px] text-xs text-ink-muted hover:text-ink"
          >
            {t.chat.modelLabel} <b className="text-amber">{t.chat.modelTier}</b> ▾
          </button>
          <button
            type="button"
            className="ml-auto rounded-[10px] bg-brand px-[18px] py-[9px] font-display text-xs uppercase tracking-wide text-white shadow-[0_2px_0_#3f4bc5] hover:bg-brand-dark"
          >
            {t.chat.send}
          </button>
        </div>
      </div>
    </section>
  );
}
