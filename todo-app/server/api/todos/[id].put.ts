import { db } from '~/server/db';
import { todos } // Assuming NewTodo might not be directly applicable, but Todo type is useful
from '~/server/db/schema';
import { updateTodoSchema } from '~/zod-schemas/todo';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing todo ID' });
  }

  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid todo ID format' });
  }

  const result = await readValidatedBody(event, body => updateTodoSchema.safeParse(body));

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: result.error.flatten().fieldErrors,
    });
  }

  const { text, completed } = result.data;

  if (Object.keys(result.data).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No update data provided',
    });
  }

  try {
    // Check if todo exists
    const existingTodo = await db.select().from(todos).where(eq(todos.id, parsedId)).get();
    if (!existingTodo) {
      throw createError({ statusCode: 404, statusMessage: 'Todo not found' });
    }

    const updateData: Partial<typeof todos.$inferInsert> = {};
    if (text !== undefined) {
      updateData.text = text;
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }
    // Update the updatedAt timestamp
    updateData.updatedAt = new Date();


    const updatedRows = await db.update(todos)
      .set(updateData)
      .where(eq(todos.id, parsedId))
      .run(); // .run() for better-sqlite3, check if .returning() is supported or needed

    if (updatedRows.changes === 0) {
        // This case might occur if the data provided doesn't actually change any values
        // or if the ID wasn't found (though we check above).
        // For now, we assume if changes is 0 after a successful query, the record exists but was not modified.
        // Return the existing todo as if no change was made, or the "updated" one.
        const notActuallyUpdatedTodo = await db.select().from(todos).where(eq(todos.id, parsedId)).get();
        if (!notActuallyUpdatedTodo) throw createError({ statusCode: 404, statusMessage: 'Todo not found after update attempt' });
        return notActuallyUpdatedTodo;
    }

    const updatedTodo = await db.select().from(todos).where(eq(todos.id, parsedId)).get();
    if (!updatedTodo) {
        throw createError({ statusCode: 404, statusMessage: 'Todo not found after update' });
    }
    return updatedTodo;

  } catch (e: any) {
    console.error(`Error updating todo ${parsedId}:`, e.message);
    if (e.statusCode) throw e; // Re-throw known H3 errors
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to update todo',
    });
  }
});
