import { Heading, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Expandable from "../components/Expandable";
import GameAttributes from "../components/GameAttributes";
import useGame from "../hooks/useGame";
import GameTrailer from "../components/GameTrailer";
import GameScreenshots from "../components/GameScreenshots";

const GameDetailsPage = () => {
  const { slug } = useParams();
  const { data: game, isLoading, error } = useGame(slug!);

  if (isLoading) return <Spinner />;
  if (error || !game) throw error;

  return (
    <div>
      <Heading>{game.name}</Heading>
      <Expandable>{game.description_raw}</Expandable>
      <GameAttributes game={game} />
      <GameTrailer gameId={game.id} />
      <GameScreenshots gameId={game.id} />
    </div>
  );
};

export default GameDetailsPage;
