<template>
  <div
    class="flex items-center p-3 border-b transition-colors duration-150 ease-in-out"
    :class="{
      'bg-muted/50 hover:bg-muted': todo.completed,
      'hover:bg-accent/50': !todo.completed
    }"
  >
    <Checkbox
      :id="'todo-' + todo.id"
      :checked="todo.completed"
      @update:checked="handleToggle"
      class="mr-3 shrink-0"
      aria-label="Toggle todo completion"
    />
    <label
      :for="'todo-' + todo.id"
      class="flex-grow cursor-pointer"
      :class="{ 'line-through text-muted-foreground': todo.completed }"
    >
      {{ todo.text }}
    </label>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="icon" class="ml-2 shrink-0">
          <Icon name="lucide:more-vertical" class="h-5 w-5" />
          <span class="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @select="openEditDialog">
          <Icon name="lucide:edit-3" class="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @select="handleDelete" class="text-destructive focus:text-destructive focus:bg-destructive/10">
          <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Edit Dialog (using Dialog component from shadcn-vue) -->
    <Dialog :open="isEditDialogOpen" @update:open="isEditDialogOpen = $event">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to your todo item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="editText" class="text-right">
              Text
            </Label>
            <Input id="editText" v-model="editText" class="col-span-3" />
          </div>
          <p v-if="editError" class="text-destructive text-sm col-span-4">{{ editError }}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isEditDialogOpen = false">Cancel</Button>
          <Button @click="handleSaveEdit" :disabled="isSavingEdit">
            <span v-if="isSavingEdit">Saving...</span>
            <span v-else>Save changes</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Todo } from '~/utils/types'; // Corrected: Import frontend Todo type from utils
import { useTodoStore } from '~/stores/todos';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Icon } from '#components'; // Nuxt Icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateTodoSchema } from '~/zod-schemas/todo';


const props = defineProps<{
  todo: Todo;
}>();

const store = useTodoStore();

const handleToggle = async () => {
  // Optimistic update is handled in store, just call the action
  try {
    await store.toggleTodo(props.todo.id);
  } catch (error) {
    console.error('Failed to toggle todo in component:', error);
    // Potentially show a toast/notification here
  }
};

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this todo?')) {
    try {
      await store.deleteTodo(props.todo.id);
    } catch (error) {
      console.error('Failed to delete todo in component:', error);
      // Potentially show a toast/notification here
    }
  }
};

// Edit functionality
const isEditDialogOpen = ref(false);
const editText = ref('');
const editError = ref<string | null>(null);
const isSavingEdit = ref(false);

watch(() => props.todo, (newTodo) => {
  editText.value = newTodo.text;
}, { immediate: true });

const openEditDialog = () => {
  editText.value = props.todo.text; // Reset text on open
  editError.value = null;
  isEditDialogOpen.value = true;
};

const handleSaveEdit = async () => {
  editError.value = null;
  const validationResult = updateTodoSchema.safeParse({ text: editText.value });

  if (!validationResult.success) {
    editError.value = validationResult.error.flatten().fieldErrors.text?.[0] || 'Invalid input.';
    return;
  }

  if (!editText.value.trim()) {
      editError.value = "Todo text cannot be empty.";
      return;
  }

  isSavingEdit.value = true;
  try {
    await store.updateTodo(props.todo.id, { text: editText.value });
    isEditDialogOpen.value = false; // Close dialog on success
  } catch (error: any) {
    console.error('Failed to save edit in component:', error);
    editError.value = error.data?.message || error.message || 'Failed to save. Please try again.';
     if (error.data && error.data.data) {
        const serverFieldErrors = error.data.data as Record<string, string[]>;
        if (serverFieldErrors.text && serverFieldErrors.text.length > 0) {
            editError.value = serverFieldErrors.text[0];
        }
    }
  } finally {
    isSavingEdit.value = false;
  }
};

</script>

<style scoped>
/* Scoped styles if necessary */
</style>
