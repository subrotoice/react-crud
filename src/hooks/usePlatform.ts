import useGameQueryStore from "../store";
import usePlatforms from "./usePlatformsStatic";

const usePlatform = () => {
  const selectedPlatformId = useGameQueryStore((s) => s.gameQuery.platformId);
  const { data: platforms } = usePlatforms();
  return platforms?.results.find((p) => p.id === selectedPlatformId);
};

export default usePlatform;
