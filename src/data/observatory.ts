import { localizedPath, type SiteLocale } from '../i18n/config';

/** Explanatory layer only. References point to the public editions of the controlling codices. */
export type ObservatoryImage = { src: string; alt: string; caption?: string };
export type ObservatoryMotionProfile = 'branch' | 'echo' | 'interval' | 'thread' | 'unfold' | 'horizon';
export type ObservatoryConcept = {
  id: string; label: string; summary: string; interaction: 'concept' | 'definition';
  parent?: string; children: string[]; source: string;
  image?: ObservatoryImage; related?: string[]; motionProfile?: ObservatoryMotionProfile;
};
export type ObservatorySystem = {
  id: string; title: string; summary: string; explanation: string; logo: string;
  destination: string; source: string; x: number; y: number; angle: number;
  transitionName?: string; behavior: 'routes' | 'coherence' | 'recurrence' | 'fusion' | 'roots' | 'threshold';
  concepts: ObservatoryConcept[];
  image?: ObservatoryImage; motionProfile?: ObservatoryMotionProfile;
};
export type ObservatoryRelationship = { id: string; source: string; target: string; summary: string; different: string; reference: string };

export function getObservatory(locale: SiteLocale) {
  const t = (en: string, pt: string) => locale === 'pt-br' ? pt : en;
  const path = (url: string) => localizedPath(locale, url);
  const redSource = path('/systems/redactorysystem/');
  const concept = (id: string, label: string, en: string, pt: string, children: string[] = [], parent?: string, definition = false): ObservatoryConcept =>
    ({ id, label, summary: t(en, pt), children, parent, interaction: definition ? 'definition' : 'concept', source: redSource });
  const systems: ObservatorySystem[] = [
    { image: { src: '/uploads/sys-redactory.png', alt: t('An ornate pen tracing luminous paths across an inscribed page.', 'Uma caneta ornamentada traça caminhos luminosos sobre uma página inscrita.') }, id: 'redactory', title: 'Redactory', x: 21, y: 48, angle: Math.PI, behavior: 'routes',
      logo: '/uploads/observatory-white/Redactory_symbol.png', destination: path('/systems/redactory/'), source: redSource, transitionName: 'observatory-redactory-symbol',
      summary: t('Choose a possible result. Find a route that reality can hold.', 'Escolha um resultado possível. Encontre uma rota que a realidade possa sustentar.'),
      explanation: t('A Redactor enters the Dive through their Anchor and establishes a route toward an Archive-valid result. Reach measures how far that route moves from the Anchor’s natural territory.', 'Um Redactor entra no Dive por sua Anchor e estabelece uma rota até um resultado permitido pelo Archive. Reach mede quanto essa rota se afasta do território natural da Anchor.'),
      concepts: [
        concept('dive', 'Dive', 'Every Redactory act requires Dive: recursive compression into the Page’s conceptual depth. It is an interface, not a physical place. Dive Depth describes the band reached in this act.', 'Todo ato de Redactory exige Dive: compressão recursiva na profundidade conceitual da Page. É uma interface, não um lugar físico. Dive Depth descreve a faixa alcançada neste ato.', ['anchor', 'sinking', 'drowning']),
        concept('anchor', 'Anchor', 'The Anchor is a Redactor’s most stable conceptual route into the Dive. Near it, intention or trained habit can organize a coherent result without consciously calculating every step. Anchor Depth is inherent; practice improves access and control, not its Depth class.', 'A Anchor é a rota conceitual mais estável de um Redactor para o Dive. Perto dela, intenção ou hábito treinado podem organizar um resultado coerente sem calcular conscientemente cada etapa. Anchor Depth é inerente; a prática melhora acesso e controle, não sua classe de Depth.', ['reach', 'point', 'fray']),
        concept('route', t('Route', 'Rota'), 'A route aligns local reality with a configuration the Archive permits. An instance needs continuing route support. A stable reconfiguration can remain after release when Page-native conditions carry the next moment themselves.', 'Uma rota alinha a realidade local a uma configuração permitida pelo Archive. Uma instância precisa de suporte contínuo da rota. Uma reconfiguração estável pode permanecer após a liberação quando condições nativas da Page sustentam o momento seguinte.', ['schematic', 'leaf', 'cas']),
        concept('reach', 'Reach', 'Reach is lateral distance from the Anchor into adjacent or foreign routes. It is separate from vertical Depth. Greater distance leaves less native structure to organize the result, increasing the need for preparation and control.', 'Reach é a distância lateral da Anchor até rotas adjacentes ou estrangeiras. É distinta da Depth vertical. Uma distância maior deixa menos estrutura nativa para organizar o resultado, aumentando a necessidade de preparação e controle.', ['overreach', 'schematic'], 'anchor'),
        concept('point', 'Point', 'A Point assists routing, records, warnings, credentials, and apparatus access. It does not enter the Dive or supply the capacity for Redactory.', 'Um Point auxilia rotas, registros, alertas, credenciais e acesso a aparatos. Ele não entra no Dive nem fornece a capacidade de Redactory.', [], undefined, true),
        concept('schematic', t('Schematic', 'Esquema'), 'A schematic prepares a route so it can be cheaper, safer, and more reproducible. It cannot make an impossible result lawful.', 'Um esquema prepara uma rota para torná-la mais econômica, segura e reproduzível. Não torna lícito um resultado impossível.', [], undefined, true),
        concept('leaf', 'Leaf', 'A Leaf remembers an inscribed schematic. The Redactor still performs and sustains the route.', 'Uma Leaf guarda um esquema inscrito. O Redactor continua responsável por executar e sustentar a rota.', [], undefined, true),
        concept('cas', 'CAS', 'The Common Apparatus Set is supported through Point apparatus access. Apparatus assists practice; it does not perform Redactory.', 'O Common Apparatus Set é apoiado pelo acesso a aparatos do Point. Aparatos auxiliam a prática; não executam Redactory.', [], undefined, true),
        concept('overreach', 'Overreach', 'Work beyond safe routing tolerance can misinstance, collapse, recoil, or injure the Anchor. Reach is a distance; Overreach is a failure risk.', 'Trabalho além da tolerância segura da rota pode falhar, colapsar, recuar ou ferir a Anchor. Reach é uma distância; Overreach é um risco de falha.', [], undefined, true),
        concept('sinking', 'Sinking', 'Sinking is involuntary descent caused by environmental instability. It is distinct from ordinary exhaustion and from Drowning.', 'Sinking é uma descida involuntária causada por instabilidade ambiental. É distinto de exaustão comum e de Drowning.', [], undefined, true),
        concept('drowning', 'Drowning', 'Drowning occurs when a hyper-coherent presence prevents independent ascent. It is a separate catastrophe from Sinking.', 'Drowning ocorre quando uma presença hipercoerente impede a ascensão independente. É uma catástrofe distinta de Sinking.', [], undefined, true),
        concept('fray', 'Fray', 'Failed or strained routing can fray the Anchor. Familiarity with a route does not make continued strain healthy.', 'Rotas sob tensão ou que falham podem desgastar a Anchor. Familiaridade com uma rota não torna saudável a tensão contínua.', [], undefined, true),
      ] },
    { id: 'resonance', title: 'Resonance', x: 34, y: 19, angle: -2.2, behavior: 'coherence', logo: '/uploads/observatory-white/Resonance_symbol.png', destination: path('/systems/resonance-field/'), source: path('/systems/resonance/'), transitionName: 'observatory-resonance-symbol',
      summary: t('Similar structures quietly influence one another.', 'Estruturas semelhantes influenciam umas às outras silenciosamente.'),
      explanation: t('Resonance is passive coherence pressure. Similar configurations can stabilize or destabilize one another. These gradients make directed indexing possible, but resonance itself is not an act of magic.', 'Resonance é pressão passiva de coerência. Configurações semelhantes podem estabilizar ou desestabilizar umas às outras. Esses gradientes permitem indexação dirigida, mas Resonance em si não é um ato mágico.'), concepts: [] },
    { id: 'harmonics', title: 'Harmonics', x: 69, y: 22, angle: -.8, behavior: 'recurrence', logo: '/uploads/observatory-white/Harmonics_symbol.png', destination: path('/systems/harmonics/'), source: path('/systems/resonance/'), transitionName: 'observatory-harmonics-symbol',
      summary: t('Resonance becomes readable as a pattern through Time.', 'Resonance se torna legível como um padrão através de Time.'),
      explanation: t('When resonance persists through Time, it can be read as recurrence, surge, or fade. Harmonic systems regulate that expression. A repeating disturbance is not automatically a message or a prediction.', 'Quando Resonance persiste através de Time, pode ser lida como recorrência, surto ou dissipação. Sistemas harmônicos regulam essa expressão. Uma perturbação recorrente não é automaticamente mensagem ou previsão.'), concepts: [] },
    { id: 'divination', title: 'Divination', x: 80, y: 51, angle: 0, behavior: 'fusion', logo: '/uploads/observatory-white/Divination_symbol.png', destination: path('/systems/divinationsystem/'), source: path('/systems/divinationsystem/'),
      summary: t('A fragment’s domain finds expression through a mortal vessel.', 'O domínio de um fragmento se expressa por um receptáculo mortal.'),
      explanation: t('Divination joins a compatible mortal vessel and a divine or demonic fragment through fusion. Communion sustains contact; the Diviner’s intention guides the expression of capabilities already integrated into that relationship.', 'Divination une um receptáculo mortal compatível e um fragmento divino ou demoníaco por fusão. Communion sustenta o contato; a intenção do Diviner orienta a expressão de capacidades já integradas nessa relação.'), concepts: [] },
    { id: 'bloom', title: 'Bloom', x: 68, y: 81, angle: .8, behavior: 'roots', logo: '/uploads/observatory-white/Bloom_symbol.png', destination: path('/systems/bloom/'), source: path('/systems/bloom/'),
      summary: t('Living resonance takes root in a host.', 'Resonance viva cria raízes em um hospedeiro.'),
      explanation: t('Bloom acts through symbiont and host biology: tissue, blood, nerve, memory, and growth. Its Rootline is a persistent living address, held through growth rather than a route selected by a Redactor.', 'Bloom atua pelo simbionte e pela biologia do hospedeiro: tecido, sangue, nervos, memória e crescimento. Sua Rootline é um endereço vivo persistente, mantido pelo crescimento em vez de uma rota escolhida por um Redactor.'), concepts: [] },
    { id: 'shores', title: 'Shores', x: 32, y: 80, angle: 2.3, behavior: 'threshold', logo: '/uploads/observatory-white/Shores_symbol.png', destination: path('/systems/shores/'), source: path('/systems/shores/'),
      summary: t('A threshold where deep conceptual pressure becomes place-like.', 'Um limiar onde a pressão conceitual profunda ganha aspecto espacial.'),
      explanation: t('A Shore is a Terra-local condition where deep conceptual strata meet Archive-adjacent pressure. It is spatially experienceable to recursive consciousness, not ordinary terrain or a deeper band of the Dive. Different systems approach it through different mechanisms.', 'Uma Shore é uma condição local de Terra onde estratos conceituais profundos encontram pressão adjacente ao Archive. É experimentada espacialmente pela consciência recursiva, não como terreno comum ou faixa mais profunda do Dive. Sistemas distintos se aproximam por mecanismos distintos.'), concepts: [] },
  ];
  const additions: Record<string, ObservatoryConcept[]> = {
    resonance: [
      concept('gradient', t('Gradient', 'Gradiente'), 'Partially similar configurations have a resonance gradient. Similarity, density, and informational distance shape its strength.', 'Configurações parcialmente semelhantes têm um gradiente de Resonance. Semelhança, densidade e distância informacional determinam sua intensidade.', ['thinness']),
      concept('field', t('Field', 'Campo'), 'Many similar structures reinforcing one another form a resonance field. Dense fields stabilize what belongs there and resist foreign translation pressure.', 'Muitas estruturas semelhantes que se reforçam formam um campo de Resonance. Campos densos estabilizam o que lhes pertence e resistem à pressão de tradução estrangeira.', ['thinness']),
      concept('thinness', 'Thinness', 'Thin regions offer less resistance to perturbation. They stabilize poorly and carry outside disturbance readily.', 'Regiões rarefeitas resistem menos à perturbação. Estabilizam mal e conduzem facilmente perturbações externas.', [], undefined, true),
    ],
    harmonics: [
      concept('recurrence', t('Recurrence', 'Recorrência'), 'A continuing resonance relation becomes readable under Time as rhythm, surge, or fade. Reading the pattern does not by itself establish its cause.', 'Uma relação contínua de Resonance se torna legível sob Time como ritmo, surto ou dissipação. Ler o padrão não estabelece, por si só, sua causa.', ['modulation']),
      concept('modulation', t('Modulation', 'Modulação'), 'Harmonic intervention regulates amplitude, interval, periodicity, or expression under traversal.', 'A intervenção harmônica regula amplitude, intervalo, periodicidade ou expressão durante a travessia.', [], undefined, true),
    ],
    divination: [
      concept('pathway', 'Pathway', 'Pathway names the vessel’s access to a fragment. Compatibility permits contact to stabilize; the mechanism remains fusion.', 'Pathway nomeia o acesso do receptáculo a um fragmento. Compatibilidade permite estabilizar o contato; o mecanismo continua sendo fusão.', ['communion']),
      concept('communion', 'Communion', 'Communion is active contact: the vessel sustains its relation to the domain source and bears fusion pressure. Intention guides capabilities already integrated into that relation.', 'Communion é contato ativo: o receptáculo sustenta sua relação com a fonte do domínio e suporta pressão de fusão. A intenção orienta capacidades já integradas nessa relação.', ['manifestation']),
      concept('manifestation', t('Manifestation', 'Manifestação'), 'A Manifestation deliberately expresses a capability already available through fusion. It does not require a new petition each time.', 'Uma Manifestação expressa deliberadamente uma capacidade já disponível pela fusão. Não exige uma nova petição a cada vez.', [], undefined, true),
    ],
    bloom: [
      concept('rootline', 'Rootline', 'The Rootline is a persistent root-address held through living growth. Shore-rooted strains retain an address to the ecology from which they emerged or with which they became entangled.', 'A Rootline é um endereço-raiz persistente mantido pelo crescimento vivo. Linhagens enraizadas em Shores mantêm um endereço para a ecologia de onde surgiram ou à qual se ligaram.', ['overbloom']),
      concept('overbloom', 'Overbloom', 'Overbloom occurs when growth exceeds the host’s mediation. Growth that erases the host is consumption or takeover.', 'Overbloom ocorre quando o crescimento excede a mediação do hospedeiro. Crescimento que apaga o hospedeiro é consumo ou tomada de controle.', [], undefined, true),
    ],
    shores: [
      concept('shorefall', 'Shorefall', 'Shorefall is catastrophic loss of recursive self-address through a Shore threshold. Different systems approach that threshold through their own mechanisms; falling is not mastery.', 'Shorefall é a perda catastrófica do autoendereçamento recursivo através de um limiar de Shore. Sistemas distintos se aproximam por seus próprios mecanismos; cair não é maestria.', ['continuity']),
      concept('shorewalking', 'Shorewalking', 'A Shorewalker remains Page-side while internalizing Shore pressure through body, continuity, and system interface. This rare condition grants bounded aperture authority, not ownership of the Shore.', 'Um Shorewalker permanece do lado da Page enquanto internaliza pressão da Shore pelo corpo, pela continuidade e pela interface do sistema. Essa condição rara concede autoridade de abertura limitada, não posse da Shore.', ['continuity']),
      concept('continuity', t('Continuity', 'Continuidade'), 'Continuity is what allows a structure to remain identifiable as itself across transformation. For a person, this means persistence of self-address.', 'Continuidade permite que uma estrutura permaneça identificável como ela mesma através da transformação. Para uma pessoa, significa a persistência do autoendereçamento.', [], undefined, true),
    ],
  };
  for (const system of systems) {
    if (additions[system.id]) system.concepts = additions[system.id].map(c => ({ ...c, source: system.source }));
    const profiles: Record<string, ObservatoryMotionProfile> = { redactory: 'branch', resonance: 'echo', harmonics: 'interval', divination: 'thread', bloom: 'unfold', shores: 'horizon' };
    system.motionProfile = profiles[system.id];
  }
  const relation = (source: string, target: string, en: string, pt: string, different: string, differentPt: string, reference: string): ObservatoryRelationship =>
    ({ id: `${source}-${target}`, source, target, summary: t(en, pt), different: t(different, differentPt), reference: path(reference) });
  const relationships = [
    relation('redactory', 'resonance', 'Resonance supplies the gradients and field conditions through which Redactory routes.', 'Resonance fornece os gradientes e condições de campo pelos quais Redactory estabelece rotas.', 'Redactory is directed routing. Resonance is passive mutual pressure.', 'Redactory é roteamento dirigido. Resonance é pressão mútua passiva.', '/systems/resonance/'),
    relation('resonance', 'harmonics', 'Harmonics are resonance made legible through Time.', 'Harmonics são Resonance tornada legível através de Time.', 'Resonance describes the relation; Harmonics describes its recurrence under Time.', 'Resonance descreve a relação; Harmonics descreve sua recorrência sob Time.', '/systems/harmonics/'),
    relation('resonance', 'divination', 'Resonance compatibility helps a fragment and vessel stabilize their contact.', 'Compatibilidade de Resonance ajuda fragmento e receptáculo a estabilizar seu contato.', 'The condition is resonance; the Divination mechanism is fusion.', 'A condição é Resonance; o mecanismo de Divination é fusão.', '/systems/resonance/'),
    relation('bloom', 'shores', 'Shore-rooted Bloom strains retain a root-address to their Shore ecology.', 'Linhagens de Bloom enraizadas em Shores mantêm um endereço-raiz para sua ecologia.', 'Bloom roots through biology. A Shore spatializes conceptual pressure; not every Bloom is Shorewalking.', 'Bloom cria raízes pela biologia. Uma Shore espacializa pressão conceitual; nem todo Bloom pratica Shorewalking.', '/systems/bloom/'),
    relation('redactory', 'shores', 'Extreme Dive conditions can bring a Redactor into Shore-class danger.', 'Condições extremas de Dive podem levar um Redactor a perigos de classe Shore.', 'The Dive is a compression interface. A Shore is a distinct marginal condition.', 'O Dive é uma interface de compressão. Uma Shore é uma condição marginal distinta.', '/systems/shores/'),
  ];
  return { systems, relationships, archive: {
    title: 'Archive', source: path('/cosmology/the-archive/'),
    summary: t('All possible informational configurations.', 'Todas as configurações informacionais possíveis.'),
    explanation: t('The Archive is the totality of possible information. It is not a place, a container, or another magical system. The points and lines here are a conceptual map: the systems remain distinct while acting within what the Archive permits.', 'O Archive é a totalidade da informação possível. Não é um lugar, um recipiente ou outro sistema mágico. Os pontos e linhas aqui são um mapa conceitual: os sistemas permanecem distintos enquanto atuam dentro do que o Archive permite.'),
  }, ui: { title: t('The Systems Observatory', 'Observatório dos Sistemas'), kicker: t('Systems / Conceptual atlas', 'Sistemas / Atlas conceitual'),
    subtitle: t('Distinct systems. A shared underlying reality.', 'Sistemas distintos. Uma realidade subjacente compartilhada.'),
    instruction: t('Follow a point. Discover a connection.', 'Siga um ponto. Descubra uma conexão.'),
    follow: t('Follow a point', 'Seguir um ponto'),
    followPrompt: t('Choose a system to begin tracing its concepts.', 'Escolha um sistema para começar a explorar seus conceitos.'),
    followNext: t('Follow a concept below, or trace a related system.', 'Siga um conceito abaixo ou explore um sistema relacionado.'),
    map: t('Return to the constellation', 'Voltar à constelação'), read: t('Read full entry', 'Ler registro completo'), explore: t('Open interface', 'Abrir interface'),
    relationships: t('Show relationships', 'Mostrar relações'), compare: t('Compare two systems', 'Comparar dois sistemas'), shared: t('Shared', 'Em comum'), different: t('Different', 'Diferenças'),
    close: t('Close definition', 'Fechar definição'), lineage: t('Concept lineage', 'Linhagem conceitual'), concepts: t('Follow a concept', 'Explorar um conceito'),
    destinations: t('Full archive destinations', 'Destinos completos do arquivo'), skip: t('Enter the Observatory', 'Entrar no Observatório'),
    relationPrompt: t('Select a connection to read how the systems meet.', 'Selecione uma conexão para ler como os sistemas se encontram.'),
    comparePrompt: t('Select two systems in the constellation.', 'Selecione dois sistemas na constelação.'),
  } };
}
export type ObservatoryData = ReturnType<typeof getObservatory>;

