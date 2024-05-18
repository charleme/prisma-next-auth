import { Suspense } from "react";

export async function RequestSuspense<T>({
  request,
  render,
  fallback,
}: {
  request: () => Promise<T>;
  render: (data: T) => React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const data = await request();

  return <Suspense fallback={fallback}>{render(data)}</Suspense>;
}
