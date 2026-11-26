import { preload } from 'react-dom';
import type { CSSProperties, ImgHTMLAttributes } from 'react';
import manifest from './manifest.json';

export type AssetId = keyof typeof manifest;
const base = import.meta.env.BASE_URL + 'media/';

export function isAssetId(id: unknown): id is AssetId {
  return typeof id === 'string' && Object.hasOwn(manifest, id);
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

/** Wait for the browser-selected candidate on the element that will be revealed. */
export async function imageReady(image: HTMLImageElement, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const listeners = new AbortController();
  try {
    await new Promise<void>((resolve, reject) => {
      const decode = () => {
        const source = image.currentSrc;
        // A resize can replace the candidate during decode. Its load event starts a fresh wait.
        const current = () => image.complete && image.currentSrc === source;
        image.decode().then(() => { if (current()) resolve(); },
          error => { if (current()) reject(error); });
      };
      const options = { signal: listeners.signal };
      image.addEventListener('load', decode, options);
      image.addEventListener('error', () => reject(new Error('Publication image unavailable')), options);
      signal?.addEventListener('abort', () => reject(signal.reason), options);
      if (image.complete) decode();
    });
  } finally {
    listeners.abort();
  }
}

/** Prepare one imminent selection. The caller owns the decoded element's lifetime. */
export async function prepareImage(id: AssetId, sizes: string, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const { src, srcSet } = imageProps(id, sizes, '');
  const image = new Image();
  const cancel = () => {
    image.removeAttribute('srcset');
    image.removeAttribute('src');
  };
  signal?.addEventListener('abort', cancel, { once: true });
  try {
    image.decoding = 'async';
    image.sizes = sizes;
    image.srcset = srcSet;
    image.src = src;
    await imageReady(image, signal);
    return image;
  } finally {
    signal?.removeEventListener('abort', cancel);
  }
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
