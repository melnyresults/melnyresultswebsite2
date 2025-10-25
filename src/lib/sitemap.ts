import { supabase } from './supabase';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://melnyresults.com';
  const urls: SitemapUrl[] = [];

  urls.push({
    loc: `${baseUrl}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0,
  });

  urls.push({
    loc: `${baseUrl}/blog`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
  });

  const staticPages = [
    { path: '/closer', priority: 0.8 },
    { path: '/free-marketing-analysis', priority: 0.8 },
    { path: '/generative-engine-optimization', priority: 0.8 },
    { path: '/newsletter', priority: 0.7 },
    { path: '/privacy-policy', priority: 0.3 },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: page.priority,
    });
  });

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, published_at, scheduled_publish_date')
    .eq('is_published', true)
    .eq('noindex', false)
    .or(`scheduled_publish_date.is.null,scheduled_publish_date.lte.${new Date().toISOString()}`)
    .order('published_at', { ascending: false });

  if (posts) {
    posts.forEach(post => {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: new Date(post.updated_at).toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.8,
      });
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const saveSitemap = async (): Promise<void> => {
  const xml = await generateSitemap();

  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
