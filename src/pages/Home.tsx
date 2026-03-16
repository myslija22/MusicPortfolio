import { 
    Box, 
    Container, 
    Heading, 
    Text, 
    VStack, 
    Separator, 
    Link 
} from '@chakra-ui/react';

import Track from '@/components/audio/Track';

const Home = () => {
    return (
        <Container maxW="4xl" py={12}>
            <VStack gap={64} align="stretch">
                <Box textAlign="center" py={10}>
                    <Heading as="h1" size="4xl" mb={4}>
                        Jan Myslil
                    </Heading>
                    <Text fontSize="2xl" color="gray.500" mb={2}>
                        Producer & Sound Engineer
                    </Text>
                    <Text fontSize="lg" color="gray.400">
                        Prague
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="2xl" mb={8} textAlign="center">
                        Featured Work
                    </Heading>
                    <Track />
                </Box>

                {/* Recent Credits & Collaborations */}
                <Box>
                    <Heading as="h2" size="2xl" mb={8}>
                        Recent Credits & Collaborations
                    </Heading>
                    <VStack align="start" gap={6}>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">Samvelo & Carpinteroo</Text>
                            <Text color="gray.500" fontSize="lg">– DANCER</Text>
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">Radek Titěra</Text>
                            <Text color="gray.500" fontSize="lg">- Deep Ignition Soundtrack</Text>
                        </Box>
                    </VStack>
                </Box>



                <Box textAlign="center" pb={10}>
                    <Heading as="h2" size="2xl" mb={6}>
                        Reach Out!
                    </Heading>
                    <VStack gap={3}>
                        <Link href='https://www.instagram.com/honza_myslil?igsh=ZGp4eHYyb2Mybnhq&utm_source=qr'>
                            <Text fontSize="lg" color="gray.300">
                                Instagram
                            </Text>
                        </Link>
                        <Link href='https://soundcloud.com/majslil'>
                            <Text fontSize="lg" color="gray.300">
                                SoundCloud
                            </Text>
                        </Link>
                    </VStack>
                </Box>

            </VStack>
        </Container>
    );
};

export default Home;