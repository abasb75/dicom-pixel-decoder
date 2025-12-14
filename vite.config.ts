import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'
import path from 'path'
import wasm from 'vite-plugin-wasm';

// https://vite.dev/config/
export default defineConfig({
  base: '/dicom-pixel-decoder',
  plugins: [
    react(),
    commonjs(),
    wasm(),
  ],
  resolve: {
    alias: {
      "@lib":"/lib",
      "@src":"/react-test",
      "@package":"/package",
      '@abasb75/dicom-parser': path.resolve(__dirname, 'libs/dicom-parser/src'),
      '@abasb75/dicom-pixel-decoder': path.resolve(__dirname, 'libs/dicom-pixel-decoder/src'),
    }
  },
  optimizeDeps: {
    include: []
  }
})
