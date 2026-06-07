export function sortByDate(d1: string, d2: string, dir: 'asc' | 'desc') {
  const date1 = new Date(d1);
  const date2 = new Date(d2);

  if (dir === 'desc') return date2.getTime() - date1.getTime();
  return date1.getTime() - date2.getTime();
}

export function groupByCategory<T extends { category?: string }>(items: T[]) {
  return items.reduce(
    (acc, item) => {
      const category = item.category ?? '';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);

      return acc;
    },
    {} as Record<string, T[]>
  );
}
