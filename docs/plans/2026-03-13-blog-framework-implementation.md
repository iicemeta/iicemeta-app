# 「間」Ma 博客框架实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建日式极简风格的博客框架，包含首页、分类、标签、归档四大功能页面

**Architecture:** 基于 Astro + React + daisyUI，采用 Content Collections 管理文章，组件化开发，支持响应式布局

**Tech Stack:** Astro 6.x, React 19, daisyUI 5.x, Tailwind CSS 4.x, @astrojs/react

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

**Step 1: 安装 daisyUI 和 Tailwind CSS**

```bash
pnpm add -D tailwindcss @tailwindcss/vite daisyui@latest
```

**Step 2: 安装中文字体**

```bash
pnpm add @chinese-fonts/nssct
```

**Step 3: 提交**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add tailwindcss, daisyui and chinese fonts"
```

---

## Task 2: 配置 Tailwind CSS 和 daisyUI

**Files:**
- Create: `src/styles/global.css`
- Modify: `astro.config.mjs`
- Modify: `src/pages/index.astro`

**Step 1: 创建全局样式文件**

Create: `src/styles/global.css`

```css
@import "tailwindcss";
@import "@chinese-fonts/nssct/dist/NotoSerifSC/result.css";
@import "@chinese-fonts/nssct/dist/NotoSansSC/result.css";

@plugin "daisyui";

@theme {
  /* 日式极简配色 */
  --color-bg-primary: #FAF9F6;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6B6B6B;
  --color-accent: #E74C3C;
  --color-border: #E8E8E8;
  
  /* 字体 */
  --font-serif: "Noto Serif SC", serif;
  --font-sans: "Noto Sans SC", sans-serif;
  
  /* 黄金比例字号 */
  --text-base: 16px;
  --text-lg: 26px;
  --text-xl: 42px;
  --text-2xl: 68px;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
}
```

**Step 2: 更新 Astro 配置**

Modify: `astro.config.mjs`

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
```

**Step 3: 更新首页引入样式**

Modify: `src/pages/index.astro`

```astro
---
import '../styles/global.css';
---
```

**Step 4: 提交**

```bash
git add src/styles/global.css astro.config.mjs src/pages/index.astro
git commit -m "feat: configure tailwindcss and daisyui with japanese minimal theme"
```

---

## Task 3: 创建基础布局组件

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

**Step 1: 创建 Header 组件**

Create: `src/components/Header.astro`

