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

### **When Icon is in string format | Not using chakra ui**

```jsx
// app.tsx
const iconMap: { [key: string]: IconType } = {
  FaMobileScreen: FaMobileScreen,
  FaLaptop: FaLaptop,
  FaTv: FaTv,
  FaNetworkWired: FaNetworkWired,
  FaMicrophoneLines: FaMicrophoneLines,
};

<IconComponent Icon={iconMap[category.icon]} />;

// IconComponent.tsx
import { IconType } from "react-icons";

const IconComponent = ({ Icon }: { Icon: IconType }) => {
  return (
    <div>
      <Icon className="my-8 text-6xl" />
    </div>
  );
};
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

### - Refactor: Create a reusable API client (APIClient class)

- In the case of CRUD is more convenient using Class

```jsx
// useGenres.ts
const apiClient = new APIClient() < Genre > "/genres";

const useGenres = () =>
  useQuery({
    queryKey: ["genres"],
    queryFn: apiClient.getAll,
    staleTime: 24 * 60 * 60 * 1000, // 24h
    initialData: { count: genres.length, results: genres }, // data/genres.ts locally saved
  });

// useGames.ts
const apiClient = new APIClient() < Game > "/games";

const useGames = (gameQuery: GameQuery) =>
  useQuery({
    queryKey: ["games", gameQuery.platform?.name, gameQuery],
    queryFn: () =>
      apiClient.getAll({
        params: {
          genres: gameQuery.genre?.id,
          parent_platforms: gameQuery.platform?.id,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchText,
        },
      }),
  });

// api-client.ts
import axios, { AxiosRequestConfig } from "axios";

export interface FetchResponse<T> {
  count: number;
  results: T[];
}

const axiosInstance = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    //params is query String https://api.rawg.io/api/platforms?key=YOUR_API_KEY
    key: "b0d7069520c04a5c8e168712f0464506",
  },
});

class APIClient<T> {
  endPoint: string;
  constructor(endPoint: string) {
    this.endPoint = endPoint;
  }

  getAll = (config: AxiosRequestConfig) => {
    return (
      axiosInstance.get <
      FetchResponse <
      T >> (this.endPoint, config).then((res) => res.data)
    );
  };
}

export default APIClient;
```

### - Implementing Infinite Queries (Data fetches in chanks (Pages))

- In the case of CRUD is more convenient using Class
- [nextParam](https://prnt.sc/fe1d0phEzpOd)
- [data] Where data: { pageParam, pages }, pages: { [], [{next, results}, {}] } this data is from useInfiniteQuery not actual server response, useInfiniteQuery proces server response this way

```jsx
// Testing.tsx
import React from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchPosts = async ({ pageParam = 1 }) => {
  return await fetch(
    `https://api.rawg.io/api/games?page=${pageParam}&page_size=10&key=b0d7069520c04a5c8e168712f0464506`
  ).then((res) => res.json());
};

const PostList = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ["games"],
    fetchPosts,
    {
      getNextPageParam: (lastPage, allPages) => {
        return allPages.length + 1; // Generate pageParam (exact Same name) which is an array[]  https://prnt.sc/fe1d0phEzpOd
      },
    }
  );

  if (isFetching) return <div>Loading...</div>;
  console.log(data);

  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.results.map((post, gameIndex) => (
            <div key={post.id}>
              {pageIndex * 10 + gameIndex + 1} {post.name}
            </div>
          ))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
};

