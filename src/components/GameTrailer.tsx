import useTrailers from "../hooks/useTrailers";

interface Props {
  gameId: number;
}

const GameTrailer = ({ gameId }: Props) => {
  const { data, isLoading, error } = useTrailers(gameId);
  if (isLoading) return null;
  if (error) throw error;

  const first = data?.results[0];
  return first ? (
    <video src={first.data["max"]} controls poster={first.preview} />
  ) : null;
};

export default GameTrailer;
