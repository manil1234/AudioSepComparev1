import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Image,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  Button,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import useSong from "../hooks/useSong";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import OverallScore from "./OverallScore";
import RadarChart from "./RadarChart";
import { useEffect, useState } from "react";
import DataModal from "./DataModal";
import WaveformVisualizer from "./WaveformVisualiser";
import useSeparateSong from "../hooks/useSeparateSong";

interface Params {
  id: string;
}
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SongDetails: React.FC = () => {
  const { id } = useParams<Params>();
  const { song, error, isLoading } = useSong(id);
  const { separateSong, isSeparateLoading, isSeparateSuccess, separateError } =
    useSeparateSong();
  const handleSeparateClick = () => {
    separateSong(song.title);
  };
  useEffect(() => {
    if (isSeparateSuccess) {
      // Reload the page when isSeparateSuccess becomes true
      window.location.reload();
    }
  }, [isSeparateSuccess]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const totalDataPages = 3;
  const totalAudioPages = 5;
  const options = {
    scales: {
      r: {
        grid: {
          color: "rgba(149, 149, 149, 1)",
        },
      },
    },
    responsive: true,
  };

  const [currentDataPage, setCurrentDataPage] = useState<number>(0);
  const [currentAudioPage, setCurrentAudioPage] = useState<number>(0);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!song) {
    return <div>Song not found</div>;
  }

  const sdr_data = {
    labels: ["Drums", "Bass", "Vocals", "Other"],
    datasets: [
      {
        label: "Spleeter",
        data: [
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_drums_SDR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_bass_SDR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_vocals_SDR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_other_SDR) ||
            0,
        ],
        backgroundColor: "rgba(66, 219, 255, 0.2)",
        borderColor: "rgba(66, 219, 255, 1)",
        pointBackgroundColor: "rgba(255, 120, 120, 1)",
        borderWidth: 1,
      },
      {
        label: "Demucs",
        data: [
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_drums_SDR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_bass_SDR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_vocals_SDR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_other_SDR) ||
            0,
        ],
        backgroundColor: "rgba(23, 252, 55, 0.2)",
        borderColor: "rgba(23, 252, 55, 1)",
        pointBackgroundColor: "rgba(255, 218, 104, 1)",
        borderWidth: 1,
      },
    ],
  };

  const isr_data = {
    labels: ["Drums", "Bass", "Vocals", "Other"],
    datasets: [
      {
        label: "Spleeter",
        data: [
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_drums_ISR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_bass_ISR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_vocals_ISR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_other_ISR) ||
            0,
        ],
        backgroundColor: "rgba(66, 219, 255, 0.2)",
        borderColor: "rgba(66, 219, 255, 1)",
        pointBackgroundColor: "rgba(255, 120, 120, 1)",
        borderWidth: 1,
      },
      {
        label: "Demucs",
        data: [
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_drums_ISR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_bass_ISR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_vocals_ISR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_other_ISR) ||
            0,
        ],
        backgroundColor: "rgba(23, 252, 55, 0.2)",
        borderColor: "rgba(23, 252, 55, 1)",
        pointBackgroundColor: "rgba(255, 218, 104, 1)",
        borderWidth: 1,
      },
    ],
  };

  const sar_data = {
    labels: ["Drums", "Bass", "Vocals", "Other"],
    datasets: [
      {
        label: "Spleeter",
        data: [
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_drums_SAR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_bass_SAR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_vocals_SAR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.spleeter_other_SAR) ||
            0,
        ],
        backgroundColor: "rgba(66, 219, 255, 0.2)",
        borderColor: "rgba(66, 219, 255, 1)",
        pointBackgroundColor: "rgba(255, 120, 120, 1)",
        borderWidth: 1,
      },
      {
        label: "Demucs",
        data: [
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_drums_SAR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_bass_SAR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_vocals_SAR) ||
            0,
          (song.comparison_metrics &&
            song.comparison_metrics.demucs_other_SAR) ||
            0,
        ],
        backgroundColor: "rgba(23, 252, 55, 0.2)",
        borderColor: "rgba(23, 252, 55, 1)",
        pointBackgroundColor: "rgba(255, 218, 104, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cyclic pages for Data tables and Audio files
  const handleNextDataPage = () => {
    setCurrentDataPage((prevPage) => (prevPage + 1) % totalDataPages);
  };

  const handlePrevDataPage = () => {
    setCurrentDataPage(
      (prevPage) => (prevPage - 1 + totalDataPages) % totalDataPages
    );
  };

  const handleNextAudioPage = () => {
    setCurrentAudioPage((prevPage) => (prevPage + 1) % totalAudioPages);
  };

  const handlePrevAudioPage = () => {
    setCurrentAudioPage(
      (prevPage) => (prevPage - 1 + totalAudioPages) % totalAudioPages
    );
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box backgroundColor={bgColor} borderRadius="lg" p="4">
        <Flex>
          <Box flex="1">
            <Text fontSize="xl" fontWeight="bold">
              {song.title}
            </Text>
            <Text fontSize="lg">Artist: {song.artist}</Text>
            <Text fontSize="lg">Duration: {formatDuration(song.duration)}</Text>
            {(song.comparison_metrics || isSeparateSuccess) && (
              <>
                <VStack>
                  <HStack>
                    <Badge
                      variant="outline"
                      colorScheme={
                        (song.comparison_metrics?.spleeter_overall_time ?? 0) >=
                        (song.comparison_metrics?.demucs_overall_time ?? 0)
                          ? "red"
                          : "green"
                      }
                    >
                      {" "}
                      Spleeter{" "}
                      {(
                        song.comparison_metrics?.spleeter_overall_time ?? 0
                      ).toFixed(1)}{" "}
                      seconds{" "}
                    </Badge>
                    <Badge
                      variant="outline"
                      colorScheme={
                        (song.comparison_metrics?.demucs_overall_time ?? 0) >=
                        (song.comparison_metrics?.spleeter_overall_time ?? 0)
                          ? "red"
                          : "green"
                      }
                    >
                      {" "}
                      Demucs{" "}
                      {(
                        song.comparison_metrics?.demucs_overall_time ?? 0
                      ).toFixed(1)}{" "}
                      seconds{" "}
                    </Badge>
                  </HStack>
                  {song.comparison_metrics &&
                    (song.comparison_metrics.spleeter_overall_time >=
                    song.comparison_metrics.demucs_overall_time ? (
                      <Badge variant="outline" colorScheme="teal">
                        Demucs was{" "}
                        {(
                          song.comparison_metrics.spleeter_overall_time /
                          song.comparison_metrics.demucs_overall_time
                        ).toFixed(1)}
                        X faster!
                      </Badge>
                    ) : (
                      <Badge variant="outline" colorScheme="teal" fontSize="l">
                        Spleeter was{" "}
                        {(
                          song.comparison_metrics.demucs_overall_time /
                          song.comparison_metrics.spleeter_overall_time
                        ).toFixed(1)}
                        X faster!
                      </Badge>
                    ))}
                </VStack>
              </>
            )}
            <br />
            <Image
              src={
                song.artwork_uri
                  ? `http://127.0.0.1:5000/images/${song.title}.mp4.jpg`
                  : "https://purepng.com/public/uploads/large/purepng.com-music-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596085b6osz.png"
              }
              alt={song.title}
              height="400px"
              objectFit="cover"
            />
            {currentAudioPage === 0 && (
              <div>
                <Text fontSize="l" as="i">
                  Original Mix
                </Text>
                <WaveformVisualizer
                  audioUrl={`http://127.0.0.1:5000/songs/musb18/${song.title}.mp4`}
                  waveColor={"#e6e6e6"}
                  progressColor={"#b3b3b3"}
                />
              </div>
            )}
            {!song.comparison_metrics && (
              <>
                <Box p="20">
                  <VStack>
                    <Text fontSize="xl" noOfLines={2}>
                      Song has not been processed yet. {"\n"}
                      Please click below.
                    </Text>

                    <Button
                      colorScheme="teal"
                      variant="outline"
                      onClick={handleSeparateClick}
                    >
                      {isSeparateLoading ? "Separating..." : "Separate Song"}
                    </Button>
                    {isSeparateLoading && <Spinner />}
                    <Link href="/">
                      <IconButton
                        aria-label="Go Back"
                        icon={<CloseIcon />}
                        variant="ghost"
                      />
                    </Link>
                  </VStack>
                </Box>
              </>
            )}
            {(song.comparison_metrics || isSeparateSuccess) && (
              <>
                {currentAudioPage === 1 && (
                  <div>
                    <Text fontSize="l" as="i">
                      Drums Mix
                    </Text>
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/musb18/${song.title}.mp4/drums`}
                      waveColor={"#e6e6e6"}
                      progressColor={"#b3b3b3"}
                    />
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/demucs/${song.title}/drums.wav`}
                      waveColor={"#17fc36"}
                      progressColor={"#0c781a"}
                    />
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/spleeter/${song.title}/drums.wav`}
                      waveColor={"#42dcff"}
                      progressColor={"#216e80"}
                    />
                  </div>
                )}
                {currentAudioPage === 2 && (
                  <div>
                    <Text fontSize="l" as="i">
                      Bass Mix
                    </Text>
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/musb18/${song.title}.mp4/bass`}
                      waveColor={"#e6e6e6"}
                      progressColor={"#b3b3b3"}
                    />
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/demucs/${song.title}/bass.wav`}
                      waveColor={"#17fc36"}
                      progressColor={"#0c781a"}
                    />
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/spleeter/${song.title}/bass.wav`}
                      waveColor={"#42dcff"}
                      progressColor={"#216e80"}
                    />
                  </div>
                )}
                {currentAudioPage === 3 && (
                  <div>
                    <Text fontSize="l" as="i">
                      Vocals Mix
                    </Text>
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/musb18/${song.title}.mp4/vocals`}
                      waveColor={"#e6e6e6"}
                      progressColor={"#b3b3b3"}
                    />
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/demucs/${song.title}/vocals.wav`}
                      waveColor={"#17fc36"}
                      progressColor={"#0c781a"}
                    />
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/spleeter/${song.title}/vocals.wav`}
                      waveColor={"#42dcff"}
                      progressColor={"#216e80"}
                    />
                  </div>
                )}
                {currentAudioPage === 4 && (
                  <div>
                    <Text fontSize="l" as="i">
                      Other Mix
                    </Text>
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/musb18/${song.title}.mp4/other`}
                      waveColor={"#e6e6e6"}
                      progressColor={"#b3b3b3"}
                    />
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/demucs/${song.title}/other.wav`}
                      waveColor={"#17fc36"}
                      progressColor={"#0c781a"}
                    />
                    <WaveformVisualizer
                      audioUrl={`http://127.0.0.1:5000/songs/spleeter/${song.title}/other.wav`}
                      waveColor={"#42dcff"}
                      progressColor={"#216e80"}
                    />
                  </div>
                )}
                <HStack justifyContent="center">
                  <IconButton
                    aria-label="Previous Page"
                    icon={<ChevronLeftIcon />}
                    onClick={handlePrevAudioPage}
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Next Page"
                    icon={<ChevronRightIcon />}
                    onClick={handleNextAudioPage}
                    variant="ghost"
                  />
                  <br />
                </HStack>
              </>
            )}
          </Box>
          {(song.comparison_metrics || isSeparateSuccess) && (
            <>
              <Box p="4">
                <VStack>
                  {currentDataPage === 0 && (
                    <>
                      <Text fontSize="xl" fontWeight="bold">
                        Signal To Distortion Ratio (SDR)
                      </Text>
                      <HStack>
                        <OverallScore
                          score={
                            song.comparison_metrics?.spleeter_overall_SDR || 0
                          }
                          model="spleeter"
                        />
                        <br />
                        <OverallScore
                          score={
                            song.comparison_metrics?.demucs_overall_SDR || 0
                          }
                          model="demucs"
                        />
                      </HStack>
                      <RadarChart data={sdr_data} options={options} /> <br />
                      <Button
                        colorScheme="teal"
                        variant="outline"
                        onClick={onOpen}
                      >
                        View Raw Data
                      </Button>
                      <DataModal
                        isOpen={isOpen}
                        onClose={onClose}
                        song={song}
                        metric="SDR"
                        header="Signal To Distortion Ratio (SDR)"
                      />
                    </>
                  )}
                  {currentDataPage === 1 && (
                    <>
                      <Text fontSize="xl" fontWeight="bold">
                        Source to Spatial Distortion Image (ISR)
                      </Text>
                      <HStack>
                        <OverallScore
                          score={
                            song.comparison_metrics?.spleeter_overall_ISR || 0
                          }
                          model="spleeter"
                        />
                        <br />
                        <OverallScore
                          score={
                            song.comparison_metrics?.demucs_overall_ISR || 0
                          }
                          model="demucs"
                        />
                      </HStack>
                      <RadarChart data={isr_data} options={options} />
                      <Button
                        colorScheme="teal"
                        variant="outline"
                        onClick={onOpen}
                      >
                        View Raw Data
                      </Button>
                      <DataModal
                        isOpen={isOpen}
                        onClose={onClose}
                        song={song}
                        metric="ISR"
                        header="Source to Spatial Distortion Image (ISR)"
                      />
                    </>
                  )}
                  {currentDataPage === 2 && (
                    <>
                      <Text fontSize="xl" fontWeight="bold">
                        Source to Artifact Ratio (SAR)
                      </Text>
                      <HStack>
                        <OverallScore
                          score={
                            song.comparison_metrics?.spleeter_overall_SAR || 0
                          }
                          model="spleeter"
                        />
                        <br />
                        <OverallScore
                          score={
                            song.comparison_metrics?.demucs_overall_SAR || 0
                          }
                          model="demucs"
                        />
                      </HStack>
                      <RadarChart data={sar_data} options={options} />
                      <Button
                        colorScheme="teal"
                        variant="outline"
                        onClick={onOpen}
                      >
                        View Raw Data
                      </Button>
                      <DataModal
                        isOpen={isOpen}
                        onClose={onClose}
                        song={song}
                        metric="SAR"
                        header="Source to Artifact Ratio (SAR)"
                      />
                    </>
                  )}

                  <HStack>
                    <IconButton
                      aria-label="Previous Page"
                      icon={<ChevronLeftIcon />}
                      onClick={handlePrevDataPage}
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Next Page"
                      icon={<ChevronRightIcon />}
                      onClick={handleNextDataPage}
                      variant="ghost"
                    />
                    <br />
                  </HStack>
                  <Link href="/">
                    <IconButton
                      aria-label="Go Back"
                      icon={<CloseIcon />}
                      variant="ghost"
                    />
                  </Link>
                </VStack>
              </Box>
            </>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default SongDetails;
