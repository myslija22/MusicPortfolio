import React, { useEffect, useState } from 'react';
import { Box, Button, Text, VStack, Spinner } from '@chakra-ui/react';
import { useAudio } from '../../context/AudioContext';
import { supabase } from '../../lib/supabase';

interface TrackData {
    id: string | number;
    title: string;
    file_path: string;
    artist?: string; 
}

const Track: React.FC = () => {
    const { playTrack } = useAudio();
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tracks')
            .select('*');

        if (error) {
            console.error('Error fetching tracks:', error.message);
        } else if (data) {
            setTracks(data);
        }
        setLoading(false);
        };

        fetchTracks();
    }, []);

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

    if (loading) {
        return <Spinner size="xl" />;
    }

    return (
        <VStack align="stretch" gap={4} p={4} maxW="600px">
        <Text fontSize="2xl" fontWeight="bold">Music Library</Text>
        
        {tracks.length === 0 ? (
            <Text>No tracks found.</Text>
        ) : (
            tracks.map((track) => (
            <Box 
                key={track.id} 
                p={4} 
                borderWidth="1px" 
                borderRadius="md" 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                _dark={{ borderColor: "whiteAlpha.300", bg: "whiteAlpha.50" }}
            >
                <Box>
                <Text fontWeight="bold">{track.title}</Text>
                {track.artist && <Text fontSize="sm" color="gray.500">{track.artist}</Text>}
                </Box>
                <Button onClick={() => handlePlay(track)} colorScheme="blue" size="sm">
                Play
                </Button>
            </Box>
            ))
        )}
        </VStack>
    );
};

export default Track;