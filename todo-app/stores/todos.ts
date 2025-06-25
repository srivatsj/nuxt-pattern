import { defineStore } from 'pinia';
import { ref, computed } from 'vue'; // Removed 'watch' as it's not used here directly
import type { Todo as DbTodo } from '~/server/db/schema'; // Raw type from DB
import type { CreateTodoSchema, UpdateTodoSchema } from '~/zod-schemas/todo';
import type { Todo } from '~/utils/types'; // Import frontend Todo type
import { transformDbTodosToFrontendTodos } from '~/utils/types'; // Import transformer

export const useTodoStore = defineStore('todos', () => {
  // Use useFetch to get todos, its state will be managed by Nuxt
  const {
    data: fetchedTodos, // This is a Ref<Todo[] | null> after transformation
    pending: loading,   // Ref<boolean>
    error: fetchError,  // Ref<Error | null>
    refresh: refreshTodos // Function to re-fetch data
  } = useFetch<DbTodo[]>('/api/todos', { // Fetches DbTodo[]
    default: () => [],
    transform: (data: DbTodo[] | null): Todo[] => { // Explicitly type input and output of transform
        return data ? transformDbTodosToFrontendTodos(data) : [];
    }
    // `lazy: true` can be used if we don't want to block navigation
    // `server: false` can be used if we only want to fetch on client-side
  });

  // The store's primary reactive state for todos.
  // `fetchedTodos` from `useFetch` is already the transformed data (Ref<Todo[] | null>)
  // So, `todos` computed is just ensuring it's an array.
  const todos = computed<Todo[]>(() => fetchedTodos.value || []);

  // We might need a separate error state for mutations if we want to distinguish
  // fetch errors from mutation errors. For now, mutation errors will be logged
  // and potentially handled by components calling the actions.
  const mutationError = ref<string | null>(null);

  async function addTodo(todoData: CreateTodoSchema) {
    mutationError.value = null;
    try {
      const newTodo = await $fetch<DbTodo>('/api/todos', {
        method: 'POST',
        body: todoData,
      });
      // Instead of manually pushing, we refresh the list to get the latest state from server
      // This ensures consistency if other operations happened or if server modifies data upon creation.
      await refreshTodos();
    } catch (e: any) {
      mutationError.value = e.data?.message || e.message || 'Failed to add todo';
      console.error(mutationError.value);
      throw e; // Re-throw for component to handle if needed
    }
  }

  async function updateTodo(id: number, updates: UpdateTodoSchema) {
    mutationError.value = null;
    try {
      await $fetch<DbTodo>(`/api/todos/${id}`, {
        method: 'PUT',
        body: updates,
      });
      await refreshTodos();
    } catch (e: any) {
      mutationError.value = e.data?.message || e.message || 'Failed to update todo';
      console.error(mutationError.value);
      throw e;
    }
  }

  async function deleteTodo(id: number) {
    mutationError.value = null;
    try {
      await $fetch(`/api/todos/${id}`, { method: 'DELETE' });
      await refreshTodos();
    } catch (e: any) {
      mutationError.value = e.data?.message || e.message || 'Failed to delete todo';
      console.error(mutationError.value);
      throw e;
    }
  }

  async function toggleTodo(id: number) {
    mutationError.value = null;

    // Optimistic update:
    // Find the local todo and toggle its state immediately
    const todoIndex = fetchedTodos.value?.findIndex(t => t.id === id);
    let originalCompletedStatus: boolean | undefined = undefined;

    if (fetchedTodos.value && todoIndex !== undefined && todoIndex !== -1) {
        const todoToToggle = fetchedTodos.value[todoIndex];
        originalCompletedStatus = todoToToggle.completed;
        // Create a new object for reactivity if items are complex; direct mutation of ref content is fine.
        fetchedTodos.value[todoIndex] = {
            ...todoToToggle,
            completed: !todoToToggle.completed,
            updatedAt: Math.floor(Date.now() / 1000) // keep it as number before transform for consistency
        };
    }

    try {
      await $fetch<DbTodo>(`/api/todos/${id}/toggle`, {
        method: 'POST',
      });
      // Refresh to ensure consistency, though optimistic update handles UI.
      // If server response is slightly different, refresh will correct it.
      await refreshTodos();
    } catch (e: any) {
      mutationError.value = e.data?.message || e.message || 'Failed to toggle todo';
      console.error(mutationError.value);

      // Revert optimistic update on error
      if (fetchedTodos.value && todoIndex !== undefined && todoIndex !== -1 && originalCompletedStatus !== undefined) {
        fetchedTodos.value[todoIndex] = {
            ...fetchedTodos.value[todoIndex],
            completed: originalCompletedStatus,
            // We might want to revert updatedAt as well or just rely on next refresh
        };
      }
      throw e;
    }
  }

  return {
    todos,       // Renamed from `items` for clarity, this is the transformed list
    loading,     // `pending` from useFetch, renamed to `loading`
    fetchError,  // Error object from the initial fetch
    mutationError, // Separate error state for mutation actions
    refreshTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
});
