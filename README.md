## initial Commit

## Install Chakra UI

## Build a Responsive Layout

```jsx
// App.js
function App() {
  return (
    <Grid
      templateAreas={{
        base: `"nav nav" "main main"`,
        lg: `"nav nav" "aside main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside">Aside</GridItem>
      </Show>
      <GridItem area="main">Main</GridItem>
    </Grid>
  );
}
```

## Build a NavBar

```jsx
// Horizontal Stack
<HStack justifyContent="space-between" padding="10px">
  <Image src={logo} boxSize="60px" />
  <ColorModeSwitch />
</HStack>
```

## Implement dark mode

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

## Build the color mode switch

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

## Fetch the games

[Import System](https://prnt.sc/2eBA4idKjvmf){:target="\_blank"}
[Param of Axios](https://prnt.sc/gWqKmgDzN3eM){:target="\_blank"}

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

##

```jsx

```

##

```jsx

```

##

```jsx

```

##

```jsx

```

##

```jsx

```
