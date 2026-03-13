#!/usr/bin/env node

/**
 * 创建新文章脚本
 * 自动生成 front matter 并创建 markdown 文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取命令行参数
const args = process.argv.slice(2);

// 显示帮助信息
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
用法: node scripts/newpost.js [选项] <文章标题>

选项:
  -c, --category <分类>    设置分类 (默认: 随笔)
  -t, --tags <标签>        设置标签，逗号分隔 (默认: 空)
  -d, --desc <描述>        设置描述
  -f, --folder             使用文件夹模式创建 (如: my-post/index.md)

示例:
  node scripts/newpost.js "我的新文章"
  node scripts/newpost.js -c "技术" -t "astro,博客" "我的新文章"
  node scripts/newpost.js -f "我的新文章"
`);
  process.exit(0);
}

// 解析参数
let title = '';
let category = '随笔';
let tags = [];
let description = '';
let useFolder = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case '-c':
    case '--category':
      category = args[++i] || category;
      break;
    case '-t':
    case '--tags':
      tags = (args[++i] || '').split(',').map(t => t.trim()).filter(Boolean);
      break;
    case '-d':
    case '--desc':
      description = args[++i] || '';
      break;
    case '-f':
    case '--folder':
      useFolder = true;
      break;
    default:
      if (!arg.startsWith('-')) {
        title = arg;
      }
  }
}

// 验证标题
if (!title) {
  console.error('❌ 错误: 请提供文章标题');
  console.error('用法: node scripts/newpost.js "文章标题"');
  process.exit(1);
}

// 如果没有提供描述，使用标题作为默认描述
if (!description) {
  description = title;
}

// 生成 slug（用于文件名）
const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
  .substring(0, 50);

// 生成日期
const now = new Date();
const dateStr = now.toISOString().split('T')[0];
const dateTimeStr = now.toISOString().split('.')[0];

// 格式化 tags
const tagsStr = tags.length > 0 ? `\n  - ${tags.join('\n  - ')}` : '';

// 生成 front matter
const frontMatter = `---
title: ${title}
date: ${dateTimeStr}
category: ${category}
tags:${tagsStr}
description: ${description}
readingTime: 5分钟
---

# ${title}

在这里开始写作...
`;

// 确定文件路径
const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');

let filePath;
if (useFolder) {
  // 文件夹模式: my-post/index.md
  const folderPath = path.join(postsDir, slug);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  filePath = path.join(folderPath, 'index.md');
} else {
  // 单文件模式: my-post.md
  filePath = path.join(postsDir, `${slug}.md`);
}

// 检查文件是否已存在
if (fs.existsSync(filePath)) {
  console.error(`❌ 错误: 文件已存在: ${filePath}`);
  process.exit(1);
}

// 写入文件
fs.writeFileSync(filePath, frontMatter, 'utf-8');

console.log(`✅ 文章创建成功!`);
console.log(`📄 文件路径: ${filePath}`);
console.log(`📋 标题: ${title}`);
console.log(`📂 分类: ${category}`);
console.log(`🏷️  标签: ${tags.length > 0 ? tags.join(', ') : '无'}`);
