# Brazilian Portuguese Translation Glossary

This glossary is for the Brazilian Portuguese localization pass.

Source coverage:
- `src/content`
- `public/data`
- `The Archive`

Core rule:
- The canon term stays unchanged in the final translation.
- The `PT-BR sense` field exists only to guide the translator's understanding.
- The `Gender/article` field tells the translator which agreement to use around the unchanged canon term in Brazilian Portuguese.
- Common conceptual nouns are translatable unless they are themselves listed here as protected canon terms.

Example:
- `the Anchor` -> `a Anchor`
- `an Abyssal Anchor` -> `uma Abyssal Anchor`
- `the Dive` -> `o Dive`
- `Skyphon of luminance` -> `Skyphon de luminancia`
- `Anchor of light` -> `Anchor de luz`

## Agreement Guide

| Pattern | Use |
|---|---|
| feminine singular | `a`, `uma`, `esta`, `essa`, `sua`, `alinhada`, etc. |
| masculine singular | `o`, `um`, `este`, `esse`, `seu`, `alinhado`, etc. |
| feminine plural | `as`, `umas`, `estas`, `essas`, etc. |
| masculine plural | `os`, `uns`, `estes`, `esses`, etc. |
| proper name | keep the name unchanged; only surrounding syntax is translated |
| variable by referent | agree with the person or noun being described in Portuguese |

## Translation Boundary Rule

Translate normally:
- common nouns used descriptively inside larger phrases, such as `light`, `fire`, `flame`, `atmosphere`, `heat`, `motion`, `threshold`, `memory`, `language`, `dominion`, `radiance`, `combustion`, `ignition`
- domain labels when they are not being used as a protected standalone canon term
- explanatory phrasing around a protected term

Keep unchanged:
- protected canon terms listed in this glossary
- full proper names and institutional names
- technical terms that the glossary explicitly marks as protected

Examples:
- `Skyphon of luminance` -> keep `Skyphon`, translate `luminance`
- `Anchor of light` -> keep `Anchor`, translate `light`
- `fire-domain vessel` -> translate `fire-domain`, keep `vessel`
- `Light` as a named canonical Anchor or foundational expression may stay unchanged if the source is clearly using it as a formal title-level term rather than a descriptive noun

Translator decision rule:
- If the word functions like a common concept inside the sentence, translate it.
- If the word functions like a canon label, rank, institution, artifact name, or registered proper term, keep it unchanged.

## Core Cosmology

| Canon term | PT-BR sense | Gender/article | Policy |
|---|---|---|---|
| The Archive | o Arquivo absoluto cosmologico | masculine singular | keep unchanged |
| Archive | arquivo cosmologico total | masculine singular | keep unchanged |
| Book of Humanity | Livro da Humanidade | masculine singular | keep unchanged |
| Book | Livro | masculine singular | keep unchanged |
| Chapter | Capitulo | masculine singular | keep unchanged |
| Page | Pagina | feminine singular | keep unchanged |
| Paragraph | Paragrafo | masculine singular | keep unchanged |
| Sentence | Sentenca | feminine singular | keep unchanged |
| Shelf | Estante/Prateleira cosmologica | feminine singular | keep unchanged |
| Shelf-state | estado de Shelf | masculine singular | keep unchanged |
| Primordial | Primordial | variable by referent | keep unchanged |
| Book Primordial | Primordial de Book | variable by referent | keep unchanged |
| Chapter Primordial | Primordial de Chapter | variable by referent | keep unchanged |
| Page Primordial | Primordial de Page | variable by referent | keep unchanged |
| recursive singularity | singularidade recursiva | feminine singular | translate normally unless using canon phrase verbatim |
| structural density | densidade estrutural | feminine singular | translate normally unless using canon phrase verbatim |
| Thinness | rarefacao estrutural | feminine singular | keep unchanged when used as term |
| Time | Tempo | masculine singular | keep unchanged |
| Entropy | Entropia | feminine singular | keep unchanged |
| Terra | Terra | feminine singular | keep unchanged |
| The Twilight Band | Faixa do Crepusculo | feminine singular | keep unchanged |
| Twilight Band | Faixa do Crepusculo | feminine singular | keep unchanged |
| The Central Twilight Corridor | Corredor Central do Crepusculo | masculine singular | keep unchanged |
| The Outer Band | Faixa Externa | feminine singular | keep unchanged |
| The Dark Side | Lado Escuro | masculine singular | keep unchanged |
| The Darkmargin | Margem Escura | feminine singular | keep unchanged |
| The Brightmargin | Margem Clara/Luminosa | feminine singular | keep unchanged |
| The Quiet Moon | Lua Silenciosa | feminine singular | keep unchanged |
| The Lunar Crown | Coroa Lunar | feminine singular | keep unchanged |
| The Lunar Ring | Anel Lunar | masculine singular | keep unchanged |
| the Fracture | Fratura | feminine singular | keep unchanged |
| the Intact Seal | Selo Intacto | masculine singular | keep unchanged |
| the Scar of Dominion | Cicatriz do Dominio | feminine singular | keep unchanged |
| Resonance | Ressonancia | feminine singular | keep unchanged |
| BrightCrystal | cristal luminoso estrutural | masculine singular | keep unchanged |
| Callings | Chamados/Chamamentos | masculine plural | keep unchanged |
| Stase | Estase | feminine singular | keep unchanged |
| StaSis | nome institucional de estase | feminine singular | keep unchanged |
| SiNE | nome institucional | masculine singular | keep unchanged |
| HourGlass | nome institucional | feminine singular | keep unchanged |
| CLOCKWORK | nome institucional | masculine singular | keep unchanged |
| Clepsydra | nome proprio/artefato | feminine singular | keep unchanged |
| The Clepsydra Apparatus | Aparato Clepsydra | masculine singular | keep unchanged |

