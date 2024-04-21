import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

const SongCardSkeleton = () => {
  return (
    <Card>
      <Skeleton height="512px" />
      <CardBody>
        <SkeletonText />
      </CardBody>
    </Card>
  );
};

export default SongCardSkeleton;
