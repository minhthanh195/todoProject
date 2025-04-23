export function getTagColor(tag: string): string {
  const map: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100",
    study: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100",
    bug: "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-100",
    personal:
      "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-100",
    work: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100",
  };

  return (
    map[tag.toLowerCase()] ||
    "bg-gray-200 text-gray-800 dark:bg-rose-950 dark:bg-sky-500/100"
  );
}
