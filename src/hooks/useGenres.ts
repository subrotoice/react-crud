import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

interface Genre {
  id: number;
  name: string;
}
interface FetchGenresResponse {
  count: number;
  results: Genre[];
}

const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    setIsloading(true);
    apiClient
      .get<FetchGenresResponse>("/genres", { signal: abortController.signal })
      .then((res) => {
        setGenres(res.data.results);
        setIsloading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsloading(false);
      });

    return () => abortController.abort();
  }, []);
  return { genres, error, isloading };
};

export default useGenres;
