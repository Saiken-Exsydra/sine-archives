import songMetadata from "./songs.json";
import type { SiteLocale } from "../i18n/config";

export type MusicTrackKind = "song" | "soundtrack";

type LocalizedString = Record<SiteLocale, string>;

type SongMetadataEntry = {
  title: string;
  artist: string | null;
  album: string | null;
  year: number | null;
  track: number | null;
  duration: number | null;
  src: string;
  cover: string | null;
};

type MusicTrackEditorial = {
  id: string;
  kind: MusicTrackKind;
  title?: LocalizedString;
  subtitle?: LocalizedString;
  summary?: LocalizedString;
  mood?: LocalizedString;
  year?: string;
};

export type LocalizedMusicTrack = {
  id: string;
  kind: MusicTrackKind;
  kindLabel: string;
  title: string;
  album: string;
  subtitle: string;
  summary: string;
  mood: string;
  image: string;
  duration: string;
  year: string;
  audioSrc: string | null;
};

export const DEFAULT_MUSIC_TRACK_ID = "glass-server-archive";

const KIND_LABELS: Record<SiteLocale, Record<MusicTrackKind, string>> = {
  en: {
    song: "Song",
    soundtrack: "Soundtrack",
  },
  "pt-br": {
    song: "Cancao",
    soundtrack: "Trilha",
  },
};

const EDITORIAL_BY_SRC: Record<string, MusicTrackEditorial> = {
  "/music/tracks/Glass%20Server%20Archive.mp3": {
    id: "glass-server-archive",
    kind: "song",
    subtitle: {
      en: "Standalone single",
      "pt-br": "Single independente",
    },
    summary: {
      en: "Cataloged as its own single release, with colder archive-facing atmosphere and isolated placement in the registry.",
      "pt-br": "Catalogada como single proprio, com atmosfera mais fria voltada ao arquivo e colocacao isolada no registro.",
    },
    mood: {
      en: "Archive ambient",
      "pt-br": "Ambientacao de arquivo",
    },
    year: "1127",
  },
  "/music/tracks/Moonsick.mp3": {
    id: "moonsick",
    kind: "song",
    subtitle: {
      en: "Standalone single",
      "pt-br": "Single independente",
    },
    summary: {
      en: "A song for the Quiet Moon: a distant scar, red rivers in the dark, and the slow warmth of something impossibly far away still looking back.",
      "pt-br": "Uma cancao para a Quiet Moon: uma cicatriz distante, rios vermelhos no escuro e o calor lento de algo impossivelmente remoto que ainda olha de volta.",
    },
    mood: {
      en: "Moonlit pull",
      "pt-br": "Atracao lunar",
    },
    year: "1127",
  },
  "/music/tracks/Sistera%20N%C2%B0%201.mp3": {
    id: "sistera-no-1",
    kind: "song",
    title: {
      en: "Sistera No 1",
      "pt-br": "Sistera No 1",
    },
    subtitle: {
      en: "Private track file",
      "pt-br": "Faixa privada em arquivo",
    },
    summary: {
      en: "A Wonderwall piece of light, inheritance, and old grief made tender: the sound of a family trying to turn miracle into something human enough to love.",
      "pt-br": "Uma peca Wonderwall de luz, heranca e luto antigo tornado terno: o som de uma familia tentando transformar milagre em algo humano o bastante para amar.",
    },
    mood: {
      en: "Recorded piece",
      "pt-br": "Peca gravada",
    },
    year: "1127",
  },
  "/music/tracks/Tacet%20Lapis.mp3": {
    id: "tacet-lapis",
    kind: "song",
    subtitle: {
      en: "Stone in silence",
      "pt-br": "Pedra em silencio",
    },
    summary: {
      en: "Recovered from an old jukebox, carrying the hush of dust, dim glass, and a room that forgot its own name before the music did.",
      "pt-br": "Recuperada de uma jukebox antiga, carregando o silencio de poeira, vidro fosco e um comodo que esqueceu o proprio nome antes que a musica esquecesse.",
    },
    mood: {
      en: "Low-lit lament",
      "pt-br": "Lamento em baixa luz",
    },
    year: "1127",
  },
};

const FALLBACK_COPY = {
  subtitle: {
    en: "Archive track file",
    "pt-br": "Faixa do arquivo",
  },
  summary: {
    en: "Indexed from music registry for direct playback through archive systems.",
    "pt-br": "Indexada do registro musical para reproducao direta pelos sistemas do arquivo.",
  },
  mood: {
    en: "Registered piece",
    "pt-br": "Peca registrada",
  },
} as const;

function formatDurationLabel(duration?: number | null) {
  if (!duration || !Number.isFinite(duration)) return "00:00";
  const totalSeconds = Math.max(0, Math.floor(duration));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${String(minutes).padStart(2, "0")}:${seconds}`;
}

const TRACKS = (songMetadata as SongMetadataEntry[]).map((song) => {
  const editorial = EDITORIAL_BY_SRC[song.src];

  return {
    id: editorial?.id ?? song.src,
    kind: editorial?.kind ?? "song",
    title: editorial?.title ?? {
      en: song.title,
      "pt-br": song.title,
    },
    subtitle: editorial?.subtitle ?? {
      en: song.artist || FALLBACK_COPY.subtitle.en,
      "pt-br": song.artist || FALLBACK_COPY.subtitle["pt-br"],
    },
    summary: editorial?.summary ?? FALLBACK_COPY.summary,
    mood: editorial?.mood ?? FALLBACK_COPY.mood,
    album: song.album || song.title,
    image: song.cover || "/uploads/ui-banner.png",
    duration: formatDurationLabel(song.duration),
    year: editorial?.year ?? (song.year ? String(song.year) : "1127"),
    audioSrc: song.src,
  };
});

export function getLocalizedMusicCatalog(locale: SiteLocale): LocalizedMusicTrack[] {
  return TRACKS.map((track) => ({
    id: track.id,
    kind: track.kind,
    kindLabel: KIND_LABELS[locale][track.kind],
    title: track.title[locale],
    album: track.album,
    subtitle: track.subtitle[locale],
    summary: track.summary[locale],
    mood: track.mood[locale],
    image: track.image,
    duration: track.duration,
    year: track.year,
    audioSrc: track.audioSrc,
  }));
}
