/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ tsconfigPath: resolve(__dirname, './tsconfig.lib.json') })],
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
