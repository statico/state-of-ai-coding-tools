"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc/client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

export default function HomePage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [newTodoText, setNewTodoText] = useState("");
  const [localTodoTexts, setLocalTodoTexts] = useState<Record<number, string>>(
    {},
  );

  const { data: todos } = useQuery(
    trpc.todos.getAll.queryOptions(undefined, {
      placeholderData: keepPreviousData,
    }),
  );

  // Get the current text for a todo, using local state if available, otherwise server data
  const getTodoText = (todo: any) => {
    return localTodoTexts[todo.id] !== undefined
      ? localTodoTexts[todo.id]
      : todo.text;
  };

  const createTodo = useMutation(
    trpc.todos.create.mutationOptions({
      onSuccess: () => {
        setNewTodoText("");
        toast.success("Todo created successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.todos.getAll.queryKey(),
        });
      },
    }),
  );

  const updateTodo = useMutation(
    trpc.todos.update.mutationOptions({
      onSuccess: () => {
        toast.success("Todo updated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.todos.getAll.queryKey(),
        });
      },
    }),
  );

  const deleteTodo = useMutation(
    trpc.todos.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Todo deleted successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.todos.getAll.queryKey(),
        });
      },
    }),
  );

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      createTodo.mutate({ text: newTodoText.trim() });
    }
  };

  const handleToggleComplete = (id: number, completed: boolean) => {
    updateTodo.mutate({ id, completed });
  };

  // Debounced callback for updating todo text
  const debouncedUpdateText = useDebouncedCallback(
    (id: number, text: string) => {
      if (text.trim()) {
        updateTodo.mutate({ id, text: text.trim() });
      }
    },
    500, // 500ms delay
  );

  const handleUpdateText = (id: number, text: string) => {
    // Update local state immediately for responsive UI
    setLocalTodoTexts((prev) => ({ ...prev, [id]: text }));
    // Debounce the actual database update
    debouncedUpdateText(id, text);
  };

  const handleDelete = (id: number) => {
    deleteTodo.mutate({ id });
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCreateTodo} className="flex gap-2">
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!newTodoText.trim() || createTodo.isPending}
            >
              Add
            </Button>
          </form>

          <div className="space-y-2">
            {!todos && (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            )}
            {todos?.map((todo: any) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(checked) =>
                    handleToggleComplete(todo.id, checked as boolean)
                  }
                />
                <Input
                  value={getTodoText(todo)}
                  onChange={(e) => handleUpdateText(todo.id, e.target.value)}
                  className={`flex-1 ${
                    todo.completed ? "text-gray-500 line-through" : ""
                  }`}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {todos?.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No todos yet. Add one above!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
