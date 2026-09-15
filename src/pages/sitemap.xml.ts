import type { APIRoute } from 'astro';
import existingSitemap from '../data/existing-sitemap.xml?raw';
import { posts, postPath, blogPaths } from '../lib/blog';
import { siteUrl } from '../i18n/site';

// Keep all existing product/legal entries; new Markdown posts are included automatically.
export const GET: APIRoute = () => {
  const paths = [...Object.values(blogPaths), ...posts.map(postPath)];
  const entries = paths.map(path => `  <url><loc>${new URL(path, siteUrl).href}</loc></url>`).join('\n');
  return new Response(existingSitemap.replace('</urlset>', `${entries}\n</urlset>`), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
