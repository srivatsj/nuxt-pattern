import { db } from '~/server/db';
import { todos } from '~/server/db/schema';
import { eq, not } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing todo ID' });
  }

  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid todo ID format' });
  }

  try {
    const currentTodo = await db.select({ id: todos.id, completed: todos.completed })
      .from(todos)
      .where(eq(todos.id, parsedId))
      .get();

    if (!currentTodo) {
      throw createError({ statusCode: 404, statusMessage: 'Todo not found' });
    }

    const newCompletedStatus = !currentTodo.completed;

    await db.update(todos)
      .set({
        completed: newCompletedStatus,
        updatedAt: new Date() // Update the updatedAt timestamp
      })
      .where(eq(todos.id, parsedId))
      .run();

    const updatedTodo = await db.select().from(todos).where(eq(todos.id, parsedId)).get();
    if (!updatedTodo) {
        throw createError({ statusCode: 404, statusMessage: 'Todo not found after toggle' });
    }
    return updatedTodo;

  } catch (e: any) {
    console.error(`Error toggling todo ${parsedId}:`, e.message);
    if (e.statusCode) throw e; // Re-throw known H3 errors
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to toggle todo',
    });
  }
});
