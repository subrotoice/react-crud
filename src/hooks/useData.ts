import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";

interface FetchResponse<T> {
  count: number;
  results: T[];
}

// received 3 argument (endpoint, params?, dependency?)
const useData = <T>(
  endPoint: string,
  requestConfig?: AxiosRequestConfig, // receiving params
  deps?: any[]
) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);

  useEffect(
    () => {
      const abortController = new AbortController();
      setIsloading(true);
      apiClient
        .get<FetchResponse<T>>(endPoint, {
          signal: abortController.signal,
          ...requestConfig,
        })
        .then((res) => {
          setData(res.data.results);
          setIsloading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setError(err.message);
          setIsloading(false);
        });

      return () => abortController.abort();
    },
    deps ? [...deps] : []
  );
  return { data, error, isloading };
};

export default useData;
