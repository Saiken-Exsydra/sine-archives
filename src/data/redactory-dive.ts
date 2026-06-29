import type { SiteLocale } from "../i18n/config";
import { redactoryAssets } from "./redactory";

export type DiveExample = { term: string; explanation: string };

export type DiveAnchorSeal = {
  label: string;
  eyebrow: string;
  summary: string;
  depth: string;
  asset: string;
  symbolAsset: string;
  alt: string;
  position: string;
  structure: string;
  risk: string;
};

export type DiveSectionData = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string[];
  depthLabel: string;
  panelTitle: string;
  panelNote?: string;
  examples?: DiveExample[];
  progression?: string[];
  comparison?: DiveExample[];
  depthMeter?: DiveExample;
  plateLabel: string;
  visualVariant:
    | "surface"
    | "anchor-basics"
    | "shallow"
    | "practical"
    | "deepening"
    | "deep-anchor"
    | "near-strata"
    | "strata"
    | "abyssal"
    | "abyssal-warning"
    | "boundary";
  asset?: string;
  seal?: DiveAnchorSeal;
};

type DiveContent = {
  eyebrow: string;
  title: string;
  intro: string;
  scrollLabel: string;
  returnLabel: string;
  legendTitle: string;
  legend: DiveExample[];
  sealTitle: string;
  sealIntro: string;
  seals: DiveAnchorSeal[];
  sections: DiveSectionData[];
};

const englishSeals = [
  {
    label: "Shallow Anchor",
    eyebrow: "Registry depth reading",
    summary: "A specific derived handle near the surface. Clear enough for early training and routine work.",
    depth: "Near-surface route",
    asset: redactoryAssets.shallowAnchorSeal,
    symbolAsset: redactoryAssets.shallowAnchorSymbol,
    alt: "Apocachynthion seal for a Shallow Anchor",
    position: "Near-surface configuration",
    structure: "Specific, derived, and close to ordinary expression.",
    risk: "Easier to reach and hold; still bounded by Anchor specificity.",
  },
  {
    label: "Deep Anchor",
    eyebrow: "Registry depth reading",
    summary: "A distinct lower-rank route seated beneath surface derivatives. Wider structural access, higher strain.",
    depth: "Deep route",
    asset: redactoryAssets.deepAnchorSeal,
    symbolAsset: redactoryAssets.deepAnchorSymbol,
    alt: "Apocachynthion seal for a Deep Anchor",
    position: "Lower configuration route",
    structure: "Broader, less-derived, and native to deeper work.",
    risk: "Harder to stabilize; pressure and collapse risk increase.",
  },
  {
    label: "Abyssal Anchor",
    eyebrow: "Registry depth reading",
    summary: "A handle that begins at bedrock. The destination is set; surviving the descent is the question.",
    depth: "Stratal route",
    asset: redactoryAssets.abyssalAnchorSeal,
    symbolAsset: redactoryAssets.abyssalAnchorSymbol,
    alt: "Apocachynthion seal for an Abyssal Anchor",
    position: "Born on the strata",
    structure: "Rooted in a foundational primitive, not a derived expression.",
    risk: "No shortcut to survival; stabilization remains the problem.",
  },
] satisfies DiveAnchorSeal[];

