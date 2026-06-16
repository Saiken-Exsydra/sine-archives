import type { SiteLocale } from "../i18n/config";

export type ProfileCard = {
  title: string;
  text: string;
  label?: string;
  details?: Array<{ label: string; text: string }>;
};

const english = {
  pageTitle: "The Redactor - SiNE Archives",
  hero: {
    eyebrow: "REDACTORY PROFILE",
    title: "The Redactor",
    subtitle: "A Redactor is not someone who breaks reality. They are someone reality briefly listens to.",
    intro: "Most people live inside the world as it is. A Redactor is born with a rare inner fault-line: under the right pressure, their mind can reach for another possible version of what is already there and make the world follow it for a moment.",
    anchorAction: "Study the Anchor",
    diveAction: "Enter the Dive",
  },
  rarity: {
    eyebrow: "RARITY",
    title: "One in One Hundred Thousand",
    copy: [
      "A Redactor is rare enough that most people will never knowingly meet one.",
      "Some are born into old Redactor families. Some appear in ordinary families with no warning at all. The common explanation is mutation, but even the best institutions treat that word carefully. It explains the body. It does not fully explain the moment the world answers back.",
    ],
    stat: "1 / 100,000",
    statLabel: "estimated manifestation rate",
    cards: [
      { title: "Chance", text: "A child with no known lineage manifests unexpectedly." },
      { title: "Lineage", text: "Ability can run in families, but bloodline is a door left unlocked, not a promise." },
      { title: "Catalyst", text: "Fear, injury, thin places, or disaster can reveal what was already there." },
      { title: "Dormancy", text: "Some carry the route for years before anything finally answers." },
    ] satisfies ProfileCard[],
  },
  manifestation: {
    eyebrow: "MANIFESTATION",
    title: "The First Sign Is Usually Small",
    copy: [
      "Most first Redactions are not grand miracles.",
      "A candle catches when it should not. A falling cup slows for half a breath. A wound closes wrong, then right. A pane of glass bends an image before it cracks.",
      "The first sign is often mistaken for luck, panic, fever, or memory lying to itself. Only later does a pattern begin to show.",
    ],
    cards: [
      { title: "Accident", text: "Something impossible happens before the person knows how or why." },
      { title: "Pattern", text: "The same kind of impossibility begins to repeat." },
      { title: "Assessment", text: "Someone trained recognizes that the event has a shape." },
      { title: "Training", text: "The new Redactor learns how to return safely and stop on purpose." },
    ] satisfies ProfileCard[],
  },
  anchor: {
    eyebrow: "ANCHOR",
    title: "The Handle, Not the Power",
    copy: [
      "An Anchor is the Redactor's handle.",
      "Not the whole power. Not the final result. The handle.",
      "A person with an Ignition Anchor is not simply a fire mage. Their safest doorway is the moment something becomes able to burn.",
      "A person with a Refraction Anchor is not simply a light mage. Their doorway is the bend: the moment light changes direction through something else.",
    ],
    cards: [
      {
        title: "Ignition",
        text: "The first yes of flame.",
        details: [
          { label: "What others see", text: "A flame starts." },
          { label: "What the Redactor feels", text: "A door opening at the edge of heat." },
          { label: "What the Anchor touches", text: "The moment before burning becomes true." },
        ],
      },
      {
        title: "Refraction",
        text: "Light changing direction.",
        details: [
          { label: "What others see", text: "An image bends or straightens." },
          { label: "What the Redactor feels", text: "A path turning inside glass, water, or air." },
          { label: "What the Anchor touches", text: "The instant light changes course through a medium." },
        ],
      },
      {
        title: "Signal",
        text: "A message crossing a medium.",
        details: [
          { label: "What others see", text: "A broken transmission clears." },
          { label: "What the Redactor feels", text: "A route connecting sender and receiver." },
          { label: "What the Anchor touches", text: "The passage that lets information arrive." },
        ],
      },
      {
        title: "Cellular Repair",
        text: "Flesh remembering how to close.",
        details: [
          { label: "What others see", text: "Damaged tissue begins to mend." },
          { label: "What the Redactor feels", text: "Living structure finding its way back." },
          { label: "What the Anchor touches", text: "The body's possible route toward repair." },
        ],
      },
    ] satisfies ProfileCard[],
  },
  discovery: {
    eyebrow: "DISCOVERY",
    title: "Learning the Shape of Yourself",
    copy: [
      "Finding an Anchor is less like choosing a school of magic and more like discovering the one instrument your hands already know how to play.",
      "Training does not give a Redactor their Anchor. Training helps them name it.",
      "Some Anchors are obvious within days. Others take years. Some refuse every neat label the Academy tries to place on them.",
    ],
    cards: [
      { title: "Incident", text: "Something impossible happens." },
      { title: "Repetition", text: "The impossible thing has a pattern." },
      { title: "Naming", text: "Assessors try to describe the route." },
      { title: "Practice", text: "The Redactor learns what is safe, difficult, and not ready to be touched." },
    ] satisfies ProfileCard[],
  },
  dive: {
    eyebrow: "THE DIVE",
    title: "Every Redactor Falls Differently",
    copy: [
      "The Dive is the inner descent a Redactor enters before Redaction becomes possible.",
      "But it does not look the same for everyone.",
      "One Redactor may see corridors. Another may hear music. Another may feel pressure in the bones. Another may read the world as numbers, diagrams, or written lines. Another may see nothing at all and simply know where the route is.",
      "The Dive borrows the language the person already carries inside them.",
    ],
    cards: [
      { title: "The Architect", text: "Rooms, doors, angles, and hidden floors." },
      { title: "The Musician", text: "Pitch, rhythm, dissonance, and resolution." },
      { title: "The Mathematician", text: "Lines, functions, values, and trajectories." },
      { title: "The Hunter", text: "Scent, distance, timing, and instinct." },
      { title: "The Devout", text: "Prayer, chapel-light, silence, or judgment." },
      { title: "The Wounded", text: "The place the mind first broke open." },
    ] satisfies ProfileCard[],
    note: "These are examples, not classes. The Dive belongs to the person, not to a registry.",
  },
  training: {
    eyebrow: "TRAINING",
    title: "Power Is Not Mastery",
    copy: [
      "A newly discovered Redactor is not a master. They are a person standing beside a dangerous door.",
      "Training teaches them how to enter the Dive, how to return from it, how to recognize their limits, and how to avoid reaching outside their Anchor before they understand the cost.",
    ],
    cards: [
      { title: "Newly Found", label: "Nib", text: "They can do something real, but not safely or reliably." },
      { title: "In Training", label: "Nib", text: "They learn their Anchor, their limits, and how to stop." },
      { title: "Practitioner", label: "Quill", text: "They can work alone within permitted bounds." },
      { title: "Master", label: "Stylus", text: "They know their Anchor so well that the work becomes almost second nature." },
    ] satisfies ProfileCard[],
  },
  danger: {
    eyebrow: "COST",
    title: "The World Answers, But It Does Not Kneel",
    copy: [
      "A Redactor can do extraordinary things, but every act has a limit.",
      "The deeper they go, the harder it is to return cleanly. The farther they reach from their Anchor, the more unstable the work becomes. The more they force, the more the body and mind have to pay.",
      "Redactory is not wish-making. It is a negotiation with a door that can close on your hand.",
    ],
    cards: [
      { title: "Too Deep", text: "The Redactor loses the path back." },
      { title: "Too Far", text: "They reach beyond their Anchor and the work turns unstable." },
      { title: "Too Long", text: "The body cannot carry the strain forever." },
      { title: "Too Much", text: "They force more than the mind can route cleanly." },
    ] satisfies ProfileCard[],
  },
  close: {
    eyebrow: "NEXT",
    title: "The Person, the Anchor, the Descent",
    copy: "A Redactor begins as a person with a hidden route inside them. The Anchor is the handle. The Dive is the descent. The work is what happens when they return with something the world can briefly become.",
    diveAction: "Enter the Dive",
    deskAction: "Return to the Desk",
  },
};

export function getRedactorProfileContent(_locale: SiteLocale) {
  return english;
}
