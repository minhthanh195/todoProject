import dayjs from "dayjs";

export function getCountdown(deadline: string): string {
  const now = dayjs();
  const end = dayjs(deadline);

  if (end.isBefore(now)) return "Đã quá hạn";

  const diffMs = end.diff(now);
  const dur = dayjs.duration(diffMs);
  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  if (days > 0) return `⏳ Còn ${days} ngày ${hours} giờ`;
  if (hours > 0) return `⏳ Còn ${hours} giờ ${minutes} phút`;
  if (minutes > 0) return `⏳ Còn ${minutes} phút ${seconds} giây`;
  return `⏳ Còn ${seconds} giây`;
}
