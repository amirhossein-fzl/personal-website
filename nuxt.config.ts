import tailwindcss from "@tailwindcss/vite";
import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/mcp-toolkit', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/test-utils/module', '@nuxt/eslint'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1` : '/api',
    },
  },
  css: ['@@/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  i18n: {
    strategy: 'prefix',
    restructureDir: '.',
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json', language: 'en-US' },
      { code: 'fa', name: 'Persian', file: 'fa.json', language: 'fa-IR' },
    ],
    defaultLocale: 'en',
  },
  alias: {
    '@utils': path.resolve(__dirname, './utils'),
    '@stores': path.resolve(__dirname, './stores'),
  },
})
