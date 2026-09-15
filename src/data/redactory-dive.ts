import type { SiteLocale } from '../i18n/config';
import { redactoryAssets } from './redactory';

export type DiveExample = { term: string; explanation: string };
export type DiveAnchorSeal = {
  label: string; eyebrow: string; summary: string; depth: string; asset: string;
  symbolAsset: string; alt: string; position: string; structure: string; risk: string;
};
export type DiveSectionData = {
  id: string; eyebrow: string; title: string; copy: string[]; depthLabel: string;
  panelTitle: string; panelNote?: string; examples?: DiveExample[];
  progression?: string[]; comparison?: DiveExample[]; depthMeter?: DiveExample;
  plateLabel: string; visualVariant: string; asset?: string; seal?: DiveAnchorSeal;
};

/** Explanatory layer. The Redactory Codex owns the system and its depth categories. */
export function getRedactoryDiveContent(locale: SiteLocale) {
  const t = (en: string, pt: string) => locale === 'pt-br' ? pt : en;
  const ex = (term: string, pt: string, en: string, translation: string): DiveExample => ({ term: t(term, pt), explanation: t(en, translation) });
  const seals: DiveAnchorSeal[] = [
    {
      label: 'Shallow Anchor', eyebrow: t('A specific effect', 'Um efeito específico'),
      summary: t('A familiar way into one precise behavior of reality, such as light bending.', 'Um caminho familiar para um comportamento preciso da realidade, como a luz mudar de direção.'),
      depth: t('Example: Refraction', 'Exemplo: Refraction'), asset: redactoryAssets.shallowAnchorSeal, symbolAsset: redactoryAssets.shallowAnchorSymbol,
      alt: t('Shallow Anchor seal', 'Selo de Shallow Anchor'), position: t('Close to everyday effects', 'Perto dos efeitos cotidianos'),
      structure: t('One specific behavior', 'Um comportamento específico'), risk: t('Specific does not mean weak or harmless.', 'Específico não significa fraco ou inofensivo.'),
    },
    {
      label: 'Deep Anchor', eyebrow: t('A family of effects', 'Uma família de efeitos'),
      summary: t('A way into the system behind several related effects, such as the behavior of light.', 'Um caminho para o sistema por trás de vários efeitos relacionados, como o comportamento da luz.'),
      depth: t('Example: Optics', 'Exemplo: Optics'), asset: redactoryAssets.deepAnchorSeal, symbolAsset: redactoryAssets.deepAnchorSymbol,
      alt: t('Deep Anchor seal', 'Selo de Deep Anchor'), position: t('Beneath related effects', 'Abaixo de efeitos relacionados'),
      structure: t('The system connecting them', 'O sistema que os conecta'), risk: t('More to understand, more that can go wrong.', 'Mais para compreender, mais possibilidades de erro.'),
    },
    {
      label: 'Abyssal Anchor', eyebrow: t('A foundational idea', 'Uma ideia fundamental'),
      summary: t('A way into an idea at reality’s foundations, such as Light itself. Full access demands an extremely dangerous Dive.', 'Um caminho para uma ideia nos fundamentos da realidade, como Light em si. O acesso pleno exige um Dive extremamente perigoso.'),
      depth: t('Example: Light', 'Exemplo: Light'), asset: redactoryAssets.abyssalAnchorSeal, symbolAsset: redactoryAssets.abyssalAnchorSymbol,
      alt: t('Abyssal Anchor seal', 'Selo de Abyssal Anchor'), position: t('At the conceptual bedrock', 'No alicerce das ideias'),
      structure: t('The idea beneath the system', 'A ideia por trás do sistema'), risk: t('Having this Anchor does not mean reaching it safely.', 'Ter essa Anchor não significa alcançá-la com segurança.'),
    },
  ];
  const sections: DiveSectionData[] = [
    {
      id: 'surface', eyebrow: t('Start here', 'Comece aqui'), title: t('What is Redactory?', 'O que é Redactory?'), depthLabel: 'Redactory', visualVariant: 'surface',
      copy: [
        t('Redactory is a way of making reality take a possible form that a person chooses. Someone who does this is called a Redactor.', 'Redactory é uma forma de fazer a realidade assumir uma forma possível escolhida por uma pessoa. Quem faz isso se chama Redactor.'),
        t('Think of holding a bridge in place so someone can cross. The Redactor finds a way for the result to exist, then keeps that way open. This sustaining connection is called a route.', 'Pense em manter uma ponte no lugar para alguém atravessar. O Redactor encontra um caminho para o resultado existir e mantém esse caminho aberto. Essa conexão de sustentação se chama rota.'),
        t('The Archive is the whole of what is possible. Redactory works within those possibilities, even when an effect could not last under ordinary physics alone.', 'O Archive é a totalidade do que é possível. Redactory trabalha dentro dessas possibilidades, mesmo quando um efeito não duraria apenas pelas leis físicas comuns.'),
      ], panelTitle: t('An idea becomes a real effect', 'Uma ideia se torna um efeito real'),
      progression: [t('Choose a possible result.', 'Escolha um resultado possível.'), t('Find a route that can support it.', 'Encontre uma rota capaz de sustentá-lo.'), t('Hold the route while the result needs it.', 'Mantenha a rota enquanto o resultado precisar dela.')],
      plateLabel: t('Possibility, practice, support', 'Possibilidade, prática, sustentação'), asset: redactoryAssets.diveSurface,
    },
    {
      id: 'practical-use', eyebrow: t('A concrete example', 'Um exemplo concreto'), title: t('What happens when you let go?', 'O que acontece quando você solta?'), depthLabel: t('Real results', 'Resultados reais'), visualVariant: 'practical',
      copy: [
        t('A temporary tool made through Redactory is real while the route holds it. It can carry weight or drive a nail. This is called instancing.', 'Uma ferramenta temporária feita por Redactory é real enquanto a rota a sustenta. Ela pode suportar peso ou pregar um prego. Isso se chama instancing.'),
        t('When the route ends, the tool disappears. The nail stays where it was driven. Ending an effect does not undo what it already did.', 'Quando a rota termina, a ferramenta desaparece. O prego fica onde foi colocado. Encerrar um efeito não desfaz o que ele já causou.'),
        t('Some changes can last on their own. Reshaped metal can keep its new form after release if the material can support it. That is stable reconfiguration.', 'Algumas mudanças se mantêm sozinhas. Um metal remodelado pode conservar a nova forma após a liberação se o material puder sustentá-la. Isso é uma reconfiguração estável.'),
      ], panelTitle: t('Two kinds of result', 'Dois tipos de resultado'), comparison: [
        ex('Instanced hammer', 'Martelo temporário', 'Needs the route to keep existing.', 'Precisa da rota para continuar existindo.'),
        ex('Reshaped metal', 'Metal remodelado', 'Can remain if the world can carry the result without help.', 'Pode permanecer se o mundo sustentar o resultado sem ajuda.'),
        ex('The useful question', 'A pergunta útil', 'What keeps this going after I let go?', 'O que mantém isso funcionando depois que eu soltar?'),
      ], plateLabel: t('Real consequences remain', 'Consequências reais permanecem'),
    },
    {
      id: 'dive-basics', eyebrow: t('How it works', 'Como funciona'), title: t('Why call it a Dive?', 'Por que se chama Dive?'), depthLabel: 'Dive', visualVariant: 'surface', asset: redactoryAssets.diveShallow,
      copy: [
        t('Every Redactory act uses the Dive. The Redactor turns inward to work with the ideas that hold the world together. It feels like descending beneath the surface, but their body is not traveling into another place.', 'Todo ato de Redactory usa o Dive. O Redactor se volta para dentro para trabalhar com as ideias que sustentam o mundo. A experiência parece uma descida abaixo da superfície, mas o corpo não viaja para outro lugar.'),
        t('Imagine looking past a moving hand to the muscles moving it, then to the principles of movement. Deeper work similarly reaches broader, more fundamental relationships. This is an analogy for depth, not a literal journey through water.', 'Imagine olhar além de uma mão em movimento: primeiro para os músculos que a movem, depois para os princípios do movimento. O trabalho mais profundo também alcança relações mais amplas e fundamentais. Essa é uma analogia para a profundidade, não uma viagem literal pela água.'),
      ], panelTitle: t('From an effect to what supports it', 'Do efeito ao que o sustenta'),
      progression: [t('The effect you can see', 'O efeito que você vê'), t('The relationships behind it', 'As relações por trás dele'), t('The deeper ideas they depend on', 'As ideias profundas das quais elas dependem')],
      plateLabel: t('Working beneath the surface', 'Trabalhar abaixo da superfície'),
    },
    {
      id: 'anchor-basics', eyebrow: 'Anchor', title: t('Your most familiar way in', 'Sua entrada mais familiar'), depthLabel: 'Anchor', visualVariant: 'anchor-basics',
      copy: [
        t('An Anchor is the idea through which a Redactor most reliably enters the Dive and organizes a change. Think of it as a familiar path: knowing the way makes each step easier.', 'Uma Anchor é a ideia pela qual um Redactor entra no Dive com mais confiança e organiza uma mudança. Pense em um caminho conhecido: saber o trajeto facilita cada passo.'),
        t('Near that path, intention and practiced instinct can do work the Redactor could not explain step by step. Preparation still makes the result safer and more precise.', 'Perto desse caminho, a intenção e o instinto treinado podem realizar um trabalho que o Redactor não saberia explicar passo a passo. O preparo ainda torna o resultado mais seguro e preciso.'),
        t('An Anchor is not a list of spells. Ignition concerns the moment burning begins. It gives a particular way to work with fire, rather than effortless control of everything fire can do.', 'Uma Anchor não é uma lista de feitiços. Ignition trata do momento em que algo começa a queimar. Ela oferece uma forma específica de trabalhar com o fogo, em vez de controle sem esforço sobre tudo o que ele pode fazer.'),
      ], panelTitle: t('What these names mean', 'O que esses nomes significam'), examples: [
        ex('Ignition', 'Ignition', 'The moment something starts burning.', 'O momento em que algo começa a queimar.'),
        ex('Refraction', 'Refraction', 'Light bending as it passes into a different material.', 'A luz mudando de direção ao passar para outro material.'),
        ex('Signal', 'Signal', 'A signal passing through a medium.', 'Um sinal passando por um meio.'),
      ], plateLabel: t('A familiar route', 'Uma rota familiar'),
    },
    {
      id: 'depth-and-reach', eyebrow: t('Three different questions', 'Três perguntas diferentes'), title: t('Depth and Reach are different', 'Depth e Reach são diferentes'), depthLabel: 'Depth / Reach', visualVariant: 'practical',
      copy: [
        t('Use a diving rope as a picture. Anchor Depth tells you where the familiar handhold belongs. Dive Depth tells you how far down the Redactor goes this time. Reach tells you how far they work away from the familiar line.', 'Use uma corda de mergulho como imagem. Anchor Depth indica onde fica o apoio familiar. Dive Depth indica até onde o Redactor desce desta vez. Reach indica o quanto ele trabalha longe dessa linha conhecida.'),
        t('Shallow, Deep, and Abyssal describe both Anchors and Dives, but answer different questions. A Shallow Anchor can guide a deep Dive. A person with an Abyssal Anchor may only be able to manage a shallow Dive.', 'Shallow, Deep e Abyssal descrevem tanto Anchors quanto Dives, mas respondem a perguntas diferentes. Uma Shallow Anchor pode guiar um Dive profundo. Alguém com uma Abyssal Anchor talvez só consiga realizar um Dive raso.'),
      ], panelTitle: t('Keep these separate', 'Separe estas medidas'), comparison: [
        ex('Anchor Depth', 'Anchor Depth', 'Where does my Anchor belong? Inherent to the Anchor.', 'Onde minha Anchor se situa? É uma característica da própria Anchor.'),
        ex('Dive Depth', 'Dive Depth', 'How deep am I working now? Varies from act to act.', 'A que profundidade trabalho agora? Varia de um ato para outro.'),
        ex('Reach', 'Reach', 'How far is this work from my familiar route? Greater distance needs more preparation.', 'A que distância da rota familiar está esse trabalho? Distâncias maiores exigem mais preparo.'),
      ], plateLabel: t('Downward depth · outward Reach', 'Profundidade para baixo · Reach para os lados'),
    },
    {
      id: 'shallow-anchor', eyebrow: 'Shallow Anchor', title: t('One specific behavior', 'Um comportamento específico'), depthLabel: 'Shallow Anchor', visualVariant: 'shallow', seal: seals[0],
      copy: [
        t('A Shallow Anchor is close to effects we recognize in everyday life. Refraction concerns light bending; Thermal Diffusion concerns heat spreading through matter.', 'Uma Shallow Anchor fica perto dos efeitos que reconhecemos no cotidiano. Refraction trata da mudança de direção da luz; Thermal Diffusion, do calor se espalhando pela matéria.'),
        t('Specific does not mean weak. Starting or stopping a fire at the right moment can change an entire situation. Skill, scale, conditions, and control matter as much as the name of the Anchor.', 'Específico não significa fraco. Iniciar ou impedir um fogo no momento certo pode mudar toda uma situação. Habilidade, escala, condições e controle importam tanto quanto o nome da Anchor.'),
      ], panelTitle: t('A precise way in', 'Uma entrada precisa'), panelNote: t('A deeper Dive does not change this Anchor’s category.', 'Um Dive mais profundo não muda a categoria desta Anchor.'), plateLabel: t('Specific can still be powerful', 'O específico também pode ser poderoso'),
    },
    {
      id: 'deep-anchor', eyebrow: 'Deep Anchor', title: t('The system behind several effects', 'O sistema por trás de vários efeitos'), depthLabel: 'Deep Anchor', visualVariant: 'deep-anchor', seal: seals[1],
      copy: [
        t('A Deep Anchor reaches the system connecting a family of effects. Think of understanding how an instrument works, rather than knowing one note.', 'Uma Deep Anchor alcança o sistema que conecta uma família de efeitos. Pense em compreender como um instrumento funciona, em vez de conhecer apenas uma nota.'),
        t('Refraction is one behavior of light. Optics covers a broader family of light’s behavior. Likewise, Thermal Diffusion describes heat spreading, while Thermodynamics concerns the wider system of heat and energy.', 'Refraction é um comportamento da luz. Optics abrange uma família mais ampla desses comportamentos. Da mesma forma, Thermal Diffusion descreve o calor se espalhando, enquanto Thermodynamics trata do sistema mais amplo de calor e energia.'),
        t('That wider access brings more to learn and more room for mistakes. A Deep Anchor is its own kind of Anchor, not a Shallow one promoted through training.', 'Esse acesso mais amplo traz mais coisas para aprender e mais possibilidades de erro. Uma Deep Anchor é um tipo próprio de Anchor, não uma Shallow promovida pelo treinamento.'),
      ], panelTitle: t('A broader family', 'Uma família mais ampla'), plateLabel: t('Broader access asks for greater understanding', 'Um acesso mais amplo exige mais compreensão'),
    },
    {
      id: 'strata', eyebrow: t('The foundations', 'Os fundamentos'), title: t('What lies beneath the systems?', 'O que existe por trás dos sistemas?'), depthLabel: 'Strata', visualVariant: 'strata', asset: redactoryAssets.diveStrata,
      copy: [
        t('Strata is the name for reality’s conceptual bedrock: the foundational ideas on which more familiar systems depend.', 'Strata é o nome do alicerce conceitual da realidade: as ideias fundamentais das quais os sistemas mais familiares dependem.'),
        t('Think of a tree. A particular effect is like a leaf; a governing system is like a branch; the foundational concept is closer to the root. These are relationships between ideas, not physical layers underground.', 'Pense em uma árvore. Um efeito específico é como uma folha; um sistema que governa vários efeitos é como um galho; o conceito fundamental está mais perto da raiz. São relações entre ideias, não camadas físicas no subsolo.'),
      ], panelTitle: t('From effect to foundation', 'Do efeito ao fundamento'), examples: [
        ex('Refraction → Optics → Light', 'Refraction → Optics → Light', 'Light bending → the system of light’s behavior → Light itself.', 'A luz mudando de direção → o sistema de seus comportamentos → Light em si.'),
        ex('Thermal Diffusion → Thermodynamics → Temperature', 'Thermal Diffusion → Thermodynamics → Temperature', 'Heat spreading → the system of heat and energy → the foundational idea of Temperature.', 'O calor se espalhando → o sistema de calor e energia → a ideia fundamental de Temperature.'),
      ], panelNote: t('These are related ideas, not stages that an Anchor grows through.', 'São ideias relacionadas, não etapas pelas quais uma Anchor evolui.'), plateLabel: t('Effects, systems, foundations', 'Efeitos, sistemas, fundamentos'),
    },
    {
      id: 'abyssal-anchor', eyebrow: 'Abyssal Anchor', title: t('An Anchor at the foundations', 'Uma Anchor nos fundamentos'), depthLabel: 'Abyssal Anchor', visualVariant: 'abyssal', seal: seals[2],
      copy: [
        t('An Abyssal Anchor forms around a foundational idea such as Light, Temperature, or Memory. Its familiar route begins at the conceptual bedrock.', 'Uma Abyssal Anchor se forma em torno de uma ideia fundamental, como Light, Temperature ou Memory. Sua rota familiar começa no alicerce conceitual.'),
        t('Imagine your handhold far below the depth you can safely reach. Having it does not make the descent easy. An Abyssal Redactor may have extraordinary potential and still struggle to use it.', 'Imagine seu apoio muito abaixo da profundidade que você consegue alcançar com segurança. Ter esse apoio não facilita a descida. Um Redactor abissal pode ter um potencial extraordinário e ainda enfrentar dificuldades para usá-lo.'),
        t('They still need training through shallower Dives. Full access requires surviving the deepest ordinary Dive band and returning safely.', 'Ele ainda precisa treinar em Dives mais rasos. O acesso pleno exige sobreviver à faixa mais profunda do Dive comum e retornar com segurança.'),
      ], panelTitle: t('Access and control', 'Acesso e controle'), plateLabel: t('Potential does not skip the journey', 'O potencial não elimina o percurso'),
    },
    {
      id: 'near-strata', eyebrow: t('Practice', 'Prática'), title: t('What training actually changes', 'O que o treinamento realmente muda'), depthLabel: t('Training', 'Treinamento'), visualVariant: 'near-strata',
      copy: [
        t('Training makes the familiar route easier to find, hold, and release. It improves precision, efficiency, recovery, and how deep the Redactor can work without losing control.', 'O treino facilita encontrar, manter e liberar a rota familiar. Ele melhora a precisão, a eficiência, a recuperação e a profundidade em que o Redactor consegue trabalhar sem perder o controle.'),
        t('The Anchor’s category stays the same. Refraction stays Refraction even during a deeper Dive. Think of learning a path more thoroughly, rather than moving its starting point.', 'A categoria da Anchor continua a mesma. Refraction continua sendo Refraction mesmo durante um Dive mais profundo. Pense em conhecer melhor um caminho, em vez de mudar seu ponto de partida.'),
      ], panelTitle: t('Tools that help you prepare', 'Ferramentas que ajudam no preparo'), examples: [
        ex('Schematic', 'Esquema', 'A prepared plan, like a recipe for a route.', 'Um plano preparado, como uma receita para uma rota.'),
        ex('Leaf', 'Leaf', 'Stores the inscribed plan; the Redactor still does the work.', 'Guarda o plano inscrito; o Redactor ainda executa o trabalho.'),
        ex('Point and CAS', 'Point e CAS', 'An assistant and equipment access. CAS means Common Apparatus Set. Neither replaces the practitioner.', 'Um assistente e acesso a equipamentos. CAS significa Common Apparatus Set. Nenhum substitui o praticante.'),
      ], plateLabel: t('Better preparation, safer practice', 'Mais preparo, prática mais segura'),
    },
    {
      id: 'abyssal-warning', eyebrow: t('Costs and warning signs', 'Custos e sinais de alerta'), title: t('What can go wrong?', 'O que pode dar errado?'), depthLabel: t('Risks', 'Riscos'), visualVariant: 'abyssal-warning',
      copy: [
        t('A route becomes harder to hold with greater depth, unfamiliar work, larger effects, exhaustion, injury, or poor preparation. The effect can form incorrectly, collapse, or hurt the Redactor.', 'Uma rota fica mais difícil de manter com maior profundidade, trabalho desconhecido, efeitos maiores, exaustão, ferimentos ou pouco preparo. O efeito pode se formar errado, colapsar ou ferir o Redactor.'),
        t('Overreach means pushing beyond safe control. Fray is wear or damage to the Anchor, like a rope weakened by repeated strain. Familiar work can still cause harm when forced.', 'Overreach é ultrapassar os limites de controle seguro. Fray é desgaste ou dano à Anchor, como uma corda enfraquecida pelo esforço repetido. Até um trabalho familiar pode causar danos quando é forçado.'),
      ], panelTitle: t('Different problems, different names', 'Problemas diferentes, nomes diferentes'), comparison: [
        ex('Sinking', 'Sinking', 'Unstable surroundings pull the Redactor deeper without their choosing.', 'A instabilidade do ambiente puxa o Redactor para mais fundo, contra sua vontade.'),
        ex('Drowning', 'Drowning', 'A powerful, unusually stable presence keeps them from coming back up on their own.', 'Uma presença poderosa e excepcionalmente estável impede que ele suba por conta própria.'),
        ex('Burn-in', 'Burn-in', 'The route becomes hard to release or reopens by itself. It is still active and still costs effort.', 'A rota fica difícil de liberar ou se reabre sozinha. Ela continua ativa e continua consumindo esforço.'),
      ], panelNote: t('Easy, practiced control is fluency. Losing the ability to let go is a warning sign.', 'Controle fácil e treinado é fluência. Perder a capacidade de soltar é um sinal de alerta.'), plateLabel: t('Knowing when to stop is part of the skill', 'Saber quando parar faz parte da habilidade'),
    },
    {
      id: 'shore', eyebrow: t('The far boundary', 'O limite distante'), title: t('When the Dive approaches a Shore', 'Quando o Dive se aproxima de uma Shore'), depthLabel: 'Shore', visualVariant: 'boundary',
      copy: [
        t('At extreme depth, a Redactor may encounter a Shore. Picture solid ground meeting a vast sea: the ideas beneath the world meet the influence of the Archive strongly enough for a mind to experience the boundary as a place.', 'Em uma profundidade extrema, um Redactor pode encontrar uma Shore. Imagine a terra firme encontrando um mar imenso: as ideias por trás do mundo encontram a influência do Archive com força suficiente para uma mente vivenciar esse limite como um lugar.'),
        t('Shorefall is losing your hold on yourself and falling into that boundary. Shorewalking is the rare, controlled state of staying in ordinary reality while carrying the Shore’s pressure within yourself.', 'Shorefall é perder a sustentação de si e cair nesse limite. Shorewalking é o estado raro e controlado de permanecer na realidade comum enquanto carrega a pressão da Shore dentro de si.'),
        t('This is not the next lesson after a successful Dive. A Shore is a distinct boundary, and surviving contact does not make someone its owner.', 'Essa não é a próxima lição depois de um Dive bem-sucedido. Uma Shore é um limite distinto, e sobreviver ao contato não torna alguém seu dono.'),
      ], panelTitle: t('The distinction to remember', 'A diferença para lembrar'), comparison: [
        ex('Shorefall', 'Shorefall', 'The person falls into the Shore.', 'A pessoa cai na Shore.'),
        ex('Shorewalking', 'Shorewalking', 'The person stays here and holds the contact within strict limits.', 'A pessoa fica aqui e sustenta o contato dentro de limites rígidos.'),
        ex('Continuity', 'Continuidade', 'What keeps this the same person through the change.', 'O que mantém essa pessoa sendo ela mesma através da mudança.'),
      ], plateLabel: t('A boundary, not another training rank', 'Um limite, não mais um grau de treinamento'),
    },
  ];
  return {
    eyebrow: t('Redactory, explained step by step', 'Redactory, explicado passo a passo'), title: t('The Dive', 'O Dive'),
    intro: t('How does a Redactor change the world? Start with a real example, learn what the Dive and an Anchor do, then explore depth, practice, and the risks of going too far. No codex knowledge needed.', 'Como um Redactor muda o mundo? Comece com um exemplo concreto, entenda o Dive e a Anchor e depois explore profundidade, prática e os riscos de ir longe demais. Você não precisa conhecer os codices.'),
    scrollLabel: t('Start with the basics', 'Começar pelo básico'), returnLabel: t('Return to Desk', 'Voltar à Mesa'),
    legendTitle: t('Read in order, or choose a question', 'Leia na ordem ou escolha uma pergunta'),
    sealTitle: t('The three Anchors, at a glance', 'As três Anchors, em resumo'),
    sealIntro: t('These seals record Anchor Depth. They describe where an Anchor belongs, not the practitioner’s skill or the depth of today’s Dive.', 'Estes selos registram Anchor Depth. Eles descrevem onde uma Anchor se situa, não a habilidade do praticante nem a profundidade do Dive de hoje.'),
    seals, sections,
  };
}
