import React, { useEffect, useState } from 'react';
import { Box, Button, Text, SimpleGrid, Spinner, VStack, Grid, GridItem } from '@chakra-ui/react';
// Assuming you have LuDownload from react-icons; if not, you can use any icon or text
import { LuDownload } from 'react-icons/lu'; 
import { useAudio } from '../../context/AudioContext';
import { supabase } from '../../lib/supabase';

interface TrackData {
    id: string | number;
    title: string;
    file_path: string;
    artist?: string; 
    is_exclusive?: boolean;
}

interface TracksProps {
    isExclusive?: boolean;
}

const Tracks: React.FC<TracksProps> = ({ isExclusive = false }) => {
    const { playTrack } = useAudio();
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracks = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('tracks')
                .select('*')
                .eq('is_exclusive', isExclusive);

            if (error) {
                console.error('Error fetching tracks:', error.message);
            } else if (data) {
                setTracks(data);
            }
            setLoading(false);
        };

        fetchTracks();
    }, [isExclusive]);

    const handlePlay = (track: TrackData) => {
        const { data } = supabase.storage
        .from('audio_files')
        .getPublicUrl(track.file_path);

        if (data?.publicUrl) {
        playTrack({
            src: data.publicUrl,
            title: track.title, 
        });
        }
    };

    const handleDownload = (track: TrackData) => {
        // Create a clean filename
        const extension = track.file_path.split('.').pop() || 'mp3';
        const filename = `${track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;

        // Pass download: true (or the filename) to tell Supabase to set headers for downloading
        const { data } = supabase.storage
            .from('audio_files')
            .getPublicUrl(track.file_path, { download: filename });

        if (data?.publicUrl) {
            // Create a temporary link and click it to trigger native browser download instantly
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = data.publicUrl;
            a.download = filename; // Note: for cross-origin URLs, the server's content-disposition header (set by Supabase above) dictates the filename
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    return (
        <Box w="full">
            {tracks.length === 0 ? (
                <Text textAlign="center">No tracks found.</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
                    {tracks.map((track) => (
                    <Box 
                        key={track.id} 
                        p={6} 
                        borderWidth="1px" 
                        borderRadius="xl" 
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between" 
                        //alignItems="center"
                        shadow="sm"
                        transition="all 0.2s"
                        _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                        _dark={{ borderColor: "whiteAlpha.300", bg: "gray.950" }}
                        minH="150px"
                        position="relative" // Required for absolute positioning of VIP badge
                    >
                        {isExclusive && (
                            <Box
                                position="absolute"
                                top={2}
                                left={2}
                                px={2}
                                py={1}
                                bg="orange.500"
                                color="white"
                                fontSize="xs"
                                fontWeight="bold"
                                borderRadius="md"
                                zIndex={1}
                            >
                                VIP
                            </Box>
                        )}
                        <VStack gap={1} mb={4} textAlign="center">
                            <Text fontWeight="bold" fontSize="lg" lineClamp={1}>{track.title}</Text>
                            {track.artist && <Text fontSize="sm" color="gray.500" lineClamp={1}>{track.artist}</Text>}
                        </VStack>
                        
                        <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                            <GridItem colSpan={3}>
                                <Button onClick={() => handlePlay(track)} colorScheme="blue" width="full">
                                    Play
                                </Button>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Button 
                                    onClick={() => handleDownload(track)} 
                                    colorScheme="teal" 
                                    width="full"
                                    aria-label="Download track"
                                >
                                    <LuDownload />
                                </Button>
                            </GridItem>   
                        </Grid>
                    </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};

export default Tracks;