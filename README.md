# Bulilding Game Hub

[React Basic](https://github.com/subrotoice/react-basic)

### Initial Commit

### Install Chakra UI

[Install Chakra UI](https://chakra-ui.com/getting-started)

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
  const [isloading, setIsloading] = useState(false); // Loading status

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

### Building game card (GameCard.tsx)

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

### Displaying critic score (CriticScore.tsx)

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

### Get optimized images (build pure javascipt to modify url; getCroppedImageUrl.ts)

```jsx
// GameCard.tsx
<Image src={getCroppedImageUrl(game.background_image)} />;

// services/image-url.ts
const getCroppedImageUrl = (url: string) => {
  // media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg
  // media.rawg.io/media/crop/600/400/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

export default getCroppedImageUrl;
```

### Show loading skeleton (GameCardSkeleton.tsx)

We will refactor this code in next commit. Because our code is in working stage. If we refactor code in this commit code might be broken down. What will we do in that case?

```jsx
// useGame.ts
const [isloading, setIsloading] = useState(false);
isLoading(true / False);

// GameGrid.tsx;
const { games, error, isloading } = useGames();
const skeletons = [1, 2, 3, 4, 5, 6];

{
  isloading && skeletons.map((skeleton) => <GameCardSkeleton key={skeleton} />);
}

// CameCard.tsx
<Card width="300px" borderRadius={10} overflow="hidden"> // add width to match

// GameCardSkeleton.tsx
import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";

const GameCardSkeleton = () => {
  return (
    <div>
      <Card width="300px" borderRadius={10} overflow="hidden">
        <Skeleton height="200px" />
        <CardBody>
          <SkeletonText />
        </CardBody>
      </Card>
    </div>
  );
};

```

### Refactor: remove duplicated styles (GameCardContainer.tsx)

- Just pass <GameCard> as a children to container

```jsx
// GameGrid.tsx
{
  isloading &&
    skeletons.map((skeleton) => (
      <GameCardContainer>
        <GameCardSkeleton key={skeleton} />
      </GameCardContainer>
    ));
}

// GameCard.tsx
<Card width="300px" borderRadius={10} overflow="hidden">
to
<Card>

// GameCardContainer.tsx
import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const GameCardContainer = ({ children }: Props) => {
  return (
    <Box width="300px" borderRadius={10} overflow="hidden">
      {children}
    </Box>
  );
};

```

### Fetch the genres (create useGenres.ts hook my coping useGames and change it)

```jsx
// GenreList
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

// useGenres.ts (Hook) same as useGames; Letter we will refactor our code to remove duplication and increase reuseability
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

```

### Create a generic data fetching hook (useData.ts which can fetch any types of data)

- Only need to pass this: const useUsers = () => useData<Game>("/users");

```jsx
// GameGrid.tsx
const { data, error, isloading } = useGames();

// useGames.tsx
const useGames = () => useData<Game>("/games");


// useData.ts
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

interface FetchResponse<T> {
  count: number;
  results: T[];
}

const useData = <T>(endPoint: string) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    setIsloading(true);
    apiClient
      .get<FetchResponse<T>>(endPoint, { signal: abortController.signal })
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
  }, []);
  return { data, error, isloading };
};

export default useData;

```

### Display Genres (Just grab extra field image_background of Genres and Some layout change)

```jsx
// App.tsx
<Grid
  templateAreas={{
    base: `"nav nav" "main main"`,
    lg: `"nav nav" "aside main"`,
  }}
  templateColumns={{
    base: "1fr",
    lg: "200px 1fr",
  }}
>

// GenreList.ts
const GenreList = () => {
  const { data } = useGenres();
  return (
    <List>
      {data.map((genre) => (
        <ListItem key={genre.id}>
          <HStack paddingY="5px">
            <Image
              boxSize="32px"
              borderRadius={8}
              src={getCroppedImageUrl(genre.image_background)}
            />
            <Text fontSize="2l">{genre.name}</Text>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
};

// useGenres.ts
export interface Genre {
  ........
  image_background: string; // Add this line
}

```

### Show a spinner while fetching the genres (GenreList.tsx)

- We could show skeleton here but try different

```jsx
// GenreList.tsx
const GenreList = () => {
  const { data, error, isloading } = useGenres();
  if (error) return null; // A way of codding return here
  if (isloading) return <Spinner />; // we could use inside last return
  return (
    <List>
      {data.map((genre) => (
        <ListItem key={genre.id}>
          <HStack paddingY="5px">
            <Image
              boxSize="32px"
              borderRadius={8}
              src={getCroppedImageUrl(genre.image_background)}
            />
            <Text fontSize="2l">{genre.name}</Text>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
};
```

###

```jsx

```

###

```jsx

```
