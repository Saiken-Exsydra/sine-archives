// Widths are display requirements. The engine caps each one at the oriented source width.
export const profiles = {
  thumbnail: { widths: [96, 192, 320], quality: 86 },
  portrait: { widths: [96, 320, 640, 960], quality: 90 },
  hero: { widths: [1280, 1920, 2560], quality: 90 },
  illustration: { widths: [640, 1280, 1920], quality: 90 },
  symbol: { widths: [96, 256, 512], quality: 94 },
  background: { widths: [960, 1600, 2560], quality: 88 },
};

export function widthsFor(width, profile) {
  return [...new Set(profiles[profile].widths.map(size => Math.min(width, size)))];
}
