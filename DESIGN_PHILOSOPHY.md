# SiNE — Imperial Obsidian

Imperial Obsidian governs the visual and interaction language of the SiNE Archives React reconstruction. Apply it to new work and to existing components as they come into scope. Individual implementation changes follow author-directed tasks.

## Institutional character

The archive should feel like an exceptionally sophisticated institution in an advanced civilization. Architectural precision, disciplined typography, and carefully finished materials convey authority, intellectual sophistication, and quiet grandeur. The interface should feel physically constructed, with the understated luxury of a finely made optical instrument. Its technology should be apparent in the precision of its behavior. Avoid the visual conventions of gaming interfaces, cyberpunk terminals, generic science-fiction dashboards, consumer apps, and commercial SaaS.

## Identity and color

| Role | Governing reference |
| --- | --- |
| SiNE corporate identity | The approved `SiNE-Principal-Logo.svg` and `SiNE-Circular-Emblem.svg` establish the corporate marks and their optical gradients. Use the approved runtime copies in `src/art/`. |
| Imperial Obsidian interface | Use the dark architectural field and the optical materials described below. See the [React palette inventory and current digital roles](README.md#archive-index-and-visual-identity) for values and assignments already in use. |
| Wonderwall Pearl Spectrum | Use approved tones and restrained iridescence for optical accents. The House specifications govern its palette, quill, and other House motifs. |
| Subject and institution colors | Use the relevant identity specification where one exists. Keep contextual color cues local to their subject and preserve original artwork colors. |

The logo masters and the [Design Systems index](<../SiNE Archives REPO/The Archive/Artworks/Design Systems/README.md>) are in the sibling checkout under `The Archive/Artworks/Design Systems/`. Consult the corporate masters and the Wonderwall [structured specification](<../SiNE Archives REPO/The Archive/Artworks/Design Systems/House Wonderwall/Wonderwall.json>), [CSS palette](<../SiNE Archives REPO/The Archive/Artworks/Design Systems/House Wonderwall/Wonderwall.css>), and [design brief](<../SiNE Archives REPO/The Archive/Artworks/Design Systems/House Wonderwall/Wonderwall.txt>) before adding or changing color tokens. Reuse an approved color when it meets the need. Pearl accents should support SiNE's identity and remain selective even where the two palettes share tones.

## Geometry

**Every interface component has sharp, 90-degree corners. The design system uses zero border radius.** Apply this to buttons, navigation, language selectors, cards, search fields, dropdowns, dialogs, tooltips, sidebars, tabs, document containers, notifications, scrollbars, and other interactive controls. Preserve this geometry across all states, including focus and press.

Reserve circular geometry for intrinsically circular content or functions such as an official emblem, astronomical object, scientific visualization, or an instrument that requires it. A circular emblem can sit inside a square-cornered panel. Rounded rectangles, pills, capsules, and decorative hybrids of circular and rectilinear geometry are outside the interface language.

## Optical materials

Treat the interface as precision-cut glass set into an architectural structure. Edges, diffusion, and internal shading should make a surface feel like it has thickness. Use translucency where it adds depth and keep text and controls legible over the backing surface.

| Material | Character | Typical use |
| --- | --- | --- |
| **Obsidian Glass** | Nearly black, with low transparency, quiet reflections, polished edges, and strong contrast. | Navigation, document containers, reading surfaces, and primary architectural panels. |
| **Smoked Crystal** | Controlled translucency and background diffusion, with fine edge illumination and responsive reflections. | Buttons, menus, search surfaces, interactive panels, and information windows. |
| **Pearlescent Crystal** | Restrained iridescence and subtle chromatic dispersion. Light should travel across the edge in approved tones. | Selected states, important interactions, and exceptional highlights. |

Use microscopic grain or subtle procedural noise, directional reflections, internal glass shading, delicate gradients, and controlled shadows as needed. Texture should register through the surface's depth and finish. Keep grain, reflections, blur, and glow below the point where they compete with the archive's content. Favor the finish of polished optical glass and keep neon illumination out of the material treatment.

## Tactile interaction

| State | Surface behavior |
| --- | --- |
| **Resting** | A composed, stable surface with subdued reflections and a polished edge. |
| **Hover** | A localized reflection may follow the pointer across the surface, with a subtle edge response. The effect should read as moving light on glass. |
| **Pressed** | Suggest pressure through a small change in depth, internal reflection, or localized refraction. Distortion, compression, or chromatic dispersion may reinforce the response while the outline stays sharp. |
| **Released** | Return smoothly to equilibrium. Avoid bounce, overshoot, and rubbery motion. |
| **Keyboard focus and selected** | Keep focus and selection clearly distinguishable, including when both apply. Use a visible focus indicator and cues that work without pointer tracking or optical effects. |

Give touch users clear activation feedback without relying on hover. Keep essential state changes understandable when optional effects are disabled.

## Motion

Use fluid, restrained motion to communicate hierarchy, continuity, or the response of a surface. Let transitions settle deliberately and keep reading surfaces stable. Avoid constant pulsing, excessive parallax, aggressive scaling, and decorative movement that interrupts reading. Provide a reduced-motion path that preserves state and navigation cues.

Use the scale and weight of a surface to choose its timing. Input and navigation should respond immediately.

In Obsidian Awakening, the first interaction sends one broad ripple from beneath the centered Circular Emblem to the farthest corner of the landing viewport. A soft highlight catches one face of the crest and a shadow defines the other. The wave should be easy to follow across the dark glass. As it passes, the emblem rises, ARCHIVES appears, and the surrounding interface settles into place. The [motion architecture](MOTION_ARCHITECTURE.md) documents the timing and both rendering paths.

## Typography and information

Compose pages like an institutional publication. Use a clear hierarchy, legible reading type, refined display type, disciplined alignment, generous negative space, fine dividers, and consistently placed metadata. Choose layouts that fit the structure of the records, especially where dense or connected information would lose clarity in oversized cards. The archive's content should command the reader's attention.

## Examining an individual

Keep the fullscreen illustration stationary. Set the primary institution and its relationship above the vertical navigation at the left. Give the category, name, designation, divider and section content one leading edge. The entire information territory extends inward from a stable right boundary. The open space between them belongs to the illustration. The published crop and focal point belong to the character record.

On a phone, place the section choices within thumb reach above the Registry threshold. Let the primary affiliation travel with the Overview facts and give prose its own native scroll. Institutional marks identify an organization. Classification inscriptions pair the published concept with a precise label and may disclose a short public explanation.

## Implementation and development

Choose techniques for visual fidelity, readability, accessibility, maintenance, browser compatibility, and performance. CSS custom properties and reusable React components can carry common treatments. Backdrop filters, procedural textures, pointer-responsive reflections, SVG displacement, and WebGL refraction or chromatic dispersion are available options. Keep ordinary components lightweight and use heavier optical effects only where they materially improve the experience. Provide readable fallbacks, keyboard access, touch support, and reduced-motion behavior. Clean up effects when their components unmount.

Develop and refine Imperial Obsidian incrementally in the existing React reconstruction on `experiment/react-systems`. Keep component, material, and animation work within the scope of each author-directed task. Do not create a separate material lab, Experience Lab, experimental site, sandbox application, or branch for this design system.

## Established requirements and open decisions

**Established requirements** include square-cornered interface geometry, architectural and institutional elegance, an optical glass material language, respect for official palettes, restrained tactile feedback, accessibility, readability, performance, and incremental work in the React checkout.

**Open decisions** include material intensity, typefaces, optical treatments, accent distribution and timing for future components. Set these as individual experiences are developed.
