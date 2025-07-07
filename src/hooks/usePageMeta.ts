import { useEffect } from 'react';

interface PageMetaData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export const usePageMeta = (meta: PageMetaData) => {
  useEffect(() => {
    // Update document title
    document.title = meta.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description);
    }

    // Update meta keywords
    if (meta.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', meta.keywords);
    }

    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.ogTitle || meta.title);
    }

    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', meta.ogDescription || meta.description);
    }

    // Update Open Graph image
    if (meta.ogImage) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', meta.ogImage);
      }
    }

    // Update Twitter title
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', meta.ogTitle || meta.title);
    }

    // Update Twitter description
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', meta.ogDescription || meta.description);
    }

    // Update Twitter image
    if (meta.ogImage) {
      const twitterImage = document.querySelector('meta[property="twitter:image"]');
      if (twitterImage) {
        twitterImage.setAttribute('content', meta.ogImage);
      }
    }
  }, [meta]);
};