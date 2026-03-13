import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../site.config';

export const GET: APIRoute = async () => {
  // 获取所有内容
  const posts = await getCollection('posts');
  const photos = await getCollection('photos');

  // 静态页面
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/categories', priority: 0.7, changefreq: 'weekly' },
    { url: '/tags', priority: 0.7, changefreq: 'weekly' },
    { url: '/archive', priority: 0.7, changefreq: 'weekly' },
    { url: '/photos', priority: 0.8, changefreq: 'weekly' },
  ];

  // 生成分类页面
  const categories = [...new Set(posts.map(post => post.data.category))];
  const categoryPages = categories.map(category => ({
    url: `/categories/${encodeURIComponent(category)}`,
    priority: 0.6,
    changefreq: 'weekly' as const,
  }));

  // 生成标签页面
  const allTags = [...new Set(posts.flatMap(post => post.data.tags))];
  const tagPages = allTags.map(tag => ({
    url: `/tags/${encodeURIComponent(tag)}`,
    priority: 0.5,
    changefreq: 'weekly' as const,
  }));

  // 文章页面
  const postPages = posts.map(post => ({
    url: `/posts/${post.id}`,
    lastmod: post.data.date.toISOString(),
    priority: 0.8,
    changefreq: 'monthly' as const,
  }));

  // 影集页面
  const photoPages = photos.map(photo => ({
    url: `/photos/${photo.id}`,
    lastmod: new Date(photo.data.date).toISOString(),
    priority: 0.7,
    changefreq: 'monthly' as const,
  }));

  // 合并所有页面
  const allPages = [
    ...staticPages,
    ...categoryPages,
    ...tagPages,
    ...postPages,
    ...photoPages,
  ];

  // 生成 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${siteConfig.url}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
