import { Insertable, Selectable, Updateable } from "kysely";
import { db } from "../db";
import { Todos } from "../db/types";
import { Logger } from "../logging";

export type CreateTodoInput = Insertable<Todos>;
export type UpdateTodoInput = Updateable<Todos>;
export type TodoRecord = Selectable<Todos>;

const log = Logger.forModule();

/**
 * Get all todos ordered by creation date (newest first)
 */
export async function getAllTodos(): Promise<TodoRecord[]> {
  return await db
    .selectFrom("todos")
    .selectAll()
    .orderBy("id", "asc")
    .execute();
}

/**
 * Create a new todo
 */
export async function createTodo(input: CreateTodoInput): Promise<TodoRecord> {
  log.info("Creating todo %s", input.text);
  return await db
    .insertInto("todos")
    .values({
      text: input.text,
      completed: false,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Update an existing todo
 */
export async function updateTodo(
  id: number,
  input: UpdateTodoInput,
): Promise<TodoRecord> {
  log.info("Updating todo %s with %s", id, input);
  return await db
    .updateTable("todos")
    .set({
      ...input,
      updated_at: new Date(),
    })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: number): Promise<TodoRecord> {
  log.info("Deleting todo %s", id);
  return await db
    .deleteFrom("todos")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}
