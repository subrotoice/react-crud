import usePlatforms from "./usePlatformsStatic";

const usePlatform = (selectedPlatformId?: number) => {
  const { data: platforms } = usePlatforms();
  return platforms?.results.find((p) => p.id === selectedPlatformId);
};

export default usePlatform;
