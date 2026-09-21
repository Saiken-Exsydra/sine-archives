# Interaction and navigation

## Reconstruct the reader's model

Before implementation, answer these questions explicitly:

- What world, instrument, archive, map, or conceptual structure does the reader believe they are manipulating?
- What state is represented now? Which state is current, visited, available, unavailable, loading, or transitional?
- Which actions are reversible, and by what exact control or browser operation?
- What does each navigation operation mean?
- What information persists across states, and what appears only in context?
- What should the reader expect before acting?
- What visible, audible, or spatial feedback confirms the result?
- How does the reader return to the exact previous state?

Name separate behaviors for browser Back, local Back, conceptual parent/Up, Home/reset, overlay dismissal, focus change, zoom, and navigation to another concept. If two behaviors intentionally share a control, document why their semantics are equivalent. Otherwise keep them separate in labels, state transitions, and code.

Model major states and transitions before building them. A short state table or diagram is often enough; include interrupted and invalid transitions when they affect implementation.

## Spatial knowledge interfaces

When position carries meaning, define how the interface represents:

- current focus and current position;
- depth and relative importance;
- parent-child relationships and cross-links;
- clusters and semantic distance;
- visited states;
- reachable neighboring states;
- persistent landmarks and orientation cues.

The spatial layer must carry information. Do not reduce a constellation, graph, map, or network to modal windows over decorative scenery. Detail panels may supplement the space, but the space itself must explain structure or relationships.

## Progressive disclosure

At the highest level, show the major systems, their strongest relationships, and enough context to invite exploration. Reveal specialized terms, mechanics, and secondary links only after the reader enters the relevant branch. Preserve orientation while depth increases: keep a landmark, breadcrumb, path, minimap, parent label, or another suitable trace of position.

Avoid rendering the complete conceptual graph merely because the data exists. Orientation comes before depth.

## Relationship semantics

Identify the meaning of every important connection. Possible types include:

- contains;
- derives from;
- enables;
- influences;
- opposes;
- interacts with;
- shares a foundation with;
- historically precedes;
- is institutionally related to.

Do not render materially different relationships as identical lines when that creates ambiguity. Distinguish them through a restrained combination of path geometry, direction, weight, rhythm, marker, label, timing, or grouping. Keep the legend and visual vocabulary legible; variation is useful only when readers can decode it.

## Images as information

For each candidate image, ask:

- What does it communicate better than text?
- Should it be illustrative or diagrammatic?
- Does it need to show a character, object, environment, mechanism, document, or abstract relationship?
- Should it remain visible as a landmark or appear only in context?
- Would animation materially improve the explanation?

Suitable treatments include contextual illustrations, technical diagrams, transparent overlays, in-world documents, apparatus cutaways, environmental art, animated explanatory diagrams, and subtle background imagery. Do not fill empty panels with decoration or turn an interface into an image gallery.

Before laying out an asset, inspect its real dimensions, aspect ratio, transparency, visual weight, focal point, and edge treatment. Compose around those properties. Avoid aggressive cropping of lore art unless the asset was made for that crop or the crop has a deliberate editorial purpose.

## Responsive spatial behavior

Define desktop, tablet, and narrow-mobile behavior separately. Do not shrink a desktop constellation until nodes and labels become unusable. Preserve the conceptual structure while changing the navigation expression: a mobile branch explorer, ordered path, focused-node carousel, or overview/detail split may be more appropriate than a miniature desktop map.

For every mode, preserve current position, parent context, reachable choices, return paths, touch targets, and readable labels.

## Readable overlays and panels

Immersive interfaces still exist to be read. Maintain sensible line lengths, adequate contrast, intentional type hierarchy, sufficient spacing, stable text during motion, and restrained transparency behind body copy. Never make lore harder to read to protect atmosphere.

## External reference research

Research only when useful, using high-quality examples from digital museums, cultural archives, scientific visualization, data journalism, experimental editorial sites, game interfaces, interactive maps, constellation interfaces, knowledge graphs, or portfolio experiences.

For each useful reference, record:

1. the problem it solves;
2. the technique worth borrowing;
3. why the technique fits this interface;
4. how to reinterpret it within SiNE rather than copy its skin.
