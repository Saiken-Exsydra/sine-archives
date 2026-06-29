import { existsSync } from "node:fs";
import { join } from "node:path";
import type { SiteLocale } from "../i18n/config";

export const redactoryAssets = {
  quillGateway: "/uploads/quill-gateway.png",
  papersCutout: "/uploads/papers-cutout.png",
  uploadedDesk: "/uploads/desk-top.png",
  uploadedInkpot: "/uploads/inkpot-cutout.png",
  shallowAnchorSeal: "/uploads/Shallow_Anchor.png",
  deepAnchorSeal: "/uploads/Deep_Anchor.png",
  abyssalAnchorSeal: "/uploads/Abyssal_Anchor.png",
  shallowAnchorSymbol: "/uploads/Shallow_Anchor_symbol.png",
  deepAnchorSymbol: "/uploads/Deep_Anchor_symbol.png",
  abyssalAnchorSymbol: "/uploads/Abyssal_Anchor_symbol.png",
  quill: "/images/redactory/quill.webp",
  quillCutout: "/images/redactory/quill-cutout.png",
  desk: "/images/redactory/desk-top.webp",
  inkpot: "/images/redactory/inkpot-cutout.png",
  diveSurface: "/images/redactory/dive-surface.webp",
  diveShallow: "/images/redactory/dive-shallow.webp",
  diveDeepening: "/images/redactory/dive-deepening.webp",
  diveStrata: "/images/redactory/dive-strata.webp",
  abyssalAnchor: "/images/redactory/abyssal-anchor.webp",
  inkNoise: "/images/redactory/ink-noise.png",
  anchorGlyphs: "/images/redactory/anchor-glyphs.svg",
} as const;

export function hasRedactoryAsset(assetPath: string) {
  return existsSync(join(process.cwd(), "public", assetPath.replace(/^\/+/, "")));
}

export type DeskHotspotData = {
  id: string;
  label: string;
  title: string;
  description: string;
  position: { x: string; y: string };
  variant: "quill" | "paper" | "instrument" | "ink-line";
};

export type DepthSectionData = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  location: string;
  capability: string;
  depthLabel: string;
  examples?: string[];
  progression?: string[];
  plateLabel: string;
  visualVariant: "surface" | "shallow" | "practical" | "deepening" | "near-strata" | "strata" | "abyssal" | "boundary";
  asset?: string;
};

type RedactoryContent = {
  pageTitle: string;
  divePageTitle: string;
  gateway: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
  };
  desk: {
    eyebrow: string;
    title: string;
    intro: string;
    instruction: string;
    mobileInstruction: string;
    inkpotTitle: string;
    inkpotDescription: string;
    inkpotAction: string;
  };
  hotspots: DeskHotspotData[];
  depthLabels: string[];
  dive: {
    eyebrow: string;
    title: string;
    intro: string;
    scrollLabel: string;
    shoresStatus: string;
  };
  sections: DepthSectionData[];
};

