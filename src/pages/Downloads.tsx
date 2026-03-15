import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Track from '../components/audio/Track';

const Downloads: React.FC = () => {
  return (
    <Box p={8}>
      <Heading mb={6} textAlign="center">
        Download Library
      </Heading>
      
      <Box maxW="800px" mx="auto">
        <Track />
      </Box>
    </Box>
  );
};

export default Downloads;