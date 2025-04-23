import dayjs from "../lib/dayjs";
import { Todo } from "../types/todo";

export function filterRecentCompleted(todos: Todo[]): Todo[] {
  return todos.filter((todo) => {
    if (!todo.completed) return true;
    if (!todo.completedAt) return true;

    let dayPassed = dayjs().diff(dayjs(todo.completedAt), "day");
    return dayPassed <= 3;
  });
}
