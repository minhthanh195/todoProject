import dayjs from "dayjs";
import { Todo } from "../types/todo";

export default function sortTodosByDeadline(todos: Todo[]) {
  return [...todos].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return dayjs(a.deadline).diff(dayjs(b.deadline));
  });
}