// GameGrid.tsx
{data?.pages.map((page, pageIndex) => (
  <React.Fragment key={pageIndex}>
    {page.results.map((game, gameIndex) => (
      <GameCardContainer key={gameIndex}>
        <GameCard game={game} />
      </GameCardContainer>
    ))}
  </React.Fragment>
))}
{hasNextPage && (
  <Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
    Load More
  </Button>
)}
const useGames = (gameQuery: GameQuery) =>
  useInfiniteQuery<FetchResponse<Game>, Error>({
    queryKey: ["games", gameQuery],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: {
          genres: gameQuery.genre?.id,
          parent_platforms: gameQuery.platform?.id,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchText,
          page: pageParam,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
  });

// useGames.ts
const useGames = (gameQuery: GameQuery) =>
  useInfiniteQuery<FetchResponse<Game>, Error>({
    queryKey: ["games", gameQuery],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: {
          genres: gameQuery.genre?.id,
          parent_platforms: gameQuery.platform?.id,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchText,
          page: pageParam,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
  });
```

### - Implement infinite scroll (GameGrid.tsx)

[React Infinite Scroll Component](https://www.npmjs.com/package/react-infinite-scroll-component)

- DataLenght: represents the number of data currently loaded, and it's used to update the dataLength prop of the InfiniteScroll component.
- Wrap in '< InfiniteScroll >'

```bash
npm i react-infinite-scroll-component
```

```jsx
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  gameQuery: GameQuery;
}

const GameGrid = ({ gameQuery }: Props) => {
  // const { data, error, isLoading } = useGames(gameQuery);
  const pageSize = 10;
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGames(gameQuery);

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  if (error) return <Text>error</Text>;

  const numberOfDataCurrentlyLoaded =
    data?.pages.reduce((total, page) => {
      return total + page.results.length;
    }, 0) || 0;

  return (
    <InfiniteScroll
      dataLength={numberOfDataCurrentlyLoaded} // most importent property
      next={() => fetchNextPage()}
      hasMore={!!hasNextPage} // convert to boolean ie. bool || Undifine is false
      loader={<Spinner />}
    >
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        padding="10px"
        spacing={6}
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <GameCardContainer key={skeleton}>
              <GameCardSkeleton />
            </GameCardContainer>
          ))}

        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.results.map((game, gameIndex) => (
              <GameCardContainer key={gameIndex}>
                <GameCard game={game} />
              </GameCardContainer>
            ))}
          </React.Fragment>
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};
```

### - Refactor: Simplify game query (Idal way of refactoring)

- Use F2 to rename all occurance to genreId
- Right click genreId and "go to reference"

```jsx
// App.js
export interface GameQuery {
  genreId?: number; // Change Happend here
  platformId?: number; // Change Happend here
  sortOrder: string;
  searchText: string;
}
```

### - Refactor: Create lookup hooks (useGenre.ts, usePlatform.ts)

- Create hook like useGenre.ts to find single genre object from all genres
- Perform "Organize Import"

```jsx
// useGenre.ts (1: get all genres using useGenres() then use find method)
import useGenres from "./useGenres";

const useGenre = (selectedGenreId?: number) => {
  const { data: genres } = useGenres();
  return genres?.results.find((g) => g.id === selectedGenreId);
};
export default useGenre;

// usePlatform.ts
import usePlatforms from "./usePlatformsStatic";

const usePlatform = (selectedPlatformId?: number) => {
  const { data: platforms } = usePlatforms();
  return platforms?.results.find((p) => p.id === selectedPlatformId);
};

// GameHeading.tsx
import usePlatform from "../hooks/usePlatform";
import useGenre from "../hooks/useGenre";

interface Props {
  gameQuery: GameQuery;
}

const GameHeading = ({ gameQuery }: Props) => {
  const genre = useGenre(gameQuery.genreId);
  const platform = usePlatform(gameQuery.platformId);

  const heading = `${platform?.name || ""} ${genre?.name || ""} Games`;
  return (
    <Heading as="h1" fontSize="4xl" marginY={5}>
      {heading}
    </Heading>
  );
};
```

# Zustand for State management [Zustand: React-Basic](https://github.com/subrotoice/react-basic#managing-application-state-with-zustand)

We can get ride of

- Prop drilling
- Central state update, (Markup and state update logic is in different place)
- All component re-render, (if we use reducer and context)

### Setting up Zustand store

```bash
npm i zustand@4.3.7
```

store.ts | useGameQueryStore hook return data(gameQuery) and functions for updating data

```jsx
import { create } from "zustand";

interface GameQuery {
  genreId?: number;
  platformId?: number;
  sortOrder?: string;
  searchText?: string;
}

interface GameQueryStore {
  gameQuery: GameQuery;
  setSearchText: (searchText: string) => void;
  setGenraId: (genraId: number) => void;
  setPlatformId: (platformId: number) => void;
  setSortOrder: (sortOrder: string) => void;
}

