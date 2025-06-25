import type { Todo as DbTodo } from '~/server/db/schema';

/**
 * Represents a Todo item as used on the frontend.
 * Timestamps are Date objects.
 */
export interface Todo extends Omit<DbTodo, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to transform a single DB Todo to a frontend Todo
export function transformDbTodoToFrontendTodo(dbTodo: DbTodo): Todo {
  return {
    ...dbTodo,
    createdAt: new Date(dbTodo.createdAt * 1000),
    updatedAt: new Date(dbTodo.updatedAt * 1000),
  };
}

// Helper function to transform an array of DB Todos to frontend Todos
export function transformDbTodosToFrontendTodos(dbTodos: DbTodo[]): Todo[] {
  return dbTodos.map(transformDbTodoToFrontendTodo);
}

// We can also re-export Zod types if they are widely used in the client-side
// for forms or other logic, though direct import from '~/zod-schemas/todo' is also fine.
// Example:
// export type { CreateTodoSchema, UpdateTodoSchema } from '~/zod-schemas/todo';