```astro
---
const navItems = [
  { href: '/', label: '首页' },
  { href: '/categories', label: '分类' },
  { href: '/tags', label: '标签' },
  { href: '/archive', label: '归档' },
];

const currentPath = Astro.url.pathname;
---

<header class="py-8 px-6 md:px-12">
  <nav class="flex justify-between items-center max-w-6xl mx-auto">
    <a href="/" class="text-2xl font-serif text-[#1A1A1A] hover:text-[#E74C3C] transition-colors duration-300">
      間
    </a>
    
    <ul class="flex gap-8">
      {navItems.map(item => (
        <li>
          <a 
            href={item.href}
            class={`text-sm tracking-wide transition-all duration-300 hover:translate-x-1 inline-block ${
              currentPath === item.href 
                ? 'text-[#E74C3C]' 
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

**Step 2: 创建 Footer 组件**

Create: `src/components/Footer.astro`

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="py-12 px-6 md:px-12 border-t border-[#E8E8E8]">
  <div class="max-w-6xl mx-auto text-center">
    <p class="text-sm text-[#6B6B6B]">
      © {currentYear} · 留白之处，自有天地
    </p>
  </div>
</footer>
```

**Step 3: 创建 BaseLayout 布局**

Create: `src/layouts/BaseLayout.astro`

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '一个关于留白与思考的空间' } = Astro.props;
---

<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title} · 間</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body class="min-h-screen flex flex-col bg-[#FAF9F6]">
  <Header />
  <main class="flex-1 px-6 md:px-12 py-12">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

**Step 4: 提交**

```bash
git add src/components/Header.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: add header, footer and base layout components"
```

---

## Task 4: 配置 Content Collections

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/posts/hello-world.md`
- Create: `src/content/posts/second-post.md`

**Step 1: 创建内容配置文件**

Create: `src/content.config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    readingTime: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
```

**Step 2: 创建示例文章**

Create: `src/content/posts/hello-world.md`

```markdown
---
title: 你好，世界
date: 2026-03-13
category: 随笔
tags: [开始, 生活]
description: 这是我在这个空间的第一个足迹，像在一片空白画布上落下第一笔。
readingTime: 2分钟
---

# 你好，世界

欢迎来到这个留白的空间。

在这里，我想记录一些思考、一些观察、一些生活的碎片。

## 为什么叫「間」

日语中的「間」（Ma），不只是空间上的间隔，更是时间上的留白。它让事物有呼吸的余地，让意义在空白中浮现。

希望这个空间也能如此。
```

Create: `src/content/posts/second-post.md`

```markdown
---
title: 关于极简的思考
date: 2026-03-12
category: 设计
tags: [极简, 设计, 思考]
description: 极简不是少，而是刚刚好。探讨日式美学中的减法哲学。
readingTime: 5分钟
---

# 关于极简的思考

极简主义常被误解为「少即是多」的极端实践。但真正的极简，是去除一切不必要的，留下真正重要的。

## 留白的力量

在日式美学中，空白不是缺失，而是存在的一种形式。它给观者留下了想象的空间，给事物留下了呼吸的余地。
```

**Step 3: 提交**

```bash
git add src/content.config.ts src/content/posts/
git commit -m "feat: setup content collections with sample posts"
```

---

## Task 5: 创建文章卡片组件

**Files:**
- Create: `src/components/PostCard.astro`

**Step 1: 创建 PostCard 组件**

Create: `src/components/PostCard.astro`

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'posts'>;
}

const { post } = Astro.props;
const { title, date, category, tags, description, readingTime } = post.data;

const formattedDate = date.toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<article class="group py-8 border-b border-[#E8E8E8] last:border-b-0">
  <a href={`/posts/${post.id}`} class="block">
    <div class="flex flex-col gap-4">
      {/* 标题 */}
      <h2 class="text-2xl md:text-3xl font-serif text-[#1A1A1A] group-hover:text-[#E74C3C] transition-all duration-300 group-hover:translate-x-1">
        {title}
      </h2>
      
      {/* 元信息 */}
      <div class="flex items-center gap-4 text-sm text-[#6B6B6B]">
        <time datetime={date.toISOString()}>{formattedDate}</time>
        <span>·</span>
        <span>{category}</span>
        {readingTime && (
          <>
            <span>·</span>
            <span>{readingTime}</span>
          </>
        )}
      </div>
      
      {/* 摘要 */}
      <p class="text-[#6B6B6B] leading-relaxed line-clamp-2">
        {description}
      </p>
      
      {/* 标签 */}
      {tags.length > 0 && (
        <div class="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <span class="text-xs px-3 py-1 bg-[#E8E8E8] text-[#6B6B6B] rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </a>
</article>
```

**Step 2: 提交**

```bash
git add src/components/PostCard.astro
git commit -m "feat: add PostCard component with hover animations"
```

---

## Task 6: 实现首页

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: 重写首页**

Modify: `src/pages/index.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

// 获取所有标签
const allTags = [...new Set(posts.flatMap(post => post.data.tags))];
---

<BaseLayout title="首页">
  <div class="max-w-6xl mx-auto">
    {/* 头部介绍 */}
    <section class="py-16 md:py-24">
      <h1 class="text-4xl md:text-6xl font-serif text-[#1A1A1A] mb-6">
        留白之处
      </h1>
      <p class="text-lg md:text-xl text-[#6B6B6B] max-w-2xl leading-relaxed">
        一个关于思考、观察与生活的空间。<br/>
        在这里，空白不是缺失，而是存在的一种形式。
      </p>
    </section>
    
    {/* 主体内容 */}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* 文章列表 */}
      <section class="lg:col-span-2">
        <h2 class="text-sm uppercase tracking-widest text-[#6B6B6B] mb-8">
          最新文章
        </h2>
        <div class="divide-y divide-[#E8E8E8]">
          {sortedPosts.map(post => (
            <PostCard post={post} />
          ))}
        </div>
      </section>
      
      {/* 侧边栏 */}
      <aside class="space-y-12">
        {/* 标签云 */}
        <section>
          <h3 class="text-sm uppercase tracking-widest text-[#6B6B6B] mb-6">
            标签
          </h3>
          <div class="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <a 
                href={`/tags#${tag}`}
                class="text-sm px-4 py-2 border border-[#E8E8E8] text-[#6B6B6B] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-all duration-300"
                style={`transform: translateY(${index % 2 === 0 ? '0' : '4px'})`}
              >
                {tag}
              </a>
            ))}
          </div>
        </section>
        
        {/* 关于 */}
        <section>
          <h3 class="text-sm uppercase tracking-widest text-[#6B6B6B] mb-6">
            关于
          </h3>
          <p class="text-sm text-[#6B6B6B] leading-relaxed">
            记录思考，分享观察，在留白中寻找意义。
          </p>
        </section>
      </aside>
    </div>
  </div>
