import { X, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getLiveSessionById } from '@/api/liveSessions';
import type { DetailedLiveSession } from '@/api/liveSessions';

interface OngoingSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    liveSessionId: string | null;
    counsellorId: string | null;
    counsellorName: string; 
    onJoinStream: (playbackId: string) => void;
}

export function OngoingSessionModal({
    isOpen,
    onClose,
    liveSessionId,
    counsellorId,
    counsellorName,
    onJoinStream,
}: OngoingSessionModalProps) {
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

    const calculateLiveSince = (createdAtSeconds: number) => {
        const startedTimeMs = createdAtSeconds * 1000;
        const now = Date.now();
        const diffInMinutes = Math.floor((now - startedTimeMs) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just started';
        if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    };

    const liveSinceText = sessionDetails?.createdAt?.seconds
        ? calculateLiveSince(sessionDetails.createdAt.seconds)
        : 'Starting soon...';

    const handleJoin = () => {
        if (sessionDetails?.playbackId) {
            onJoinStream(sessionDetails.playbackId);
        } else {
            toast.error("Stream ID not available.");
        }
    };

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
                    <h2 className="text-xl font-semibold text-[#343C6A]">Session details</h2>
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
                            <span className="text-[16px] text-[#232323] font-medium mb-1">Live Since</span>
                            <div className="flex items-center gap-2 text-base font-semibold text-[#13097D]">
                                <Clock className="w-4 h-4 text-[#13097D]" />
                                <span>{liveSinceText}</span>
                            </div>
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
                        className="px-6 py-2 border border-orange-500 text-orange-500 font-semibold rounded-lg transition-colors hover:bg-orange-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleJoin}
                        disabled={loading || !sessionDetails?.playbackId}
                        className="px-6 py-2 bg-[#FF660F] text-white font-semibold rounded-lg transition-colors hover:bg-[#FF660F]/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Join Now
                    </button>
                </div>
            </div>
        </div>
    );
}