const english: RedactoryContent = {
  pageTitle: "Redactory Desk - SiNE Archives",
  divePageTitle: "The Redactory Dive - SiNE Archives",
  gateway: {
    eyebrow: "Interactive archive",
    title: "Enter the Redactory Desk",
    description: "Examine the quill, paper, instruments, and ink through a scholar's working table.",
    action: "Approach the desk",
  },
  desk: {
    eyebrow: "Redactory Primer",
    title: "The Scholar's Desk",
    intro: "Redactory routes local expression through recursive compression and indexed alignment. It selects Archive-valid configurations and locally stabilizes them.",
    instruction: "Select an object",
    mobileInstruction: "Desk objects",
    inkpotTitle: "Enter the Dive",
    inkpotDescription: "Follow the ink downward.",
    inkpotAction: "Descend",
  },
  hotspots: [
    {
      id: "redactor",
      label: "Examine the quill",
      title: "The Redactor",
      description: "A Redactor is a rare person whose mind can make reality choose one possible version of itself for a moment.",
      position: { x: "69%", y: "84%" },
      variant: "quill",
    },
    {
      id: "routing",
      label: "Open the papers",
      title: "The Index Theorem",
      description: "The theory behind Redactory.",
      position: { x: "17%", y: "47%" },
      variant: "paper",
    },
  ],
  depthLabels: ["Surface", "Shallow", "Practical", "Deepening", "Near-Strata", "Strata", "Abyssal", "Boundary"],
  dive: {
    eyebrow: "Compression Interface",
    title: "The Dive",
    intro: "Descend through the ink. Depth broadens conceptual access, but never creates information from nothing.",
    scrollLabel: "Begin descent",
    shoresStatus: "Shores entry forthcoming",
  },
  sections: [
    {
      id: "surface",
      eyebrow: "Surface",
      title: "The Dive Begins",
      location: "At the mouth of the Dive, before the Anchor has narrowed into a usable route.",
      body: "The Dive is the inward passage a Redactor uses to approach an Anchor. It does not leave reality behind; it brings one valid possibility into focus.",
      capability: "Settle the mind, find the intended Anchor, and begin selecting an expression the Archive already permits.",
      depthLabel: "Surface",
      plateLabel: "Future plate: The Dive threshold",
      visualVariant: "surface",
      asset: redactoryAssets.diveSurface,
    },
    {
      id: "shallow",
      eyebrow: "Shallow Anchor",
      title: "A Usable Route",
      location: "Close to the surface, where the Anchor is specific, stable, and easy to recognize.",
      body: "An Anchor is a reliable route into a concept, not the power itself. A shallow route stays narrow enough for practical use.",
      capability: "Find a familiar effect quickly and hold it with less pressure than deeper work requires.",
      depthLabel: "Shallow",
      examples: ["Ignition", "Refraction", "Signal", "Cellular Repair"],
      plateLabel: "Future plate: Anchor route",
      visualVariant: "shallow",
      asset: redactoryAssets.diveShallow,
    },
    {
      id: "practical",
      eyebrow: "Practical Use",
      title: "What a Shallow Anchor Can Do",
      location: "Still within the shallow range, where a route can answer a clear local need.",
      body: "Redactory routes local expression. The Redactor chooses among Archive-valid outcomes, then stabilizes the chosen one for a time.",
      capability: "Light a prepared fuel, bend light through a surface, carry a signal, or guide existing tissue toward repair. Nothing is created from nothing.",
      depthLabel: "Practical",
      examples: ["Prepared fuel → ignition", "Glass → refraction", "Open channel → signal", "Living tissue → repair"],
      plateLabel: "Future plate: Local stabilization",
      visualVariant: "practical",
    },
    {
      id: "deepening",
      eyebrow: "Descent",
      title: "The Same Route, Lower",
      location: "Below ordinary use, following the same Anchor toward the rules beneath its familiar effect.",
      body: "Going deeper does not always mean changing Anchors. It can mean understanding the same route at a broader, less forgiving level.",
      capability: "Apply the Anchor across more targets, harsher conditions, or less obvious forms, if the Redactor can keep the route stable.",
      depthLabel: "Deepening",
      progression: ["Ignition", "Distributed ignition", "Ignition under hostile conditions", "Near-Fire expression"],
      plateLabel: "Future plate: Anchor depth progression",
      visualVariant: "deepening",
      asset: redactoryAssets.diveDeepening,
    },
    {
      id: "near-strata",
      eyebrow: "Near-Strata",
      title: "The Concept Stops Being Small",
      location: "Near conceptual bedrock, where a precise effect begins to open into a foundational idea.",
      body: "Ignition starts to resemble Fire. A signal starts to touch communication itself. The route grows broader, while safe boundaries grow harder to keep.",
      capability: "Access expressions that shallow practice cannot hold, but only by carrying greater strain and greater risk of losing precision.",
      depthLabel: "Near-Strata",
      plateLabel: "Future plate: Near-strata diagram",
      visualVariant: "near-strata",
    },
    {
      id: "strata",
      eyebrow: "Strata",
      title: "Bedrock Concepts",
      location: "At the bottom of the Dive, where concepts appear as foundations rather than individual effects.",
      body: "The strata are conceptual bedrock. Light, Fire, Motion, Memory, Blood, and Absence are not techniques here. They are the ground from which narrower routes rise.",
      capability: "Touch foundational grammar. That offers enormous range, but no automatic mastery and no permission to rewrite reality at its root.",
      depthLabel: "Strata",
      examples: ["Light", "Fire", "Motion", "Memory", "Blood", "Absence"],
      plateLabel: "Future plate: Conceptual strata",
      visualVariant: "strata",
      asset: redactoryAssets.diveStrata,
    },
    {
      id: "abyssal",
      eyebrow: "Abyssal Anchor",
      title: "Born at the Bottom",
      location: "At or near the strata, where an Anchor begins in conceptual bedrock instead of descending toward it.",
      body: "An Abyssal Anchor starts deep. Its possible scope is immense, but its Redactor must cross a dangerous distance before even simple expression becomes usable.",
      capability: "Approach broad foundational effects. Potential is high; control is not. Basic use can be more dangerous than advanced shallow work.",
      depthLabel: "Abyssal",
      plateLabel: "Future plate: Abyssal Anchor",
      visualVariant: "abyssal",
      asset: redactoryAssets.abyssalAnchor,
    },
    {
      id: "boundary",
      eyebrow: "Boundary",
      title: "Where Descent Ends",
      location: "At the final limit of vertical descent.",
      body: "At the strata, descent ends. Beyond it, the concept becomes coastline.",
      capability: "No deeper Dive remains. What follows belongs to another interface.",
      depthLabel: "Boundary",
      plateLabel: "Future plate: The first coastline",
      visualVariant: "boundary",
    },
  ],
};

