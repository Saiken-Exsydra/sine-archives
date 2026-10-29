import { useState } from "react";
import type { SiteLocale } from "../../../i18n/config";
import "./ArchiveRecord.css";

const copy = {
  en: {
    eyebrow: "SiNE Archives · Interface study", title: "Archive record", notice: "Non-canonical sample data for visual evaluation.",
    record: "Record", reference: "LAB / 001", category: "Category", categoryValue: "Interface fixture", status: "Status", statusValue: "Experimental",
    controls: "Reading controls", overview: "Overview", notes: "Review notes", compact: "Compact spacing",
    overviewTitle: "A quiet place to read", overviewText: "An isolated record panel for examining hierarchy, spacing and reading comfort within the archive’s existing visual language.",
    notesTitle: "Inspect the reading states", notesText: "Switch views, use the keyboard and narrow the window. The metadata and reading panel should remain clear at every size.",
    detail: "Show evaluation checklist", checklist: ["Typography and contrast", "Metadata alignment and spacing", "Focus, selected and expanded states"],
    footer: "Local interface experiment · No archive content is edited", returnLabel: "Return to the archive",
  },
  "pt-br": {
    eyebrow: "SiNE Archives · Estudo de interface", title: "Registro do arquivo", notice: "Dados de exemplo não canônicos para avaliação visual.",
    record: "Registro", reference: "LAB / 001", category: "Categoria", categoryValue: "Modelo de interface", status: "Estado", statusValue: "Experimental",
    controls: "Controles de leitura", overview: "Visão geral", notes: "Notas de revisão", compact: "Espaçamento compacto",
    overviewTitle: "Um espaço tranquilo para ler", overviewText: "Um painel de registro isolado para examinar hierarquia, espaçamento e conforto de leitura com a linguagem visual existente do arquivo.",
    notesTitle: "Inspecione os estados de leitura", notesText: "Alterne as visualizações, use o teclado e reduza a janela. Os metadados e o painel de leitura devem permanecer claros em todos os tamanhos.",
    detail: "Mostrar lista de avaliação", checklist: ["Tipografia e contraste", "Alinhamento e espaçamento dos metadados", "Estados de foco, seleção e expansão"],
    footer: "Experimento local de interface · Nenhum conteúdo do arquivo é editado", returnLabel: "Voltar ao arquivo",
  },
};

export default function ArchiveRecord({ locale = "en" }: { locale?: SiteLocale }) {
  const text = copy[locale];
  const [view, setView] = useState<"overview" | "notes">("overview");
  const [compact, setCompact] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="onlook-record" data-compact={compact} aria-labelledby="lab-title">
      <header className="onlook-record__header">
        <p className="onlook-record__eyebrow">{text.eyebrow}</p>
        <h1 id="lab-title">{text.title}</h1>
        <p className="onlook-record__notice">{text.notice}</p>
      </header>
      <div className="onlook-record__grid">
        <aside className="onlook-record__metadata" aria-label={text.record}>
          <dl>
            <div><dt>{text.record}</dt><dd>{text.reference}</dd></div>
            <div><dt>{text.category}</dt><dd>{text.categoryValue}</dd></div>
            <div><dt>{text.status}</dt><dd className="onlook-record__status">{text.statusValue}</dd></div>
          </dl>
        </aside>
        <div className="onlook-record__reading">
          <div className="onlook-record__controls" role="group" aria-label={text.controls}>
            <button type="button" aria-pressed={view === "overview"} onClick={() => setView("overview")}>{text.overview}</button>
            <button type="button" aria-pressed={view === "notes"} onClick={() => setView("notes")}>{text.notes}</button>
            <label className="onlook-record__density">
              <input type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} />{text.compact}
            </label>
          </div>
          <section className="onlook-record__panel" aria-live="polite" aria-atomic="true">
            <p className="onlook-record__number" aria-hidden="true">{view === "overview" ? "01" : "02"}</p>
            <h2>{view === "overview" ? text.overviewTitle : text.notesTitle}</h2>
            <p>{view === "overview" ? text.overviewText : text.notesText}</p>
          </section>
          <button type="button" className="onlook-record__disclosure" aria-expanded={expanded} aria-controls="lab-checklist" onClick={() => setExpanded(!expanded)}>
            <span aria-hidden="true">{expanded ? "−" : "+"}</span> {text.detail}
          </button>
          <ul id="lab-checklist" className="onlook-record__checklist" hidden={!expanded}>
            {text.checklist.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
      <footer className="onlook-record__footer">
        <p>{text.footer}</p>
        <a href={locale === "en" ? "/" : "/pt-br/"}>{text.returnLabel} <span aria-hidden="true">↗</span></a>
      </footer>
    </article>
  );
}
