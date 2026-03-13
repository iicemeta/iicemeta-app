# 照片故事 (Photo Stories) 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 Astro 博客中实现一个浅色主题的影集功能，每张照片都有独立的故事页面，采用不对称网格布局。

**Architecture:** 使用 Astro Content Collections 管理照片数据，每个照片是一个包含 MDX 故事的文件夹。影集首页展示不对称瀑布流，详情页展示完整故事。复用博客的浅色主题，但注入乱序美学的布局风格。

**Tech Stack:** Astro, TypeScript, Tailwind CSS, MDX, Astro Icon

---

## Task 1: 创建照片内容集合配置

**Files:**
- Create: `src/content/photos/config.ts`
- Modify: `src/content.config.ts`

**Step 1: 创建照片集合配置**

创建 `src/content/photos/config.ts`：

```typescript
import { defineCollection, z } from 'astro:content';

export const photoSchema = z.object({
  title: z.string(),
  date: z.date(),
  location: z.string().optional(),
  camera: z.string().optional(),
  film: z.string().optional(),
  tags: z.array(z.string()).default([]),
  cover: z.string(),
  mood: z.enum(['joy', 'calm', 'nostalgic', 'melancholy', 'excited', 'peaceful']).default('calm'),
});

export type Photo = z.infer<typeof photoSchema>;

export const photosCollection = defineCollection({
  type: 'content',
  schema: photoSchema,
});
```

**Step 2: 注册到主配置**

修改 `src/content.config.ts`，添加 photos 集合：

```typescript
import { defineCollection } from 'astro:content';
import { photosCollection } from './content/photos/config';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('未分类'),
  }),
});

export const collections = {
  posts,
  photos: photosCollection,
};
```

**Step 3: 提交**

```bash
git add src/content/photos/config.ts src/content.config.ts
git commit -m "feat: add photos content collection config"
```

---

## Task 2: 创建示例照片故事

**Files:**
- Create: `src/content/photos/old-bookstall/index.mdx`
- Create: `src/content/photos/old-bookstall/cover.jpg` (使用占位图)

**Step 1: 创建照片文件夹和故事**

创建 `src/content/photos/old-bookstall/index.mdx`：

```mdx
---
title: "街角的旧书摊"
date: 2024-03-15
location: "杭州，河坊街"
camera: "Sony A7C"
film: "Kodak Portra 400"
tags: ["街拍", "胶片", "杭州"]
cover: "./cover.jpg"
mood: "nostalgic"
---

那是下午4点的光芒，斜斜地穿过梧桐叶。

我在这个书摊前站了十分钟，老板没抬头看我一眼。
他戴着老花镜，正在读一本1987年的《读者》。

我拍下了这张照片，不是因为书摊有多特别，
而是因为那束光，正好落在了一本《百年孤独》上。

> "生命中曾经有过的所有灿烂，终究都需要用寂寞来偿还。"
> —— 那天我正好读到这一页。
```

**Step 2: 提交**

```bash
git add src/content/photos/
git commit -m "feat: add sample photo story"
```

---

## Task 3: 创建照片卡片组件

**Files:**
- Create: `src/components/PhotoCard.astro`

**Step 1: 实现 PhotoCard 组件**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { Icon } from 'astro-icon/components';

interface Props {
  photo: CollectionEntry<'photos'>;
  rotation?: number;
}

const { photo, rotation = 0 } = Astro.props;
const { title, date, location, mood, cover } = photo.data;

// 情绪颜色映射
const moodColors: Record<string, string> = {
  joy: '#FCD34D',      // 暖黄
  calm: '#93C5FD',     // 淡蓝
  nostalgic: '#C4B5FD', // 淡紫
  melancholy: '#9CA3AF', // 灰
  excited: '#FCA5A5',  // 粉红
  peaceful: '#86EFAC', // 淡绿
};

const moodLabels: Record<string, string> = {
  joy: '喜悦',
  calm: '宁静',
  nostalgic: '怀旧',
  melancholy: '忧郁',
  excited: '兴奋',
  peaceful: '平和',
};

const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
---

<article 
  class="photo-card group relative"
  style={`transform: rotate(${rotation}deg)`}
  data-mood={mood}
