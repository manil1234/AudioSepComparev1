import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SongCardContainer = ({ children }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} // Set initial opacity to 0
      animate={{ opacity: 1 }} // Animate opacity to 1
      exit={{ opacity: 0 }} // Animate opacity to 0 when component is removed
      transition={{ duration: 0.5 }} // Set transition duration
    >
      <Box
        width="300px"
        borderRadius={10}
        overflow="hidden"
        transition="transform 0.3s" // Add transition for smoother effect
        _hover={{
          bg: "gray.50", // Change background color on hover
          transform: "scale(1.05)", // Scale up by 5% on hover
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
};

export default SongCardContainer;
