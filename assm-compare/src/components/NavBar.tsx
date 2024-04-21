import { HStack, Image } from "@chakra-ui/react";
import logoBlack from "../assets/svsd_black.webp";
import logoWhite from "../assets/svsd_white.webp";
import ColorModeSwitch from "./ColorModeSwitch";
import { useColorModeValue } from "@chakra-ui/react";

const NavBar = () => {
  const logo = useColorModeValue(logoBlack, logoWhite);
  return (
    <HStack justifyContent="space-between" padding="10px">
      <Image src={logo} width={200} alt="logo" />
      <ColorModeSwitch />
    </HStack>
  );
};
export default NavBar;