</BaseLayout>
```

**Step 2: 提交**

```bash
git add src/pages/index.astro
git commit -m "feat: implement homepage with post list and tag cloud"
```

---

## Task 7: 实现分类页面

**Files:**
- Create: `src/pages/categories.astro`

**Step 1: 创建分类页面**

Create: `src/pages/categories.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');

// 按分类分组
const postsByCategory = posts.reduce((acc, post) => {
  const category = post.data.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(post);
  return acc;
}, {} as Record<string, typeof posts>);

// 排序分类
const sortedCategories = Object.keys(postsByCategory).sort();

// 获取当前选中的分类
const currentCategory = Astro.url.searchParams.get('category') || sortedCategories[0];
const currentPosts = postsByCategory[currentCategory] || [];
---

<BaseLayout title="分类">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-12">
      分类
    </h1>
    
    {/* 分类导航 */}
    <nav class="mb-12 overflow-x-auto">
      <ul class="flex gap-2 pb-4 border-b border-[#E8E8E8]">
        {sortedCategories.map(category => (
          <li>
            <a 
              href={`/categories?category=${encodeURIComponent(category)}`}
              class={`px-6 py-3 text-sm whitespace-nowrap transition-all duration-300 ${
                currentCategory === category
                  ? 'text-[#E74C3C] border-b-2 border-[#E74C3C] -mb-4 pb-4'
                  : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
              }`}
            >
              {category}
              <span class="ml-2 text-xs opacity-60">
                ({postsByCategory[category].length})
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
    
    {/* 文章列表 */}
    <section>
      <h2 class="text-sm uppercase tracking-widest text-[#6B6B6B] mb-8">
        {currentCategory} · {currentPosts.length} 篇文章
      </h2>
      <div class="divide-y divide-[#E8E8E8]">
        {currentPosts
          .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
          .map(post => (
            <PostCard post={post} />
          ))}
      </div>
    </section>
  </div>
</BaseLayout>
```

**Step 2: 提交**

```bash
git add src/pages/categories.astro
git commit -m "feat: implement categories page with horizontal navigation"
```

---

## Task 8: 实现标签页面

**Files:**
- Create: `src/pages/tags.astro`

**Step 1: 创建标签页面**

Create: `src/pages/tags.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');

// 按标签分组
const postsByTag = posts.reduce((acc, post) => {
  post.data.tags.forEach(tag => {
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(post);
  });
  return acc;
}, {} as Record<string, typeof posts>);

// 计算标签大小
const maxCount = Math.max(...Object.values(postsByTag).map(p => p.length));
const minCount = Math.min(...Object.values(postsByTag).map(p => p.length));

const getTagSize = (count: number) => {
  if (maxCount === minCount) return 'text-base';
  const ratio = (count - minCount) / (maxCount - minCount);
  if (ratio > 0.7) return 'text-2xl';
  if (ratio > 0.4) return 'text-xl';
  return 'text-base';
};

// 获取当前选中的标签
const currentTag = Astro.url.hash.slice(1) || Object.keys(postsByTag)[0];
const currentPosts = postsByTag[currentTag] || [];
---

<BaseLayout title="标签">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-12">
      标签
    </h1>
    
    {/* 标签云 */}
    <section class="mb-16">
      <div class="flex flex-wrap gap-4 items-baseline">
        {Object.entries(postsByTag)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([tag, tagPosts], index) => (
            <a 
              href={`/tags#${tag}`}
              class={`${getTagSize(tagPosts.length)} font-serif transition-all duration-300 hover:text-[#E74C3C] ${
                currentTag === tag ? 'text-[#E74C3C]' : 'text-[#6B6B6B]'
              }`}
              style={`transform: translateY(${index % 3 === 0 ? '0' : index % 3 === 1 ? '8px' : '-4px'})`}
            >
              {tag}
              <span class="text-xs ml-1 opacity-60">({tagPosts.length})</span>
            </a>
          ))}
      </div>
    </section>
    
    {/* 文章列表 */}
    {currentTag && (
      <section>
        <h2 class="text-sm uppercase tracking-widest text-[#6B6B6B] mb-8">
          #{currentTag} · {currentPosts.length} 篇文章
        </h2>
        <div class="divide-y divide-[#E8E8E8]">
          {currentPosts
            .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
            .map(post => (
              <PostCard post={post} />
            ))}
        </div>
      </section>
    )}
  </div>
</BaseLayout>
```

**Step 2: 提交**

```bash
git add src/pages/tags.astro
git commit -m "feat: implement tags page with cloud layout"
```

---

## Task 9: 实现归档页面

**Files:**
- Create: `src/pages/archive.astro`

**Step 1: 创建归档页面**

Create: `src/pages/archive.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');

// 按年月分组
const postsByYearMonth = posts.reduce((acc, post) => {
  const date = post.data.date;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const key = `${year}-${month.toString().padStart(2, '0')}`;
  
  if (!acc[key]) {
    acc[key] = { year, month, posts: [] };
  }
  acc[key].posts.push(post);
  return acc;
}, {} as Record<string, { year: number; month: number; posts: typeof posts }>);

// 按时间倒序排列
const sortedKeys = Object.keys(postsByYearMonth).sort().reverse();
---

<BaseLayout title="归档">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-12">
      归档
    </h1>
    
    {/* 时间轴 */}
    <div class="relative">
      {/* 时间轴线 */}
      <div class="absolute left-0 md:left-4 top-0 bottom-0 w-px bg-[#E8E8E8]"></div>
      
      {sortedKeys.map(key => {
        const { year, month, posts: monthPosts } = postsByYearMonth[key];
        const sortedPosts = monthPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
        
        return (
          <section class="relative pl-8 md:pl-16 pb-12">
            {/* 时间节点 */}
            <div class="absolute left-0 md:left-4 top-2 w-2 h-2 -translate-x-1/2 rounded-full bg-[#E74C3C]"></div>
            
            {/* 月份标题 */}
            <h2 class="text-2xl font-serif text-[#1A1A1A] mb-6">
              {year}年{month}月
              <span class="text-sm text-[#6B6B6B] ml-2">
                ({sortedPosts.length} 篇)
              </span>
            </h2>
            
            {/* 文章列表 */}
            <ul class="space-y-4">
              {sortedPosts.map(post => (
                <li>
                  <a 
                    href={`/posts/${post.id}`}
                    class="group flex items-baseline gap-4 text-[#6B6B6B] hover:text-[#1A1A1A] transition-all duration-300"
                  >
                    <time class="text-sm whitespace-nowrap">
                      {post.data.date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                    </time>
                    <span class="group-hover:translate-x-1 transition-transform duration-300">
                      {post.data.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  </div>
</BaseLayout>
```

**Step 2: 提交**

```bash
git add src/pages/archive.astro
git commit -m "feat: implement archive page with timeline layout"
```

---

## Task 10: 实现文章详情页

**Files:**
- Create: `src/pages/posts/[id].astro`

**Step 1: 创建文章详情页**

Create: `src/pages/posts/[id].astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const { title, date, category, tags, readingTime } = post.data;

const formattedDate = date.toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout title={title} description={post.data.description}>
  <article class="max-w-3xl mx-auto">
    {/* 文章头部 */}
    <header class="mb-12 pb-8 border-b border-[#E8E8E8]">
      <h1 class="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-6 leading-tight">
        {title}
      </h1>
      
      <div class="flex flex-wrap items-center gap-4 text-sm text-[#6B6B6B]">
        <time datetime={date.toISOString()}>{formattedDate}</time>
        <span>·</span>
        <a href={`/categories?category=${encodeURIComponent(category)}`} class="hover:text-[#E74C3C] transition-colors">
          {category}
        </a>
        {readingTime && (
          <>
            <span>·</span>
            <span>{readingTime}</span>
          </>
        )}
      </div>
      
      {tags.length > 0 && (
        <div class="flex gap-2 flex-wrap mt-6">
          {tags.map(tag => (
            <a 
              href={`/tags#${tag}`}
              class="text-xs px-3 py-1 bg-[#E8E8E8] text-[#6B6B6B] rounded-full hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300"
            >
              {tag}
            </a>
          ))}
        </div>
      )}
    </header>
    
    {/* 文章内容 */}
    <div class="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#1A1A1A] prose-p:text-[#1A1A1A] prose-a:text-[#E74C3C] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1A1A1A] prose-code:text-[#E74C3C] prose-pre:bg-[#F5F5F5] prose-pre:text-[#1A1A1A]">
      <Content />
    </div>
    
    {/* 文章底部导航 */}
    <footer class="mt-16 pt-8 border-t border-[#E8E8E8]">
      <a 
        href="/"
        class="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] transition-all duration-300 hover:translate-x-1"
      >
        <span>←</span>
        <span>返回首页</span>
      </a>
    </footer>
  </article>
</BaseLayout>
```

**Step 2: 提交**

```bash
git add src/pages/posts/[id].astro
git commit -m "feat: implement post detail page with markdown rendering"
```

---

## Task 11: 添加响应式优化

**Files:**
- Modify: `src/styles/global.css`

**Step 1: 添加响应式工具类**

Modify: `src/styles/global.css`

在文件末尾添加：

```css
/* 响应式排版 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 选中文字样式 */
::selection {
  background-color: rgba(231, 76, 60, 0.2);
  color: #1A1A1A;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #FAF9F6;
}

::-webkit-scrollbar-thumb {
  background: #E8E8E8;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6B6B6B;
}
```

**Step 2: 提交**

```bash
git add src/styles/global.css
git commit -m "style: add responsive and scrollbar styles"
```

---

## Task 12: 验证构建

**Files:**
- Run: build command

**Step 1: 运行构建**

```bash
pnpm build
```

**Expected:** 构建成功，无错误

**Step 2: 提交（如果一切正常）**

```bash
git commit -m "chore: verify build passes"
```

---

## 完成总结

实施完成后，你将拥有：

1. ✅ 日式极简风格的首页，带文章列表和标签云
2. ✅ 分类页面，横向滚动导航
3. ✅ 标签页面，不规则标签云布局
4. ✅ 归档页面，时间轴设计
5. ✅ 文章详情页，支持 Markdown
6. ✅ 响应式设计，移动端友好
7. ✅ 优雅的悬停动画和过渡效果
