import useGenres from "../hooks/useGenres";

const GenreList = () => {
  const { data } = useGenres();
  return (
    <div>
      {data.map((genre) => (
        <p>{genre.name}</p>
      ))}
    </div>
  );
};

export default GenreList;
