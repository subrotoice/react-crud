import { SimpleGrid, Text } from "@chakra-ui/react";
import CriticScore from "./CriticScore";
import DefinationItem from "./DefinationItem";
import { Game } from "../entities/Game";

interface Props {
  game: Game;
}

const GameAttributes = ({ game }: Props) => {
  return (
    <div>
      <SimpleGrid columns={2} as="dl">
        <DefinationItem terms="Platforms">
          {game.parent_platforms?.map(({ platform }) => (
            <Text key={platform.id}>{platform.name}</Text>
          ))}
        </DefinationItem>
        <DefinationItem terms="Metascore">
          <CriticScore score={game.metacritic} />
        </DefinationItem>
        <DefinationItem terms="Genres">
          {game.genres?.map((genre) => (
            <Text key={genre.id}>{genre.name}</Text>
          ))}
        </DefinationItem>
        <DefinationItem terms="Publishers">
          {game.publishers?.map((publisher) => (
            <Text key={publisher.id}>{publisher.name}</Text>
          ))}
        </DefinationItem>
      </SimpleGrid>
    </div>
  );
};

export default GameAttributes;
