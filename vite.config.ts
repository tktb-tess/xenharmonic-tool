/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      fileName: 'bundle',
      formats: ['es'],
    },
  },
  test: {
    environment: 'jsdom',
    testTimeout: 15000,
  },
});
