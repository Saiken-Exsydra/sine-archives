import type { ContentKey } from "../content-keys";

export const LOCALES = ["en", "pt-br"] as const;
export type SiteLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: SiteLocale = "en";
export const BRAZILIAN_PORTUGUESE_LOCALE: SiteLocale = "pt-br";

export const LOCALE_LABELS: Record<SiteLocale, string> = {
  en: "English",
  "pt-br": "Portuguese (BR)",
};

export function isSiteLocale(value: string | undefined): value is SiteLocale {
  return !!value && LOCALES.includes(value as SiteLocale);
}

export function normalizeLocale(value: string | undefined): SiteLocale {
  return isSiteLocale(value) ? value : DEFAULT_LOCALE;
}

export function getHtmlLang(locale: SiteLocale): string {
  return locale === "pt-br" ? "pt-BR" : "en";
}

export function localePrefix(locale: SiteLocale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function localizedPath(locale: SiteLocale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return localePrefix(locale) || "/";
  return `${localePrefix(locale)}${clean}`;
}

export function stripLocalePrefix(path = "/"): string {
  if (!path) return "/";
  const stripped = path.replace(/^\/pt-br(?=\/|$)/, "");
  return stripped || "/";
}

export function localizeCurrentPath(path: string, locale: SiteLocale): string {
  return localizedPath(locale, stripLocalePrefix(path));
}

export function alternateLocale(locale: SiteLocale): SiteLocale {
  return locale === "en" ? "pt-br" : "en";
}

export function localizedEntryPath(locale: SiteLocale, section: ContentKey, slug: string): string {
  return localizedPath(locale, `/${section}/${slug}/`);
}
