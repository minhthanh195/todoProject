"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "../utils/getCountdownString";
import dayjs from "../lib/dayjs";

interface Props {
  deadline: string;
}

export default function CountdownTimer({ deadline }: Props) {
  const [countdown, setCountdown] = useState(getCountdown(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <p
      className={`text-xs mt-1 font-medium ${
        dayjs(deadline).isBefore(dayjs())
          ? "text-red-500" // ❌ đã quá hạn
          : dayjs(deadline).diff(dayjs(), "hour") < 24
          ? "text-yellow-500" // ⚠️ gần đến hạn
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      Hạn chót: {dayjs(deadline).format("DD/MM/YYYY HH:mm")} - {countdown}
    </p>
  );
}