## Redactory

| Canon term | PT-BR sense | Gender/article | Policy |
|---|---|---|---|
| Redactory | sistema/arte de reconfiguracao | feminine singular | keep unchanged |
| Redactor | Redator praticante da Redactory | variable by person | keep unchanged |
| Dive | mergulho liminar | masculine singular | keep unchanged |
| strata | estratos | masculine plural | keep unchanged |
| abyss | abismo | masculine singular | keep unchanged |
| Anchor | ancora conceitual | feminine singular | keep unchanged |
| Abyssal Anchor | ancora abissal | feminine singular | keep unchanged |
| Anchor depth | profundidade da Anchor | feminine singular | keep unchanged |
| Dive depth | profundidade do Dive | feminine singular | keep unchanged |
| Depth | profundidade operacional | feminine singular | keep unchanged |
| Reach | alcance/estender-se alem do seguro | masculine singular | keep unchanged |
| Overreach | excesso de alcance | masculine singular | keep unchanged |
| Collapse | colapso | masculine singular | keep unchanged |
| Instancing | instanciacao | feminine singular | keep unchanged |
| Sovereign Depth | profundidade soberana | feminine singular | keep unchanged |
| Archtype | arquitipo soberano | variable by person | keep unchanged |
| Inkless | sem inscricao identificavel | variable by person | keep unchanged |
| Nib | rank inicial | masculine singular | keep unchanged |
| Quill | rank intermediario | masculine singular | keep unchanged |
| Stylus | rank avancado | masculine singular | keep unchanged |
| Pager | agente Pager | variable by person | keep unchanged |
| Pagers | agentes Pagers | variable by group | keep unchanged |
| Page Warden | guardiao de Page | variable by person | keep unchanged |
| The Index Theorem | Teorema do Indice | masculine singular | keep unchanged |
| The Recursiveness Trap | Armadilha da Recursividade | feminine singular | keep unchanged |

## Divination

