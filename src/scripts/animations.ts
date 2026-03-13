/**
 * 滚动动画控制器
 * 为网站添加流畅的滚动触发动画
 */

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

class ScrollReveal {
  private observer: IntersectionObserver | null = null;
  private elements: Set<Element> = new Set();
  private options: RevealOptions;

  constructor(options: RevealOptions = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      once: true,
      ...options,
    };

    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      this.handleIntersect.bind(this),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin,
      }
    );

    // 自动查找所有需要动画的元素
    this.observeElements();

    // 监听 DOM 变化，自动为新元素添加动画
    this.observeDOMChanges();
  }

  private handleIntersect(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.revealElement(entry.target);

        if (this.options.once) {
          this.observer?.unobserve(entry.target);
          this.elements.delete(entry.target);
        }
      } else if (!this.options.once) {
        this.hideElement(entry.target);
      }
    });
  }

  private revealElement(element: Element): void {
    requestAnimationFrame(() => {
      element.classList.add('visible');
    });
  }

  private hideElement(element: Element): void {
    requestAnimationFrame(() => {
      element.classList.remove('visible');
    });
  }

  private observeElements(): void {
    const selectors = [
      '.reveal',
      '.reveal-left',
      '.reveal-right',
      '.reveal-scale',
      '.blur-in',
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        this.observe(el);
      });
    });
  }

  private observeDOMChanges(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            // 检查新添加的元素本身
            if (
              node.classList.contains('reveal') ||
              node.classList.contains('reveal-left') ||
              node.classList.contains('reveal-right') ||
              node.classList.contains('reveal-scale') ||
              node.classList.contains('blur-in')
            ) {
              this.observe(node);
            }

            // 检查新添加元素内部的子元素
            node
              .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .blur-in')
              .forEach((el) => this.observe(el));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  public observe(element: Element): void {
    if (this.elements.has(element)) return;

    this.elements.add(element);
    this.observer?.observe(element);
  }

  public unobserve(element: Element): void {
    this.elements.delete(element);
    this.observer?.unobserve(element);
  }

  public destroy(): void {
    this.observer?.disconnect();
    this.elements.clear();
  }
}

/**
 * 平滑滚动到指定元素
 */
function smoothScrollTo(
  target: string | Element,
  offset: number = 0
): void {
  const element =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!element) return;

  const top =
    element.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top,
    behavior: 'smooth',
  });
}

/**
 * 初始化所有动画
 */
function initAnimations(): void {
  // 初始化滚动动画
  new ScrollReveal();

  // 为锚点链接添加平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        smoothScrollTo(href, 80);
      }
    });
  });
}

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

export { ScrollReveal, smoothScrollTo, initAnimations };
