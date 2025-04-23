"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  CalendarIcon,
  FolderIcon,
  WrenchIcon,
  XCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  MoonIcon,
  SunIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import { Todo } from "@/types/todo";
import { useDebounced } from "../hooks/useDebouncedValue";
import useDarkMode from "../hooks/useDarkMode";
import { useTodoManager } from "@/hooks/useTodoManager";
import TodoItem from "../components/TodoItem";
import ConfirmDialog from "@/components/ConfirmDialog";
import { filterRecentCompleted } from "../utils/filterRecentCompleted";

export default function Home() {
  const [currentGroup, setCurrentGroup] = useState("Personal");
  const [newTodo, setNewTodo] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [filter, setFilter] = useState<"all" | "doing" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const {
    todos,
    deletedTodos,
    loading,
    error,
    addTodo,
    toggleCompleted,
    deleteTodo,
    editTodo,
    clearCompleted,
    undoLastDelete,
    dataGroup
  } = useTodoManager(currentGroup);

  const { isDark, toggleDark, isReady } = useDarkMode();
  const debouncedSearchTerm = useDebounced(searchTerm, 500);
  const groupList = [
    {
      key: "Personal",
      text: "Cá nhân",
    },
    {
      key: "Work",
      text: "Công việc",
    },
    {
      key: "Study",
      text: "Học tập",
    },
    {
      key: "Diff",
      text: "Khác",
    },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };
  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    const tags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    // console.log('khi dua len',tags);

    const newItem: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
      tags,
      deadline: newDeadline || undefined,
      completedAt: undefined,
      group: currentGroup,
    };
    await addTodo(newItem);
    setNewTodo("");
    setNewTags("");
    setNewDeadline("");
  };

  const visibleTodos = filterRecentCompleted(todos);
  const filteredTodos = visibleTodos.filter((todo) =>
    todo.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const saved = localStorage.getItem("recent-searches");
    if (saved) setRecentSearches(JSON.parse(saved));
    if(dataGroup) setCurrentGroup(dataGroup);
  }, []);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) return;
    const keyword = debouncedSearchTerm.trim();
    setRecentSearches((prev) => {
      const newList = [keyword, ...prev.filter((k) => k !== keyword)].slice(
        0,
        7
      );
      localStorage.setItem("recent-searches", JSON.stringify(newList));
      return newList;
    });
  }, [debouncedSearchTerm]);

  if (!isReady || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 transition">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ... phần JSX giữ nguyên, chỉ đổi các handler thành hàm từ hook như:
  // onToggle={toggleCompleted}, onEdit={editTodo}, onDelete={() => setTodoToDelete(todo)}

  return (
    <>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow rounded-xl p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDark}
              className="flex gap-[3px] text-sm text-stone-950 dark:text-stone-50 hover:underline cursor-pointer"
            >
              Chế độ :{" "}
              {isDark ? (
                <>
                  Tối
                  <MoonIcon className="w-5 h-5 text-amber-300  pointer-events-none" />
                </>
              ) : (
                <>
                  Sáng
                  <SunIcon className="w-5 h-5 text-amber-300 dark:text-gray-300 pointer-events-none" />
                </>
              )}
            </button>
          </div>
          <div className="mb-6 flex items-center gap-4">
            <label className="flex gap-[3px] text-sm font-medium text-gray-700 dark:text-gray-300">
              <FolderIcon className="w-5 h-5 text-gray-500 dark:text-gray-300 pointer-events-none" />
              Danh sách:
            </label>

            <div className="relative">
              <select
                value={currentGroup}
                onChange={(e) => setCurrentGroup(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
               text-sm rounded px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 
               text-gray-800 dark:text-gray-100 shadow-sm transition"
              >
                {groupList.map((g, index) => (
                  <option key={index} value={g.key}>
                    {g.text}
                  </option>
                ))}
              </select>

              {/* ▼ icon */}
              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-300 pointer-events-none" />
              </div>
            </div>
          </div>

          <h1 className="flex gap-[6px] justify-center items-center text-3xl font-bold text-neutral-600 dark:text-stone-50 text-center mb-6">
            <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600 dark:text-gray-300 pointer-events-none" />
            Danh sách việc cần làm
          </h1>

          <form onSubmit={handleAddTodo} className="flex gap-2 mb-6 flex-col">
            <input
              type="text"
              value={newTodo}
              onChange={handleInputChange}
              placeholder="Nhập việc cần làm..."
              className="flex-1 border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none text-zinc-700 dark:text-neutral-50"
            />
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Thêm tags: urgent, study, bug, personal, work, .etc"
              className="w-full mt-2 border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none text-zinc-700 dark:text-neutral-50"
            />
            <div className="relative w-full mt-2">
              <input
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="pl-10 pr-3 py-2 w-full rounded border border-gray-300 dark:border-gray-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Thêm
            </button>
          </form>
          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => setFilter("all")}
              className={`text-sm px-2 py-1 rounded ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 cursor-pointer"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("doing")}
              className={`text-sm px-2 py-1 rounded ${
                filter === "doing"
                  ? "bg-emerald-400 text-white"
                  : "bg-gray-200 text-gray-700 cursor-pointer"
              }`}
            >
              Đang thực hiện
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`text-sm px-2 py-1 rounded ${
                filter === "completed"
                  ? "bg-rose-600 text-white"
                  : "bg-gray-200 text-gray-700 cursor-pointer"
              }`}
            >
              Đã hoàn thành
            </button>
          </div>
          <input
            type="text"
            placeholder="Tìm công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:outline-none dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          {recentSearches.length > 0 && (
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Từ khoá gần đây:
              <div className="flex flex-wrap gap-2 mt-1">
                {recentSearches.map((kw, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchTerm(kw)}
                    className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
          <ul className="space-y-2 mt-5">
            {filteredTodos
              .filter((todo) => {
                if (filter === "doing") return !todo.completed;
                if (filter === "completed") return todo.completed;
                return true;
              })
              .map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleCompleted}
                  onEdit={editTodo}
                  onDelete={(id) => {
                    const found = todos.find((t) => t.id === id);
                    if (found) setTodoToDelete(found);
                  }}
                />
              ))}
          </ul>
          {todos.some((todo) => todo.completed) && (
            <div className="flex justify-center mt-4 text-center">
              <button
                onClick={clearCompleted}
                className="flex gap-[3px] items-center text-sm text-stone-950 dark:text-stone-50 hover:underline hover:text-red-600 transition cursor-pointer"
              >
                <XCircleIcon className="w-5 h-5 text-red-500 dark:text-amber-300 pointer-events-none" />
                Xoá tất cả công việc đã hoàn thành
              </button>
            </div>
          )}
          {deletedTodos.length > 0 && (
            <div className="flex justify-center mt-4 text-center">
              <button
                onClick={undoLastDelete}
                className="flex gap-[3px] items-center text-sm text-blue-500 dark:text-stone-50 hover:text-blue-700 hover:underline transition cursor-pointer"
              >
                <WrenchIcon className="w-5 h-5 text-blue-600 dark:text-amber-300 pointer-events-none" />
                Hoàn tác
              </button>
            </div>
          )}
        </div>
        {todoToDelete && (
          <ConfirmDialog
            message={`Bạn có chắc muốn xoá "${todoToDelete.text}"?`}
            onConfirm={() => {
              deleteTodo(todoToDelete.id);
              setTodoToDelete(null);
            }}
            onCancel={() => setTodoToDelete(null)}
          />
        )}
      </main>
    </>
  );
}
