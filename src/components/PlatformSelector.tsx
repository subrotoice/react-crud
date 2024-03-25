import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import usePlatformsStatic, { Platform } from "../hooks/usePlatformsStatic";

interface Props {
  selectedPlatform: Platform | null;
  onSelectPlatform: (platform: Platform | null) => void;
}
const PlatformSelector = ({ selectedPlatform, onSelectPlatform }: Props) => {
  const { data, error, isLoading } = usePlatformsStatic();
  if (error) return null; // A way of codding return here
  if (isLoading) return <Spinner />; // we could use inside last return

  return (
    <div>
      <Menu>
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          {selectedPlatform?.name || "Platform"}
        </MenuButton>
        <MenuList>
          {data.results.map((platform) => (
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

export default PlatformSelector;
