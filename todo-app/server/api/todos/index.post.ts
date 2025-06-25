import { db } from '~/server/db';
import { todos, NewTodo } from '~/server/db/schema';
import { createTodoSchema } from '~/zod-schemas/todo';
import { sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => createTodoSchema.safeParse(body));

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: result.error.flatten().fieldErrors,
    });
  }

  const { text } = result.data;

  try {
    const newTodoData: NewTodo = {
      text,
      completed: false, // Default value
      // createdAt and updatedAt will be handled by database defaults
    };

    // Drizzle's .returning() is commonly used with PostgreSQL, for SQLite, we might need to fetch separately or rely on insertId
    // For better-sqlite3, insert().run() returns info like lastInsertRowid
    const insertResult = await db.insert(todos).values(newTodoData).run();

    // Fetch the newly created todo to return it
    // SQLite's last_insert_rowid() can be used if `id` is an alias for rowid, which it is by default for INTEGER PRIMARY KEY
    // However, Drizzle's `lastInsertRowId` is not always available or consistent across drivers in the way one might expect.
    // A safe bet is to query by some unique property if available, or if `id` is returned.
    // Since `id` is auto-incrementing, and `run()` gives `lastInsertRowid`, we can use that.

    if (insertResult.lastInsertRowid) {
      const newTodo = await db.select().from(todos).where(sql`${todos.id} = ${insertResult.lastInsertRowid}`).get();
      if (!newTodo) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to retrieve created todo',
          });
      }
      return newTodo;
    } else {
      // Fallback or error if lastInsertRowid is not available
      // This part depends on how Drizzle + better-sqlite3 driver handles .run() return value for your schema
      // For now, assume lastInsertRowid is reliable.
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create todo or get its ID',
      });
    }

  } catch (e: any) {
    console.error('Error creating todo:', e.message);
    // Check if it's a known error type (like a validation error already thrown)
    if (e.statusCode) throw e;

    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to create todo',
    });
  }
});