| Canon term | PT-BR sense | Gender/article | Policy |
|---|---|---|---|
| Divination | sistema de fusao divina | feminine singular | keep unchanged |
| vessel | recipiente/vessel humano | variable by person | keep unchanged |
| Divine Vessel | vessel divino | variable by person | keep unchanged |
| Indexed Vessel | vessel indexado | variable by person | keep unchanged |
| Oracle | oraculo/vidente | variable by person | keep unchanged |
| the Gift of Sight | dom da visao | masculine singular | keep unchanged |
| Covenant of the Open Eye | Pacto do Olho Aberto | masculine singular | keep unchanged |
| the Sovereign | Soberano | masculine singular | keep unchanged |
| the Unnamed | Inominado | masculine singular | keep unchanged |
| the Maker of the Veil | Criador do Veu | masculine singular | keep unchanged |
| the First Speaker | Primeiro Orador | masculine singular | keep unchanged |
| the Still Voice | Voz Imovel/Silenciosa | feminine singular | keep unchanged |
| Angels | Anjos | masculine plural | keep unchanged |
| Demons | Demonios | masculine plural | keep unchanged |
| Seraphim | Serafins | masculine plural | keep unchanged |
| Abyssarchs | entidades abissarcas | masculine plural | keep unchanged |
| Heaven | Ceu | masculine singular | keep unchanged |
| Hell | Inferno | masculine singular | keep unchanged |
| Purgatory | Purgatorio | masculine singular | keep unchanged |
| the Passageway | passagem liminar | feminine singular | keep unchanged |
| the Crowning | coroacao | feminine singular | keep unchanged |
| Beatified | beatificado | variable by person | keep unchanged |
| the Whispering | sussurro/sussurrar inicial | masculine singular | keep unchanged |
| the Tenant | inquilino/presenca residente | masculine singular | keep unchanged |
| the Wearing | desgaste/sobrevestir | masculine singular | keep unchanged |
| the Hollowed | esvaziado | variable by person | keep unchanged |
| the Consumed | consumido | variable by person | keep unchanged |
| the Naming | nomeacao ritual | feminine singular | keep unchanged |
| The Confirmation | Confirmacao | feminine singular | keep unchanged |
| The Bonding | Vinculacao/Uniao | feminine singular | keep unchanged |
| The Ordination | Ordenacao | feminine singular | keep unchanged |
| The Last Rite | Ultimo Rito | masculine singular | keep unchanged |
| The Rite of Expulsion | Rito de Expulsao | masculine singular | keep unchanged |
| Grand Expulsion | Grande Expulsao | feminine singular | keep unchanged |
| The Consecration of Place | Consagracao do Lugar | feminine singular | keep unchanged |

## Institutions, Orders, and Canonical Bodies

| Canon term | PT-BR sense | Gender/article | Policy |
|---|---|---|---|
| Church | Igreja | feminine singular | translate to `Igreja` in pt-BR prose |
| The Church | a Igreja | feminine singular | translate to `a Igreja` in pt-BR prose |
| The Apocachynthion | instituicao reguladora | masculine singular | keep unchanged |
| Empire of Synus | Imperio de Synus | masculine singular | keep unchanged |
| Imperial Redactor Academy | Academia Imperial Redactor | feminine singular | keep unchanged |
| Council of Volumes | Conselho dos Volumes | masculine singular | keep unchanged |
| Compact of Institutional Authority | Compacto de Autoridade Institucional | masculine singular | keep unchanged |
| Compact of the Two Houses | Compacto das Duas Casas | masculine singular | keep unchanged |
| First Charter of Inscription | Primeira Carta de Inscricao | feminine singular | keep unchanged |
| Fifteen Founding Houses | Quinze Casas Fundadoras | feminine plural | keep unchanged |
| Fifteen Houses | Quinze Casas | feminine plural | keep unchanged |
| the Binding | vinculacao/pacto | feminine singular | keep unchanged |
| The Field Branch | ramo de campo | feminine singular | keep unchanged |
| The Registry Branch | ramo de registro | feminine singular | keep unchanged |
| The Review Branch | ramo de revisao | feminine singular | keep unchanged |
| Obsidian | ramo Obsidian da Igreja | masculine singular | keep unchanged |
| Oracles | Oracles / oraculos de Obsidian | masculine plural | keep unchanged |
| Order of the Interior Wound | Ordem da Ferida Interior | feminine singular | keep unchanged |
| Apothecarium | arquivo/apotecario de casos | masculine singular | keep unchanged |
| Keepers of Before | Guardioes do Antes | masculine plural | keep unchanged |
| Confessor-Priests | Padres Confessores | masculine plural | keep unchanged |
| Parish Priests | Padres Paroquiais | masculine plural | keep unchanged |
| Deacons | Diaconos | masculine plural | keep unchanged |
| Arch-Deacons | Arcediagos | masculine plural | keep unchanged |
| The Diaconate Council | Conselho do Diaconato | masculine singular | keep unchanged |
| The Arch-Patriarch | Arqui-Patriarca | masculine singular | keep unchanged |
| General Council | Conselho Geral | masculine singular | keep unchanged |
| Warden | guardiao/guarda de rito | variable by person | keep unchanged |
| Senior Warden | Warden senior | variable by person | keep unchanged |
| Rector-Ascendant | Reitor Ascendente | variable by person | keep unchanged |
| Ecclesiastic Surgeon | Cirurgiao Eclesiastico | variable by person | keep unchanged |
| Desolation Event | Evento de Desolacao | masculine singular | keep unchanged |
| Protracted Containment | Contencao Prolongada | feminine singular | keep unchanged |

