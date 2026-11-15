import { useEffect } from 'react';

interface PageMetaOptions {
  title: string;
  robots?: string;
}

export function usePageMeta({ title, robots = 'index, follow' }: PageMetaOptions): void {
  useEffect(() => {
    document.title = title;

    let robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', robots);
  }, [title, robots]);
}
