import type { SiteLocale } from "../i18n/config";

export type TheoryCard = {
  title: string;
  text: string;
  label?: string;
};

const english = {
  pageTitle: "The Index Theorem - SiNE Archives",
  hero: {
    eyebrow: "APOCACHYNTHION THEORY",
    title: "The Index Theorem",
    subtitle: "The best known explanation for why Redactory works.",
    intro: [
      "The Index Theorem is the Apocachynthion's cleanest answer to an impossible question: when a Redactor changes the world, what are they actually doing?",
      "The short version is simple. A Redactor does not create a new reality. They find a possible version that already belongs to the Archive, then make the local world follow that version for a while.",
    ],
    note: "A theory, not omniscience. The Apocachynthion knows more than most institutions. It does not know everything.",
    startAction: "Start with Indexing",
    diveAction: "Enter the Dive",
  },
  index: {
    eyebrow: "THE INDEX",
    title: "An Address for Something Possible",
    copy: [
      "To index something is to find its address.",
      "Not a street address. Not a place on a map. An address in possibility.",
      "If the Archive contains every version of what can exist, indexing is the act of pointing clearly enough at one version for reality to answer.",
      "A normal person can imagine a flame. A Redactor with the right Anchor can find the address of flame beginning, then make the local world follow that address.",
    ],
    cards: [
      { title: "Imagine", text: "A thought passes through you. It is broad, private, and easy to lose." },
      { title: "Index", text: "The thought finds a real address among the things the world can become." },
      { title: "Redact", text: "The world briefly follows that address here." },
    ] satisfies TheoryCard[],
    note: "Imagination is a sketch. Redactory is a trained hand finding one exact line and making the world answer it.",
  },
  theorem: {
    eyebrow: "THE SIMPLE FORM",
    title: "Redactory Selects. It Does Not Create.",
    statement: "Redactory is the art of making reality choose one valid possibility over another.",
    copy: [
      "A Redactor does not pull something out of nothing.",
      "They do not write brand-new rules into the world.",
      "They lean on one possible version of the world until it becomes the version happening here.",
      "Think of reality as a locked library shelf. Most people can only read the page already open in front of them. A Redactor can find another page that belongs to the same book and force the world to read from it for a moment.",
    ],
    note: "The page must belong to the book. If a possibility does not fit the world at all, Redactory cannot make it real.",
  },
  conservation: {
    eyebrow: "CONSERVATION",
    title: "Nothing Comes From Nothing",
    copy: [
      "This is the part the Apocachynthion cares about most.",
      "Redactory may look like creation. A blade appears. A wound closes. A flame begins where there was only wet wood.",
      "According to the Index Theorem, nothing new has been invented. The Redactor has forced a possible arrangement to appear locally.",
    ],
    cards: [
      {
        title: "A Blade Appears",
        label: "Visible effect",
        text: "A weapon manifests in the Redactor's hand. The theory says they are holding a temporary valid object in place. Stop supporting it, and it collapses.",
      },
      {
        title: "A Wound Closes",
        label: "Stable change",
        text: "Torn tissue repairs. The body is guided into a version it could lawfully become: closed, connected, and alive. Once stable, the body continues on its own.",
      },
    ] satisfies TheoryCard[],
  },
  routing: {
    eyebrow: "THE BOUNDARY",
    title: "Redactory Changes the Route, Not the Road",
    copy: [
      "This is the line between Redactors and things far above them.",
      "A Redactor cannot rewrite the deep rules of reality. They cannot decide that fire no longer burns, death no longer ends, or gravity has become a suggestion.",
      "They can redirect what the local world expresses, and only toward something the world can already contain.",
      "They are not changing the alphabet. They are choosing a different sentence that can be written with the same letters.",
    ],
    comparisons: [
      { title: "Creation", text: "Making something from nothing.", label: "Redactory does not do this." },
      { title: "True Rewrite", text: "Changing the rules themselves.", label: "Redactory does not do this." },
      { title: "Routing", text: "Making one valid possibility happen here.", label: "This is Redactory." },
    ] satisfies TheoryCard[],
  },
  anchor: {
    eyebrow: "ANCHOR",
    title: "A Redactor Needs a Handle",
    copy: [
      "The Archive is too vast to reach directly.",
      "An Anchor gives the Redactor a handle. It narrows the impossible ocean into one route the mind can survive touching.",
      "This is why Redactors do not simply do anything. Their Anchor gives them access, but it also gives their work a shape.",
    ],
    cards: [
      { title: "Ignition", text: "A handle into the beginning of flame." },
      { title: "Refraction", text: "A handle into the bending of light." },
      { title: "Signal", text: "A handle into messages crossing distance." },
      { title: "Cellular Repair", text: "A handle into living tissue closing itself." },
    ] satisfies TheoryCard[],
  },
  dive: {
    eyebrow: "THE DIVE",
    title: "The Doorway Opens Inward",
    copy: [
      "The Index Theorem says the Redactor needs more than desire.",
      "They must enter the Dive: the inward state where the Anchor can be reached clearly enough to work.",
      "Outside the Dive, the idea is too blurry. Inside the Dive, the route sharpens.",
      "Trying to Redact without the Dive is like trying to thread a needle in a storm.",
    ],
    cards: [
      { title: "Outside", text: "Wanting, imagining, guessing." },
      { title: "Inside", text: "Finding, narrowing, touching the route." },
      { title: "Return", text: "The chosen possibility appears in the world." },
    ] satisfies TheoryCard[],
    action: "Enter the Dive",
  },
  explains: {
    eyebrow: "WHAT IT EXPLAINS",
    title: "Why Redactory Has Shape",
    copy: [
      "The Index Theorem explains why Redactory is powerful but not unlimited.",
    ],
    cards: [
      { title: "Why Redactors need Anchors", text: "The mind needs a stable handle." },
      { title: "Why deeper work is harder", text: "The route reaches closer to the roots of the idea, where the world resists more strongly." },
      { title: "Why some effects collapse", text: "Some possibilities need constant support to stay here." },
      { title: "Why some changes remain", text: "Once a lawful change becomes stable, the world can continue it without the Redactor." },
      { title: "Why training matters", text: "Better training means cleaner routes and fewer mistakes." },
      { title: "Why Redactors differ", text: "Each mind reaches the Archive through its own shape." },
    ] satisfies TheoryCard[],
  },
  limits: {
    eyebrow: "LIMITS",
    title: "The Theory Has Edges",
    copy: [
      "The Index Theorem is powerful. It is not complete.",
      "Some phenomena do not fit neatly inside it. Divination, Bloom conditions, Shore-contact, ancient Instruments, Callings, and certain cosmic anomalies may touch similar language, but they are not simply Redactory.",
      "The theory describes what Redactors do with unusual precision. It does not fully explain why the Archive can be reached, why Anchors take the shapes they do, or why other kinds of power appear near related deep-access architecture.",
      "The Apocachynthion knows this. A good theory explains much. A dangerous theory pretends to explain everything.",
    ],
    note: "Do not use the Index Theorem as a universal answer. It is the best theory for Redactory, not the skeleton key for the whole world.",
  },
  summary: {
    eyebrow: "SUMMARY",
    title: "The Four Lines",
    lines: [
      "The Archive contains what can be.",
      "Indexing finds an address inside what can be.",
      "An Anchor gives the Redactor a survivable route to that address.",
      "Redactory makes the local world follow that route for a time.",
    ],
    copy: "That is the Index Theorem in its gentlest form. The papers on the desk are only the doorway. The Dive is where the theory becomes dangerous.",
    redactorAction: "Meet the Redactor",
    diveAction: "Enter the Dive",
    deskAction: "Return to the Desk",
  },
};

export type IndexTheoremContent = typeof english;

export function getIndexTheoremContent(_locale: SiteLocale): IndexTheoremContent {
  return english;
}
