import { db } from '~/server/db';
import { todos } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

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
    // Optional: Check if todo exists before attempting delete
    const existingTodo = await db.select({ id: todos.id }).from(todos).where(eq(todos.id, parsedId)).get();
    if (!existingTodo) {
      throw createError({ statusCode: 404, statusMessage: 'Todo not found' });
    }

    const result = await db.delete(todos).where(eq(todos.id, parsedId)).run();

    if (result.changes === 0) {
      // This might happen if the todo was deleted by another request between the check and the delete operation
      throw createError({ statusCode: 404, statusMessage: 'Todo not found or already deleted' });
    }

    // Set appropriate status code for successful deletion with no content
    setResponseStatus(event, 204);
    return null; // Or return { message: 'Todo deleted successfully' } with 200 OK

  } catch (e: any) {
    console.error(`Error deleting todo ${parsedId}:`, e.message);
    if (e.statusCode) throw e; // Re-throw known H3 errors
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to delete todo',
    });
  }
});
