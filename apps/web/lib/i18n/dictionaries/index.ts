import { ru, type Dictionary } from "./ru";
import { en } from "./en";

export type Lang = "ru" | "en";

export const dictionaries: Record<Lang, Dictionary> = { ru, en };

export type { Dictionary };
