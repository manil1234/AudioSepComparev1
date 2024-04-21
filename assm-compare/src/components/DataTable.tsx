import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface DataTableProps {
  song: any;
  metric: string; // Add a prop for the metric
}

const DataTable: React.FC<DataTableProps> = ({ song, metric }) => {
  // Define a function to get the metric value from Spleeter data
  const spleeterGetMetricValue = (category: string) => {
    if (!song.comparison_metrics) return "-";
    return song.comparison_metrics[`spleeter_${category}_${metric}`] || "-";
  };

  // Define a function to get the metric value from Demucs data
  const demucsGetMetricValue = (category: string) => {
    if (!song.comparison_metrics) return "-";
    return song.comparison_metrics[`demucs_${category}_${metric}`] || "-";
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Category</Th>
          <Th>Spleeter Score</Th>
          <Th>Demucs Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Drums</Td>
          <Td>{spleeterGetMetricValue("drums")}</Td>
          <Td>{demucsGetMetricValue("drums")}</Td>
        </Tr>
        <Tr>
          <Td>Bass</Td>
          <Td>{spleeterGetMetricValue("bass")}</Td>
          <Td>{demucsGetMetricValue("bass")}</Td>
        </Tr>
        <Tr>
          <Td>Vocals</Td>
          <Td>{spleeterGetMetricValue("vocals")}</Td>
          <Td>{demucsGetMetricValue("vocals")}</Td>
        </Tr>
        <Tr>
          <Td>Other</Td>
          <Td>{spleeterGetMetricValue("other")}</Td>
          <Td>{demucsGetMetricValue("other")}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default DataTable;
