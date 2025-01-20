/// <reference types="vite/client" />

interface Window {
  MathJax: {
    typesetPromise?: () => Promise<void>;
    tex2chtml?: (tex: string) => HTMLElement;
    startup?: {
      promise: Promise<void>;
    };
  };
}