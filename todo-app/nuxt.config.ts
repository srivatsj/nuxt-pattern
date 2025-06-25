// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-icon'
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config', // This will create tailwind.config.js
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  }
})