const portugueseSeals = [
  {
    label: "Anchor Rasa",
    eyebrow: "Leitura de profundidade",
    summary: "Um apoio derivado e especifico perto da superficie. Claro o bastante para treino inicial e trabalho comum.",
    depth: "Rota de superficie",
    asset: redactoryAssets.shallowAnchorSeal,
    symbolAsset: redactoryAssets.shallowAnchorSymbol,
    alt: "Selo da Apocachynthion para Anchor Rasa",
    position: "Configuracao perto da superficie",
    structure: "Especifica, derivada e proxima da expressao comum.",
    risk: "Mais facil de alcancar e manter; ainda limitada pela especificidade da Anchor.",
  },
  {
    label: "Anchor Profunda",
    eyebrow: "Leitura de profundidade",
    summary: "Uma rota distinta assentada abaixo das derivacoes de superficie. Acesso estrutural maior, tensao maior.",
    depth: "Rota profunda",
    asset: redactoryAssets.deepAnchorSeal,
    symbolAsset: redactoryAssets.deepAnchorSymbol,
    alt: "Selo da Apocachynthion para Anchor Profunda",
    position: "Rota de configuracao mais baixa",
    structure: "Mais ampla, menos derivada e nativa de trabalho profundo.",
    risk: "Mais dificil de estabilizar; pressao e risco de colapso aumentam.",
  },
  {
    label: "Anchor Abissal",
    eyebrow: "Leitura de profundidade",
    summary: "Um apoio que comeca no alicerce. O destino esta definido; sobreviver a descida e a pergunta.",
    depth: "Rota estratal",
    asset: redactoryAssets.abyssalAnchorSeal,
    symbolAsset: redactoryAssets.abyssalAnchorSymbol,
    alt: "Selo da Apocachynthion para Anchor Abissal",
    position: "Nascida nos strata",
    structure: "Enraizada numa primitiva fundamental, nao numa expressao derivada.",
    risk: "Nao ha atalho para sobreviver; estabilizar continua sendo o problema.",
  },
] satisfies DiveAnchorSeal[];

