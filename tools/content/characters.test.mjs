import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadCharacterPublication, proseSections } from '../../src/content/character-publication.ts';

function fixture() {
  const assets = {
    'demo-hero': { profile: 'hero' },
    'demo-portrait': { profile: 'portrait' },
    'demo-symbol': { profile: 'symbol' },
  };
  const files = {};
  const dossiers = {};
  const set = (name, data) => { files[name] = JSON.stringify(data); };
  const register = (id, overrides = {}) => {
    const folder = './characters/' + id;
    set(folder + '/record.json', {
      name: id, shortName: id, summary: 'A shared summary.',
      designation: { en: 'Example', 'pt-BR': 'Exemplo' },
      hero: 'demo-hero', portrait: 'demo-portrait', overview: {}, ...overrides,
    });
    for (const section of proseSections) {
      files[`${folder}/${section}.en.md`] = 'A short passage.';
      files[`${folder}/${section}.pt-BR.md`] = 'Uma passagem curta.';
    }
  };
  set('./institutions.json', {
    'demo-house': { name: { en: 'Demo House', 'pt-BR': 'Casa Exemplo' }, category: 'house', emblem: 'demo-symbol' },
    'demo-household': { name: 'Demo household', category: 'household', parent: 'demo-house' },
  });
  set('./classifications.json', {
    systems: { bloom: { name: 'Bloom', insignia: 'demo-symbol' } },
    anchorTypes: {}, anchorDepths: {}, redactorRanks: {}, other: {},
  });
  return { files, dossiers, set, register, load: () => loadCharacterPublication(files, dossiers, assets) };
}

test('discovers and orders records independently of the featured choice', () => {
  const f = fixture();
  f.register('zulu');
  f.register('second', { featured: true, order: 20 });
  f.register('first', { order: 10 });
  f.register('alpha');
  const { characters, featuredCharacter } = f.load();
  assert.deepEqual(characters.map(({ id }) => id), ['first', 'second', 'alpha', 'zulu']);
  assert.equal(featuredCharacter.id, 'second');
  assert.equal(characters[0].affiliations, undefined);
  assert.equal(characters[0].classifications, undefined);
  assert.equal(characters[0].dossier, undefined);
});

test('resolves affiliations, insignia, structured facts and only the approved dossier language', async () => {
  const f = fixture();
  f.register('friend');
  f.register('subject', {
    featured: true, dossier: ['pt-BR'],
    overview: { birth: { imperialYear: 1557, approximate: true } },
    affiliations: [
      { institution: 'demo-house', kind: 'association' },
      { institution: 'demo-household', kind: 'service', primary: true },
    ],
    relationships: [{ character: 'friend', kind: 'family' }],
    classifications: { systems: [{ system: 'bloom', kind: 'capability' }] },
  });
  const file = './characters/subject/dossier.pt-BR.md';
  f.dossiers[file] = async () => '# Edição pública';
  f.files['./characters/subject/abilities.en.md'] = '## Example\n\nA short passage.\n\n[Bloom](#/systems/bloom)';
  const { featuredCharacter: person, institutions, insignia } = f.load();
  assert.equal(person.designation['pt-br'], 'Exemplo');
  assert.deepEqual(person.facts.birth, { imperialYear: 1557, approximate: true });
  assert.deepEqual(person.overview.map(([, value]) => value['pt-br']), ['c. AI 1557', 'Demo household']);
  assert.deepEqual(person.abilities.en[0].link, { label: 'Bloom', href: '#/systems/bloom' });
  assert.equal(person.classifications.redactory, undefined);
  assert.equal(institutions.get('demo-household').emblem, undefined);
  assert.equal(institutions.get('demo-house').emblem, 'demo-symbol');
  assert.equal(insignia.get('systems').get('bloom').insignia, 'demo-symbol');
  assert.equal(person.dossier.en, undefined);
  assert.equal(await person.dossier['pt-br'](), '# Edição pública');
  delete f.dossiers[file];
  assert.throws(f.load, /dossier.pt-BR.md: Missing declared dossier/);
});

test('rejects publication errors with the affected record or file', () => {
  const f = fixture();
  const cases = [
    [{ hero: 'missing' }, /record.json: hero must reference a published hero asset \(missing\)/],
    [{ hero: 'demo-portrait' }, /record.json: hero must reference a published hero asset/],
    [{ summary: { en: 'Missing translation' } }, /record.json: summary:/],
    [{ source: 'private-file.md' }, /record.json: Unrecognized key: "source"/],
    [{ relationships: [{ character: 'missing', kind: 'family' }] }, /record.json: Relationship must reference another published character/],
    [{ affiliations: [{ institution: 'missing', kind: 'service' }] }, /record.json: Unknown affiliation institution/],
    [{ affiliations: [ { institution: 'demo-house', kind: 'membership', primary: true },
      { institution: 'demo-household', kind: 'service', primary: true } ] }, /record.json: Select at most one primary affiliation/],
    [{ classifications: { redactory: { anchor: { depth: 'bloom' } } } }, /record.json: Unknown anchorDepths classification/],
  ];
  for (const [overrides, error] of cases) {
    f.register('subject', { featured: true, ...overrides });
    assert.throws(f.load, error);
  }
  f.register('subject', { featured: true });
  f.dossiers['./characters/subject/dossier.en.md'] = async () => 'Unlisted';
  assert.throws(f.load, /dossier.en.md: List the approved dossier language/);
  delete f.dossiers['./characters/subject/dossier.en.md'];
  f.files['./characters/subject/abilities.en.md'] += '\n\n[Unknown](#/systems/unknown)';
  assert.throws(f.load, /abilities.en.md: Place one link to a published system/);
  delete f.files['./characters/subject/abilities.pt-BR.md'];
  f.files['./characters/subject/abilities.en.md'] = 'A short passage.';
  assert.throws(f.load, /abilities.pt-BR.md: Missing or empty prose/);
  f.register('subject', { featured: true });
  f.set('./institutions.json', { house: { name: 'Demo', category: 'house', emblem: 'missing' } });
  assert.throws(f.load, /institutions.json: house.emblem must reference a published symbol/);
});
