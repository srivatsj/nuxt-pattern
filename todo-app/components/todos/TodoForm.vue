<template>
  <form @submit.prevent="handleSubmit" class="flex gap-2 mb-4 items-start">
    <div class="flex-grow">
      <Input
        v-model="todoText"
        placeholder="What needs to be done?"
        :class="{ 'border-destructive': localError }"
        aria-label="New todo text"
      />
      <p v-if="localError" class="text-destructive text-sm mt-1">{{ localError }}</p>
    </div>
    <Button type="submit" :disabled="isSubmitting">
      <span v-if="isSubmitting">Adding...</span>
      <span v-else>Add Todo</span>
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '~/stores/todos';
import { createTodoSchema } from '~/zod-schemas/todo'; // For client-side validation
import { Input } from '@/components/ui/input'; // Auto-imported by Nuxt usually, but explicit for clarity
import { Button } from '@/components/ui/button'; // Auto-imported by Nuxt usually

const todoStore = useTodoStore();
const todoText = ref('');
const localError = ref<string | null>(null);
const isSubmitting = ref(false);

const handleSubmit = async () => {
  localError.value = null; // Reset local error

  // Client-side validation (optional, as backend also validates)
  const validationResult = createTodoSchema.safeParse({ text: todoText.value });
  if (!validationResult.success) {
    localError.value = validationResult.error.flatten().fieldErrors.text?.[0] || 'Invalid input.';
    return;
  }

  if (!todoText.value.trim()) {
    localError.value = 'Todo text cannot be empty.'; // Should be caught by Zod, but good fallback
    return;
  }

  isSubmitting.value = true;
  try {
    await todoStore.addTodo({ text: todoText.value });
    todoText.value = ''; // Clear input on success
  } catch (error: any) {
    // Error is already logged in store, here we can set a local message if needed
    localError.value = error.data?.message || error.message || 'Failed to add todo. Please try again.';
    // If the error is a validation error from the server, it might be more specific
    if (error.data && error.data.data) { // Assuming our server API returns Zod errors in error.data.data
        const serverFieldErrors = error.data.data as Record<string, string[]>;
        if (serverFieldErrors.text && serverFieldErrors.text.length > 0) {
            localError.value = serverFieldErrors.text[0];
        }
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Scoped styles if necessary */
</style>
