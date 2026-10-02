export function getCountdownDays(targetDate: Date) {
  const currentDate = new Date();
  const timeDiff = targetDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

export function sortDates(
  dateA: string,
  dateB: string,
  direction: 'asc' | 'desc' = 'asc'
) {
  const timeA = new Date(dateA).getTime();
  const timeB = new Date(dateB).getTime();

  if (direction === 'asc') {
    return timeA - timeB;
  } else {
    return timeB - timeA;
  }
}