const english: DiveContent = {
  eyebrow: "A guided descent",
  title: "The Dive",
  intro: "Follow how Anchor Depth, Dive Depth, Reach, and risk fit together. Redactory never makes something from nothing; it chooses a possible version of the local world and makes that version hold for a while.",
  scrollLabel: "Begin descent",
  returnLabel: "Return to Desk",
  legendTitle: "The descent at a glance",
  legend: [
    { term: "Surface", explanation: "entering the Dive" },
    { term: "Shallow Anchor", explanation: "Anchor Depth near the surface" },
    { term: "Deep Anchor", explanation: "Anchor Depth seated lower in the grammar" },
    { term: "Near-Strata", explanation: "close to bedrock" },
    { term: "Strata", explanation: "bedrock ideas" },
    { term: "Abyssal Anchor", explanation: "a route born at bedrock" },
    { term: "Shore", explanation: "beyond this lesson" },
  ],
  sealTitle: "Apocachynthion Depth Seals",
  sealIntro: "Depth Reading is the institution's shorthand for where an Anchor sits in the Page's vertical grammar. These are the three seals used for ordinary registry classification.",
  seals: englishSeals,
  sections: [
    {
      id: "surface",
      eyebrow: "SURFACE",
      title: "The Dive Begins",
      copy: [
        "The Dive is the place a Redactor goes inside themselves before they change anything outside themselves.",
        "Think of it like lowering a lantern into dark water. At first, you only see the surface. The Anchor is somewhere below.",
      ],
      depthLabel: "Surface",
      depthMeter: { term: "Surface depth", explanation: "The world offers little resistance here. The Redactor is still approaching their route." },
      panelTitle: "The Dive threshold",
      panelNote: "No spell has happened yet. This is the approach.",
      progression: ["Ordinary awareness", "Attention turns inward", "The search for an Anchor begins"],
      plateLabel: "Approach before action",
      visualVariant: "surface",
      asset: redactoryAssets.diveSurface,
    },
    {
      id: "anchor-basics",
      eyebrow: "ANCHOR BASICS",
      title: "Your Handle on Reality",
      copy: [
        "An Anchor is the Redactor's reliable handle.",
        "Not the whole power. Not the final result. The handle.",
        "A Redactor with an Ignition Anchor is not simply a fire mage. Their safest doorway is the moment when something becomes able to burn.",
      ],
      depthLabel: "Anchor Basics",
      depthMeter: { term: "Anchor range", explanation: "The route becomes visible. Staying close to it keeps the descent manageable." },
      panelTitle: "Four handles, four doorways",
      examples: [
        { term: "Ignition", explanation: "the first yes of flame" },
        { term: "Refraction", explanation: "light changing direction" },
        { term: "Signal", explanation: "a message crossing a medium" },
        { term: "Cellular Repair", explanation: "flesh remembering how to close" },
      ],
      plateLabel: "The Anchor is the doorway",
      visualVariant: "anchor-basics",
      asset: redactoryAssets.diveShallow,
    },
    {
      id: "shallow-anchor",
      eyebrow: "SHALLOW ANCHOR",
      title: "Small, Clear, Usable",
      copy: [
        "A Shallow Anchor sits close to ordinary life.",
        "Shallow does not mean weak. It means specific and near the surface of the Page's grammar. Ignition governs the threshold where burning begins, and that single doorway can still force major changes.",
        "An Ignition Redactor might flash-ionize air into a plasma arc, trigger combustion across many prepared points at once, or force a reluctant fuel past the moment where it catches.",
      ],
      depthLabel: "Shallow Anchor",
      depthMeter: { term: "Shallow depth", explanation: "Powerful, specific changes are possible. Resistance is present, but trained Redactors can still return cleanly." },
      panelTitle: "Specific does not mean small",
      examples: [
        { term: "Plasma arc", explanation: "flash-ionize a narrow path through the air" },
        { term: "Distributed ignition", explanation: "set many prepared points alight in the same instant" },
        { term: "Forced threshold", explanation: "make resistant fuel cross into combustion" },
        { term: "Ignition denial", explanation: "stop a spark from becoming a sustained burn" },
      ],
      plateLabel: "Clear enough to use",
      visualVariant: "shallow",
      seal: englishSeals[0],
    },
    {
      id: "practical-use",
      eyebrow: "PRACTICAL USE",
      title: "What This Looks Like",
      copy: [
        "At this level, Redactory can already be dramatic.",
        "The Redactor is not grabbing Fire itself. They are using one precise doorway that belongs to fire, then forcing a possible local result through it.",
        "That can mean cutting metal with a brief plasma channel, igniting a prepared defense line all at once, or preventing an explosion by refusing its first moment of flame.",
      ],
      depthLabel: "Practical Use",
      depthMeter: { term: "Working depth", explanation: "The Redactor can alter a wider area or more targets. Losing focus now can cause a hard collapse back to the surface." },
      panelTitle: "Before and after",
      panelNote: "The Redactor chooses a possible local outcome and makes the world follow it for a while.",
      examples: [
        { term: "Cold air", explanation: "becomes a short-lived plasma channel" },
        { term: "Defense line", explanation: "ignites across dozens of prepared points" },
        { term: "Armored seam", explanation: "heats and parts under a focused arc" },
        { term: "Fuel cloud", explanation: "is denied the threshold that would make it explode" },
      ],
      plateLabel: "Small changes, not creation",
      visualVariant: "practical",
    },
    {
      id: "deep-anchor",
      eyebrow: "DEEP ANCHOR",
      title: "Deeper Route, Greater Risk",
      copy: [
        "A Deep Anchor is not a Shallow Anchor pushed lower. It is its own foundational rank.",
        "Its stable route forms around broader, lower concepts such as Combustion or Heat rather than a surface-near threshold like Ignition.",
        "But it is also harder to use safely. The deeper the Redactor goes, the less the world wants to cooperate.",
      ],
      depthLabel: "Deep Anchor",
      depthMeter: { term: "Deep depth", explanation: "Resistance can throw the Redactor out of the Dive. Collapse may leave memory gaps, dissociation, or internal damage to mind and body." },
      panelTitle: "Different ranks, different routes",
      panelNote: "Anchors can sometimes deepen through dangerous refinement, but registry rank is not a simple upgrade path.",
      comparison: [
        { term: "Shallow Ignition", explanation: "Open plasma through air or ignite many prepared targets at once." },
        { term: "Deep Combustion", explanation: "Carry burning through hostile conditions, sustain linked combustion, or address the behavior of heat at a broader level." },
        { term: "Beyond control", explanation: "The route collapses. The effect ends, but damage already caused to the world or the Redactor remains." },
      ],
      plateLabel: "Depth grows faster than safety",
      visualVariant: "deep-anchor",
      seal: englishSeals[1],
    },
    {
      id: "near-strata",
      eyebrow: "NEAR-STRATA",
      title: "The Bottom Is Close",
      copy: [
        "Near the strata, the small doorway starts opening onto something enormous.",
        "This is where examples stop behaving like tricks.",
        "Ignition is no longer just a spark. It is standing close to the question: why can fire begin at all?",
      ],
      depthLabel: "Near-Strata",
      depthMeter: { term: "Extreme depth", explanation: "Memory can fragment and identity can begin to erode. Involuntary Sinking may pull the Redactor deeper than intended." },
      panelTitle: "The doorway opens wider",
      panelNote: "Most Redactors do not work here casually.",
      progression: ["A plasma path opens", "Combustion crosses matter that should resist it", "Heat behaves across an entire system", "The root of burning comes into view"],
      plateLabel: "Close to conceptual bedrock",
      visualVariant: "near-strata",
    },
    {
      id: "strata",
      eyebrow: "STRATA",
      title: "The Bedrock Layer",
      copy: [
        "The strata are not a power list.",
        "They are the bottom layer of reality's ideas.",
        "Fire. Light. Motion. Memory. Blood. Absence. These are not examples of something deeper. They are the deep things.",
      ],
      depthLabel: "Strata",
      depthMeter: { term: "Bedrock depth", explanation: "The Redactor is near the survivable ceiling. Failure can damage mind and body; exceeding that ceiling means death." },
      panelTitle: "Bedrock ideas",
      examples: [
        { term: "Fire", explanation: "not a flame, but the root of burning" },
        { term: "Light", explanation: "not brightness, but the root of visibility" },
        { term: "Motion", explanation: "not speed, but the root of movement" },
        { term: "Memory", explanation: "not remembering, but the root of what remains" },
        { term: "Blood", explanation: "not injury, but the root of living cost" },
        { term: "Absence", explanation: "not emptiness, but the root of what is missing" },
      ],
      plateLabel: "The bottom layer, not another Anchor type",
      visualVariant: "strata",
      asset: redactoryAssets.diveStrata,
    },
    {
      id: "abyssal-anchor",
      eyebrow: "ABYSSAL ANCHOR",
      title: "Born at Bedrock",
      copy: [
        "Most Redactors begin with a small handle near the surface.",
        "An Abyssal Anchor is different. Its route is already at the bottom.",
        "A Fire Abyssal Anchor is not Ignition, Combustion, Heat, or Flame. It is Fire itself, down where burning begins.",
        "At full capacity, that doorway could make stone, sea, or sky express burning across a region. That is potential, not automatic control.",
      ],
      depthLabel: "Abyssal Anchor",
      depthMeter: { term: "Abyssal Anchor Depth", explanation: "The Anchor sits here, but a full-capacity Dive still has to reach it. An uncontrolled descent may become Sinking or catastrophic Shorefall." },
      panelTitle: "Where the handle begins",
      progression: ["Shallow rank: Ignition / Refraction / Signal", "Deep rank: Combustion / Heat / Structural Momentum", "Abyssal rank: FIRE / LIGHT / MOTION", "Full capacity: stone, sea, or sky burn across a region"],
      panelNote: "The Anchor begins here. The Redactor still has to survive reaching it.",
      plateLabel: "Born at the strata",
      visualVariant: "abyssal",
      asset: redactoryAssets.abyssalAnchor,
      seal: englishSeals[2],
    },
    {
      id: "abyssal-warning",
      eyebrow: "THE COST",
      title: "The Ceiling Is High. The Floor Is Far Away.",
      copy: [
        "An Abyssal Anchor has terrifying potential.",
        "But potential is not control.",
        "If your Anchor is at the bottom, you must reach the bottom to use it fully. Until then, your own power can feel far away from you.",
      ],
      depthLabel: "The Cost",
      depthMeter: { term: "Survival limit", explanation: "At full capacity, Fire could make stone, sea, or sky express burning across a region. Holding that answer may destroy the person forcing it." },
      panelTitle: "Potential is not control",
      comparison: [
        { term: "Shallow or Deep Redactor", explanation: "Works from a route closer to ordinary operating height. The Anchor may sometimes deepen, but that is training history, not the rank itself." },
        { term: "Abyssal Redactor", explanation: "The handle is already deep. They must learn to survive the trip." },
      ],
      plateLabel: "A long route to your own Anchor",
      visualVariant: "abyssal-warning",
    },
    {
      id: "shore",
      eyebrow: "BOUNDARY",
      title: "Where Descent Ends",
      copy: [
        "At the bottom, the Dive stops feeling like a tunnel.",
        "The idea becomes a coastline.",
        "That is not part of this lesson yet.",
      ],
      depthLabel: "Shore",
      depthMeter: { term: "Descent ends", explanation: "The vertical route is over. What follows is a boundary condition, not a deeper ordinary Dive." },
      panelTitle: "The Shore threshold",
      progression: ["The downward route ends", "The line opens into a horizon", "The Shore begins beyond this lesson"],
      plateLabel: "End of the guided descent",
      visualVariant: "boundary",
    },
  ],
};

