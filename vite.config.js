import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { ghPages } from 'vite-plugin-gh-pages';
import { staticPages } from 'vite-plugin-static-pages';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ghPages(),staticPages()],
  base: '/Event-Search-Planner/',
  css: {
    postcss: './postcss.config.js', // Ensures PostCSS config is loaded
  },
})
