# Bulilding Game Hub

[React Basic](https://github.com/subrotoice/react-basic)

### Initial Commit

### Install Chakra UI

### Build a NavBar

```jsx
// Horizontal Stack
<HStack justifyContent="space-between" padding="10px">
  <Image src={logo} boxSize="60px" />
  <ColorModeSwitch />
</HStack>
```

### Implement dark mode

```jsx
// main.tsx
<React.StrictMode>
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </ChakraProvider>
</React.StrictMode>;

// theme.ts
import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { ThemeContext } from "@emotion/react";
const config: ThemeConfig = {
  initialColorMode: "dark",
};
const theme = extendTheme({ config });
export default theme;
```

### Build the color mode switch

```jsx
const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // return this two thing
  return (
    <div>
      <HStack>
        <Switch
          colorScheme="green"
          isChecked={colorMode === "dark"}
          onChange={toggleColorMode}
        />
        <Text>{colorMode} Mode</Text>
      </HStack>
    </div>
  );
};
```

### Fetch the games

[Import System](https://prnt.sc/2eBA4idKjvmf)<br>
[Param of Axios](https://prnt.sc/gWqKmgDzN3eM)

```jsx
// api-client.ts
import axios from "axios";
export default axios.create({  // it will import as apiCLient; https://prnt.sc/2eBA4idKjvmf
  baseURL: "https://api.rawg.io/api",
  params: {
    //params is query String https://api.rawg.io/api/platforms?key=YOUR_API_KEY
    key: "b0d7069520c04a5c8e168712f0464506",
  },
});

// GameGrid.tsx
import { Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";

interface Game {
  id: number;
  name: string;
}

interface FetchGamesResponse {
  count: number;
  results: Game[];
}

const GameGrid = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<FetchGamesResponse>("/games")
      .then((res) => setGames(res.data.results))
      .catch((err) => setError(err.message));
  });

  return (
    <>
      {error && <Text>{error}</Text>}
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </>
  );
};

```

### Creating game hooks

- Hook data and data processing niye kaj kore
- Hook basically ekta function ja, kichu kaj kore kichu data or method return kore
  const { games, error } = useGames(); // useGames return object
  const [games, error] = useGames(); // useGames return array

### useGames Hook

```jsx
// useGames.ts
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

interface Game {
  id: number;
  name: string;
}

interface FetchGamesResponse {
  count: number;
  results: Game[];
}

const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const abortController = new AbortController(); // step1: inside useEffect
    apiClient
      .get<FetchGamesResponse>("/games", { signal: abortController.signal }) // step2
      .then((res) => setGames(res.data.results))
      .catch((err) => {
        if (err instanceof CanceledError) return; // step 4
        setError(err.message);
      });

    return () => abortController.abort(); // step3
  }, []);
  return { games, error };
};

export default useGames;


// GameGrid.tsx
import { Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";

const GameGrid = () => {
  const { games, error } = useGames();
  return (
    <>
      {error && <Text>{error}</Text>}
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </>
  );
};


```

### Building game card

```jsx
// GameGrid.tsx
<SimpleGrid
  columns={{ sm: 1, md: 2, lg: 3, xl: 5 }}
  padding="10px"
  spacing={10}
>
  {games.map((game) => (
    <GameCard game={game} />
  ))}
</SimpleGrid>;

// GameCard.tsx
import { Game } from "../hooks/useGames";
import { Card, CardBody, Heading, Image, Text } from "@chakra-ui/react";

interface Props {
  game: Game; // Imported
}

const GameCard = ({ game }: Props) => {
  return (
    <Card borderRadius={10} overflow="hidden">
      <Image src={game.background_image} />
      <CardBody>
        <Heading fontSize={"2xl"}>{game.name}</Heading>
      </CardBody>
    </Card>
  );
};

export default GameCard;
```

### Displaying platform icons

```jsx
// useGames.ts
export interface Platform {
  id: number;
  name: string;
  slug: string;
}

// GameCard.tsx
// This could be done in this component but it will more complex, and reduce reusuability
<PlatformIconList
  platforms={game.parent_platforms.map((p) => p.platform)} // Passing array of object, but it sending platform property which is also object
/>;

// PlatformIconList
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
} from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { SiNintendo } from "react-icons/si";
import { BsGlobe } from "react-icons/bs";
import { HStack, Icon, Text } from "@chakra-ui/react";
import { Platform } from "../hooks/useGames";
import { IconType } from "react-icons";

interface Props {
  platforms: Platform[];
}

const PlatformIconList = ({ platforms }: Props) => {
  const iconMap: { [key: string]: IconType } = {
    // By doing so, you do not use a lot of if else
    pc: FaWindows,
    playstation: FaPlaystation,
    xbox: FaXbox,
    nintendo: SiNintendo,
    mac: FaApple,
    linux: FaLinux,
    android: FaAndroid,
    ios: MdPhoneIphone,
    web: BsGlobe,
  };
  return (
    <HStack marginY={1}>
      {platforms.map((platform) => (
        <Icon as={iconMap[platform.slug]} color={"gray.500"} />
      ))}
    </HStack>
  );
};

export default PlatformIconList;
```

### Displaying critic score

```jsx
// useGame.ts
export interface Game {
  // Add this property
  metacritic: number;
}

// GameCard.tsx
<HStack justifyContent="space-between">
  <PlatformIconList
    platforms={game.parent_platforms.map((p) => p.platform)} // Passing array of object, but it sending platform property which is also object
  />
  <CriticScore score={game.metacritic} />
</HStack>;

// CriticScore.tsx
import { Badge } from "@chakra-ui/react";

interface Props {
  score: number;
}

const CriticScore = ({ score }: Props) => {
  const color = score >= 90 ? "green" : score >= 80 ? "yellow" : "red";
  return (
    <Badge borderRadius={2} fontSize="14px" paddingX="4px" colorScheme={color}>
      {score}
    </Badge>
  );
};
```

###

```jsx

```

###

```jsx

```

###

```jsx

```

###

```jsx

```

###

```jsx

```

###

```jsx

```

###

```jsx

```

###

```jsx

```

###

```jsx

```
