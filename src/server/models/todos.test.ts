import { describe, expect, it } from "vitest";
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "./todos";

describe("Todo Models", () => {
  describe("getAllTodos", () => {
    it("should return empty array when no todos exist", async () => {
      const todos = await getAllTodos();
      expect(todos).toEqual([]);
    });

    it("should return all todos ordered by id ascending", async () => {
      // Create test todos
      const todo1 = await createTodo({ text: "First todo" });
      const todo2 = await createTodo({ text: "Second todo" });
      const todo3 = await createTodo({ text: "Third todo" });

      const todos = await getAllTodos();
      expect(todos).toHaveLength(3);
      expect(todos[0].id).toBe(todo1.id);
      expect(todos[1].id).toBe(todo2.id);
      expect(todos[2].id).toBe(todo3.id);
    });
  });

  describe("createTodo", () => {
    it("should create a new todo with default values", async () => {
      const input = { text: "Test todo" };
      const todo = await createTodo(input);

      expect(todo.text).toBe("Test todo");
      expect(todo.completed).toBe(false);
      expect(todo.id).toBeDefined();
      expect(todo.created_at).toBeInstanceOf(Date);
      expect(todo.updated_at).toBeNull();
    });

    it("should create multiple todos with unique IDs", async () => {
      const todo1 = await createTodo({ text: "Todo 1" });
      const todo2 = await createTodo({ text: "Todo 2" });

      expect(todo1.id).not.toBe(todo2.id);
      expect(todo1.text).toBe("Todo 1");
      expect(todo2.text).toBe("Todo 2");
    });
  });

  describe("updateTodo", () => {
    it("should update todo text", async () => {
      const todo = await createTodo({ text: "Original text" });

      const updatedTodo = await updateTodo(todo.id, { text: "Updated text" });

      expect(updatedTodo.id).toBe(todo.id);
      expect(updatedTodo.text).toBe("Updated text");
      expect(updatedTodo.completed).toBe(false);
      expect(updatedTodo.updated_at).toBeInstanceOf(Date);
    });

    it("should update todo completion status", async () => {
      const todo = await createTodo({ text: "Test todo" });

      const updatedTodo = await updateTodo(todo.id, { completed: true });

      expect(updatedTodo.id).toBe(todo.id);
      expect(updatedTodo.text).toBe("Test todo");
      expect(updatedTodo.completed).toBe(true);
      expect(updatedTodo.updated_at).toBeInstanceOf(Date);
    });

    it("should update both text and completion status", async () => {
      const todo = await createTodo({ text: "Original text" });

      const updatedTodo = await updateTodo(todo.id, {
        text: "Updated text",
        completed: true,
      });

      expect(updatedTodo.id).toBe(todo.id);
      expect(updatedTodo.text).toBe("Updated text");
      expect(updatedTodo.completed).toBe(true);
      expect(updatedTodo.updated_at).toBeInstanceOf(Date);
    });

    it("should throw error when updating non-existent todo", async () => {
      await expect(updateTodo(999, { text: "Updated" })).rejects.toThrow();
    });
  });

  describe("deleteTodo", () => {
    it("should delete an existing todo", async () => {
      const todo = await createTodo({ text: "To be deleted" });

      const deletedTodo = await deleteTodo(todo.id);

      expect(deletedTodo.id).toBe(todo.id);
      expect(deletedTodo.text).toBe("To be deleted");

      // Verify todo is actually deleted
      const todos = await getAllTodos();
      expect(todos.find((t) => t.id === todo.id)).toBeUndefined();
    });

    it("should throw error when deleting non-existent todo", async () => {
      await expect(deleteTodo(999)).rejects.toThrow();
    });
  });

  describe("CRUD operations integration", () => {
    it("should handle full CRUD lifecycle", async () => {
      // Create
      const todo = await createTodo({ text: "Lifecycle test" });
      expect(todo.text).toBe("Lifecycle test");
      expect(todo.completed).toBe(false);

      // Read
      const todos = await getAllTodos();
      expect(todos.find((t) => t.id === todo.id)).toBeDefined();

      // Update
      const updatedTodo = await updateTodo(todo.id, {
        text: "Updated lifecycle test",
        completed: true,
      });
      expect(updatedTodo.text).toBe("Updated lifecycle test");
      expect(updatedTodo.completed).toBe(true);

      // Delete
      const deletedTodo = await deleteTodo(todo.id);
      expect(deletedTodo.id).toBe(todo.id);

      // Verify deletion
      const finalTodos = await getAllTodos();
      expect(finalTodos.find((t) => t.id === todo.id)).toBeUndefined();
    });
  });
});
