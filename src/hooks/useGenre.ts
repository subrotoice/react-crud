import useGenres from "./useGenres";

const useGenre = (selectedGenreId?: number) => {
  const { data: genres } = useGenres();
  return genres?.results.find((g) => g.id === selectedGenreId);
};

export default useGenre;
