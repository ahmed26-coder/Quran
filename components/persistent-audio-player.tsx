"use client"

import { useAudioPlayer } from './audio-player-provider'
import { Button } from './ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Minimize2, Maximize2 } from 'lucide-react'
import { useState, memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function PersistentAudioPlayerComponent() {
    const {
        isPlaying,
        currentTrack,
        play,
        pause,
        resume,
        next,
        previous,
        seek,
        currentTime,
        duration,
        volume,
        setVolume,
        close
    } = useAudioPlayer()

    const [isMinimized, setIsMinimized] = useState(false)

    // Load minimized state on mount
    useEffect(() => {
        const savedMinimized = localStorage.getItem('quran-player-minimized')
        if (savedMinimized === 'true') {
            setIsMinimized(true)
        }
    }, [])

    const toggleMinimize = () => {
        const newState = !isMinimized
        setIsMinimized(newState)
        localStorage.setItem('quran-player-minimized', String(newState))
    }

    if (!currentTrack) return null

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-800 dark:to-emerald-900 text-white shadow-2xl border-t-4 border-emerald-400 ${isMinimized ? 'h-16' : 'h-24 sm:h-28'
                    } transition-all duration-300`}
            >
                <div className="container mx-auto h-full px-4">
                    {!isMinimized ? (
                        <div className="flex flex-col h-full justify-center gap-2">
                            {/* Progress Bar */}
                            <div className="w-full">
                                <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect()
                                        const x = e.clientX - rect.left
                                        const percentage = x / rect.width
                                        seek(percentage * duration)
                                    }}
                                >
                                    <div
                                        className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] sm:text-xs mt-1 opacity-80">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                                {/* Track Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm sm:text-base truncate">{currentTrack.surahName}</h3>
                                    <p className="text-xs opacity-80 truncate">{currentTrack.reciterName}</p>
                                </div>

                                {/* Playback Controls */}
                                <div className="flex items-center gap-1 sm:gap-2">

                                    {/* Close Button Mobile/Desktop Left */}
                                    {/* We can put X here or at the far end. Usually X is far end or separate. 
                                        Let's put navigation first then X at end? 
                                        Or keep structure.
                                     */}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={previous}
                                        className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/20 text-white"
                                    >
                                        <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={isPlaying ? pause : resume}
                                        className="h-10 w-10 sm:h-12 sm:w-12 hover:bg-white/20 text-white bg-white/10"
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                                        ) : (
                                            <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={next}
                                        className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/20 text-white"
                                    >
                                        <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>
                                </div>

                                {/* Volume & Actions (Desktop) */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleMinimize}
                                        className="h-10 w-10 hover:bg-white/20 text-white"
                                        title="تصغير"
                                    >
                                        <Minimize2 className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={close}
                                        className="h-10 w-10 hover:bg-red-500/20 text-white hover:text-red-100"
                                        title="إغلاق"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Mobile Actions */}
                                <div className="flex sm:hidden items-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleMinimize}
                                        className="h-8 w-8 hover:bg-white/20 text-white"
                                    >
                                        <Minimize2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={close}
                                        className="h-8 w-8 hover:bg-red-500/20 text-white hover:text-red-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between h-full">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={isPlaying ? pause : resume}
                                    className="h-10 w-10 hover:bg-white/20 text-white shrink-0"
                                >
                                    {isPlaying ? (
                                        <Pause className="h-5 w-5" />
                                    ) : (
                                        <Play className="h-5 w-5" />
                                    )}
                                </Button>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm truncate">{currentTrack.surahName}</h3>
                                    <p className="text-xs opacity-80 truncate">{currentTrack.reciterName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleMinimize()} // Un-minimize
                                    className="h-10 w-10 hover:bg-white/20 text-white shrink-0"
                                    title="تكبير"
                                >
                                    <Maximize2 className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={close}
                                    className="h-10 w-10 hover:bg-red-500/20 text-white hover:text-red-100 shrink-0"
                                    title="إغلاق"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export const PersistentAudioPlayer = memo(PersistentAudioPlayerComponent)
