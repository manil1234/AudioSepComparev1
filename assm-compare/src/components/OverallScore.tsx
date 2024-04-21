import { Badge } from "@chakra-ui/react";

interface Props {
  score: number;
  model: "spleeter" | "demucs"; // New prop to specify the model
}

const OverallScore = ({ score, model }: Props) => {
  // Convert the score to a string with 3 decimal places
  const formattedScore = score.toFixed(3);
  let color =
    score > 8 ? "purple" : score > 5 ? "green" : score > 2 ? "yellow" : "red";

  if (score === 0) {
    return (
      <Badge colorScheme="orange">
        {model === "spleeter" ? "Spleeter" : "Demucs"} Not tested
      </Badge>
    );
  }

  return (
    <Badge colorScheme={color}>
      {model === "spleeter" ? "Spleeter" : "Demucs"} : {formattedScore}
    </Badge>
  );
};

export default OverallScore;
