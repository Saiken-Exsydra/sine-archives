import redactoryEn from '../../src/content/systems_en/redactorySystem.md?raw';
import redactoryPt from '../../src/content/systems_pt_br/redactorySystem.md?raw';
import divinationEn from '../../src/content/systems_en/divinationSystem.md?raw';
import divinationPt from '../../src/content/systems_pt_br/divinationSystem.md?raw';
import bloomEn from '../../src/content/systems_en/bloom.md?raw';
import bloomPt from '../../src/content/systems_pt_br/bloom.md?raw';
import redactoryArt from '../.generated/redactory.webp';
import divinationArt from '../.generated/divination.webp';
import bloomArt from '../.generated/bloom.webp';

export type Locale = 'en' | 'pt-br';
export type SystemId = 'redactory' | 'divination' | 'bloom';

function plain(text: string) {
  return text.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/\*\*/g, '').trim();
}

function record(raw: string) {
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '');
  const summary = raw.match(/^summary: "(.+)"\r?$/m)?.[1];
  const paragraphs = body.split(/\r?\n\s*\r?\n/).map(p => p.trim());
  if (!summary) throw new Error('System record is missing its public summary');
  return { summary, paragraphs, introduction: plain(paragraphs.find(p => p.startsWith('**')) ?? '') };
}

export function getSystems(locale: Locale) {
  const pt = locale === 'pt-br';
  return [
    { id: 'redactory' as const, number: '01', name: 'Redactory', action: pt ? 'Rotear' : 'Route', color: '#d88a7b', art: redactoryArt, ...record(pt ? redactoryPt : redactoryEn) },
    { id: 'divination' as const, number: '02', name: 'Divination', action: pt ? 'Fundir' : 'Fuse', color: '#9cabe5', art: divinationArt, ...record(pt ? divinationPt : divinationEn) },
    { id: 'bloom' as const, number: '03', name: 'Bloom', action: pt ? 'Enraizar' : 'Root', color: '#b3bd85', art: bloomArt, ...record(pt ? bloomPt : bloomEn) },
  ];
}

export function getAnchor(locale: Locale) {
  const pt = locale === 'pt-br';
  const data = record(pt ? redactoryPt : redactoryEn);
  const definition = data.paragraphs.find(p => p.startsWith(pt ? 'Todo Redactor tem' : 'Every Redactor has'));
  const measures = data.paragraphs.find(p => p.startsWith('- **Anchor Depth**'));
  const training = data.paragraphs.find(p => p.startsWith(pt ? 'O treinamento pode' : 'Training can'));
  if (!definition || !measures || !training) throw new Error('Anchor excerpt no longer matches the source record');
  return { definition: plain(definition), training: plain(training), measures: measures.split(/\r?\n/).map(line => plain(line.replace(/^- /, ''))) };
}
