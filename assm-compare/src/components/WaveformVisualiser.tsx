import React, { useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformVisualizerProps {
  audioUrl: string;
  waveColor: string;
  progressColor: string;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioUrl,
  waveColor,
  progressColor,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    // Initialize WaveSurfer instance
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: waveColor,
      progressColor: progressColor,
      barWidth: 3,
      cursorWidth: 1,
    });

    // Load audio file
    wavesurfer.current.load(audioUrl);

    // Attach click event listener
    wavesurfer.current.on("click", () => {
      wavesurfer.current.playPause();
    });

    return () => {
      // Clean up on component unmount
      wavesurfer.current.destroy();
    };
  }, [audioUrl]);

  return <div ref={waveformRef} />;
};

export default WaveformVisualizer;
