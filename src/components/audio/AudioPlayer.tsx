import React from 'react';
import { Box } from '@chakra-ui/react';
import H5AudioPlayer from 'react-h5-audio-player';
import { useAudio } from '../../context/AudioContext';
import 'react-h5-audio-player/lib/styles.css';

const AudioPlayer: React.FC = () => {
    const { currentTrack } = useAudio();

    if (!currentTrack) return null;

    return (
                <Box
            position="fixed"
            bottom="0"
            left="0"
            width="100%"
            zIndex={1000}
            boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
            bg="black" 
            _dark={{ bg: "black" }}
            css={{ //gemini.google.com
                
                '& .rhap_container': {
                    backgroundColor: 'transparent', 
                    boxShadow: 'none',
                },
                
                '& .rhap_time': {
                    color: 'gray.100',
                    fontFamily: 'inherit',
                },
                
                '& .rhap_button-clear svg': {
                    fill: 'white',
                    _hover: { fill: 'gray.400' }
                },

                '& .rhap_progress-bar, & .rhap_volume-bar': {
                    backgroundColor: 'gray.500', 
                },

                '& .rhap_progress-filled, & .rhap_volume-filled': {
                    backgroundColor: 'gray.100', 
                },

                '& .rhap_progress-indicator, & .rhap_volume-indicator': {
                    backgroundColor: 'gray.100',
                    boxShadow: '0 0 5px rgba(66, 153, 225, 0.5)',
                },

                '& .rhap_play-status--paused .rhap_progress-indicator': {
                    backgroundColor: 'gray.100',
                }, 
                
            }}
        >
            {currentTrack.title && (
                <Box 
                    px={4} 
                    py={2} 
                    fontSize="sm" 
                    fontWeight="bold"
                    borderBottom="1px solid"
                    borderColor="whiteAlpha.200"
                    color="white"
                >
                    Now Playing: {currentTrack.title}
                </Box>
            )}
            <H5AudioPlayer
                autoPlay
                src={currentTrack.src}
                showDownloadProgress={false}
                onPlay={() => console.log(`Playing: ${currentTrack.title || currentTrack.src}`)}
            />
        </Box>
    );
};

export default AudioPlayer;