const useGameQueryStore =
  create <
  GameQueryStore >
  ((set) => ({
    gameQuery: {},
    setSearchText: (searchText) => set(() => ({ gameQuery: { searchText } })),
    setGenraId: (genreId) =>
      set((store) => ({ gameQuery: { ...store.gameQuery, genreId } })),
    setPlatformId: (platformId) =>
      set((store) => ({ gameQuery: { ...store.gameQuery, platformId } })),
    setSortOrder: (sortOrder) =>
      set((store) => ({ gameQuery: { ...store.gameQuery, sortOrder } })),
  }));

export default useGameQueryStore;
```

App.tsx | Remove all props which was previously holding data and function

```jsx
function App() {
  return (
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
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" paddingX={5}>
          <GenreList />
        </GridItem>
      </Show>
      <GridItem area="main">
        <Box paddingLeft={2}>
          <GameHeading />
          <HStack spacing={5} paddingBottom={5}>
            <PlatformSelector />
            <SortSelector />
          </HStack>
        </Box>
        <GameGrid />
      </GridItem>
    </Grid>
  );
}
```

NavBar.tsx | No Props and Updater here, Now it is managing centrally from store using zustand

```jsx
// Old NavBar
interface Props {
  onSearch: (searchText: string) => void;
}

const NavBar = ({ onSearch }: Props) => {
  return (
    <div>
      <HStack justifyContent="space-between" padding="10px">
        <Image src={logo} boxSize="60px" />
        <SearchInput onSearch={onSearch} />
        <ColorModeSwitch />
      </HStack>
    </div>
  );
};

