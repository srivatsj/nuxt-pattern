<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground">
    <AppHeader />
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="text-center p-4 text-muted-foreground text-sm border-t">
      My Simple Todo App &copy; {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/common/AppHeader.vue';

// You can define meta tags, head scripts, etc., for the layout here if needed
useHead({
  bodyAttrs: {
    class: 'antialiased' // Example of adding a class to the body
  }
});
</script>

<style>
/* Global styles or layout-specific styles can go here */
/* Ensure html and body take full height if not already handled by Tailwind defaults or Nuxt */
html, body, #__nuxt {
  min-height: 100vh;
  height: 100%; /* Ensure #__nuxt also takes full height if it's the direct child */
}

/* Basic styling to make sure the footer stays at the bottom */
#__nuxt > div:first-child { /* Assuming this is the main Nuxt wrapper */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
}
</style>
