/**
 * 站点全局配置文件
 * 类似 Docusaurus 的 docusaurus.config.js
 * 集中管理站点信息、导航、页脚等配置
 */

export const siteConfig = {
  // 站点基本信息
  title: 'AiScReam',
  description: '一个关于留白与思考的空间',
  tagline: '留白之处，自有天地',
  url: 'https://www.iicemeta.com',
  baseUrl: '/',
  favicon: '/favicon.svg',
  language: 'zh-CN',

  // 作者信息
  author: {
    name: 'iicemeta',
    email: 'me@iicemeta.com',
  },

  // 社交链接配置（全局统一）
  socialLinks: [
    { name: 'GitHub', href: 'https://github.com/iicemeta', icon: 'simple-icons:github' },
    { name: 'Twitter', href: 'https://x.com/iicemeta', icon: 'simple-icons:x' },
    { name: 'Email', href: 'mailto:me@iicemeta.com', icon: 'simple-icons:gmail' },
  ],

  // 导航配置
  navbar: {
    // 站点 Logo/标题
    title: 'AiScReam',
    // Logo 图片（可选）
    logo: {
      alt: 'AiScReam',
      src: '',
    },
    // 导航项
    items: [
      { to: '/', label: '首页', position: 'left' },
      { to: '/categories', label: '分类', position: 'left' },
      { to: '/tags', label: '标签', position: 'left' },
      { to: '/archive', label: '归档', position: 'left' },
      { to: '/about', label: '关于', position: 'left' },
    ],
  },

  // 页脚配置
  footer: {
    // 版权信息
    copyright: `© ${new Date().getFullYear()} · 留白之处，自有天地`,
    // 页脚链接分组（可选）
    links: [
      // 示例：添加社交链接
      // {
      //   title: '社交',
      //   items: [
      //     { label: 'GitHub', href: 'https://github.com' },
      //     { label: 'Twitter', href: 'https://twitter.com' },
      //   ],
      // },
    ],
    // 是否显示页脚
    enabled: true,
  },

  // Hero 区域配置
  hero: {
    // 日文装饰文字
    greeting: '愛♡スクリ～ム！',
    // 主标题（支持换行，用数组表示每一行）
    title: ['在留白中', '寻找文字的温度'],
    // 副标题/描述
    subtitle: '记录技术、生活与思考。相信简单的力量，追求本质的美。',
  },

  // 主题配置
  theme: {
    // 颜色主题
    colors: {
      primary: '#E74C3C',
      text: '#1A1A1A',
      textMuted: '#6B6B6B',
      background: '#FAF9F6',
      border: '#E8E8E8',
    },
    // 字体
    fonts: {
      sans: 'Noto Sans SC',
      serif: 'Noto Serif SC',
    },
  },

  // 默认 CC 许可证配置
  license: {
    // 默认许可证类型
    // 可选: 'by-nc-sa' | 'by-nc-nd' | 'by-sa' | 'by-nd' | 'by' | 'zero'
    default: 'by-sa' as const,
    // 版本号
    version: '4.0',
  },
} as const;

// 类型导出，方便在其他文件中使用
type SiteConfig = typeof siteConfig;
export type { SiteConfig };
