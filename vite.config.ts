import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  base: '/dicom-pixel-decoder',
  plugins: [
    react(),
    commonjs(),
  ],
  resolve: {
    alias: {
      "@lib":"/lib",
      "@src":"/react-test",
      "@package":"/package",
    },
  },
})
