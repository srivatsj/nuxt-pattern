import { db } from '~/server/db';
import { todos } from '~/server/db/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const allTodos = await db.select().from(todos).orderBy(desc(todos.createdAt)).all();
    return allTodos;
  } catch (e: any) {
    console.error('Error fetching todos:', e.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch todos',
    });
  }
});
