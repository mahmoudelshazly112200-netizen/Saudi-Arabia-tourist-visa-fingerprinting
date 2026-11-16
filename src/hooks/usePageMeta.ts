import { useEffect } from 'react';
import { getSiteOrigin } from '../constants/brand';

interface PageMetaOptions {
  title: string;
  description?: string;
  robots?: string;
  canonicalPath?: string;
}

function upsertMetaTag(
  selector: string,
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
): void {
  let tag = document.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function usePageMeta({
  title,
  description,
  robots = 'index, follow',
  canonicalPath,
}: PageMetaOptions): void {
  useEffect(() => {
    document.title = title;

    upsertMetaTag('meta[name="robots"]', 'name', 'robots', robots);
    upsertMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);

    if (description) {
      upsertMetaTag('meta[name="description"]', 'name', 'description', description);
      upsertMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
      upsertMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    const origin = getSiteOrigin();
    const resolvedPath =
      canonicalPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const normalizedUrl = origin ? `${origin}${resolvedPath}` : '';

    if (normalizedUrl && !robots.includes('noindex')) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', normalizedUrl);
      upsertMetaTag('meta[property="og:url"]', 'property', 'og:url', normalizedUrl);
    } else {
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.remove();
      }
    }
  }, [title, description, robots, canonicalPath]);
}
