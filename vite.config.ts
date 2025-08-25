/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/bundle.ts'),
      name: 'xenharmonic-tool',
      fileName: 'bundle',
    },
    minify: 'esbuild'
  },
  test: {
    environment: 'jsdom',
  },
});
