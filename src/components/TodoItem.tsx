"use client";

import dayjs from "../lib/dayjs";
import { useState } from "react";
import {
  TrashIcon,
  CalendarIcon,
  PencilIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Todo } from "../types/todo";
import { getTagColor } from "../utils/getTagColor";
import CountdownTimer from "./CoundownTimer";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newtext: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>(todo.text);

  const handleEditSubmit = () => {
    if (editedText.trim() !== "") {
      onEdit(todo.id, editedText.trim());
    }
  };
  return (
    <li
      className="flex flex-col justify-between px-4 py-2 border rounded 
          bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600
          group transition"
    >
      <div className="flex justify-between flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSubmit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            autoFocus
            className="flex-1 border px-2 py-1 rounded focus:outline-none"
          />
        ) : (
          <>
            <span
              onClick={() => onToggle(todo.id)}
              className={`cursor-pointer flex-1 ${
                todo.completed
                  ? "line-through text-gray-400"
                  : "text-gray-800 dark:text-neutral-50"
              } group-hover:text-red-400 transition`}
            >
              {todo.text}
            </span>
            <p className="flex items-center text-xs text-gray-400">
              <ClockIcon className="w-4 h-4 mr-1 mt-4px text-gray-500 dark:text-gray-300 pointer-events-none" />
              {dayjs(todo.createdAt).fromNow()}
            </p>
          </>
        )}

        { isEditing ? 
          (<button
            onClick={() => {
              setIsEditing(false)
              handleEditSubmit()
            }}
            className="text-red-400 hover:text-red-600 transition ml-4 cursor-pointer"
          >
            <CheckCircleIcon className="w-4 h-4 text-gray-500 dark:text-gray-300 pointer-events-none" />
          </button>) :
          (
            <button
            onClick={() => setIsEditing(true)}
            className="text-red-400 hover:text-red-600 transition ml-4 cursor-pointer a"
            >
              <PencilIcon className="w-4 h-4 text-gray-500 dark:text-gray-300 pointer-events-none" />
            </button>
          )

        }

        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-400 hover:text-red-600 transition ml-4 cursor-pointer"
        >
          <TrashIcon className="w-4 h-4 text-gray-500 dark:text-gray-300 pointer-events-none" />
        </button>
      </div>
      {todo.tags && todo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 justify-end">
          {todo.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTagColor(
                tag
              )}`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {todo.deadline && <CountdownTimer deadline={todo.deadline} />}
    </li>
  );
}