// New NavBar after Zustand
const NavBar = () => {
  return (
    <div>
      <HStack justifyContent="space-between" padding="10px">
        <Image src={logo} boxSize="60px" />
        <SearchInput />
        <ColorModeSwitch />
      </HStack>
    </div>
  );
};
```

PlatformSelector.tsx | No Props and Updater here, Now it is managing centrally from store using zustand

```jsx
// Old PlatformSelector
interface Props {
  selectedPlatformId?: number;
  onSelectPlatform: (platform: Platform | null) => void;
}
const PlatformSelector = ({ selectedPlatformId, onSelectPlatform }: Props) => {
  const { data, error, isLoading } = usePlatformsStatic();
  const selectedPlatform = usePlatform(selectedPlatformId);
  if (error) return null; // A way of codding return here
  if (isLoading) return <Spinner />; // we could use inside last return

  return (
    <div>
      <Menu>
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          {selectedPlatform?.name || "Platform"}
        </MenuButton>
        <MenuList>
          {data?.results.map((platform) => (
            <MenuItem
              key={platform.id}
              onClick={() => onSelectPlatform(platform)}
            >
              {platform.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

// New PlatformSelector after Zustand
const PlatformSelector = () => {
  const { data, error, isLoading } = usePlatformsStatic();

  const setSelectedPlatformId = useGameQueryStore((s) => s.setPlatformId);
  const selectedPlatform = usePlatform();

  if (error) return null; // A way of codding return here
  if (isLoading) return <Spinner />; // we could use inside last return

  return (
    <div>
      <Menu>
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          {selectedPlatform?.name || "Platform"}
        </MenuButton>
        <MenuList>
          {data?.results.map((platform) => (
            <MenuItem
              key={platform.id}
              onClick={() => setSelectedPlatformId(platform.id)}
            >
              {platform.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};
```

# React-Router-Dom [React-Router: React-Basic](https://github.com/subrotoice/react-basic?tab=readme-ov-file#ch-3-react-router)

### Setting up React-Router-Dom

```bash
npm i react-router-dome@6.10.0
```

- _Create: src > pages > layout.tsx_
- _Create: src > pages > HomePage.tsx_
  layout.tsx

```jsx
import { Outlet } from "react-router-dom";

const layout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};
```

routes.tsx

```jsx
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "games/:id", element: <GameDetails /> },
    ],
  },
]);

export default router;
```

### **Handling Errors**

routes.tsx

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "games/:id", element: <GameDetails /> },
    ],
  },
]);
```

ErrorPage.tsx

```jsx
const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div>
      <NavBar />
      <Box padding={5}>
        <Heading>Opps</Heading>
        <Text>
          {isRouteErrorResponse(error)
            ? "Page Does not exist"
            : "An Unexpected Error occured"}
        </Text>
      </Box>
    </div>
  );
};
```

### **Fetching a Game (Little bit tricky)**

1. GameCard.tsx | Create link using React-Router-Dom

```jsx
<Heading fontSize={"2xl"}>
  <Link to={"/games/" + game.slug}>{game.name}</Link>
</Heading>
```

2. GameCardContainer.tsx | Add Hover effect

```jsx
return (
  <Box
    _hover={{
      transform: "scale(1.03)",
      transition: "transform .20s ease-in",
    }}
    borderRadius={10}
    overflow="hidden"
  >
    {children}
  </Box>
);
```

3. useGame.tsx | Hook for fetching game

```jsx
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { Game } from "./useGames";

const apiClient = new APIClient() < Game > "/games";

const useGame = (slug: string) =>
  useQuery({ queryKey: ["games", slug], queryFn: () => apiClient.get(slug) });

export default useGame;
```

4. api-client.ts | Add get function for fetching single game

```jsx
import axios, { AxiosRequestConfig } from "axios";

export interface FetchResponse<T> {
  count: number;
  next: string | null;
  results: T[];
}

const axiosInstance = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    //params is query String https://api.rawg.io/api/platforms?key=YOUR_API_KEY
    key: "b0d7069520c04a5c8e168712f0464506",
  },
});

class APIClient<T> {
  endPoint: string;
  constructor(endPoint: string) {
    this.endPoint = endPoint;
  }

  getAll = (config: AxiosRequestConfig) => {
    return (
      axiosInstance.get <
      FetchResponse <
      T >> (this.endPoint, config).then((res) => res.data)
    );
  };

  get = (id: number | string) => {
    return (
      axiosInstance.get < T > (this.endPoint + "/" + id).then((res) => res.data)
    );
  };
}

export default APIClient;
```

5. GameDetailsPage.tsx | Getting slug and use hook useGame(slug)

```jsx
import { useParams } from "react-router-dom";
import useGame from "../hooks/useGame";

const GameDetailsPage = () => {
  const { slug } = useParams();
  const { data: game, isLoading, error } = useGame(slug!);

  if (isLoading) return <Spinner />;
  if (error || !game) throw error;

  return (
    <div>
      <Heading>{game.name}</Heading>
      <Text>{game.description_raw}</Text>
    </div>
  );
};
```

### **Refactoring Entities**

**Right click on Game and "move to new file" Then move that file to entities folder**

### **Building Expandable Text**

GameDetailsPage.tsx

```jsx
import Expandable from "../components/Expandable";

const GameDetailsPage = () => {
  const [showMore, setShowMore] = useState(false);
  const { slug } = useParams();
  const { data: game, isLoading, error } = useGame(slug!);

  if (isLoading) return <Spinner />;
  if (error || !game) throw error;

  return (
    <div>
      <Heading>{game.name}</Heading>
      <Expandable>{game.description_raw}</Expandable>
    </div>
  );
};
```

_Level of Codding_ <br >
Expandable.tsx | Very smart codding how expandable implemented

```jsx
import { useState } from "react";

interface Props {
  children: string;
}

const Expandable = ({ children }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 300;
  if (children.length < limit) return <Text>{children}</Text>;

  const summary = expanded ? children : children.substring(0, limit) + "...";

  return (
    <Text>
      {summary}
      <Button
        size="xs"
        onClick={() => setExpanded(!expanded)}
        colorScheme="yellow"
        fontWeight="bold"
        marginLeft={2}
      >
        {expanded ? "Show Less" : "Show More"}
      </Button>
    </Text>
  );
};

export default Expandable;
```

### **Building Game Attributes: Another beauty of code** [See](https://prnt.sc/PsotYwf4DAJO)

1. GameDetailsPage.tsx

```jsx
return (
  <div>
    <Heading>{game.name}</Heading>
    <Expandable>{game.description_raw}</Expandable>
    <GameAttributes game={game} />
  </div>
);
```

2. GameAttributes.tsx | Contains mark up

```jsx
import DefinationItem from "./DefinationItem";

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
```

3. DefinationItem.tsx | DD, DT | Same look so make it as component

```jsx
import { Box, Heading } from "@chakra-ui/react";

interface Props {
  terms: string;
  children: ReactNode | ReactNode[];
}
const DefinationItem = ({ terms, children }: Props) => {
  return (
    <>
      <Box marginY={5}>
        <Heading as="dt" fontSize="md" color="gray.600">
          {terms}
        </Heading>
        <dd>{children}</dd>
      </Box>
    </>
  );
};
```

### **Building Game Trailer**

1. GameDetailsPage.tsx

```jsx
return (
  <div>
    <Heading>{game.name}</Heading>
    <Expandable>{game.description_raw}</Expandable>
    <GameAttributes game={game} />
    <GameTrailer gameId={game.id} />
  </div>
);
```

2. GameTrailer.tsx | Component for desplaying trailer

```jsx
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
```

3. useTrailers.ts | Hook for fetching data

```jsx
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { Trailer } from "../entities/Trailer";

const useTrailers = (gameId: number) => {
  const apiClient = new APIClient() < Trailer > `/games/${gameId}/movies`;
  return useQuery({
    queryKey: ["trailers", gameId],
    queryFn: apiClient.getAll,
  });
};

export default useTrailers;
```

### **Building Game Screenshots**

1. hooks/useScreenshots.ts | passing endpoint and getting data from server

```jsx
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { Screenshots } from "../entities/Screenshots";

const useScreenshots = (gameId: number) => {
  const apiClient =
    new APIClient() < Screenshots > `/games/${gameId}/screenshots`;
  return useQuery({
    queryKey: ["screenshots", gameId],
    queryFn: apiClient.getAll,
  });
};

export default useScreenshots;
```

2. entities/useScreenshots.ts | Just creating for step 1

```jsx
export interface Screenshots {
  id: number;
  image: string;
  height: number;
  width: number;
}
```

3. components/GameScreenshots.ts | UI for displaing data

```jsx
import { Image, SimpleGrid } from "@chakra-ui/react";
import useScreenshots from "../hooks/useScreenshots";

interface Props {
  gameId: number;
}
const GameScreenshots = ({ gameId }: Props) => {
  const { data, isLoading, error } = useScreenshots(gameId);

  if (isLoading) return null;

  if (error) throw error;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
      {data?.results.map((file) => (
        <Image key={file.id} src={file.image} />
      ))}
    </SimpleGrid>
  );
};
```

4. pages/GameDetailsPage.ts | Insert GameScreenshots ui component in the page

```jsx
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
```

### **Improving the Layout | 2 columns layout using simplegrid of Chakra**

pages/GameDetailsPage.tsx

```jsx
import { Box, Heading, SimpleGrid, Spinner } from "@chakra-ui/react";

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
```

### **Fixing the NavBar**

Present if we are in a certain game page and search something in searchbox then nothing show. But data is comming.<br />
Because we are in a game page where no information is showing about game. So we need to take back to homepage using react router.<br />

components/SearchInput.tsx

```jsx
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const setSearchText = useGameQueryStore((s) => s.setSearchText);
  const ref = useRef < HTMLInputElement > null;
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (ref.current) {
          setSearchText(ref.current.value);
          navigate("/"); // Added | Taking to homepage for showing search results
        }
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

### **Refactoring Entities | Makeing Default export instade of Name**

It is recomended to use default exports when there is a single export in a file. Default export no need {}
Step 1: Refactor: [Rind All References](https://img001.prntscr.com/file/img001/Ct9mF9S4QLCbjxOcMZvuNQ.jpeg)
Step 2: Make change all files accordingly

entities/Game.ts | Make it default and change all files accordingly

```jsx
import { Genre } from "./Genre";

export default interface Game {
  id: number;
  name: string;
  background_image: string;
  description_raw: string;
  parent_platforms: { platform: Platform }[]; // Very Crutial: Design Smale; https://prnt.sc/Mzc4SBafvAjL
  metacritic: number;
  rating_top: number;
  slug: string;
  genres: Genre[];
  publishers: Publisher[];
}
```

Do it for all entities like: Genre.ts, Platform.ts...
