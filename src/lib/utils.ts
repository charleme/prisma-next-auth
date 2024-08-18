import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterObject<TValue, TKey extends string>(
  obj: Record<TKey, TValue>,
  predicate: (value: TValue, key: TKey) => boolean,
): Record<TKey, TValue> {
  return Object.fromEntries(
    (Object.entries(obj) as [TKey, TValue][]).filter(([key, value]) =>
      predicate(value, key),
    ),
  ) as Record<TKey, TValue>;
}
