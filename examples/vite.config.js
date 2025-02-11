import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vl: resolve(__dirname, 'vega-examples.html'),
        vega: resolve(__dirname, 'vega-lite-examples.html'),
      },
    },
  },
});
