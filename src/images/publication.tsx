import { preload } from 'react-dom';
import type { CSSProperties, ImgHTMLAttributes } from 'react';
import manifest from './manifest.json';

export type AssetId = keyof typeof manifest;
const base = import.meta.env.BASE_URL + 'media/';

export function isAssetId(id: string): id is AssetId {
  return Object.hasOwn(manifest, id);
}

export function imageProps(id: AssetId, sizes: string, alt: string) {
  const { variants } = manifest[id];
  const largest = variants[variants.length - 1];
  return {
    src: base + largest.file,
    srcSet: variants.map(v => base + v.file + ' ' + v.width + 'w').join(', '),
    sizes, width: largest.width, height: largest.height, alt,
    decoding: 'async' as const,
  };
}

export function preloadImage(id: AssetId, sizes: string) {
  const { src, srcSet } = imageProps(id, sizes, '');
  preload(src, { as: 'image', imageSrcSet: srcSet, imageSizes: sizes });
}

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  asset: AssetId;
  alt: string;
  sizes: string;
  fit?: CSSProperties['objectFit'];
  focalPoint?: string;
}

export function PublicationImage({ asset, sizes, alt, fit, focalPoint, style, loading = 'lazy', ...props }: Props) {
  return <img {...imageProps(asset, sizes, alt)} {...props} loading={loading}
    style={{ objectFit: fit, objectPosition: focalPoint, ...style }} />;
}
