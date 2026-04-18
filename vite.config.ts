/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'unplugin-dts/vite';

const names = ['monzo', 'val', 'util', 'main'];

export default defineConfig({
  plugins: [dts()],
  server: {
    port: 8000,
  },
  build: {
    lib: {
      entry: names.map((name) => resolve(__dirname, `./lib/${name}.ts`)),
      fileName: (_, fileName) => `${fileName}.js`,
      formats: ['es'],
      
    },
    minify: 'oxc',
    outDir: 'dist/esm',
  },
  test: {
    testTimeout: 30000,
  },
});
