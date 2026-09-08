/**
 * PostCSS 配置
 * Next.js 15 默认不会自动用 PostCSS 处理 Tailwind，必须显式配置
 *
 * 处理顺序：
 * 1. tailwindcss — 把 @tailwind base/components/utilities 编译成实际 CSS
 * 2. autoprefixer — 添加浏览器前缀（-webkit-, -moz- 等）
 */

const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;