const portuguese: RedactoryContent = {
  pageTitle: "Mesa Redactory - Arquivos SiNE",
  divePageTitle: "O Dive Redactory - Arquivos SiNE",
  gateway: {
    eyebrow: "Arquivo interativo",
    title: "Entrar na Mesa Redactory",
    description: "Examine a pena, o papel, os instrumentos e a tinta sobre a mesa de trabalho de um estudioso.",
    action: "Aproximar-se da mesa",
  },
  desk: {
    eyebrow: "Introducao a Redactory",
    title: "A Mesa do Estudioso",
    intro: "Redactory direciona a expressao local por compressao recursiva e alinhamento indexado. Ela seleciona configuracoes validas no Archive e as estabiliza localmente.",
    instruction: "Selecione um objeto",
    mobileInstruction: "Objetos da mesa",
    inkpotTitle: "Entrar no Dive",
    inkpotDescription: "Siga a tinta para baixo.",
    inkpotAction: "Descer",
  },
  hotspots: [
    {
      id: "redactor",
      label: "Examinar a pena",
      title: "O Redactor",
      description: "Um Redactor e uma singularidade recursiva humana capaz de sustentar indexacao direcionada alem dos limiares comuns.",
      position: { x: "69%", y: "84%" },
      variant: "quill",
    },
    {
      id: "routing",
      label: "Abrir os papeis",
      title: "O Teorema do Indice",
      description: "A teoria por tras da Redactory.",
      position: { x: "17%", y: "47%" },
      variant: "paper",
    },
  ],
  depthLabels: ["Superficie", "Raso", "Pratica", "Aprofundamento", "Proximo aos Strata", "Strata", "Abissal", "Limite"],
  dive: {
    eyebrow: "Interface de Compressao",
    title: "O Dive",
    intro: "Desca pela tinta. A profundidade amplia o acesso conceitual, mas nunca cria informacao do nada.",
    scrollLabel: "Iniciar descida",
    shoresStatus: "Entrada de Shores em preparacao",
  },
  sections: [
    {
      id: "surface",
      eyebrow: "Superficie",
      title: "O Dive Comeca",
      location: "Na entrada do Dive, antes que a Anchor se estreite em uma rota utilizavel.",
      body: "O Dive e a passagem interior usada pelo Redactor para se aproximar de uma Anchor. Ele nao abandona a realidade; coloca uma possibilidade valida em foco.",
      capability: "Aquietar a mente, encontrar a Anchor desejada e comecar a selecionar uma expressao ja permitida pelo Archive.",
      depthLabel: "Superficie",
      plateLabel: "Placa futura: Limiar do Dive",
      visualVariant: "surface",
      asset: redactoryAssets.diveSurface,
    },
    {
      id: "shallow",
      eyebrow: "Anchor Rasa",
      title: "Uma Rota Utilizavel",
      location: "Perto da superficie, onde a Anchor e especifica, estavel e facil de reconhecer.",
      body: "Uma Anchor e uma rota confiavel para um conceito, nao o poder em si. Uma rota rasa permanece estreita o bastante para uso pratico.",
      capability: "Encontrar rapidamente um efeito familiar e sustenta-lo com menos pressao que um trabalho profundo exige.",
      depthLabel: "Raso",
      examples: ["Ignicao", "Refracao", "Sinal", "Reparo Celular"],
      plateLabel: "Placa futura: Rota da Anchor",
      visualVariant: "shallow",
      asset: redactoryAssets.diveShallow,
    },
    {
      id: "practical",
      eyebrow: "Uso Pratico",
      title: "O Que uma Anchor Rasa Pode Fazer",
      location: "Ainda na faixa rasa, onde uma rota pode responder a uma necessidade local clara.",
      body: "Redactory direciona a expressao local. O Redactor escolhe entre resultados validos no Archive e estabiliza temporariamente aquele que escolheu.",
      capability: "Acender combustivel preparado, curvar luz numa superficie, conduzir um sinal ou guiar tecido existente ao reparo. Nada surge do nada.",
      depthLabel: "Pratica",
      examples: ["Combustivel preparado → ignicao", "Vidro → refracao", "Canal aberto → sinal", "Tecido vivo → reparo"],
      plateLabel: "Placa futura: Estabilizacao local",
      visualVariant: "practical",
    },
    {
      id: "deepening",
      eyebrow: "Descida",
      title: "A Mesma Rota, Mais Fundo",
      location: "Abaixo do uso comum, seguindo a mesma Anchor em direcao as regras sob seu efeito familiar.",
      body: "Descer mais fundo nem sempre significa trocar de Anchor. Pode significar compreender a mesma rota num nivel mais amplo e menos tolerante.",
      capability: "Aplicar a Anchor a mais alvos, condicoes hostis ou formas menos obvias, se o Redactor conseguir manter a rota estavel.",
      depthLabel: "Aprofundamento",
      progression: ["Ignicao", "Ignicao distribuida", "Ignicao sob condicoes hostis", "Expressao proxima a Fire"],
      plateLabel: "Placa futura: Progressao de profundidade",
      visualVariant: "deepening",
      asset: redactoryAssets.diveDeepening,
    },
    {
      id: "near-strata",
      eyebrow: "Proximo aos Strata",
      title: "O Conceito Deixa de Ser Pequeno",
      location: "Perto do alicerce conceitual, onde um efeito preciso comeca a se abrir numa ideia fundamental.",
      body: "Ignicao comeca a se parecer com Fire. Um sinal comeca a tocar a propria comunicacao. A rota se amplia enquanto limites seguros ficam mais dificeis de manter.",
      capability: "Acessar expressoes que a pratica rasa nao sustenta, mas apenas suportando maior pressao e maior risco de perder precisao.",
      depthLabel: "Proximo aos Strata",
      plateLabel: "Placa futura: Diagrama proximo aos strata",
      visualVariant: "near-strata",
    },
    {
      id: "strata",
      eyebrow: "Strata",
      title: "Conceitos de Alicerce",
      location: "No fundo do Dive, onde conceitos aparecem como fundacoes em vez de efeitos individuais.",
      body: "Os strata sao alicerce conceitual. Light, Fire, Motion, Memory, Blood e Absence nao sao tecnicas aqui. Sao o solo do qual rotas mais estreitas se erguem.",
      capability: "Tocar a gramatica fundamental. Isso oferece enorme alcance, mas nao dominio automatico nem permissao para reescrever a realidade pela raiz.",
      depthLabel: "Strata",
      examples: ["Light", "Fire", "Motion", "Memory", "Blood", "Absence"],
      plateLabel: "Placa futura: Strata conceituais",
      visualVariant: "strata",
      asset: redactoryAssets.diveStrata,
    },
    {
      id: "abyssal",
      eyebrow: "Anchor Abissal",
      title: "Nascida no Fundo",
      location: "Nos strata ou perto deles, onde uma Anchor nasce no alicerce em vez de descer ate ele.",
      body: "Uma Anchor Abissal comeca profunda. Seu escopo possivel e imenso, mas seu Redactor precisa cruzar uma distancia perigosa antes mesmo de tornar uma expressao simples utilizavel.",
      capability: "Aproximar-se de efeitos fundamentais amplos. O potencial e alto; o controle nao. Uso basico pode ser mais perigoso que trabalho raso avancado.",
      depthLabel: "Abissal",
      plateLabel: "Placa futura: Anchor Abissal",
      visualVariant: "abyssal",
      asset: redactoryAssets.abyssalAnchor,
    },
    {
      id: "boundary",
      eyebrow: "Limite",
      title: "Onde a Descida Termina",
      location: "No limite final da descida vertical.",
      body: "Nos strata, a descida termina. Alem deles, o conceito se torna litoral.",
      capability: "Nao existe Dive mais profundo. O que vem depois pertence a outra interface.",
      depthLabel: "Limite",
      plateLabel: "Placa futura: A primeira costa",
      visualVariant: "boundary",
    },
  ],
};

export function getRedactoryContent(locale: SiteLocale) {
  return locale === "pt-br" ? portuguese : english;
}
