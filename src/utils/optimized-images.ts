import { getImage } from "astro:assets";
import type { GetImageResult, ImageMetadata, ImageOutputFormat } from "astro";

export type ContentImageValue = ImageMetadata | string | null | undefined;

export type OptimizedImageBundle = {
  avifSrcset: string;
  webpSrcset: string;
  fallbackSrc: string;
  fallbackSrcset: string;
  sizes: string;
  width: number;
  height: number;
};

type OptimizedImageOptions = {
  widths: number[];
  sizes: string;
  quality?: number;
  fit?: string;
  fallbackFormat?: ImageOutputFormat;
};

export function isImageMetadata(value: ContentImageValue): value is ImageMetadata {
  return !!value && typeof value === "object" && typeof value.src === "string";
}

export function getImageUrl(value: ContentImageValue): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.src;
}

function getSrcsetAttribute(result: GetImageResult): string {
  return result.srcSet.attribute || "";
}

export async function buildOptimizedImageBundle(
  value: ContentImageValue,
  options: OptimizedImageOptions,
): Promise<OptimizedImageBundle | null> {
  if (!value) return null;

  if (typeof value === "string") {
    return {
      avifSrcset: "",
      webpSrcset: "",
      fallbackSrc: value,
      fallbackSrcset: "",
      sizes: options.sizes,
      width: 0,
      height: 0,
    };
  }

  const sharedOptions = {
    src: value,
    widths: options.widths,
    quality: options.quality,
    fit: options.fit,
  };

  const [avif, webp, fallback] = await Promise.all([
    getImage({ ...sharedOptions, format: "avif" }),
    getImage({ ...sharedOptions, format: "webp" }),
    getImage({ ...sharedOptions, format: options.fallbackFormat ?? value.format }),
  ]);

  return {
    avifSrcset: getSrcsetAttribute(avif),
    webpSrcset: getSrcsetAttribute(webp),
    fallbackSrc: fallback.src,
    fallbackSrcset: getSrcsetAttribute(fallback),
    sizes: options.sizes,
    width: Number(fallback.attributes.width ?? value.width),
    height: Number(fallback.attributes.height ?? value.height),
  };
}
