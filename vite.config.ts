/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    dts({ tsconfigPath: resolve(__dirname, './tsconfig.lib.json') }),
    svelte(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/bundle.ts'),
      name: 'xenharmonic-tool',
      fileName: 'bundle',
      formats: ['es'],
    },
  },
  test: {
    environment: 'jsdom',
    testTimeout: 15000,
  },
});
