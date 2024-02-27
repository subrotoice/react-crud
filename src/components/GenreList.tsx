import useGenres from "../hooks/useGenres";

const GenreList = () => {
  const { genres, error, isloading } = useGenres();
  return (
    <div>
      {genres.map((genre) => (
        <p>{genre.name}</p>
      ))}
    </div>
  );
};

export default GenreList;
