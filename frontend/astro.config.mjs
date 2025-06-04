import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import node from '@astrojs/node'

import react from '@astrojs/react'

export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: 'standalone',
  }),

  middleware: true,
  integrations: [react()],
})
