/**
 * 滚动动画控制器
 * 为网站添加流畅的滚动触发动画
 */

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

class ScrollReveal {
  options: { threshold: number; rootMargin: string; once: boolean };
  observer: IntersectionObserver | null;
  elements: Set<Element>;

  constructor(options: ScrollRevealOptions = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      once: true,
      ...options,
    };
    this.observer = null;
    this.elements = new Set();

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      this.handleIntersect.bind(this),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin,
      }
    );

    this.observeElements();
    this.observeDOMChanges();
  }

  handleIntersect(entries: IntersectionObserverEntry[]) {
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

  revealElement(element: Element) {
    requestAnimationFrame(() => {
      element.classList.add('visible');
    });
  }

  hideElement(element: Element) {
    requestAnimationFrame(() => {
      element.classList.remove('visible');
    });
  }

  observeElements() {
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

  observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            if (
              node.classList.contains('reveal') ||
              node.classList.contains('reveal-left') ||
              node.classList.contains('reveal-right') ||
              node.classList.contains('reveal-scale') ||
              node.classList.contains('blur-in')
            ) {
              this.observe(node);
            }

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

  observe(element: Element) {
    if (this.elements.has(element)) return;

    this.elements.add(element);
    this.observer?.observe(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
    this.observer?.unobserve(element);
  }

  destroy() {
    this.observer?.disconnect();
    this.elements.clear();
  }
}

// 初始化
function initAnimations() {
  new ScrollReveal();

  // 锚点平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
