import { Flex, Heading } from "@radix-ui/themes";
import "./Result.css";

export interface ResultProps {
  right: number;
  missed: number;
}

export function Result(result: ResultProps) {
  return (
    <Flex className="result">
      <Heading as="h4">Right: {result.right}</Heading>
      <Heading as="h4">Missed: {result.missed}</Heading>
    </Flex>
  );
}
