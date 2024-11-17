import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  children: string;
}

const Expandable = ({ children }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 300;
  if (children.length < limit) return <Text>{children}</Text>;

  const summary = expanded ? children : children.substring(0, limit) + "...";

  return (
    <Text>
      {summary}
      <Button
        size="xs"
        onClick={() => setExpanded(!expanded)}
        colorScheme="yellow"
        fontWeight="bold"
        marginLeft={2}
      >
        {expanded ? "Show Less" : "Show More"}
      </Button>
    </Text>
  );
};

export default Expandable;
