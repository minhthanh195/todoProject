"use client";
import { useState, useEffect, useRef } from "react";
import { Todo } from "@/types/todo";
import { supabase } from "@/lib/supabase";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useTodoManager(currentGroup: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletedTodos, setDeletedTodos] = useState<Todo[]>([]);
  const undoTimers = useRef<Record<number, NodeJS.Timeout>>({});
  const [groupSaved, setGourpSaved] = useLocalStorage('group','Person')

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setGourpSaved(currentGroup);

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("group", currentGroup)
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Lỗi fetch Supabase:", error.message);
        setError(true);
      } else {
        setTodos(data as Todo[]);
      }
      setLoading(false);
    };
    fetchTodos();
  }, [currentGroup]);

  const addTodo = async (todo: Todo) => {
    const { error } = await supabase.from("todos").insert([todo]);
    if (error) {
      console.error("Lỗi thêm todo:", error.message);
    } else {
      setTodos((prev) => [todo, ...prev]);
    }
  };

  const editTodo = async (id: number, newText: string) => {
    const { error } = await supabase
      .from("todos")
      .update({ text: newText })
      .eq("id", id);

    if (error) console.error("Lỗi sửa todo:", error.message);
    else
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
      );
  };

  const toggleCompleted = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updated = {
      completed: !todo.completed,
      completedAt: !todo.completedAt ? new Date().toISOString() : undefined,
    };

    const { error } = await supabase.from("todos").update(updated).eq("id", id);

    if (error) console.error("Lỗi toggle:", error.message);
    else
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      );
  };

  const deleteTodo = async (id: number) => {
    const deleted = todos.find((t) => t.id === id);
    if (!deleted) return;

    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Lỗi xoá todo:", error.message);
      return;
    }

    setDeletedTodos((prev) => [deleted, ...prev]);
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const timeout = setTimeout(() => {
      setDeletedTodos((prev) => prev.filter((t) => t.id !== id));
      delete undoTimers.current[id];
    }, 10000);

    undoTimers.current[id] = timeout;
  };

  const undoLastDelete = async () => {
    const [last, ...rest] = deletedTodos;
    if (!last) return;

    if (undoTimers.current[last.id]) {
      clearTimeout(undoTimers.current[last.id]);
      delete undoTimers.current[last.id];
    }

    const { error } = await supabase.from("todos").insert([last]);
    if (error) {
      console.error("Lỗi undo:", error.message);
      return;
    }

    setTodos((prev) => [last, ...prev]);
    setDeletedTodos(rest);
  };

  const clearCompleted = async () => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("group", currentGroup)
      .eq("completed", true);

    if (error) console.error("Lỗi xoá completed:", error.message);
    else setTodos((prev) => prev.filter((t) => !t.completed));
  };

  return {
    todos,
    loading,
    error,
    deletedTodos,
    addTodo,
    editTodo,
    toggleCompleted,
    deleteTodo,
    clearCompleted,
    undoLastDelete,
    setTodos,
    groupSaved,
  };
}
