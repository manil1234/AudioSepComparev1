import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";


export interface ComparisonMetrics {
    demucs_bass_ISR?: number;
    demucs_bass_SAR?: number;
    demucs_bass_SDR?: number;
    demucs_drums_ISR?: number;
    demucs_drums_SAR?: number;
    demucs_drums_SDR?: number;
    demucs_other_ISR?: number;
    demucs_other_SAR?: number;
    demucs_other_SDR?: number;
    demucs_vocals_ISR?: number;
    demucs_vocals_SAR?: number;
    demucs_vocals_SDR?: number;
    demucs_overall_SDR?: number;
    demucs_overall_ISR?: number;
    demucs_overall_SAR?: number;
    demucs_overall_time?: number;
    spleeter_bass_ISR?: number;
    spleeter_bass_SAR?: number;
    spleeter_bass_SDR?: number;
    spleeter_drums_ISR?: number;
    spleeter_drums_SAR?: number;
    spleeter_drums_SDR?: number;
    spleeter_other_ISR?: number;
    spleeter_other_SAR?: number;
    spleeter_other_SDR?: number;
    spleeter_vocals_ISR?: number;
    spleeter_vocals_SAR?: number;
    spleeter_vocals_SDR?: number;
    spleeter_overall_SDR?: number;
    spleeter_overall_ISR?: number;
    spleeter_overall_SAR?: number;

    spleeter_overall_time?: number;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    duration: number;
    audio_url: string;
    artwork_uri: string;
    comparison_metrics?: ComparisonMetrics;
}

interface SongResponse {
  data: Song;
}

const useSong = (id: string) => {
  const [song, setSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSong = async () => {
      try {
        const response = await axios.get<SongResponse>(
          `http://127.0.0.1:5000/songs/${id}`,
          { signal: controller.signal }
        );
        setSong(response.data);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request aborted");
        } else {
          setError((error as AxiosError).message);
          setLoading(false);
        }
      }
    };

    fetchSong();

    return () => controller.abort();
  }, [id]);

  return { song, error, isLoading };
};

export default useSong;
