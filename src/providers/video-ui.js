import { createContext, useContext, useRef, useEffect, useCallback, useMemo } from "react";
import { useStore, createStore } from "zustand";

const VideoStoreContext = createContext(null);
const VideoContext = createContext(null);

function makeVideoStore() {
  return createStore((set) => ({
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoaded: false,
    buffered: 0,
    activeCue: null,
    isFullscreen: false,
    videoData: { cues: [], id: null },

    setIsPlaying: (b) => set({ isPlaying: b }),
    setIsMuted: (b) => set({ isMuted: b }),
    setCurrentTime: (t) => set({ currentTime: t }),
    setDuration: (d) => set({ duration: d }),
    setVolume: (v) => set({ volume: v }),
    setIsLoaded: (b) => set({ isLoaded: b }),
    setBuffered: (n) => set({ buffered: n }),
    setActiveCue: (c) => set({ activeCue: c }),
    setVideoData: (v) => set({ videoData: v }),
    setIsFullscreen: (b) => set({ isFullscreen: b }),
  }));
}

export function VideoUIProvider({ children, videoData }) {
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const storeRef = useRef();

  if (!storeRef.current) storeRef.current = makeVideoStore();

  const actions = storeRef.current.getState();

  useEffect(() => {
    actions.setVideoData(videoData);
  }, [videoData]);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;

    if (!v) return;

    actions.setIsLoaded(true);
    actions.setDuration(v.duration);
    actions.setCurrentTime(v.currentTime);
    actions.setVolume(v.volume);
    actions.setIsMuted(v.muted);

    const { cues } = storeRef.current.getState().videoData;

    if (cues.length) {
      const track = v.addTextTrack("metadata", "cues");

      track.mode = "hidden";

      cues.forEach(({ startTime, endTime, cueText, cueId }, i) => {
        const cue = new VTTCue(startTime, endTime, cueText);

        cue.id = cueId ?? i;
        track.addCue(cue);
      });

      v.textTracks[0].addEventListener("cuechange", handleCueChange);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;

    if (!v) return;

    const bufferedEnd = v.buffered.length ? v.buffered.end(v.buffered.length - 1) : 0;

    actions.setCurrentTime(v.currentTime);
    actions.setBuffered(bufferedEnd);
  }, []);

  const handlePlay = useCallback(() => actions.setIsPlaying(true), []);

  const handlePause = useCallback(() => actions.setIsPlaying(false), []);

  const handleVolumeChange = useCallback(() => {
    const v = videoRef.current;

    if (v) {
      actions.setVolume(v.volume);
      actions.setIsMuted(v.muted);
    }
  }, []);

  const handleCueChange = useCallback(() => {
    const v = videoRef.current;

    if (!v) return;

    actions.setActiveCue(v.textTracks?.[0]?.activeCues?.[0]);
  }, []);

  useEffect(() => {
    const v = videoRef.current;

    if (!v) return;

    const handleError = (e) => console.error("Video error:", e, e.target.error);

    v.addEventListener("loadedmetadata", handleLoadedMetadata);
    v.addEventListener("timeupdate", handleTimeUpdate);
    v.addEventListener("play", handlePlay);
    v.addEventListener("pause", handlePause);
    v.addEventListener("volumechange", handleVolumeChange);
    v.addEventListener("error", handleError);

    if (v.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      v.load();
    }

    return () => {
      v.removeEventListener("loadedmetadata", handleLoadedMetadata);
      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.removeEventListener("play", handlePlay);
      v.removeEventListener("pause", handlePause);
      v.removeEventListener("volumechange", handleVolumeChange);
      v.removeEventListener("error", handleError);

      if (v.textTracks.length) {
        v.textTracks[0].removeEventListener("cuechange", handleCueChange);
      }
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handlePlay, handlePause, handleVolumeChange, handleCueChange]);

  const controls = useMemo(
    () => ({
      play: () => videoRef.current?.play(),

      pause: () => videoRef.current?.pause(),

      toggleFullscreen: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();

          actions.setIsFullscreen(false);
        } else {
          videoContainerRef.current?.requestFullscreen?.();

          actions.setIsFullscreen(true);
        }
      },

      seek: (t) => {
        if (videoRef.current) {
          videoRef.current.currentTime = t;

          actions.setCurrentTime(t);
        }
      },

      setVolume: (v) => {
        const vid = videoRef.current;

        if (vid) {
          vid.volume = Math.max(0, Math.min(1, v));
          vid.muted = vid.volume === 0;

          actions.setVolume(vid.volume);
          actions.setIsMuted(vid.muted);
        }
      },

      setIsMuted: (m) => {
        if (videoRef.current) {
          videoRef.current.muted = m;

          actions.setIsMuted(m);
        }
      },
    }),
    []
  );

  return (
    <VideoStoreContext.Provider value={storeRef.current}>
      <VideoContext.Provider value={{ videoContainerRef, videoRef, controls }}>{children}</VideoContext.Provider>
    </VideoStoreContext.Provider>
  );
}

export const useVideoRef = () => useContext(VideoContext).videoRef;

export const useVideoContainerRef = () => useContext(VideoContext).videoContainerRef;

export const useVideoControls = () => useContext(VideoContext).controls;

export function useVideoUI(selector) {
  const store = useContext(VideoStoreContext);

  if (!store) {
    console.error("using video ui state store outside its provider");
  }

  return useStore(store, selector);
}
