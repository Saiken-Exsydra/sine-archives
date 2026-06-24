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
  hidden?: boolean;
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
  hidden: boolean;
};

export const DEFAULT_MUSIC_TRACK_ID = "glass-server-archive";
export const SHOW_HIDDEN_MUSIC_TRACKS = false;

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
  "/music/tracks/LEn'Ore%20iS%20HerE_%5E!.mp3": {
    id: "lenore-is-here",
    kind: "song",
    title: {
      en: "LEn'Ore iS HerE_^!",
      "pt-br": "LEn'Ore iS HerE_^!",
    },
    subtitle: {
      en: "Lenore signal file",
      "pt-br": "Arquivo de sinal de Lenore",
    },
    summary: {
      en: "A volatile Lenore recording indexed from the recovered upload set, paired with its dedicated eclipse cover.",
      "pt-br": "Uma gravacao volatil de Lenore indexada do conjunto recuperado, pareada com sua capa de eclipse dedicada.",
    },
    mood: {
      en: "Signal intrusion",
      "pt-br": "Intrusao de sinal",
    },
    year: "1127",
  },
  "/music/tracks/Le'nore.mp3": {
    id: "lenore",
    kind: "song",
    subtitle: {
      en: "Lenore track file",
      "pt-br": "Faixa de Lenore",
    },
    summary: {
      en: "A compact Lenore theme from the recovered upload set, cataloged with its matching archive cover.",
      "pt-br": "Um tema compacto de Lenore vindo do conjunto recuperado, catalogado com sua capa correspondente.",
    },
    mood: {
      en: "Veiled presence",
      "pt-br": "Presenca velada",
    },
    year: "1127",
  },
  "/music/tracks/Left%20Unsaid%20(Lenore's%20Memoir).mp3": {
    id: "left-unsaid-lenores-memoir",
    kind: "song",
    hidden: true,
    subtitle: {
      en: "Lenore memoir fragment",
      "pt-br": "Fragmento de memoria de Lenore",
    },
    summary: {
      en: "A quieter Lenore memoir piece, cataloged from the upload set with its pale eclipse artwork.",
      "pt-br": "Uma peca mais quieta de memoria de Lenore, catalogada do conjunto enviado com sua arte de eclipse palida.",
    },
    mood: {
      en: "Unsent confession",
      "pt-br": "Confissao nao enviada",
    },
    year: "1127",
  },
  "/music/tracks/Moonsick.mp3": {
    id: "moonsick",
    kind: "song",
    subtitle: {
      en: "Quiet Moon motif",
      "pt-br": "Motivo da Quiet Moon",
    },
    summary: {
      en: "A song for the Quiet Moon layer: red rivers, distant attention, and the invitation behind Le'nore's final question.",
      "pt-br": "Uma cancao para a camada da Quiet Moon: rios vermelhos, atencao distante e o convite por tras da pergunta final de Le'nore.",
    },
    mood: {
      en: "Cursed revelation",
      "pt-br": "Revelacao maldita",
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
  "/music/tracks/Sol'ytra.mp3": {
    id: "solytra",
    kind: "song",
    hidden: true,
    subtitle: {
      en: "Sol'ytra track file",
      "pt-br": "Faixa de Sol'ytra",
    },
    summary: {
      en: "A Sol'ytra recording indexed from the recovered upload set and paired with its crystalline cover artwork.",
      "pt-br": "Uma gravacao de Sol'ytra indexada do conjunto recuperado e pareada com sua arte cristalina.",
    },
    mood: {
      en: "Frozen ascent",
      "pt-br": "Ascensao congelada",
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
  "/music/tracks/Wounded%20Crown%20Authority.mp3": {
    id: "wounded-crown-authority",
    kind: "song",
    subtitle: {
      en: "Authority track file",
      "pt-br": "Faixa de autoridade",
    },
    summary: {
      en: "A recovered recording cataloged with the Wounded Crown cover, carrying the pressure of ritual authority and fracture.",
      "pt-br": "Uma gravacao recuperada catalogada com a capa Wounded Crown, carregando a pressao de autoridade ritual e fratura.",
    },
    mood: {
      en: "Crowned fracture",
      "pt-br": "Fratura coroada",
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
    hidden: editorial?.hidden ?? false,
  };
});

export function getLocalizedMusicCatalog(
  locale: SiteLocale,
  options: { includeHidden?: boolean } = {},
): LocalizedMusicTrack[] {
  const includeHidden = options.includeHidden ?? SHOW_HIDDEN_MUSIC_TRACKS;

  return TRACKS.filter((track) => includeHidden || !track.hidden).map((track) => ({
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
    hidden: track.hidden,
  }));
}
