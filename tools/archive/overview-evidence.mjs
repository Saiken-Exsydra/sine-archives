// These labels index passages for editorial reading. A match is never a publication decision.
const fields = {
  name: /^(?:full|current|birth|formal|former|ardeatan formal) name$|^name$|^alias(?:es)?$|epithet/i,
  age: /^(?:(?:current|chronological|apparent|lived|subjective|manifested) )?age(?: in imperial year \d+)?$|^(?:lived years|years of wakefulness)$/i,
  birth: /^(?:approximate )?(?:year of birth|date of birth|birth year|creation)$|^creator$/i,
  birthplace: /^(?:(?:registered|actual|civil) )?birthplace$|^(?:origin|program origin)$/i,
  height: /height$/i,
  residence: /residence|location|^usual habitat$/i,
  nationality: /^(?:nationality|citizenship|nation of origin|civil status)$/i,
  occupation: /occupation|profession|position|formal public role|ecclesiastical style/i,
  affiliation: /affiliation|^house(?: status| standing)?$|^branch status$|lineage|^family status$|^public identity$/i,
  capability: /anchor|^(?:rank|open mark|mark|reach|restrictions|registry status|type|principle|core ability|state)$|classification|divine status|alignment|manifestation|inheritance|authority|expression|^domain$|^current state$|divination status|redactory (?:status|standing)/i,
};

const prose = {
  name: /\b(?:full name|born under the name|known publicly as|formal name)\b/i,
  age: /\blunar years\b.{0,50}\b(?:old|as of|of wakefulness|of age)\b|\bage (?:is undefined|of \d+)\b/i,
  birth: /\b(?:born|created|came into existence) (?:around |c\. |in )?(?:imperial year|year) \d+/i,
  birthplace: /\b(?:was born in|was created in|registered birthplace|geographic origin|individual provenance)\b/i,
  height: /\b\d+(?:[.,]\d+)?\s*(?:cm|centimet(?:er|re)s?)\b/i,
  residence: /\b(?:resides|lives|dwells) in\b|\bno fixed (?:residence|address)\b/i,
  nationality: /\b(?:holds|retains|held|dual)\b.{0,35}\bcitizenship\b|\b(?:synesian|auroran|ardeatan|hikari) (?:citizen|national)\b/i,
  occupation: /\b(?:works as|employed as|serves as|retired as|practice as)\b/i,
  affiliation: /\b(?:house seat|member of house|cadet branch|by blood|adopted into)\b/i,
  capability: /\b(?:classified as|registry records|confirmed anchor|vessel of|bloom[- ]bearer|crownborn elemental|continuity-sensitive|public designation)\b/i,
};

function plain(text) {
  return text.trim().replace(/^[*_`]+|[*_`]+$/g, '').trim();
}

function labeled(line) {
  if (/^\s*\|/.test(line)) {
    const [, label, value] = line.split(/(?<!\\)\|/);
    if (label && value) return [plain(label), plain(value)];
  }
  const attribute = /^\s*(?:[-+]\s+)?\*{0,2}([^:*|]{1,80}?)\*{0,2}:\*{0,2}\s+(\S.*)$/.exec(line)
    ?? /^\s*([^|]{1,80}?)\s{2,}(\S.*)$/.exec(line);
  if (attribute) return [plain(attribute[1]), plain(attribute[2])];
  // Some dossiers use unadorned, space-delimited headings such as "Creator The All-Mother".
  const compact = /^\s*((?:Chronological Age|Lived Years|Usual Habitat|Primary Authority|Supreme Expression|Classification|Creation|Creator|Height|Domain|Status))\s+(\S.*)$/.exec(line);
  return compact?.slice(1);
}

function indication(label, value) {
  if (/\b(?:actual|private|sealed|program origin|internal designation)\b/i.test(label)) return 'restricted-candidate';
  if (/^(?:none|not applicable|non[- ]applicable)[.!]?$/i.test(value)) return 'inapplicable-candidate';
  if (/^undefined[.!]?$/i.test(value)) return 'intentionally-unspecified';
  if (/\b(?:unassessed|review pending|disputed)\b/i.test(value)) return 'in-world-uncertainty';
}

export function overviewEvidence(dossier) {
  const index = Object.fromEntries(Object.keys(fields).map(field => [field, { labeled: [], prose: [] }]));
  let section = '';
  for (const [number, line] of dossier.split(/\r?\n/).entries()) {
    const heading = /^#{1,6}\s+(.+)$/.exec(line);
    if (heading) {
      section = heading[1];
      continue;
    }
    const entry = labeled(line);
    const matched = entry && Object.keys(fields).filter(field => fields[field].test(entry[0]));
    const location = { line: number + 1, section };
    if (matched?.length) {
      const [label, value] = entry;
      if (matched.includes('birth') && /\b(?:age|lunar years? as of)\b/i.test(value)) matched.push('age');
      for (const field of matched) index[field].labeled.push({ ...location, label, value, indication: indication(label, value) });
    } else if (!line.trimStart().startsWith('|')) {
      for (const [field, pattern] of Object.entries(prose)) {
        if (index[field].prose.length < 8 && pattern.test(line)) index[field].prose.push({ ...location, text: line.trim() });
      }
    }
  }
  for (const hits of Object.values(index)) {
    hits.needsReading = hits.labeled.length === 0;
  }
  return index;
}
