// lib/i18n.js
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export const locales = ["", "en", "en-US", "zh", "zh-CN", "zh-TW", 'zh-HK', 'ja', "ar", "es", "ru"];
export const localeNames: Record<string, string> = {
    en: "🇺🇸 English",
    zh: "🇨🇳 中文",
    ja: "🇯🇵 日本語",
    ar: "🇸🇦 العربية",
    ru: "🇷🇺 Русский",
};
export const defaultLocale = "en";

export function getLocale(headers: any): string {
    let languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
}

const dictionaries: Record<string, () => Promise<any>> = {
    en: () => import("@/locales/en.json").then((module) => module.default),
    zh: () => import("@/locales/zh.json").then((module) => module.default),
    ja: () => import("@/locales/ja.json").then((module) => module.default),
    ar: () => import("@/locales/ar.json").then((module) => module.default),
    es: () => import("@/locales/es.json").then((module) => module.default),
    ru: () => import("@/locales/ru.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    if (["zh-CN", "zh-TW", "zh-HK"].includes(locale)) {
        locale = "zh";
    }

    if (!Object.keys(dictionaries).includes(locale)) {
        locale = "en";
    }

    try {
        return await dictionaries[locale]();
    } catch (error) {
        console.error(`Failed to load dictionary for locale ${locale}:`, error);
        return await dictionaries["en"]();
    }
};

export const options = [
    { value: 'NULL', label: 'pick podcast language' },
    { value: 'en-US', label: 'english' },
    { value: 'zh-CN', label: 'chinese' },
    { value: 'es-ES', label: 'spanish' },
    { value: 'fr-FR', label: 'french' },
    { value: 'de-DE', label: 'german' },
    { value: 'ru-RU', label: 'russian' },
    { value: 'ja-JP', label: 'japanese' },
    { value: 'pt-BR', label: 'portuguese' },
    { value: 'it-IT', label: 'italian' }
];