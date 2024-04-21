import { Song } from "../hooks/useSongs";
import { Card, CardBody, Heading, Image } from "@chakra-ui/react";
import OverallScore from "./OverallScore";
import { useHistory } from "react-router-dom";

interface Props {
  song: Song;
}

const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SongCard = ({ song }: Props) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/songs/${song.id}`);
  };
  return (
    <Card height="600px" onClick={handleClick}>
      {song.artwork_uri ? (
        <Image
          src={`http://127.0.0.1:5000/images/${song.title}.mp4.jpg`}
          alt={song.title}
          // Set fixed width and height for the image
          height="400px"
          objectFit="cover" // Ensure the image covers the container without stretching
        />
      ) : (
        <Image
          src="https://purepng.com/public/uploads/large/purepng.com-music-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596085b6osz.png"
          alt="Placeholder Image"
          width="512px"
          height="512px"
          objectFit="cover"
        />
      )}
      <CardBody>
        <Heading fontSize={"2xl"}>{song.title}</Heading>
        <div>Artist: {song.artist}</div>
        <div>Duration: {formatDuration(song.duration)}</div>
        <OverallScore
          score={song.comparison_metrics?.spleeter_overall_SDR || 0}
          model="spleeter"
        />
        <br />
        <OverallScore
          score={song.comparison_metrics?.demucs_overall_SDR || 0}
          model="demucs"
        />
      </CardBody>
    </Card>
  );
};

export default SongCard;
