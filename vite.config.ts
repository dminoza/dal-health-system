import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Maps — leaflet + react-leaflet
          if (id.includes('leaflet')) return 'chunk-maps';
          // Charts — recharts + dependencies
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) return 'chunk-charts';
          // MUI + Emotion
          if (id.includes('@mui') || id.includes('@emotion')) return 'chunk-mui';
          // Radix UI primitives
          if (id.includes('@radix-ui')) return 'chunk-radix';
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'chunk-react';
          // React Router
          if (id.includes('react-router')) return 'chunk-router';
        },
      },
    },
  },
})