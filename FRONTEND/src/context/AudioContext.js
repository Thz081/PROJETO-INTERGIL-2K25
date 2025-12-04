import React, { createContext, useContext, useState, useMemo } from 'react';
import { Howl, Howler } from 'howler';

// 1. Importe seus arquivos de áudio
import themeSong from '../assets/audio/theme.mp3';
import clickSound from '../assets/audio/click.mp3';
import successSound from '../assets/audio/success.mp3';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  
  const sounds = useMemo(() => ({
    theme: new Howl({
      src: [themeSong],
      loop: false,
      volume: 0.06, // <-- REDUZIDO PARA 0.1 (BEM MAIS BAIXO)
      html5: true, 
    }),
    click: new Howl({
      src: [clickSound],
      volume: 0.5, // <-- Mais alto que a música
    }),
    success: new Howl({ 
      src: [successSound],
      volume: 0.7, // <-- O mais alto
    }),
  }), []);

  const [isMuted, setIsMuted] = useState(true);

  const playTheme = () => {
    if (!sounds.theme.playing()) {
      sounds.theme.play();
    }
  };

  const playClick = () => {
    if (!isMuted) {
      sounds.click.play();
    }
  };

  const playSuccess = () => { 
    if (!isMuted) {
      sounds.success.play();
    }
  };

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    Howler.mute(newState);
    if (newState) {
      sounds.theme.pause();
    } else {
      playTheme();
    }
  };

  const value = {
    isMuted,
    toggleMute,
    playClick,
    playSuccess,
    playTheme,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  return useContext(AudioContext);
};