"use client"

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'

interface Track {
    url: string
    surahName: string
    surahNumber: number
    reciterName: string
    reciterId: number
    artwork?: string
}

interface AudioPlayerContextType {
    isPlaying: boolean
    currentTrack: Track | null
    playlist: Track[]
    currentIndex: number
    play: (track: Track, playlist?: Track[]) => void
    pause: () => void
    resume: () => void
    next: () => void
    previous: () => void
    seek: (time: number) => void
    currentTime: number
    duration: number
    volume: number
    setVolume: (volume: number) => void
    close: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [playlist, setPlaylist] = useState<Track[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)

    const [isInitialized, setIsInitialized] = useState(false)

    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Load state from localStorage on mount
    useEffect(() => {
        const loadState = () => {
            try {
                const savedState = localStorage.getItem('quran-audio-state')
                if (savedState) {
                    const parsed = JSON.parse(savedState)
                    if (parsed.currentTrack) setCurrentTrack(parsed.currentTrack)
                    if (parsed.playlist) setPlaylist(parsed.playlist)
                    if (parsed.currentIndex) setCurrentIndex(parsed.currentIndex)
                    if (parsed.volume) setVolume(parsed.volume)

                    // Restore position if available
                    if (parsed.currentTime && parsed.currentTrack) {
                        setCurrentTime(parsed.currentTime)
                        // Defer setting audio element time until after it's created or src set
                        if (audioRef.current) {
                            audioRef.current.currentTime = parsed.currentTime
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to load audio state", e)
            } finally {
                setIsInitialized(true)
            }
        }
        loadState()
    }, [])

    // Sync restored state to audio element once initialized
    useEffect(() => {
        if (isInitialized && currentTrack && audioRef.current) {
            // Only set if not already playing or different source
            // This handles the page reload case where we have state but audio element is empty
            if (audioRef.current.src !== currentTrack.url) {
                audioRef.current.src = currentTrack.url
                // Set time but DO NOT play
                if (currentTime > 0) {
                    audioRef.current.currentTime = currentTime
                }
            }
        }
    }, [isInitialized, currentTrack]) // We depend on isInitialized to ensure we only do this after local storage load

    // Initialize audio element
    // Initialize audio element and attach event listeners
    useEffect(() => {
        audioRef.current = new Audio()

        // Restore volume if already set from state
        audioRef.current.volume = volume

        // Event listeners
        const audio = audioRef.current

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const handleDurationChange = () => {
            setDuration(audio.duration)
        }

        const handleEnded = () => {
            next()
        }

        const handlePlay = () => {
            setIsPlaying(true)
        }

        const handlePause = () => {
            setIsPlaying(false)
        }

        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('durationchange', handleDurationChange)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('durationchange', handleDurationChange)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.pause()
        }
    }, []) // Run once on mount, but check if we need to sync with restored state better

    // Save state to localStorage whenever relevant props change
    useEffect(() => {
        if (!isInitialized) return

        const stateToSave = {
            currentTrack,
            playlist,
            currentIndex,
            volume,
            currentTime // We might want to debounce this or save it only on pause/unload for performance, but straightforward for now
        }

        // Debounce saving time to avoid thrashing localStorage on every timeupdate (approx 4Hz)
        const timeoutId = setTimeout(() => {
            localStorage.setItem('quran-audio-state', JSON.stringify(stateToSave))
        }, 1000)

        return () => clearTimeout(timeoutId)
    }, [currentTrack, playlist, currentIndex, volume, currentTime, isInitialized])

    // Update volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    // Media Session API
    useEffect(() => {
        if (!currentTrack || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return

        navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.surahName,
            artist: currentTrack.reciterName,
            album: 'القرآن الكريم',
            artwork: currentTrack.artwork ? [
                { src: currentTrack.artwork, sizes: '512x512', type: 'image/png' }
            ] : []
        })

        navigator.mediaSession.setActionHandler('play', () => {
            resume()
        })

        navigator.mediaSession.setActionHandler('pause', () => {
            pause()
        })

        navigator.mediaSession.setActionHandler('previoustrack', () => {
            previous()
        })

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            next()
        })

        navigator.mediaSession.setActionHandler('seekbackward', () => {
            if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
            }
        })

        navigator.mediaSession.setActionHandler('seekforward', () => {
            if (audioRef.current) {
                audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10)
            }
        })

        return () => {
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = null
            }
        }
    }, [currentTrack])

    // Update position state
    useEffect(() => {
        if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return

        if ('setPositionState' in navigator.mediaSession && duration > 0) {
            try {
                navigator.mediaSession.setPositionState({
                    duration: duration,
                    playbackRate: 1,
                    position: currentTime
                })
            } catch (e) {
                console.error('Failed to set position state', e)
            }
        }
    }, [currentTime, duration])

    const play = useCallback((track: Track, newPlaylist?: Track[]) => {
        if (!audioRef.current) return

        setCurrentTrack(track)

        if (newPlaylist) {
            setPlaylist(newPlaylist)
            const index = newPlaylist.findIndex(t => t.url === track.url)
            setCurrentIndex(index >= 0 ? index : 0)
        }

        audioRef.current.src = track.url
        audioRef.current.play().catch(error => {
            console.error('Failed to play audio', error)
        })
    }, [])

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause()
        }
    }, [])

    const resume = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error('Failed to resume audio', error)
            })
        }
    }, [])

    const next = useCallback(() => {
        if (playlist.length === 0) return

        const nextIndex = (currentIndex + 1) % playlist.length
        setCurrentIndex(nextIndex)
        play(playlist[nextIndex])
    }, [playlist, currentIndex, play])

    const previous = useCallback(() => {
        if (playlist.length === 0) return

        const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
        setCurrentIndex(prevIndex)
        play(playlist[prevIndex])
    }, [playlist, currentIndex, play])

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time
        }
    }, [])

    const close = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        setIsPlaying(false)
        setCurrentTrack(null)
        setPlaylist([]) // Optionally clear playlist or keep it? user said "close it partially" implies stopping? "close it totally" -> clear.

        // Clear state from local storage so it doesn't reopen
        localStorage.removeItem('quran-audio-state')
    }, [])

    const value: AudioPlayerContextType = {
        isPlaying,
        currentTrack,
        playlist,
        currentIndex,
        play,
        pause,
        resume,
        next,
        previous,
        seek,
        close,
        currentTime,
        duration,
        volume,
        setVolume
    }

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    )
}

export function useAudioPlayer() {
    const context = useContext(AudioPlayerContext)
    if (context === undefined) {
        throw new Error('useAudioPlayer must be used within AudioPlayerProvider')
    }
    return context
}
