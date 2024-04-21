import axios, { CanceledError } from "axios";
import { useEffect, useState } from "react";
import { SongQuery } from "../App";

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

const useSongs = (songQuery: SongQuery) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        const fetchSongs = async () => {
            try {
                const response = await axios.get<Song[]>('http://127.0.0.1:5000/songs', 
                { params: { ordering: songQuery.sortOrder },
                signal: controller.signal });
                setSongs(response.data);
                setLoading(false);
            } catch (error) {
                if (error instanceof CanceledError) return;
                setError(error.message);
                setLoading(true);
            }
        };
        fetchSongs();
        return () => controller.abort();
    }, [songQuery.sortOrder]);
    return { songs, error, isLoading }
}

export default useSongs;