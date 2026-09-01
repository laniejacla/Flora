import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: '/Flora/' so built asset paths resolve under the GitHub Pages
// project site (https://<user>.github.io/Flora/); root '/' for local dev.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Flora/' : '/',
}))
