import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getLiveSessionById } from '@/api/liveSessions';
import type { DetailedLiveSession } from '@/api/liveSessions';

interface UpcomingSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    liveSessionId: string | null;
    counsellorId: string | null;
    counsellorName: string; 
}

export function UpcomingSessionModal({
    isOpen,
    onClose,
    liveSessionId,
    counsellorId,
    counsellorName,
}: UpcomingSessionModalProps) {
    const [sessionDetails, setSessionDetails] = useState<DetailedLiveSession | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && liveSessionId && counsellorId) {
            setLoading(true);
            const fetchDetails = async () => {
                try {
                    const details = await getLiveSessionById(counsellorId, liveSessionId);
                    setSessionDetails(details);
                } catch (error) {
                    toast.error("Failed to load session details.");
                    console.error("Modal fetch error:", error);
                    setSessionDetails(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        } else if (!isOpen) {
            setSessionDetails(null);
        }
    }, [isOpen, liveSessionId, counsellorId]);

    if (!isOpen) return null;

    const formatDateDisplay = (apiDate: string | null): string => {
        if (!apiDate) return 'N/A';
        try {
            const parts = apiDate.split('-');
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); 
            if (isNaN(d.getTime())) return 'N/A';
            
            const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
            return `${dateStr}, ${weekday}`;
        } catch {
            return 'N/A';
        }
    };
    
    const formatStartTimeDisplay = (apiTime: string | null): string => {
        if (!apiTime) return 'N/A';
        try {
            const [hours, minutes] = apiTime.split(':').map(Number);
            const dummyDate = new Date();
            dummyDate.setHours(hours);
            dummyDate.setMinutes(minutes);
            
            return dummyDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

        } catch {
            return 'N/A';
        }
    };

    const dateDisplay = formatDateDisplay(sessionDetails?.date ?? null);
    const startTimeDisplay = formatStartTimeDisplay(sessionDetails?.startTime ?? null);

    return (
        <div 
            className="fixed inset-0 z-1000 flex items-center justify-center p-4 transition-opacity duration-300"
            style={{ 
                background: '#23232380', 
                backdropFilter: 'blur(35px)', 
            }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-[20px] shadow-2xl max-w-lg w-full p-8 transition-transform duration-300 transform scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#343C6A]">Upcoming Session details</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500">Loading details...</p>
                    </div>
                ) : !sessionDetails ? (
                    <div className="flex flex-col justify-center items-center h-40">
                         <p className="text-red-500">Details not found or failed to load.</p>
                         <p className="text-sm text-gray-500 mt-1">Counselor: {counsellorName}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        
                        <div className="flex flex-col">
                            <span className="text-base text-[#232323] font-medium mb-1">Date</span>
                            <p className="text-base font-semibold text-[#13097D]">{dateDisplay}</p>
                        </div>
                        
                        <div className="flex flex-col">
                            <span className="text-base text-[#232323] font-medium mb-1">Start Time</span>
                            <p className="text-base font-semibold text-[#13097D]">{startTimeDisplay}</p>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-base text-[#232323] font-medium mb-1">Topic</span>
                            <p className="text-base font-semibold text-[#13097D]">{sessionDetails.title}</p>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-base text-[#232323] font-medium mb-1">Description</span>
                            <p className="text-base font-semibold text-[#13097D]">{sessionDetails.description}</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border bg-[#13097D] text-white font-semibold rounded-lg transition-colors hover:bg-[#13097D]/90"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}