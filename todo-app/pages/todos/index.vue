<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-3xl font-semibold mb-6 text-center">My Todos</h2>

    <TodoForm />

    <TodoList />

    <!-- Global error display for store errors, if not handled within TodoList -->
    <!-- <div v-if="todoStore.fetchError" class="my-4 p-3 bg-destructive/20 text-destructive rounded">
      Error fetching todos: {{ todoStore.fetchError.message }}
    </div>
    <div v-if="todoStore.mutationError" class="my-4 p-3 bg-destructive/20 text-destructive rounded">
      Operation error: {{ todoStore.mutationError }}
    </div> -->
  </div>
</template>

<script setup lang="ts">
import TodoForm from '~/components/todos/TodoForm.vue';
import TodoList from '~/components/todos/TodoList.vue';
import { useTodoStore } from '~/stores/todos';

const todoStore = useTodoStore();

// Set up page metadata
useHead({
  title: 'My Todos - Nuxt Todo App',
  meta: [
    { name: 'description', content: 'Manage your todos effectively with this Nuxt-powered app.' }
  ]
});

// The Pinia store `useTodoStore` initializes `useFetch` when the store is first accessed.
// Nuxt will ensure this happens appropriately on server/client.
// If we need to explicitly trigger a fetch or refresh under certain conditions on this page,
// we can call `todoStore.refreshTodos()`. For example, if coming from another page
// and we want to ensure data is fresh without a full page reload.
// However, `useFetch` typically handles this well with its caching and lifecycle.

// Example: Refresh todos when the page becomes visible after being hidden
// import { usePageVisibility } from '@vueuse/core';
// const visibility = usePageVisibility();
// watch(visibility, (current, previous) => {
//   if (current === 'visible' && previous === 'hidden') {
//     console.log('Page became visible, refreshing todos if needed.');
//     todoStore.refreshTodos();
//   }
// });

</script>

<style scoped>
/* Page-specific styles if needed */
</style>
