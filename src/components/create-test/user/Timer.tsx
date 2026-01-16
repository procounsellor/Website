// import { Clock3 } from "lucide-react"
import { useEffect, useState } from "react"

interface Timer{
    time:string // minutes as string
    onSectionClick?: () => void
    onTimerEnd?: () => void
}
export function Timer({time, onSectionClick, onTimerEnd}:Timer){
    const [seconds, setSeconds] = useState(parseInt(time) * 60)
    
    useEffect(() => {
        setSeconds(parseInt(time) * 60)
    }, [time])
    
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    onTimerEnd?.()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        
        return () => clearInterval(interval)
    }, [onTimerEnd])
    
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
                <p className="text-[1rem] font-semibold text-(--text-app-primary)">
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
                    <div className="flex flex-col items-center">
                        <p className="text-[1.5rem] font-semibold text-(--text-app-primary)">{formatTime(hours)}</p>
                        <span className="font-medium text-xs text-(--text-muted)">Hours</span>
                    </div>
                    <span className="text-[1.5rem] font-semibold text-(--text-app-primary)">:</span>
                    <div className="flex flex-col items-center">
                        <p className="text-[1.5rem] font-semibold text-(--text-app-primary)">{formatTime(minutes)}</p>
                        <span className="font-medium text-xs text-(--text-muted)">Minutes</span>
                    </div>
                    <span className="text-[1.5rem] font-semibold text-(--text-app-primary)">:</span>
                    <div className="flex flex-col items-center">
                        <p className="text-[1.5rem] font-semibold text-(--text-app-primary)">{formatTime(secs)}</p>
                        <span className="font-medium text-xs text-(--text-muted)">Seconds</span>
                    </div>
                </div>
            </div>
        </div>
    );
}