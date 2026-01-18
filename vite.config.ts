/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  server: {
    port: 8000,
  },
  build: {
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      fileName: (format) => (format === 'iife' ? 'bundle.min.js' : 'bundle.js'),
      formats: ['es', 'iife'],
      name: 'XenTool',
    },
  },
  test: {
    testTimeout: 30000,
  },
});
