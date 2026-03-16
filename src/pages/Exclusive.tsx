import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Tracks from '../components/audio/Tracks';

const Exclusive: React.FC = () => {
  return (
    <Box py={10} px={5} maxW="container.xl" mx="auto">
      <Heading mb={8} textAlign="center">
        Exclusive Demos
      </Heading>
      
      <Tracks isExclusive={true} />
    </Box>
  );
};

export default Exclusive;