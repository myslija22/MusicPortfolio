//gemini.google.com
import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface Track {
    src: string;
    title?: string;
}

interface AudioContextType {
    currentTrack: Track | null;
    playTrack: (track: Track) => void;
    stopTrack: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

    const playTrack = (track: Track) => {
        setCurrentTrack(track);
    };

    const stopTrack = () => {
        setCurrentTrack(null);
    };

    return (
        <AudioContext.Provider value={{ currentTrack, playTrack, stopTrack }}>
        {children}
        </AudioContext.Provider>
    );
    };

    export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};