import React from "react";
import ReactPlayer from "react-player";

const AudioPlayer = () => {
  return (
    <ReactPlayer
      url="URL_TO_YOUR_AUDIO_FILE"
      controls={true}
      width="100%"
      height="50px"
      volume={0.8}
    />
  );
};

export default AudioPlayer;
