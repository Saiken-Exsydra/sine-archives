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
    summary: "The same handle settled lower through dangerous practice. Wider reach, higher strain.",
    depth: "Deepened route",
    asset: redactoryAssets.deepAnchorSeal,
    symbolAsset: redactoryAssets.deepAnchorSymbol,
    alt: "Apocachynthion seal for a Deep Anchor",
    position: "Same route, pushed lower",
    structure: "Broader access through the original Anchor pathway.",
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
    risk: "No deepening shortcut needed; survival and stabilization remain the problem.",
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
    summary: "O mesmo apoio assentado mais abaixo por pratica perigosa. Maior alcance, maior tensao.",
    depth: "Rota aprofundada",
    asset: redactoryAssets.deepAnchorSeal,
    symbolAsset: redactoryAssets.deepAnchorSymbol,
    alt: "Selo da Apocachynthion para Anchor Profunda",
    position: "Mesma rota, levada para baixo",
    structure: "Acesso mais amplo pela via original da Anchor.",
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
    risk: "Nao precisa do atalho de aprofundamento; sobreviver e estabilizar continuam sendo o problema.",
  },
] satisfies DiveAnchorSeal[];

const english: DiveContent = {
  eyebrow: "A guided descent",
  title: "The Dive",
  intro: "Follow one Anchor from a clear, everyday use toward the bedrock ideas beneath it. Redactory never makes something from nothing; it chooses a possible version of the local world and makes that version hold for a while.",
  scrollLabel: "Begin descent",
  returnLabel: "Return to Desk",
  legendTitle: "The descent at a glance",
  legend: [
    { term: "Surface", explanation: "entering the Dive" },
    { term: "Shallow Anchor", explanation: "a specific handle" },
    { term: "Deep Anchor", explanation: "the same handle, lower down" },
    { term: "Near-Strata", explanation: "close to bedrock" },
    { term: "Strata", explanation: "bedrock ideas" },
    { term: "Abyssal Anchor", explanation: "a handle born at bedrock" },
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
        "Shallow does not mean weak. It means specific. Ignition governs the threshold where burning begins, and that single doorway can still force major changes.",
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
      id: "deepening",
      eyebrow: "DEEPENING",
      title: "The Same Door, Lower Down",
      copy: [
        "Going deeper does not mean switching powers.",
        "The Redactor keeps the same doorway and follows it lower.",
        "Ignition does not become Fire. It becomes Ignition closer to the deep rules that make fire possible.",
      ],
      depthLabel: "Deepening",
      depthMeter: { term: "Deeper descent", explanation: "The same Anchor reaches broader possibilities. The world pushes back harder, and ascent takes more effort." },
      panelTitle: "Ignition, followed downward",
      panelNote: "Same Anchor. Greater reach. Greater danger.",
      progression: ["Ignition", "Combustion across hostile conditions", "Heat without an easy source", "Near-Fire behavior"],
      plateLabel: "One doorway, reached from lower down",
      visualVariant: "deepening",
      asset: redactoryAssets.diveDeepening,
    },
    {
      id: "deep-anchor",
      eyebrow: "DEEP ANCHOR",
      title: "Bigger Reach, Less Safety",
      copy: [
        "A Deep Anchor is a familiar route that has been pushed far below its first position.",
        "It can do far more because it reaches closer to Combustion, Heat, and the roots beneath them.",
        "But it is also harder to use safely. The deeper the Redactor goes, the less the world wants to cooperate.",
      ],
      depthLabel: "Deep Anchor",
      depthMeter: { term: "Deep depth", explanation: "Resistance can throw the Redactor out of the Dive. Collapse may leave memory gaps, dissociation, or internal damage to mind and body." },
      panelTitle: "The same Anchor at three depths",
      comparison: [
        { term: "Shallow Ignition", explanation: "Open plasma through air or ignite many prepared targets at once." },
        { term: "Deep Ignition", explanation: "Start combustion without ordinary fuel conditions, carry it through hostile environments, or turn a broad zone into one linked ignition event." },
        { term: "Beyond control", explanation: "The route collapses. The effect ends, but damage already caused to the world or the Redactor remains." },
      ],
      plateLabel: "Reach grows faster than safety",
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
        "An Abyssal Anchor is different. The handle is already at the bottom.",
        "A Fire Abyssal Anchor is not Ignition, Combustion, Heat, or Flame. It is Fire itself, down where burning begins.",
        "At full capacity, that doorway could make stone, sea, or sky express burning across a region. That is potential, not automatic control.",
      ],
      depthLabel: "Abyssal Anchor",
      depthMeter: { term: "Abyssal depth", explanation: "The Anchor is here, but reaching it can kill the Redactor. An uncontrolled descent may become Sinking or catastrophic Shorefall." },
      panelTitle: "Where the handle begins",
      progression: ["Surface: Ignition", "Deep: Combustion / Heat / Thermal Energy", "Strata: FIRE", "Full capacity: stone, sea, or sky burn across a region"],
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
        { term: "Normal Redactor", explanation: "Starts near their handle. Learns to move it deeper." },
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
  intro: "Siga uma Anchor desde um uso claro e cotidiano ate as ideias fundamentais sob ela. Redactory nunca cria algo do nada; ela escolhe uma versao possivel do mundo local e faz essa versao durar por algum tempo.",
  scrollLabel: "Iniciar descida",
  returnLabel: "Voltar a Mesa",
  legendTitle: "A descida em resumo",
  legend: [
    { term: "Superficie", explanation: "entrada no Dive" },
    { term: "Anchor Rasa", explanation: "um apoio especifico" },
    { term: "Anchor Profunda", explanation: "o mesmo apoio, mais abaixo" },
    { term: "Near-Strata", explanation: "perto do alicerce" },
    { term: "Strata", explanation: "ideias fundamentais" },
    { term: "Anchor Abissal", explanation: "um apoio nascido no alicerce" },
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
        "Rasa nao significa fraca. Significa especifica. Ignition governa o limiar onde a queima comeca, e essa unica porta ainda pode forcar grandes mudancas.",
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
      id: "deepening",
      eyebrow: "APROFUNDAMENTO",
      title: "A Mesma Porta, Mais Abaixo",
      copy: [
        "Ir mais fundo nao significa trocar de poder.",
        "O Redactor mantem a mesma porta e a segue para baixo.",
        "Ignition nao se torna Fire. Continua sendo Ignition, mas mais perto das regras profundas que tornam o fogo possivel.",
      ],
      depthLabel: "Aprofundamento",
      depthMeter: { term: "Descida mais funda", explanation: "A mesma Anchor alcanca mais possibilidades. O mundo reage com mais forca e subir exige mais esforco." },
      panelTitle: "Ignition seguida para baixo",
      panelNote: "Mesma Anchor. Maior alcance. Maior perigo.",
      progression: ["Ignition", "Combustao em condicoes hostis", "Heat sem uma fonte facil", "Comportamento proximo de Fire"],
      plateLabel: "Uma porta usada de mais abaixo",
      visualVariant: "deepening",
      asset: redactoryAssets.diveDeepening,
    },
    {
      id: "deep-anchor",
      eyebrow: "ANCHOR PROFUNDA",
      title: "Maior Alcance, Menos Seguranca",
      copy: [
        "Uma Anchor Profunda e uma rota familiar levada muito abaixo de sua primeira posicao.",
        "Ela pode fazer muito mais porque chega perto de Combustion, Heat e das raizes sob eles.",
        "Mas tambem e mais dificil de usar com seguranca. Quanto mais fundo o Redactor vai, menos o mundo quer cooperar.",
      ],
      depthLabel: "Anchor Profunda",
      depthMeter: { term: "Profundidade alta", explanation: "A resistencia pode expulsar o Redactor do Dive. O colapso pode deixar falhas de memoria, dissociacao ou dano interno a mente e ao corpo." },
      panelTitle: "A mesma Anchor em tres profundidades",
      comparison: [
        { term: "Ignition rasa", explanation: "Abre plasma no ar ou acende muitos alvos preparados ao mesmo tempo." },
        { term: "Ignition profunda", explanation: "Inicia combustao sem condicoes comuns, leva a queima por ambientes hostis ou une uma area inteira num evento de ignicao." },
        { term: "Alem do controle", explanation: "A rota colapsa. O efeito termina, mas o dano ja causado ao mundo ou ao Redactor permanece." },
      ],
      plateLabel: "O alcance cresce mais rapido que a seguranca",
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
        "Uma Anchor Abissal e diferente. O apoio ja esta no fundo.",
        "Uma Anchor Abissal de Fire nao e Ignition, Combustion, Heat ou Flame. E Fire em si, onde a queima comeca.",
        "Em plena capacidade, essa porta poderia fazer pedra, mar ou ceu expressarem queima por uma regiao. Isso e potencial, nao controle automatico.",
      ],
      depthLabel: "Anchor Abissal",
      depthMeter: { term: "Profundidade abissal", explanation: "A Anchor esta aqui, mas alcanca-la pode matar o Redactor. Uma descida sem controle pode virar Sinking ou Shorefall catastrofico." },
      panelTitle: "Onde o apoio comeca",
      progression: ["Superficie: Ignition", "Profundo: Combustion / Heat / Thermal Energy", "Strata: FIRE", "Plena capacidade: pedra, mar ou ceu queimam por uma regiao"],
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
        { term: "Redactor comum", explanation: "Comeca perto de seu apoio. Aprende a leva-lo mais fundo." },
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
