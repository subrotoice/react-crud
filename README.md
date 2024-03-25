# Bulilding Game Hub

[React Basic](https://github.com/subrotoice/react-basic)

### - Initial Commit

### - Install Chakra UI

[Install Chakra UI](https://chakra-ui.com/getting-started)

### - Build a NavBar

```jsx
// Horizontal Stack
<HStack justifyContent="space-between" padding="10px">
  <Image src={logo} boxSize="60px" />
  <ColorModeSwitch />
</HStack>
```

### - Implement dark mode

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

### - Build the color mode switch

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

### - Fetch the games

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

### - Creating game hooks

- Hook data and data processing niye kaj kore
- Hook basically ekta function ja, kichu kaj kore kichu data or method return kore
  const { games, error } = useGames(); // useGames return object <br>
  const [games, error] = useGames(); // useGames return array <br>
  const [isloading, setIsloading] = useState(false); // Loading status <br>

### - useGames Hook

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

### - Building game card (GameCard.tsx)

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

### - Displaying platform icons

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

### - Displaying critic score (CriticScore.tsx)

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

### - Get optimized images (build pure javascipt to modify url; getCroppedImageUrl.ts)

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

### - Show loading skeleton (GameCardSkeleton.tsx)

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

### - Refactor: remove duplicated styles (GameCardContainer.tsx)

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

### - Fetch the genres (create useGenres.ts hook my coping useGames and change it)

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

### - Create a generic data fetching hook (useData.ts which can fetch any types of data)

- Only need to pass endPoint: <br>
  const useUsers = () => useData<Game>("/users"); // you get data <br>
  Later on it received 3 argument: useData(endpoint, params?, dependency?)

```jsx
// GameGrid.tsx
const { data, error, isloading } = useGames();

// useGames.tsx
const useGames = () => useData<Game>("/games");


// useData.ts | // after this received 3 argument (endpoint, params?, dependency?)
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

### - Display Genres (Just grab extra field image_background of Genres and Some layout change)

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

### - Show a spinner while fetching the genres (GenreList.tsx)

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

### - Filter games by genre (Most Difficult one)

- [Watch Video](https://members.codewithmosh.com/courses/ultimate-react-part1-1/lectures/45916351)
- useData recived 3 arguments. useData(endpoint, params?, dependency?)

```jsx
// App.js ( Use to share props between two component)
function App() {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  return (
    ...........
      <Show above="lg">
        <GridItem area="aside" paddingX={5}>
          <GenreList onSelectGenre={(genre) => setSelectedGenre(genre)} />
        </GridItem>
      </Show>
      <GridItem area="main">
        <GameGrid selectedGenre={selectedGenre} />
      </GridItem>
    </Grid>
  );
}

// GenreList.tsx (passing genre to Parent (app.tsx) component)
<Button fontSize="2l" variant="link" onClick={() => { onSelectGenre(genre); }} >

// GameGrid.tsx (Passing selected item to hook)
const { data, error, isloading } = useGames(selectedGenre);

// useGames.ts (Passing some parameter to useData hook)
// useData hook argument list
1. endpoint, 2. selected genre id, 3, dependency id if change then rerender
const useGames = (selectedGenre: Genre | null) =>
  useData<Game>("/games", { params: { genres: selectedGenre?.id } }, [
    selectedGenre?.id,
  ]);

// useData.ts | useData(endpoint, params?, dependency?)
const useData = <T>( // Step1: receiving argument from useGame
  endPoint: string,
  requestConfig?: AxiosRequestConfig, // receiving params: {......}
  deps?: any[]
) => {
  useEffect(
    () => {
      const abortController = new AbortController();
      setIsloading(true);
      apiClient
        .get<FetchResponse<T>>(endPoint, {
          signal: abortController.signal,
          ...requestConfig, // Step2: Set params: {.....}
        })
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
    },
    deps ? [...deps] : [] // Dependency Depend on
  );
  return { data, error, isloading };
};

```

### - Highlight the selected genre

```jsx
// App.js (Passing selectedGenre)
<GenreList
  selectedGenre={selectedGenre}
  onSelectGenre={(genre) => setSelectedGenre(genre)}
/>

// GenreList.tsx (receive selectedGenre and use it)
<Button fontSize="2l" fontWeight={selectedGenre?.id == genre.id ? "bold" : "normal"} > {genre.name} </Button>
```

### - Build platform selector (Easily create usePlatforms() hook and fetch data and show)

```jsx
// App.js
<PlatformSelector />;

// PlatformSelector.tsx
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { BsChevronDown } from "react-icons/bs";
import usePlatforms from "../hooks/usePlatforms";

const PlatformSelector = () => {
  const { data, error, isloading } = usePlatforms();
  if (error) return null;
  return (
    <div>
      <Menu>
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          Select platform
        </MenuButton>
        <MenuList>
          {data.map((platform) => (
            <MenuItem key={platform.id}>{platform.name}</MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

// usePlatforms.ts (Now data fetching is so easy. we can fetch any data by passing endpoint)
import useData from "./useData";
import { Platform } from "./useGames";

const usePlatforms = () => useData < Platform > "/platforms/lists/parents";

export default usePlatforms;
```

### - Filter games by platform (It's same as filter by Genres)

```jsx
// App.js (Passing selected item form parent)
<PlatformSelector
  selectedPlatform={selectedPlatform}
  onSelectPlatform={(platform) => setSelectedPlatform(platform)}
/>
<GameGrid
  selectedGenre={selectedGenre}
  selectedPlatform={selectedPlatform}
/>

// GameGrid.tsx
interface Props {
  selectedGenre: Genre | null;
  selectedPlatform: Platform | null;
}
const GameGrid = ({ selectedGenre, selectedPlatform }: Props) => {
  const { data, error, isloading } = useGames(selectedGenre, selectedPlatform);
.....

// PlatformSelector.tsx
<MenuButton as={Button} rightIcon={<BsChevronDown />}>
  {selectedPlatform?.name || "Platform"}
</MenuButton>

// useGames.ts
const useGames = (
  selectedGenre: Genre | null,
  selectedPlatform: Platform | null
) =>
  useData<Game>(
    "/games",
    { params: { genres: selectedGenre?.id, platforms: selectedPlatform?.id } },
    [selectedGenre?.id, selectedPlatform?.id]
  );
  ....
```

### - Refactor: Extract a query object ( instade of a lot of state variable we use single object here.)

```jsx
// App.js
export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
}

function App() {
  const [gameQuery, setGameQuery] = useState<GameQuery>({} as GameQuery);

  return (
      <GenreList
        selectedGenre={gameQuery.genre}
        onSelectGenre={(genre) => {
          setGameQuery({ ...gameQuery, genre });
          // console.log(gameQuery);
          // console.log(genre);
          // console.log({ ...gameQuery, genre: genre });
        }}
      />
    <PlatformSelector
      selectedPlatform={gameQuery.platform}
      onSelectPlatform={(platform) =>
        setGameQuery({ ...gameQuery, platform })
      }
    />
    <GameGrid gameQuery={gameQuery} />
  );
}

// GameGrid.tsx
interface Props {
  gameQuery: GameQuery;
}
const GameGrid = ({ gameQuery }: Props) => {
  const { data, error, isloading } = useGames(gameQuery);
  .........

// useGames.tsx
const useGames = (gameQuery: GameQuery) =>
  useData<Game>(
    "/games",
    {
      params: {
        genres: gameQuery.genre?.id,
        platforms: gameQuery.platform?.id,
      },
    },
    [gameQuery]
  );
```

### - Build sort selector (Same as Platform Selector section)

```jsx
// App.tsx
<HStack spacing={5} paddingLeft={2} paddingBottom={5}>
  <PlatformSelector
    selectedPlatform={gameQuery.platform}
    onSelectPlatform={(platform) => setGameQuery({ ...gameQuery, platform })}
  />
  <SortSelector />
</HStack>;

// SortSelector.tsx ; Same like PlatformSelector.tsx
const SortSelector = () => {
  return (
    <div>
      <Menu>
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          Order by: Relevance
        </MenuButton>
        <MenuList>
          <MenuItem>Relevance</MenuItem>
          <MenuItem>Date added</MenuItem>
          <MenuItem>Name</MenuItem>
          <MenuItem>Release date</MenuItem>
          <MenuItem>Popularity</MenuItem>
          <MenuItem>Average rating</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};
```

### - Sort the games (make funcitonal upper part, passing sortOrder as query string)

```jsx
// App.js ( added query string sortorder | Get notification from SortSelector and stored it in state )
export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
}
<SortSelector
  selectedSortOrder={gameQuery.sortOrder}
  onSelectSortOrder={(sortOrder) => setGameQuery({ ...gameQuery, sortOrder })}
/>;

// useGames.ts (added ordering: gameQuery.sortOrder for passing query string)
const useGames = (gameQuery: GameQuery) =>
  useData <
  Game >
  ("/games",
  {
    params: {
      genres: gameQuery.genre?.id,
      platforms: gameQuery.platform?.id,
      ordering: gameQuery.sortOrder, // added
    },
  },
  [gameQuery]);

// SortSelected.tsx (Dynamic sortOrders for selecting )
interface Props {
  selectedSortOrder: string;
  onSelectSortOrder: (sortOrder: string) => void;
}

const SortSelector = ({ onSelectSortOrder, selectedSortOrder }: Props) => {
  const sortOrders = [
    { value: "", label: "Relevance" },
    { value: "-added", label: "Data added" },
    { value: "name", label: "Name" },
    { value: "-released", label: "Release date" },
    { value: "-metacritic", label: "Popularity" },
    { value: "-rating", label: "Average Rating" },
  ];
  const currentSortOrder = sortOrders.find(
    (sortOrder) => sortOrder.value === selectedSortOrder
  );
  return (
    <div>
      <Menu>
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          Order by: {currentSortOrder?.label || "Relevance"}
        </MenuButton>
        <MenuList>
          {sortOrders.map((sortOrder) => (
            <MenuItem
              onClick={() => onSelectSortOrder(sortOrder.value)}
              key={sortOrder.value}
              value={sortOrder.value}
            >
              {sortOrder.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};
```

### - Handel Games with no image (add image to asset folder)

```jsx
import noImage from "../assets/no-image-placeholder-6f3882e0.webp";
// image-url.ts
if (!url) return noImage;
```

### - Implement searching ( Adding another poperty to gameQuery object )

```jsx
// App.js
export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
  searchText: string;
}
<NavBar
  onSearch={(searchText) => setGameQuery({ ...gameQuery, searchText })}
/>;

// SearchInput.tsx (it passes searchText to Navbar.tsx then it realy to App.js)
interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  const ref = useRef < HTMLInputElement > null;
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (ref.current) onSearch(ref.current.value);
      }}
    >
      <InputGroup>
        <InputLeftElement children={<BsSearch />} />
        <Input
          ref={ref}
          borderRadius={20}
          placeholder="Search game..."
          variant="filled"
        />
      </InputGroup>
    </form>
  );
};
```

### - Add a dynamic page heading (using this ``)

```jsx
// GameHeading.tsx
interface Props {
  gameQuery: GameQuery;
}

const GameHeading = ({ gameQuery }: Props) => {
  const heading = `${gameQuery.platform?.name || ""} ${
    gameQuery.genre?.name || ""
  } Games`;
  return (
    <Heading as="h1" fontSize="4xl" marginY={5}>
      {heading}
    </Heading>
  );
};
```

### - Cleane Up The genres (Some basic css & design change)

```jsx
// GenreList.tsx
<Heading fontSize="2xl" marginBottom={3}>
  Genres
</Heading>
<Image boxSize="32px" borderRadius={8} objectFit="cover" src="" />
<Button fontSize="2l" whiteSpace="wrap">Text</Button>
```

### - Clean up the game cards

```jsx
// GameCard.tsx (Just heading down to the logo)
<Card>
  <Image src={getCroppedImageUrl(game.background_image)} />
  <CardBody>
    <HStack justifyContent="space-between" marginBottom={2}>
      <PlatformIconList
        platforms={game.parent_platforms.map((p) => p.platform)} // Passing array of object, but it sending platform property which is also object
      />
      <CriticScore score={game.metacritic} />
    </HStack>
    <Heading fontSize={"2xl"}>{game.name}</Heading>
  </CardBody>
</Card>
```

### - Add emojis (Little bit Tricky)

- To build component: First create component, then Set what it will received as props and everything, then go to App.js and passes all data and function as props.

```jsx
// useGames.tsx
export interface Game {
  ............
  rating_top: number; // add this field
}

// GameCard.tsx
<Emoji rating={game.rating_top} />

// Emoji.tsx (Import images and object mapper used for ImageProps)
import bullsEye from "../assets/bulls-eye.webp";
import thumbsUp from "../assets/thumbs-up.webp";
import meh from "../assets/meh.webp";
import { Image, ImageProps } from "@chakra-ui/react";

interface Props {
  rating: number;
}

// Here object map(key: value) system is used. We need not to use ugly if statement
const Emoji = ({ rating }: Props) => {
  const emojiMap: { [rating: number]: ImageProps } = { // Anotate this object with type
    3: { src: meh, alt: "Meh", boxSize: "25px" },
    4: { src: thumbsUp, alt: "good", boxSize: "25px" },
    5: { src: bullsEye, alt: "Exceptional", boxSize: "35px" },
  };
  return <Image {...emojiMap[rating]} marginTop={1} />;
};
```

### - Load genres from app (Genres, Platforms stored in data/genres.ts)

Genres, Platforms which is rearly change can store our server and load as static data, So there will be no loading indicator, and load data instalnly <br>
It returns object and keep it as useData return so no need to change in GenreList.tsx

```jsx
// useGenres.ts
import genres from "../data/genres";

export interface Genre {
  id: number;
  name: string;
  image_background: string;
}
// const useGenres = () => useData<Genre>("/genres"); // It Was
const useGenres = () => ({ data: genres, isloading: false, error: null });

// usePlatformsStatic.ts (it has also a dynamic load data from server usePlatforms.ts)
import platforms from "../data/platforms";
const usePlatforms = () => ({ data: platforms, error: null, isLoading: false });
export default usePlatforms;


// data/genres.ts (copy this form network request)
export default [
  {
    id: 4,
    name: "Action",
    slug: "action",
    games_count: 178704,
    image_background:
      "https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg",
    games: [
      {
        id: 3498,
        slug: "grand-theft-auto-v",
        name: "Grand Theft Auto V",
        added: 20596,
      },
      {
        id: 3328,
        slug: "the-witcher-3-wild-hunt",
        name: "The Witcher 3: Wild Hunt",
        added: 19868,
      },
      {
        id: 5286,
        slug: "tomb-raider",
        name: "Tomb Raider (2013)",
        added: 16252,
      },
      {
        id: 13536,
        slug: "portal",
        name: "Portal",
        added: 15947,
      },
      {
        id: 12020,
        slug: "left-4-dead-2",
        name: "Left 4 Dead 2",
        added: 15815,
      },
      {
        id: 5679,
        slug: "the-elder-scrolls-v-skyrim",
        name: "The Elder Scrolls V: Skyrim",
        added: 15503,
      },
    ],
  },
  {
    id: 51,
    name: "Indie",
    slug: "indie",
    games_count: 62865,
    image_background:
      "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg",
    games: [
  .......................
  ................,
];

```

### - Customized the theme to get darker grays

```jsx
// theme.ts
const theme = extendTheme({
  config,
  colors: {
    gray: {
      50: "#f9f9f9",
      100: "#ededed",
      200: "#d3d3d3",
      300: "#b3b3b3",
      400: "#a0a0a0",
      500: "#898989",
      600: "#6c6c6c",
      700: "#202020",
      800: "#121212",
      900: "#111",
    },
  },
});
```

### - Refactor game grid (little change)

initialData: { count: genres.length, results: genres }, if remove this line then backend call intially, so it reduce backend hit, and
staleTime: 24 _ 60 _ 60 \* 1000, // after 24h react query fetch fresh data from backend

```jsx
// GameGrid.tsx (two return statement)
if (error) return <Text>error</Text>;
```

### - Deploy to vercel

- First install vercel cli then run vercel to deploy
- Then connect from vercel repositor of github

```besh
npm i -g vercel
```

```besh
vercel
```

# Part 2 (Game App)

---

## - Fetching genres: using react query in this project

```bash
npm i @tanstack/react-query@4.28
npm i @tanstack/react-query-devtools@4.28
```

```jsx
// main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // add
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // add

const queryClient = new QueryClient(); // add
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}> // add
        <App />
        <ReactQueryDevtools /> // add
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// useGenres.ts
import { useQueries, useQuery } from "@tanstack/react-query";
import genres from "../data/genres";
import apiClient from "../services/api-client";
import { FetchResponse } from "./useData";

export interface Genre {
  id: number;
  name: string;
  image_background: string;
}
// GenreList.tsx
  {data?.results.map((genre) => ()}

// useQuery() return {data, error, isLoading, .........}
const useGenres = () =>
  useQuery({
    queryKey: ["genres"],
    queryFn: () =>
      apiClient.get<FetchResponse<Genre>>("/genres").then((res) => res.data),
    staleTime: 24 * 60 * 60 * 1000, // 24h
    initialData: { count: genres.length, results: genres }, // data/genres.ts locally stored. If we remove this line then it hit backend and increase load
  });

```

### - Fetching Platforms: React Query (same as fetching genres)

_Cache mane local theke kichu dekhiye dewa, tarpor network theke fetch kora so that we have smoth UI_

- staleTime: Je somo porjonto netwok e data fetch korbe na, ['games', genres] queryKe, in second time it fetch data from catch, then if data is fresh then no network request, if stale then show from cache and then fetch from network, if any change react update that immediately https://prnt.sc/oQlbemwMvwzu
- cacheTime: If no observer then cache is deleted, Default time: 5 min

```jsx
// PlatformSelector.tsx
const { data, error, isLoading } = usePlatformsStatic();
{data.results.map((platform) => ()}

// usePlatformsStatic.ts
import { useQuery } from "@tanstack/react-query";
import platforms from "../data/platforms";
import apiClient from "../services/api-client";
import { FetchResponse } from "./useData";
import { Platform } from "./useGames";

const usePlatforms = () =>
  useQuery({
    queryKey: ["platforms"],
    queryFn: () =>
      apiClient.get <
      FetchResponse <
      Platform >> "/platforms/lists/parents".then((res) => res.data),
    staleTime: 24 * 60 * 60 * 1000, // 24h
    initialData: { count: platforms.length, results: platforms },
  });
```

### - Fetching games (replace useData with useQuery)

- useQuery has everything that has useData but much better way with caching
- useQuery ke sudhu data ene dite hobe. queryKey useEffect er dependency er moto kaj kore, new key hole new fetch otherwise fetch form cache no loading

```jsx
// useGames.ts (old -> useData) // useData er kace function er moto parameter pass kore data ance. No caching
// useGames(endPoint, queryString, dependencyOfUseEffect)
const useGames = (gameQuery: GameQuery) =>
  useData <
  Game >
  ("/games",
  {
    params: {
      genres: gameQuery.genre?.id,
      platforms: gameQuery.platform?.id,
      ordering: gameQuery.sortOrder,
      search: gameQuery.searchText,
    },
  },
  [gameQuery]);

// useGames.ts (new -> useGames) // here apiClient(axios) data ene dicce
const useGames = (gameQuery: GameQuery) =>
  useQuery({
    queryKey: ["games", gameQuery],
    queryFn: () =>
      apiClient.get <
      FetchResponse <
      Game >>
        ("/games",
        {
          params: {
            genres: gameQuery.genre?.id,
            parent_platforms: gameQuery.platform?.id,
            ordering: gameQuery.sortOrder,
            search: gameQuery.searchText,
          },
        }).then((res) => res.data),
  });

// api-client.ts (FetchResponse interface cut form useData.ts)
import axios from "axios";

export interface FetchResponse<T> {
  count: number;
  results: T[];
}

export default axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    //params is query String https://api.rawg.io/api/platforms?key=YOUR_API_KEY
    key: "b0d7069520c04a5c8e168712f0464506",
  },
});
```

### - Fetching Platforms: React Query (same as fetching genres)

_Cache mane local theke kichu dekhiye dewa, tarpor network theke fetch kora so that we have smoth UI_

- staleTime: Je somo porjonto netwok e data fetch korbe na, ['games', genres] queryKe, in second time it fetch data from catch, then if data is fresh then no network request, if stale then show from cache and then fetch from network, if any change react update that immediately https://prnt.sc/oQlbemwMvwzu
- cacheTime: If no observer then cache is deleted, Default time: 5 min

```jsx
// PlatformSelector.tsx
const { data, error, isLoading } = usePlatformsStatic();
{data.results.map((platform) => ()}

// usePlatformsStatic.ts
import { useQuery } from "@tanstack/react-query";
import platforms from "../data/platforms";
import apiClient from "../services/api-client";
import { FetchResponse } from "./useData";
import { Platform } from "./useGames";

const usePlatforms = () =>
  useQuery({
    queryKey: ["platforms"],
    queryFn: () =>
      apiClient.get <
      FetchResponse <
      Platform >> "/platforms/lists/parents".then((res) => res.data),
    staleTime: 24 * 60 * 60 * 1000, // 24h
    initialData: { count: platforms.length, results: platforms },
  });
```

### - Refactor: Removing duplicate interfaces (usePlatformsStatic.ts - Platform interface shift to this file)

```jsx
// usePlatformsStatic.ts (cut form useGame and paste it here, and change import statement)
export interface Platform {
  id: number;
  name: string;
  slug: string;
}
```
