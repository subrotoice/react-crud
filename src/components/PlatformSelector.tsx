import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import usePlatform from "../hooks/usePlatform";
import usePlatformsStatic from "../hooks/usePlatformsStatic";
import useGameQueryStore from "../store";

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

export default PlatformSelector;
