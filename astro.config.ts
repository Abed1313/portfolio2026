import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { siteConfig } from './src/data/site.config';

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  output: 'static',

  // Inline the CSS into each page: saves a render-blocking request (faster first paint).
  build: { inlineStylesheets: 'always' },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    icon(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ar: 'ar' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
