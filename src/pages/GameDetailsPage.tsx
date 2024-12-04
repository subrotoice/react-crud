import { Box, Heading, SimpleGrid, Spinner } from "@chakra-ui/react";
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
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        <Box>
          <Heading>{game.name}</Heading>
          <Expandable>{game.description_raw}</Expandable>
          <GameAttributes game={game} />
        </Box>
        <Box>
          <GameTrailer gameId={game.id} />
          <GameScreenshots gameId={game.id} />
        </Box>
      </SimpleGrid>
    </div>
  );
};

export default GameDetailsPage;
