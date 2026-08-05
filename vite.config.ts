// Demo-app build — plain `vite build` (see `build:lib` in vite-lib.config.ts
// for the library bundle). The demo is a small multi-page app: the root
// index.html plus one static page per tag under tags/<tag>/, so
// build.rollupOptions.input has to list every entry explicitly or `vite
// build` would only emit the root page.

import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        webcomponents: resolve(
          import.meta.dirname,
          'tags/webcomponents/index.html',
        ),
        opensource: resolve(
          import.meta.dirname,
          'tags/opensource/index.html',
        ),
      },
    },
  },
})