>
  <!-- 情绪色条 -->
  <div 
    class="h-1 w-full mb-3 rounded-full transition-all group-hover:h-2"
    style={`background-color: ${moodColors[mood]}`}
  />
  
  <!-- 图片容器 -->
  <a href={`/photos/${photo.id}`} class="block overflow-hidden bg-[#1a1a1a] rounded-sm">
    <img 
      src={cover} 
      alt={title}
      class="w-full aspect-[4/5] object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
    />
    
    <!-- 悬停遮罩 -->
    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
      <span class="text-white text-sm font-medium px-4 py-2 border border-white/50 rounded-full backdrop-blur-sm">
        阅读故事
      </span>
    </div>
  </a>
  
  <!-- 信息区 -->
  <div class="mt-4 flex justify-between items-start">
    <div>
      <h3 class="font-serif font-bold text-lg text-[#1A1A1A] group-hover:text-[#E74C3C] transition-colors">
        {title}
      </h3>
      <p class="text-sm text-[#6B6B6B] mt-1">
        {formattedDate}
        {location && <span class="mx-1">·</span>}
        {location}
      </p>
    </div>
    
    <!-- 情绪标签 -->
    <span 
      class="text-xs px-2 py-1 rounded-full border"
      style={`border-color: ${moodColors[mood]}40; color: ${moodColors[mood]}; background-color: ${moodColors[mood]}15`}
    >
      {moodLabels[mood]}
    </span>
  </div>
</article>

