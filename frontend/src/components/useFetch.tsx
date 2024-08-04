import { useState, useEffect } from "react";
import Alert from "./Alert";

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export default function useFetch<T>(
  url: string,
  method: "GET" | "POST",
  token?: string,
  dependencies: any[] = [] // 新增 dependencies 参数
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorMessage = await response.text();
          Alert({
            title: response.status.toString(),
            text: errorMessage,
            icon: "error",
          })();
          throw new Error(errorMessage);
        }
        const data: T = await response.json();
        setData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, method, token, ...dependencies]);

  return { data, isLoading, error };
}
