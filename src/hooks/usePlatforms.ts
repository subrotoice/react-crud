import useData from "./useData";
import { Platform } from "./useGames";

// useData (endpoint, params?, dependency?)
const usePlatforms = () => useData<Platform>("/platforms/lists/parents");

export default usePlatforms;
