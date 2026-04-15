/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      fileName: () => 'bundle.min.js',
      formats: ['iife'],
      name: 'XenTool',
    },
    outDir: 'dist/iife'
  },
  test: {
    testTimeout: 30000,
  },
});
