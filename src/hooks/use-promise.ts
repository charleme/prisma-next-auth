import { useEffect, useState } from "react";

export const usePromise = <T>(promise: Promise<T>) => {
  const [result, setResult] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    void promise.then((data) => {
      setResult(data);
      setIsInitialLoading(false);
      setIsLoading(false);
    });
  }, [promise]);

  return { result, isLoading, isInitialLoading };
};
