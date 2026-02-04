// import { Clock3 } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"

interface Timer {
    time?: string // minutes as string (optional if initialSeconds provided)
    initialSeconds?: number
    onSectionClick?: () => void
    onTimerEnd?: () => void
    onTick?: (seconds: number) => void // Report current seconds to parent
}

export function Timer({ time, initialSeconds, onSectionClick, onTimerEnd, onTick }: Timer) {
    // Use refs to store callbacks to avoid useEffect dependency issues
    const onTimerEndRef = useRef(onTimerEnd);
    const onTickRef = useRef(onTick);

    // Keep refs updated
    useEffect(() => {
        onTimerEndRef.current = onTimerEnd;
        onTickRef.current = onTick;
    }, [onTimerEnd, onTick]);

    // Calculate initial seconds once
    const initialSecondsValue = initialSeconds !== undefined ? initialSeconds : (time ? parseInt(time) * 60 : 0);
    
    const [seconds, setSeconds] = useState(initialSecondsValue);
    const endTimeRef = useRef<number>(Date.now() + initialSecondsValue * 1000);
    const initializedRef = useRef(false);

    // Reset timer only when initialSeconds prop actually changes
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            return;
        }
        
        const newSeconds = initialSeconds !== undefined ? initialSeconds : (time ? parseInt(time) * 60 : 0);
        setSeconds(newSeconds);
        endTimeRef.current = Date.now() + newSeconds * 1000;
    }, [initialSeconds, time]);

    // Main timer effect using timestamp-based timing (survives browser throttling)
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));

            setSeconds(remaining);
            onTickRef.current?.(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                onTimerEndRef.current?.();
            }
        }, 1000); // Update every 1 second

        return () => clearInterval(interval);
    }, []); // Empty deps - uses refs for callbacks

    // Handle visibility change - catch up when tab becomes visible again
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
                setSeconds(remaining);
                onTickRef.current?.(remaining);

                if (remaining <= 0) {
                    onTimerEndRef.current?.();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const formatTime = (num: number) => num.toString().padStart(2, '0')

    return (
        <div className="flex items-center gap-2 w-full">
            {/* Mobile: Icon + Time */}
            <div className="flex justify-between md:hidden items-center w-full">
                <div className="flex items-center gap-2">
                    <img src="/clock.svg" alt="test-time" />
                    <p className="text-[1rem] font-semibold text-(--text-app-primary) tabular-nums font-mono">
                        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(secs)}
                    </p></div>

                <button onClick={onSectionClick}>
                    <img src="/section.svg" alt="sections" />
                </button>
            </div>

            {/* Desktop: Stacked layout */}
            <div className="hidden md:flex flex-col items-center">
                <h1 className="font-semibold text-(--text-app-primary) text-[1.25rem] mb-2">Time Left</h1>
                <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center w-[2.5rem]">
                        <p className="text-[1.5rem] font-semibold text-(--text-app-primary) tabular-nums font-mono">{formatTime(hours)}</p>
                        <span className="font-medium text-xs text-(--text-muted)">h</span>
                    </div>
                    <span className="text-[1.5rem] font-semibold text-(--text-app-primary)">:</span>
                    <div className="flex flex-col items-center w-[2.5rem]">
                        <p className="text-[1.5rem] font-semibold text-(--text-app-primary) tabular-nums font-mono">{formatTime(minutes)}</p>
                        <span className="font-medium text-xs text-(--text-muted)">m</span>
                    </div>
                    <span className="text-[1.5rem] font-semibold text-(--text-app-primary)">:</span>
                    <div className="flex flex-col items-center w-[2.5rem]">
                        <p className="text-[1.5rem] font-semibold text-(--text-app-primary) tabular-nums font-mono">{formatTime(secs)}</p>
                        <span className="font-medium text-xs text-(--text-muted)">s</span>
                    </div>
                </div>
            </div>
        </div>
    );
}