## Foundational Events and Restricted Terms

| Canon term | PT-BR sense | Gender/article | Policy |
|---|---|---|---|
| the Rite of Selia | Rito de Selia | masculine singular | keep unchanged |
| the Sundering of Selia | Ruptura/Cisma de Selia | masculine singular | keep unchanged |
| the First Heresy | Primeira Heresia | feminine singular | keep unchanged |
| the First Bearers | Primeiros Portadores | masculine plural | keep unchanged |
| Skyphons | nome de entidade/grupo | masculine plural | keep unchanged |
| Obscurials | nome de artefatos/entidades | masculine plural | keep unchanged |
| the Relics of Before | Reliquias de Antes | feminine plural | keep unchanged |
| the Instruments of the Intact Seal | Instrumentos do Selo Intacto | masculine plural | keep unchanged |
| the Rightly Unmade | os corretamente desfeitos | masculine plural | keep unchanged |
| War of the Threshold | (Guerra do Limiar) | feminine singular | keep unchanged |
| SOEs | sigla institucional | masculine plural | keep unchanged |
| Stase Residuals | residuos de Stase | masculine plural | keep unchanged |
| Traversal-Independent Entities | Entidades Independentes de Travessia | feminine plural | keep unchanged |

## Places and Regions

| Canon term | PT-BR sense | Gender/article | Policy |
|---|---|---|---|
| Ael'rath | nome de lugar | proper name | keep unchanged |
| Ardeatus | nome de lugar | proper name | keep unchanged |
| Aurora | nome de lugar | proper name | keep unchanged |
| The Brightmargin | nome de regiao | feminine singular | keep unchanged |
| Brightmargin | nome de regiao | proper name | keep unchanged |
| Cal'thas | nome de lugar | proper name | keep unchanged |
| The Darkmargin | nome de regiao | feminine singular | keep unchanged |
| Darkmargin | nome de regiao | proper name | keep unchanged |
| Hal'vorn | nome de lugar | proper name | keep unchanged |
| Hora'veil | nome de lugar | proper name | keep unchanged |
| Hikari | nome de lugar | proper name | keep unchanged |
| Kalt'sen | nome de lugar | proper name | keep unchanged |
| Kor'rath | nome de lugar | proper name | keep unchanged |
| Lon'drina | nome de lugar | proper name | keep unchanged |
| Lu'mia | nome de lugar | proper name | keep unchanged |
| The Mire'thian Falls | nome de lugar | feminine plural | keep unchanged |
| Mire'thian Falls | nome de lugar | proper name | keep unchanged |
| Sarn Pell | nome de lugar | proper name | keep unchanged |
| Saint Her'chell Cathedral | Catedral de Saint Her'chell | feminine singular | keep unchanged |
| Selia | nome de lugar | proper name | keep unchanged |
| The Thornwall | nome de lugar/formacao | masculine singular | keep unchanged |
| Thornwall | nome de lugar/formacao | proper name | keep unchanged |
| Ube'lius | nome de lugar | proper name | keep unchanged |
| The Vael Mouth | nome de formacao geografica | masculine singular | keep unchanged |
| Vael Mouth | nome de formacao geografica | proper name | keep unchanged |
| Vel'hara | nome de lugar | proper name | keep unchanged |
| Vrenne | nome de lugar | proper name | keep unchanged |

## Characters and Named Figures

Use person-based agreement in Portuguese:
- masculine referent: `o`, `um`, `ele`, `nascido`, `alinhado`, etc.
- feminine referent: `a`, `uma`, `ela`, `nascida`, `alinhada`, etc.
- titles like `Redactor`, `Archtype`, `Inkless`, `Beatified`, `Warden`, `Oracle` should agree with the character, not with English morphology.