<style>
  .photo-card {
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .photo-card:hover {
    transform: rotate(0deg) scale(1.02) !important;
    z-index: 10;
  }
</style>
```

**Step 2: 提交**

```bash
git add src/components/PhotoCard.astro
git commit -m "feat: add PhotoCard component with mood indicators"
```

---

## Task 4: 创建影集首页

**Files:**
- Create: `src/pages/photos/index.astro`

**Step 1: 实现影集首页**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PhotoCard from '../../components/PhotoCard.astro';

const photos = await getCollection('photos');

// 按日期倒序
const sortedPhotos = photos.sort((a, b) => 
  new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);

// 为每张卡片生成随机旋转角度
const photosWithRotation = sortedPhotos.map(photo => ({
  ...photo,
  rotation: (Math.random() - 0.5) * 4, // -2 到 2 度
}));

// 统计
const totalPhotos = photos.length;
const uniqueLocations = new Set(photos.map(p => p.data.location).filter(Boolean)).size;
const uniqueTags = new Set(photos.flatMap(p => p.data.tags)).size;
---

<BaseLayout title="影集" description="每一张照片，都是一个故事">
  <!-- 头部区域 -->
  <header class="mb-16 md:mb-24">
    <div class="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
      <!-- 左侧文案 -->
      <div class="w-full md:w-1/2">
        <h1 class="text-5xl md:text-7xl font-serif font-black leading-[0.95] mb-6">
          别让时间<br>
          偷走你的<br>
          <span class="text-[#E74C3C] italic">瞬间。</span>
        </h1>
        <p class="text-lg text-[#6B6B6B] leading-relaxed max-w-md">
          这里没有智能分类，没有自动增强。
          只有被我亲手留下的瞬间。
          真实的颗粒感，比滤镜更动人。
        </p>
      </div>
      
      <!-- 右侧统计 -->
      <div class="w-full md:w-1/2 md:pt-8">
        <div class="grid grid-cols-3 gap-4">
          <div class="border border-[#E8E8E8] p-4 rounded-lg text-center">
            <span class="block text-3xl font-bold text-[#1A1A1A] mb-1">{totalPhotos}</span>
            <span class="text-xs text-[#6B6B6B] uppercase tracking-wider">个故事</span>
          </div>
          <div class="border border-[#E8E8E8] p-4 rounded-lg text-center">
            <span class="block text-3xl font-bold text-[#1A1A1A] mb-1">{uniqueLocations}</span>
            <span class="text-xs text-[#6B6B6B] uppercase tracking-wider">个地点</span>
          </div>
          <div class="border border-[#E8E8E8] p-4 rounded-lg text-center">
            <span class="block text-3xl font-bold text-[#1A1A1A] mb-1">{uniqueTags}</span>
            <span class="text-xs text-[#6B6B6B] uppercase tracking-wider">个标签</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- 照片网格 -->
  <main class="asymmetric-grid">
    {photosWithRotation.map((photo, index) => (
      <div class={`photo-wrapper ${getOffsetClass(index)}`}>
        <PhotoCard photo={photo} rotation={photo.rotation} />
      </div>
    ))}
  </main>

  <!-- 空状态 -->
  {photos.length === 0 && (
    <div class="text-center py-24">
      <p class="text-2xl text-[#6B6B6B] mb-4">还没有照片</p>
      <p class="text-sm text-[#9B9B9B]">在 src/content/photos/ 中添加你的第一个照片故事吧</p>
    </div>
  )}
</BaseLayout>

<style>
  /* 不对称网格 */
  .asymmetric-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr 1.1fr;
    gap: 2.5rem;
  }

  @media (max-width: 768px) {
    .asymmetric-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  /* 偏移类 */
  .photo-wrapper:nth-child(3n+2) {
    margin-top: -2rem;
  }
  
  .photo-wrapper:nth-child(3n+3) {
    margin-top: 3rem;
  }

  @media (max-width: 768px) {
    .photo-wrapper:nth-child(n) {
      margin-top: 0;
    }
  }
</style>

{/* 辅助函数 */}
{function getOffsetClass(index: number) {
  if (index % 3 === 1) return 'offset-up';
  if (index % 3 === 2) return 'offset-down';
  return '';
}}
```

**Step 2: 提交**

```bash
git add src/pages/photos/index.astro
git commit -m "feat: add photos index page with asymmetric grid"
```

---

## Task 5: 创建照片详情页

**Files:**
- Create: `src/pages/photos/[id].astro`

**Step 1: 实现照片详情页**

```astro
---
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { Icon } from 'astro-icon/components';

interface Props {
  photo: CollectionEntry<'photos'>;
}

// 生成静态路径
export async function getStaticPaths() {
  const photos = await getCollection('photos');
  return photos.map(photo => ({
    params: { id: photo.id },
    props: { photo },
  }));
}

const { photo } = Astro.props;
const { Content } = await render(photo);
const { title, date, location, camera, film, tags, cover, mood } = photo.data;

// 获取上一张/下一张
const allPhotos = await getCollection('photos');
const sortedPhotos = allPhotos.sort((a, b) => 
  new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
const currentIndex = sortedPhotos.findIndex(p => p.id === photo.id);
const prevPhoto = sortedPhotos[currentIndex + 1];
const nextPhoto = sortedPhotos[currentIndex - 1];

// 情绪映射
const moodColors: Record<string, string> = {
  joy: '#FCD34D',
  calm: '#93C5FD',
  nostalgic: '#C4B5FD',
  melancholy: '#9CA3AF',
  excited: '#FCA5A5',
  peaceful: '#86EFAC',
};

const moodLabels: Record<string, string> = {
  joy: '喜悦',
  calm: '宁静',
  nostalgic: '怀旧',
  melancholy: '忧郁',
  excited: '兴奋',
  peaceful: '平和',
};

const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout title={title} description={`${title} - 拍摄于 ${location || '未知地点'}`}>
  <article class="max-w-4xl mx-auto">
    <!-- 返回链接 -->
    <a 
      href="/photos" 
      class="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#E74C3C] transition-colors mb-8"
    >
      <Icon name="lucide:arrow-left" class="w-4 h-4" />
      <span>返回影集</span>
    </a>

    <!-- 照片展示 -->
    <div class="relative mb-12">
      <!-- 情绪色条 -->
      <div 
        class="h-1 w-full mb-4 rounded-full"
        style={`background-color: ${moodColors[mood]}`}
      />
      
      <!-- 大图 -->
      <div class="overflow-hidden rounded-sm bg-[#1a1a1a]">
        <img 
          src={cover} 
          alt={title}
          class="w-full max-h-[70vh] object-contain"
        />
      </div>
      
      <!-- 图片信息浮层 -->
      <div class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-sm shadow-lg text-xs">
        <div class="flex items-center gap-4">
          {camera && (
            <span class="flex items-center gap-1">
              <Icon name="lucide:camera" class="w-3 h-3" />
              {camera}
            </span>
          )}
          {film && (
            <span class="flex items-center gap-1">
              <Icon name="lucide:film" class="w-3 h-3" />
              {film}
            </span>
          )}
        </div>
      </div>
    </div>

    <!-- 标题区 -->
    <header class="mb-10 border-b border-[#E8E8E8] pb-8">
      <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-[#1A1A1A]">
          {title}
        </h1>
        <span 
          class="text-sm px-3 py-1 rounded-full border"
          style={`border-color: ${moodColors[mood]}40; color: ${moodColors[mood]}; background-color: ${moodColors[mood]}15`}
        >
          {moodLabels[mood]}
        </span>
      </div>
      
      <div class="flex flex-wrap items-center gap-4 text-sm text-[#6B6B6B]">
        <span class="flex items-center gap-1">
          <Icon name="lucide:calendar" class="w-4 h-4" />
          {formattedDate}
        </span>
        {location && (
          <span class="flex items-center gap-1">
            <Icon name="lucide:map-pin" class="w-4 h-4" />
            {location}
          </span>
        )}
      </div>
      
      <!-- 标签 -->
      {tags.length > 0 && (
        <div class="flex flex-wrap gap-2 mt-4">
          {tags.map(tag => (
            <a 
              href={`/tags/${tag}`}
              class="text-xs px-3 py-1 bg-[#F5F5F5] text-[#6B6B6B] rounded-full hover:bg-[#E74C3C] hover:text-white transition-colors"
            >
              #{tag}
            </a>
          ))}
        </div>
      )}
    </header>

    <!-- 故事内容 -->
    <div class="prose prose-lg max-w-none mb-16">
      <Content />
    </div>

    <!-- 导航 -->
    <nav class="border-t border-[#E8E8E8] pt-8">
      <div class="flex justify-between items-center">
        {prevPhoto ? (
          <a 
            href={`/photos/${prevPhoto.id}`}
            class="group flex items-center gap-4 text-left"
          >
            <div class="w-16 h-16 overflow-hidden rounded-sm bg-[#1a1a1a] flex-shrink-0">
              <img src={prevPhoto.data.cover} alt="" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span class="text-xs text-[#6B6B6B] uppercase tracking-wider">上一篇</span>
              <p class="font-serif font-bold text-[#1A1A1A] group-hover:text-[#E74C3C] transition-colors line-clamp-1">
                {prevPhoto.data.title}
              </p>
            </div>
          </a>
        ) : (
          <div />
        )}
        
        {nextPhoto ? (
          <a 
            href={`/photos/${nextPhoto.id}`}
            class="group flex items-center gap-4 text-right"
          >
            <div>
              <span class="text-xs text-[#6B6B6B] uppercase tracking-wider">下一篇</span>
              <p class="font-serif font-bold text-[#1A1A1A] group-hover:text-[#E74C3C] transition-colors line-clamp-1">
                {nextPhoto.data.title}
              </p>
            </div>
            <div class="w-16 h-16 overflow-hidden rounded-sm bg-[#1a1a1a] flex-shrink-0">
              <img src={nextPhoto.data.cover} alt="" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ) : (
          <div />
        )}
      </div>
    </nav>
  </article>
</BaseLayout>
```

**Step 2: 提交**

```bash
git add src/pages/photos/[id].astro
git commit -m "feat: add photo detail page with story rendering"
```

---

## Task 6: 更新导航配置

**Files:**
- Modify: `src/site.config.ts`

**Step 1: 在导航中添加影集入口**

在 `src/site.config.ts` 的 navbar.items 中添加：

```typescript
items: [
  { to: '/', label: '首页', position: 'left' },
  { to: '/categories', label: '分类', position: 'left' },
  { to: '/tags', label: '标签', position: 'left' },
  { to: '/archive', label: '归档', position: 'left' },
  { to: '/photos', label: '影集', position: 'left' },  // 新增
  { to: '/about', label: '关于', position: 'left' },
],
```

**Step 2: 提交**

```bash
git add src/site.config.ts
git commit -m "feat: add photos to navigation"
```

---

## Task 7: 添加更多示例照片

**Files:**
- Create: `src/content/photos/coffee-blur/index.mdx`
- Create: `src/content/photos/city-at-3am/index.mdx`

**Step 1: 创建第二个照片故事**

`src/content/photos/coffee-blur/index.mdx`：

```mdx
---
title: "失焦的咖啡"
date: 2024-04-02
location: "上海，永康路"
camera: "Fujifilm X100V"
tags: ["咖啡", "生活", "上海"]
cover: "./cover.jpg"
mood: "calm"
---

别问，问就是意境。

那天下午阳光很好，我坐在窗边。
咖啡的热气模糊了玻璃，也模糊了我的焦点。

有时候，看得太清楚反而没意思。
失焦的世界里，一切都很温柔。
```

**Step 2: 创建第三个照片故事**

`src/content/photos/city-at-3am/index.mdx`：

```mdx
---
title: "凌晨三点的城市"
date: 2024-05-20
location: "深圳，南山"
camera: "Sony A7C"
film: "Cinestill 800T"
tags: ["夜景", "城市", "深圳"]
cover: "./cover.jpg"
mood: "melancholy"
---

只有猫和路灯醒着。

加班到深夜，走出写字楼的那一刻，
整个世界都安静了。

路灯把影子拉得很长，
像是白天所有疲惫的延伸。

但奇怪的是，我并不觉得孤单。
这座城市里，一定还有和我一样的人，
在凌晨三点的街头，和路灯说晚安。
```

**Step 3: 提交**

```bash
git add src/content/photos/
git commit -m "feat: add more sample photo stories"
```

---

## Task 8: 添加样式优化

**Files:**
- Modify: `src/styles/global.css`

**Step 1: 添加影集相关样式**

在 `src/styles/global.css` 末尾添加：

```css
/* 影集页面样式 */
.photo-card {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.photo-card:hover {
  transform: rotate(0deg) scale(1.02) !important;
  z-index: 10;
}

/* 故事内容样式 */
.prose blockquote {
  border-left: 3px solid #E74C3C;
  padding-left: 1rem;
  font-style: italic;
  color: #6B6B6B;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.8;
}
```

**Step 2: 提交**

```bash
git add src/styles/global.css
git commit -m "style: add photo stories specific styles"
```

---

## Task 9: 验证和测试

**Files:**
- Run: 开发服务器

**Step 1: 启动开发服务器**

```bash
pnpm dev
```

**Step 2: 验证清单**

- [ ] 访问 `/photos` 页面正常显示
- [ ] 不对称网格布局正确
- [ ] 照片卡片有随机旋转效果
- [ ] 悬停时卡片旋转回正并放大
- [ ] 情绪色条显示正确
- [ ] 点击照片进入详情页
- [ ] 详情页显示完整故事内容
- [ ] 上一篇/下一篇导航正常
- [ ] 导航栏有"影集"入口
- [ ] 响应式布局在移动端正常

**Step 3: 修复问题并提交**

如有问题，修复后提交：

```bash
git add .
git commit -m "fix: address review feedback"
```

---

## 完成总结

实现完成后，你将拥有：

1. **影集首页** (`/photos`) - 不对称瀑布流展示所有照片
2. **照片详情页** (`/photos/[id]`) - 展示大图和完整故事
3. **照片卡片组件** - 带情绪标签和悬停动效
4. **内容集合配置** - 使用 MDX 管理照片故事
5. **导航集成** - 影集入口添加到顶部导航

**文件结构：**
```
src/
├── content/
│   ├── photos/
│   │   ├── config.ts          # 集合配置
│   │   ├── old-bookstall/
│   │   │   ├── index.mdx      # 照片故事
│   │   │   └── cover.jpg      # 封面图
│   │   ├── coffee-blur/
│   │   └── city-at-3am/
├── components/
│   └── PhotoCard.astro        # 照片卡片组件
├── pages/
│   └── photos/
│       ├── index.astro        # 影集首页
│       └── [id].astro         # 照片详情页
```

---

**执行选项：**

1. **Subagent-Driven (本会话)** - 我为每个任务分配子代理，逐任务执行+代码审查
2. **Parallel Session (新会话)** - 在新会话中使用 executing-plans 批量执行

请选择执行方式。
