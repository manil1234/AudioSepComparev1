import { SimpleGrid } from "@chakra-ui/react";
import { SongQuery } from "../App";
import useSongs from "../hooks/useSongs";
import SongCard from "./SongCard";
import SongCardSkeleton from "./SongCardSkeleton";
import SongCardContainer from "./SongCardContainer";

interface Props {
  songQuery: SongQuery;
}

const SongGrid = ({ songQuery }: Props) => {
  const { songs, error, isLoading } = useSongs(songQuery);
  const skeletons = [1, 2, 3, 4, 5, 6];

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 5 }}
        padding="10px"
        spacing={10}
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <SongCardContainer key={skeleton}>
              <SongCardSkeleton />
            </SongCardContainer>
          ))}
        {songs.map((song, index) => (
          <SongCardContainer key={index}>
            <SongCard song={song} />
          </SongCardContainer>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default SongGrid;