const portuguese: DiveContent = {
  eyebrow: "Uma descida guiada",
  title: "O Dive",
  intro: "Siga como Anchor Depth, Dive Depth, Reach e risco se encaixam. Redactory nunca cria algo do nada; ela escolhe uma versao possivel do mundo local e faz essa versao durar por algum tempo.",
  scrollLabel: "Iniciar descida",
  returnLabel: "Voltar a Mesa",
  legendTitle: "A descida em resumo",
  legend: [
    { term: "Superficie", explanation: "entrada no Dive" },
    { term: "Anchor Rasa", explanation: "Anchor Depth perto da superficie" },
    { term: "Anchor Profunda", explanation: "Anchor Depth assentada mais abaixo na gramatica" },
    { term: "Near-Strata", explanation: "perto do alicerce" },
    { term: "Strata", explanation: "ideias fundamentais" },
    { term: "Anchor Abissal", explanation: "uma rota nascida no alicerce" },
    { term: "Shore", explanation: "alem desta licao" },
  ],
  sealTitle: "Selos de Profundidade da Apocachynthion",
  sealIntro: "Depth Reading e o atalho institucional para indicar onde uma Anchor se assenta na gramatica vertical da Page. Estes sao os tres selos usados na classificacao comum do registro.",
  seals: portugueseSeals,
  sections: [
    {
      id: "surface",
      eyebrow: "SUPERFICIE",
      title: "O Dive Comeca",
      copy: [
        "O Dive e o lugar para onde um Redactor vai dentro de si antes de mudar qualquer coisa fora de si.",
        "Pense em baixar uma lanterna em agua escura. No inicio, voce so ve a superficie. A Anchor esta em algum lugar abaixo.",
      ],
      depthLabel: "Superficie",
      depthMeter: { term: "Profundidade da superficie", explanation: "O mundo oferece pouca resistencia aqui. O Redactor ainda esta se aproximando de sua rota." },
      panelTitle: "O limiar do Dive",
      panelNote: "Nenhum efeito aconteceu ainda. Esta e a aproximacao.",
      progression: ["Atencao comum", "A atencao se volta para dentro", "A busca pela Anchor comeca"],
      plateLabel: "Aproximacao antes da acao",
      visualVariant: "surface",
      asset: redactoryAssets.diveSurface,
    },
    {
      id: "anchor-basics",
      eyebrow: "ANCHOR: O BASICO",
      title: "Seu Apoio na Realidade",
      copy: [
        "Uma Anchor e o apoio confiavel do Redactor.",
        "Nao e o poder inteiro. Nao e o resultado final. E o apoio.",
        "Um Redactor com Anchor de Ignition nao e apenas um mago do fogo. Sua porta mais segura e o momento em que algo se torna capaz de queimar.",
      ],
      depthLabel: "Anchor: O Basico",
      depthMeter: { term: "Faixa da Anchor", explanation: "A rota se torna visivel. Permanecer perto dela mantem a descida controlavel." },
      panelTitle: "Quatro apoios, quatro portas",
      examples: [
        { term: "Ignition", explanation: "o primeiro sim da chama" },
        { term: "Refraction", explanation: "a luz mudando de direcao" },
        { term: "Signal", explanation: "uma mensagem cruzando um meio" },
        { term: "Cellular Repair", explanation: "a carne lembrando como se fechar" },
      ],
      plateLabel: "A Anchor e a porta",
      visualVariant: "anchor-basics",
      asset: redactoryAssets.diveShallow,
    },
    {
      id: "shallow-anchor",
      eyebrow: "ANCHOR RASA",
      title: "Pequena, Clara, Util",
      copy: [
        "Uma Anchor Rasa fica perto da vida comum.",
        "Rasa nao significa fraca. Significa especifica e perto da superficie da gramatica da Page. Ignition governa o limiar onde a queima comeca, e essa unica porta ainda pode forcar grandes mudancas.",
        "Um Redactor de Ignition pode ionizar o ar num arco de plasma, iniciar combustao em muitos pontos preparados ao mesmo tempo ou forcar um combustivel resistente a pegar fogo.",
      ],
      depthLabel: "Anchor Rasa",
      depthMeter: { term: "Profundidade rasa", explanation: "Mudancas poderosas e especificas sao possiveis. Ha resistencia, mas Redactors treinados ainda retornam sem dano." },
      panelTitle: "Especifica nao significa pequena",
      examples: [
        { term: "Arco de plasma", explanation: "ioniza uma rota estreita pelo ar" },
        { term: "Ignicao distribuida", explanation: "acende muitos pontos preparados no mesmo instante" },
        { term: "Limiar forcado", explanation: "faz combustivel resistente entrar em combustao" },
        { term: "Negacao de ignicao", explanation: "impede uma faisca de se tornar uma queima sustentada" },
      ],
      plateLabel: "Clara o bastante para usar",
      visualVariant: "shallow",
      seal: portugueseSeals[0],
    },
    {
      id: "practical-use",
      eyebrow: "USO PRATICO",
      title: "Como Isso Aparece",
      copy: [
        "Neste nivel, Redactory ja pode ser dramatica.",
        "O Redactor nao esta agarrando Fire. Ele usa uma porta precisa que pertence ao fogo e forca um resultado local possivel atraves dela.",
        "Isso pode cortar metal com um canal breve de plasma, acender uma linha defensiva inteira ou impedir uma explosao ao negar seu primeiro momento de chama.",
      ],
      depthLabel: "Uso Pratico",
      depthMeter: { term: "Profundidade de trabalho", explanation: "O Redactor altera uma area maior ou mais alvos. Perder o foco pode causar um colapso violento de volta a superficie." },
      panelTitle: "Antes e depois",
      panelNote: "O Redactor escolhe um resultado local possivel e faz o mundo segui-lo por algum tempo.",
      examples: [
        { term: "Ar frio", explanation: "vira um canal breve de plasma" },
        { term: "Linha defensiva", explanation: "acende em dezenas de pontos preparados" },
        { term: "Junta blindada", explanation: "aquece e se abre sob um arco focado" },
        { term: "Nuvem de combustivel", explanation: "tem negado o limiar que causaria explosao" },
      ],
      plateLabel: "Mudancas pequenas, nao criacao",
      visualVariant: "practical",
    },
    {
      id: "deep-anchor",
      eyebrow: "ANCHOR PROFUNDA",
      title: "Rota Mais Profunda, Maior Risco",
      copy: [
        "Uma Anchor Profunda nao e uma Anchor Rasa empurrada para baixo. Ela e seu proprio rank fundacional.",
        "Sua rota estavel se forma em torno de conceitos mais amplos e baixos, como Combustion ou Heat, em vez de um limiar perto da superficie como Ignition.",
        "Mas tambem e mais dificil de usar com seguranca. Quanto mais fundo o Redactor vai, menos o mundo quer cooperar.",
      ],
      depthLabel: "Anchor Profunda",
      depthMeter: { term: "Profundidade alta", explanation: "A resistencia pode expulsar o Redactor do Dive. O colapso pode deixar falhas de memoria, dissociacao ou dano interno a mente e ao corpo." },
      panelTitle: "Ranks diferentes, rotas diferentes",
      panelNote: "Anchors as vezes podem se aprofundar por refinamento perigoso, mas o rank de registro nao e uma simples rota de upgrade.",
      comparison: [
        { term: "Ignition rasa", explanation: "Abre plasma no ar ou acende muitos alvos preparados ao mesmo tempo." },
        { term: "Combustion profunda", explanation: "Leva queima por condicoes hostis, sustenta combustao ligada ou trata o comportamento de Heat em escala mais ampla." },
        { term: "Alem do controle", explanation: "A rota colapsa. O efeito termina, mas o dano ja causado ao mundo ou ao Redactor permanece." },
      ],
      plateLabel: "A profundidade cresce mais rapido que a seguranca",
      visualVariant: "deep-anchor",
      seal: portugueseSeals[1],
    },
    {
      id: "near-strata",
      eyebrow: "NEAR-STRATA",
      title: "O Fundo Esta Perto",
      copy: [
        "Perto dos strata, a pequena porta comeca a se abrir para algo enorme.",
        "Aqui, os exemplos deixam de parecer truques.",
        "Ignition ja nao e apenas uma faisca. E estar perto da pergunta: por que o fogo pode comecar?",
      ],
      depthLabel: "Near-Strata",
      depthMeter: { term: "Profundidade extrema", explanation: "A memoria pode se fragmentar e a identidade pode se desgastar. Sinking involuntario pode puxar o Redactor alem do planejado." },
      panelTitle: "A porta se abre",
      panelNote: "A maioria dos Redactors nao trabalha aqui por acaso.",
      progression: ["Um caminho de plasma se abre", "Combustion cruza materia resistente", "Heat age sobre um sistema inteiro", "A raiz da queima aparece"],
      plateLabel: "Perto do alicerce conceitual",
      visualVariant: "near-strata",
    },
    {
      id: "strata",
      eyebrow: "STRATA",
      title: "A Camada de Alicerce",
      copy: [
        "Os strata nao sao uma lista de poderes.",
        "Eles sao a camada mais funda das ideias da realidade.",
        "Fire. Light. Motion. Memory. Blood. Absence. Nao sao exemplos de algo mais profundo. Sao as coisas profundas.",
      ],
      depthLabel: "Strata",
      depthMeter: { term: "Profundidade de alicerce", explanation: "O Redactor esta perto do limite de sobrevivencia. Falhar pode ferir mente e corpo; ultrapassar o limite significa morte." },
      panelTitle: "Ideias de alicerce",
      examples: [
        { term: "Fire", explanation: "nao uma chama, mas a raiz da queima" },
        { term: "Light", explanation: "nao brilho, mas a raiz da visibilidade" },
        { term: "Motion", explanation: "nao velocidade, mas a raiz do movimento" },
        { term: "Memory", explanation: "nao lembrar, mas a raiz do que permanece" },
        { term: "Blood", explanation: "nao ferimento, mas a raiz do custo vivo" },
        { term: "Absence", explanation: "nao vazio, mas a raiz do que falta" },
      ],
      plateLabel: "A camada mais funda, nao outro tipo de Anchor",
      visualVariant: "strata",
      asset: redactoryAssets.diveStrata,
    },
    {
      id: "abyssal-anchor",
      eyebrow: "ANCHOR ABISSAL",
      title: "Nascida no Alicerce",
      copy: [
        "A maioria dos Redactors comeca com um pequeno apoio perto da superficie.",
        "Uma Anchor Abissal e diferente. Sua rota ja esta no fundo.",
        "Uma Anchor Abissal de Fire nao e Ignition, Combustion, Heat ou Flame. E Fire em si, onde a queima comeca.",
        "Em plena capacidade, essa porta poderia fazer pedra, mar ou ceu expressarem queima por uma regiao. Isso e potencial, nao controle automatico.",
      ],
      depthLabel: "Anchor Abissal",
      depthMeter: { term: "Anchor Depth abissal", explanation: "A Anchor esta aqui, mas um Dive em plena capacidade ainda precisa alcanca-la. Uma descida sem controle pode virar Sinking ou Shorefall catastrofico." },
      panelTitle: "Onde o apoio comeca",
      progression: ["Rank raso: Ignition / Refraction / Signal", "Rank profundo: Combustion / Heat / Structural Momentum", "Rank abissal: FIRE / LIGHT / MOTION", "Plena capacidade: pedra, mar ou ceu queimam por uma regiao"],
      panelNote: "A Anchor comeca aqui. O Redactor ainda precisa sobreviver ate alcanca-la.",
      plateLabel: "Nascida nos strata",
      visualVariant: "abyssal",
      asset: redactoryAssets.abyssalAnchor,
      seal: portugueseSeals[2],
    },
    {
      id: "abyssal-warning",
      eyebrow: "O CUSTO",
      title: "O Teto E Alto. O Chao Esta Muito Longe.",
      copy: [
        "Uma Anchor Abissal tem potencial assustador.",
        "Mas potencial nao e controle.",
        "Se sua Anchor esta no fundo, voce precisa chegar ao fundo para usa-la por inteiro. Ate la, seu proprio poder pode parecer distante.",
      ],
      depthLabel: "O Custo",
      depthMeter: { term: "Limite de sobrevivencia", explanation: "Em plena capacidade, Fire poderia fazer pedra, mar ou ceu expressarem queima por uma regiao. Sustentar essa resposta pode destruir quem a forca." },
      panelTitle: "Potencial nao e controle",
      comparison: [
        { term: "Redactor raso ou profundo", explanation: "Trabalha a partir de uma rota mais perto da altura operacional comum. A Anchor as vezes pode se aprofundar, mas isso e historico de treino, nao o proprio rank." },
        { term: "Redactor abissal", explanation: "O apoio ja esta fundo. Precisa aprender a sobreviver a viagem." },
      ],
      plateLabel: "Uma longa rota ate sua propria Anchor",
      visualVariant: "abyssal-warning",
    },
    {
      id: "shore",
      eyebrow: "LIMITE",
      title: "Onde a Descida Termina",
      copy: [
        "No fundo, o Dive deixa de parecer um tunel.",
        "A ideia se torna uma costa.",
        "Isso ainda nao faz parte desta licao.",
      ],
      depthLabel: "Shore",
      depthMeter: { term: "A descida termina", explanation: "A rota vertical acabou. O que vem depois e uma condicao de limite, nao um Dive comum mais profundo." },
      panelTitle: "O limiar da Shore",
      progression: ["A rota para baixo termina", "A linha se abre num horizonte", "A Shore comeca alem desta licao"],
      plateLabel: "Fim da descida guiada",
      visualVariant: "boundary",
    },
  ],
};

export function getRedactoryDiveContent(locale: SiteLocale) {
  return locale === "pt-br" ? portuguese : english;
}
