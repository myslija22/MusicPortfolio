import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Spinner, VStack } from '@chakra-ui/react';
import { useAudio } from '../../context/AudioContext';
import { supabase } from '../../lib/supabase';

interface TrackData {
    id: string | number;
    title: string;
    file_path: string;
    artist?: string;
    created_at?: string;
}

const Track: React.FC = () => {
    const { playTrack } = useAudio();
    const [latestTrack, setLatestTrack] = useState<TrackData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestTrack = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('tracks')
                .select('*')
                .eq('is_exclusive', false)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error('Error fetching latest track:', error.message);
            } else if (data) {
                setLatestTrack(data);
            }

            setLoading(false);
        };

        fetchLatestTrack();
    }, []);

    const handlePlay = () => {
        if (!latestTrack) return;

        const { data } = supabase.storage
            .from('audio_files')
            .getPublicUrl(latestTrack.file_path);

        if (data?.publicUrl) {
            playTrack({
                src: data.publicUrl,
                title: latestTrack.title,
            });
        }
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    if (!latestTrack) {
        return <Text textAlign="center">No tracks found.</Text>;
    }

    return (
        <Box
            p={6}
            borderWidth="1px"
            borderRadius="xl"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            shadow="sm"
            transition="all 0.2s"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            _dark={{ borderColor: "whiteAlpha.300", bg: "transparent" }}
            minH="150px"
            maxW="md"
            mx="auto"
            borderColor="whiteAlpha.300"
        >
            <VStack gap={1} mb={4} textAlign="center">
                <Text fontWeight="bold" fontSize="lg" lineClamp={1}>{latestTrack.title}</Text>
                {latestTrack.artist && <Text fontSize="sm" color="gray.500" lineClamp={1}>{latestTrack.artist}</Text>}
            </VStack>

            <Button onClick={handlePlay} colorScheme="blue" width="full">
                Play Newest Release
            </Button>
        </Box>
    );
};

export default Track;