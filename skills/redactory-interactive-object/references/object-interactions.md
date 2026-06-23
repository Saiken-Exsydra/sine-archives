# Object Interactions

## Good Object Cues

- a quill gains a fine crimson edge light and casts a deeper shadow.
- papers lift a few pixels, separate slightly, or reveal a thin ruled glow.
- a side handle brightens along its edge and exposes a small label or aperture.
- a desk object shows a small file label, seal, or coordinate marker on focus.
- a lore panel opens like a document reveal, not a modal from a dashboard kit.

## Semantics

Use links for navigation. Use buttons for in-place reveals/toggles. If a button must look like a physical object, style it with no default button chrome but keep accessible name, focus ring, and keyboard activation.

## States

Every interactive object should define:

- default.
- hover.
- focus-visible.
- active/pressed.
- reduced-motion fallback if animated.
- disabled/loading only when the flow needs it.

## Labels

Visible labels can be small, stamped, edge-mounted, or revealed on focus/hover. If a visible label would damage the scene, provide an `aria-label` and make focus treatment unambiguous.
