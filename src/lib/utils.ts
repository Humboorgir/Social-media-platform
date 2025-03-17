import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

// used to get relative time from date (eg. 'x days ago')
export function formatDateRelatively(date: string | Date) {
  const timeStamp = new Date(date);

  // Note: valueOf() is only used to get rid of typescript errors
  const secondsPast = (Date.now().valueOf() - timeStamp.valueOf()) / 1000;

  // number of seconds in:
  const oneMinute = 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneMonth = oneDay * 30;
  const oneYear = oneMonth * 12;

  if (secondsPast < oneMinute) {
    const relativeTime = Math.floor(secondsPast);
    const sIfNeeded = relativeTime > 1 ? "s" : "";
    return relativeTime + ` second${sIfNeeded} ago`;
  }

  if (secondsPast < oneHour) {
    const relativeTime = Math.floor(secondsPast / oneMinute);
    const sIfNeeded = relativeTime > 1 ? "s" : "";
    return relativeTime + ` minute${sIfNeeded} ago`;
  }

  if (secondsPast < oneDay) {
    const relativeTime = Math.floor(secondsPast / oneHour);
    const sIfNeeded = relativeTime > 1 ? "s" : "";
    return relativeTime + ` hour${sIfNeeded} ago`;
  }

  if (secondsPast < oneMonth) {
    const relativeTime = Math.floor(secondsPast / oneDay);
    const sIfNeeded = relativeTime > 1 ? "s" : "";
    return relativeTime + ` day${sIfNeeded} ago`;
  }

  if (secondsPast <= oneYear) {
    const relativeTime = Math.floor(secondsPast / oneMonth);
    const sIfNeeded = relativeTime > 1 ? "s" : "";
    return relativeTime + ` month${sIfNeeded} ago`;
  }

  if (secondsPast > oneYear) {
    const relativeTime = Math.floor(secondsPast / oneYear);
    const sIfNeeded = relativeTime > 1 ? "s" : "";
    return relativeTime + ` year${sIfNeeded} ago`;
  }
}
