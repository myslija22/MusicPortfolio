import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Tracks from '../components/audio/Tracks';

const Downloads: React.FC = () => {
  return (
    <Box py={10} px={5} maxW="container.xl" mx="auto">
      <Heading mb={8} textAlign="center">
        Demos
      </Heading>

      <Tracks isExclusive={false} />
    </Box>
  );
};

export default Downloads;