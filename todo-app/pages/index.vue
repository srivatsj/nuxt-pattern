<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app'; // Or use useRouter from 'vue-router'

onMounted(async () => {
  // Using navigateTo for programmatic navigation in Nuxt 3
  // It's important to use it inside onMounted or other appropriate lifecycle hooks/event handlers
  // if called on client-side. For immediate redirect, middleware is better.
  // However, for a simple client-side redirect after mount, this is fine.
  // For a server-side redirect or immediate client-side, definePageMeta is preferred.

  // await navigateTo('/todos', { replace: true });
});

// Better approach for immediate redirect: definePageMeta
// This will handle the redirect on the server side if possible, or immediately on client side.
definePageMeta({
  middleware: [
    function (to, from) {
      if (to.path === '/') {
        return navigateTo('/todos', { replace: true, redirectCode: 301 });
      }
    }
  ]
});
</script>