| Canon term | PT-BR sense | Gender/article | Policy |
|---|---|---|---|
| Aesis | personagem | proper name | keep unchanged |
| Alma | personagem | proper name | keep unchanged |
| Ardeatus | personagem | proper name | keep unchanged |
| Ec'lesia Yalara Wonderwall | personagem | feminine referent | keep unchanged |
| E'lla Rae Wonderwall | personagem | feminine referent | keep unchanged |
| Em'manuel Kael Wonderwall | personagem | masculine referent | keep unchanged |
| Hisui Kirasagi | personagem | feminine referent | keep unchanged |
| Katherine Flarian | personagem | feminine referent | keep unchanged |
| Le'nore Voren Engelmeyer | personagem | feminine referent | keep unchanged |
| Leonard von-Engelmeyer | personagem | masculine referent | keep unchanged |
| Lumenos | personagem | proper name | keep unchanged |
| Myehnai | personagem | proper name | keep unchanged |
| Nodohs | personagem | proper name | keep unchanged |
| Oracle | personagem/titulo | variable by referent | keep unchanged |
| Rouxinol Kaise | personagem | feminine referent | keep unchanged |
| Sai'ken Ex'sydra | personagem | variable by referent | keep unchanged |
| Sciel | personagem | proper name | keep unchanged |
| Shizen | personagem | proper name | keep unchanged |
| Syr'lene | personagem | feminine referent | keep unchanged |
| Thanatos | personagem | proper name | keep unchanged |
| Vael'Theryn | personagem | proper name | keep unchanged |
| Warden | titulo de personagem | variable by referent | keep unchanged |
| Ç©leinaptus | personagem/nome com encoding inconsistente | proper name | keep unchanged |
| Öleinaptus | personagem/nome com encoding inconsistente | proper name | keep unchanged |

## Archive-Only Names Worth Preserving

| Canon term | PT-BR sense | Gender/article | Policy |
|---|---|---|---|
| Corvel Institute | instituto/pesquisa | masculine singular | keep unchanged |
| Ex'sydra | casa/linhagem/nome | proper name | keep unchanged |
| Meridian Crown | Coroa Meridiana | feminine singular | keep unchanged |
| Aldric Vonn | personagem | proper name | keep unchanged |
| Vel'kara | personagem | proper name | keep unchanged |
| Valian-2 | designacao | proper name | keep unchanged |
| Vael'Khar | nome proprio/toponimo | proper name | keep unchanged |
| Syr'lenae | variante de nome | proper name | keep unchanged |

## Priority Notes for PT-BR

- `Anchor` is feminine in pt-BR usage for this glossary. Use `a Anchor`, `uma Anchor`, `esta Anchor`, `sua Anchor`, `Anchor alinhada`, `Anchor abissal`.
- `Abyssal Anchor` is feminine. Use `a Abyssal Anchor`, `uma Abyssal Anchor`.
- `Depth` is feminine. Use `a Depth`, `profunda`, `elevada`, `baixa`.
- `Redactory` is feminine. Use `a Redactory`.
- `Divination` is feminine. Use `a Divination`.
- `Dive` is masculine. Use `o Dive`.
- `Reach`, `Overreach`, `Collapse`, `Book`, `Chapter`, `Time`, `Empire`, `Council`, `Rite`, `Gift`, `Seal`, `Ring`, `Corridor`, and `Index Theorem` should take masculine agreement in pt-BR.
- `Church`, `Resonance`, `Thinness`, `Stase`, `Crown`, `Fracture`, `Passageway`, `Confirmation`, `Bonding`, `Ordination`, `Consecration`, `Heresy`, and `Containment` should take feminine agreement in pt-BR.
- For ranks and role labels attached to people, agree with the person: `a Redactor`, `o Redactor`, `uma Oracle`, `um Oracle`, `uma Inkless`, `um Inkless`, if the sentence structure requires an article before the unchanged term.
- For place names and personal names, the name itself does not translate; only articles, prepositions, and nearby adjectives adapt to Portuguese syntax.
- If a term appears here inside a longer phrase, preserve the canon term and apply gender agreement to the Portuguese frame around it.
- Terms like `light`, `luminance`, `fire`, `flame`, `atmosphere`, `heat`, and similar conceptual nouns are translatable by default unless the source is clearly using them as a protected formal canon label.
