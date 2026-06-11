import type { ContentKey } from "../content-keys";
import type { SiteLocale } from "./config";

const ARCHIVE_NAV_LABELS: Record<SiteLocale, { index: string }> = {
  en: {
    index: "Index",
  },
  "pt-br": {
    index: "Indice",
  },
};

export function getArchiveNavLabels(locale: SiteLocale) {
  return ARCHIVE_NAV_LABELS[locale];
}

const SECTION_LABELS: Record<SiteLocale, Record<ContentKey, string>> = {
  en: {
    characters: "Characters",
    organizations: "Organizations",
    sine: "SiNE",
    places: "Places",
    apparatus: "Apparatus",
    systems: "Systems",
    cosmology: "Cosmology",
  },
  "pt-br": {
    characters: "Personagens",
    organizations: "Organizações",
    sine: "SiNE",
    places: "Locais",
    apparatus: "Aparatos",
    systems: "Sistemas",
    cosmology: "Cosmologia",
  },
};

export function sectionLabel(locale: SiteLocale, key: ContentKey): string {
  return SECTION_LABELS[locale][key];
}

type EntryLayoutLabels = {
  breadcrumb: string;
  fileData: string;
  filed: string;
  onThisPage: string;
  portraitPending: string;
  relatedEntries: string;
  sharedTag: string;
  sharedTags: string;
  apparatusFields: {
    sealingStatus: string;
    origin: string;
    custody: string;
    knownPrinciple: string;
    userStatus: string;
  };
};

const ENTRY_LAYOUT_LABELS: Record<SiteLocale, EntryLayoutLabels> = {
  en: {
    breadcrumb: "Breadcrumb",
    fileData: "File Data",
    filed: "Filed",
    onThisPage: "On this page",
    portraitPending: "Portrait Pending",
    relatedEntries: "Related entries",
    sharedTag: "shared tag",
    sharedTags: "shared tags",
    apparatusFields: {
      sealingStatus: "Sealing Status",
      origin: "Origin",
      custody: "Custody",
      knownPrinciple: "Known Principle",
      userStatus: "User Status",
    },
  },
  "pt-br": {
    breadcrumb: "Navegação estrutural",
    fileData: "Dados do registro",
    filed: "Arquivado",
    onThisPage: "Nesta página",
    portraitPending: "Retrato pendente",
    relatedEntries: "Entradas relacionadas",
    sharedTag: "tag em comum",
    sharedTags: "tags em comum",
    apparatusFields: {
      sealingStatus: "Estado de selagem",
      origin: "Origem",
      custody: "Custódia",
      knownPrinciple: "Princípio conhecido",
      userStatus: "Estado do usuário",
    },
  },
};

export function getEntryLayoutLabels(locale: SiteLocale): EntryLayoutLabels {
  return ENTRY_LAYOUT_LABELS[locale];
}

type SectionListLabels = {
  section: string;
  entry: string;
  entries: string;
  matching: string;
  noEntriesMatch: string;
};

const SECTION_LIST_LABELS: Record<SiteLocale, SectionListLabels> = {
  en: {
    section: "Section",
    entry: "entry",
    entries: "entries",
    matching: "matching",
    noEntriesMatch: "No entries match this query.",
  },
  "pt-br": {
    section: "Seção",
    entry: "entrada",
    entries: "entradas",
    matching: "correspondem a",
    noEntriesMatch: "Nenhuma entrada corresponde a esta busca.",
  },
};

export function getSectionListLabels(locale: SiteLocale): SectionListLabels {
  return SECTION_LIST_LABELS[locale];
}

type ApparatusPageLabels = {
  pageTitle: string;
  fallbackKind: string;
  all: string;
  statusUnknown: string;
  sealIntact: string;
  sealCompromised: string;
  functional: string;
  sectionEyebrow: string;
  title: string;
  description: string;
  accessLevel: string;
  accessPublic: string;
  filterByType: string;
  searchRegistry: string;
  searchRegistryPlaceholder: string;
  filingYear: string;
  noEntriesMatch: string;
  entry: string;
  entries: string;
};

const APPARATUS_PAGE_LABELS: Record<SiteLocale, ApparatusPageLabels> = {
  en: {
    pageTitle: "Apparatus - SiNE Archives",
    fallbackKind: "Apparatus",
    all: "All",
    statusUnknown: "Status Unknown",
    sealIntact: "Seal Intact",
    sealCompromised: "Seal Compromised",
    functional: "Functional",
    sectionEyebrow: "Section 05 - Apparatus Registry",
    title: "Apparatus",
    description: "Classified instruments, constructions, and mechanisms of documented significance.",
    accessLevel: "Access Level",
    accessPublic: "Public",
    filterByType: "Filter by type",
    searchRegistry: "Search registry",
    searchRegistryPlaceholder: "Search registry...",
    filingYear: "Filing Year",
    noEntriesMatch: "No entries match this query.",
    entry: "entry",
    entries: "entries",
  },
  "pt-br": {
    pageTitle: "Aparatos - SiNE Archives",
    fallbackKind: "Aparato",
    all: "Todos",
    statusUnknown: "Estado desconhecido",
    sealIntact: "Selagem intacta",
    sealCompromised: "Selagem comprometida",
    functional: "Funcional",
    sectionEyebrow: "Seção 05 - Registro de Aparatos",
    title: "Aparatos",
    description: "Instrumentos, construções e mecanismos classificados de relevância documentada.",
    accessLevel: "Nível de acesso",
    accessPublic: "Público",
    filterByType: "Filtrar por tipo",
    searchRegistry: "Buscar no registro",
    searchRegistryPlaceholder: "Buscar no registro...",
    filingYear: "Ano de arquivamento",
    noEntriesMatch: "Nenhuma entrada corresponde a esta busca.",
    entry: "entrada",
    entries: "entradas",
  },
};

export function getApparatusPageLabels(locale: SiteLocale): ApparatusPageLabels {
  return APPARATUS_PAGE_LABELS[locale];
}
