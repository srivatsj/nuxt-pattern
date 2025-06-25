<template>
  <div class="mt-6">
    <div v-if="store.loading && store.todos.length === 0" class="text-center py-10">
      <LoadingSpinner />
      <p class="mt-2 text-muted-foreground">Loading todos...</p>
    </div>
    <div v-else-if="store.fetchError" class="text-center py-10">
      <Icon name="lucide:alert-triangle" class="h-12 w-12 text-destructive mx-auto" />
      <p class="mt-2 text-destructive">
        Failed to load todos: {{ store.fetchError.message || store.fetchError.toString() }}
      </p>
      <Button @click="store.refreshTodos()" variant="outline" class="mt-4">
        <Icon name="lucide:refresh-cw" class="mr-2 h-4 w-4" :class="{'animate-spin': store.loading}" />
        Try Again
      </Button>
    </div>
    <div v-else-if="store.todos.length === 0" class="text-center py-10">
      <Icon name="lucide:list-checks" class="h-12 w-12 text-muted-foreground mx-auto" />
      <p class="mt-2 text-muted-foreground">No todos yet. Add one above!</p>
    </div>
    <div v-else class="bg-card border rounded-md shadow-sm">
      <TodoItem
        v-for="todo in store.todos"
        :key="todo.id"
        :todo="todo"
      />
    </div>

    <!-- Display mutation errors (e.g., from add, update, delete) -->
    <div v-if="store.mutationError" class="mt-4 p-3 bg-destructive/10 text-destructive border border-destructive/50 rounded-md">
        <Icon name="lucide:alert-circle" class="h-5 w-5 inline-block mr-2" />
        <span>{{ store.mutationError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTodoStore } from '~/stores/todos';
import TodoItem from './TodoItem.vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import { Button } from '@/components/ui/button';
import { Icon } from '#components'; // Nuxt Icon

const store = useTodoStore();

// Fetch todos when the component is mounted if they haven't been fetched yet.
// useFetch in the store handles this, but this is a good place if we didn't want auto-fetch.
// The store's useFetch will be called on store initialization anyway if it's server-true.
// If `server: false` or `lazy: true` in store's useFetch, then calling refreshTodos here
// or accessing store.todos (which triggers computed) would be necessary.
// For now, let's assume store's useFetch handles initial load.

// Example of how you might trigger a fetch if not done automatically:
// onMounted(() => {
//   if (store.todos.length === 0 && !store.loading && !store.fetchError) {
//     store.refreshTodos();
//   }
// });

</script>

<style scoped>
/* Scoped styles for TodoList if any */
</style>
