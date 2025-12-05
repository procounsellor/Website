import { useEffect, useState } from 'react';
import { unlockScroll } from '@/lib/scrollLock';
import { getAllOngoingLiveSessions } from '@/api/liveSessions';
import type { LiveSession } from '@/api/liveSessions';
import { OngoingSessionModal } from '@/components/live/OngoingSessionModal';
import { useLiveStreamStore } from '@/store/LiveStreamStore';
import { getAllUpcomingLiveSessions } from '@/api/liveSessions';
import { UpcomingSessionModal } from '@/components/live/UpcomingSessionModal';

const getAvatarUrl = (photoUrl: string | null, fullName: string) => {
    if (photoUrl) return photoUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E0E7FF&color=4F46E5`;
};

interface OngoingSessionAvatarProps {
    session: LiveSession;
    onClick: (counsellorId: string, liveSessionId: string, counsellorName: string) => void;
}

function OngoingSessionAvatar({ session, onClick }: OngoingSessionAvatarProps) {
    const avatarUrl = getAvatarUrl(session.counsellorPhotoUrl, session.counsellorFullName);

    const handleClick = () => {
        onClick(session.counsellorId, session.liveSessionId, session.counsellorFullName);
    };

    return (
        <div 
            onClick={handleClick}
            className="relative shrink-0 cursor-pointer transition-transform duration-300"
            style={{ width: '120px', height: '120px' }} 
        >
            <div 
                className="w-full h-full rounded-full overflow-hidden"
                style={{
                    padding: '3.24px',
                    background: 'linear-gradient(90deg, #FA660F 0%, #13097D 100%)',
                }}
            >
                <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                        src={avatarUrl}
                        alt={session.counsellorFullName}
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
            </div>
            
            <div 
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#FA660F] text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg"
            >
                Live
            </div>
        </div>
    );
}

interface UpcomingSessionItemProps {
    session: LiveSession;
    onClick: (counsellorId: string, liveSessionId: string, counsellorName: string) => void;
}

function UpcomingSessionItem({ session, onClick }: UpcomingSessionItemProps) {
    const avatarUrl = getAvatarUrl(session.counsellorPhotoUrl, session.counsellorFullName);
    
    const formatDate = (): string => {
        const apiDate = (session as any).date; 
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
    
    const formatTime = (): string => {
        const apiTime = (session as any).startTime; 
        if (!apiTime) return 'N/A';
        try {
            const [hours, minutes] = apiTime.split(':').map(Number);
            const dummyDate = new Date();
            dummyDate.setHours(hours);
            dummyDate.setMinutes(minutes);
            
            const formattedTime = dummyDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }).replace(/\s(AM|PM)$/, ''); 

            const ampm = hours >= 12 ? 'PM' : 'AM';
            const endHours = hours;
            const endMinutes = minutes + 30;
            const formattedEndHours = endHours % 12 || 12;
            const formattedEndMinutes = endMinutes % 60;
            const finalEndAmpm = (endMinutes >= 60 && endHours === 11) ? 'PM' : ampm;

            return `${formattedTime}-${formattedEndHours}:${formattedEndMinutes.toString().padStart(2, '0')} ${finalEndAmpm}`; 
        } catch {
            return 'N/A';
        }
    };

    const handleClick = () => {
        onClick(session.counsellorId, session.liveSessionId, session.counsellorFullName);
    };

    return (
        <div onClick={handleClick} className="flex items-center justify-between py-4 transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4 w-1/2 min-w-0 pr-4"> 
                <img 
                    src={avatarUrl} 
                    alt={session.counsellorFullName} 
                    className="w-[81px] h-[81px] rounded-xl object-cover shrink-0" 
                />
                
                <div className="flex flex-col min-w-0 pt-1">
                    <h3 className="text-xl font-semibold text-[#242645] leading-[125%] truncate">
                        {session.counsellorFullName}
                    </h3>
                    <p className="text-base font-medium text-[#8C8CA1] leading-[125%] truncate mt-1">
                        {session.description || session.title}
                    </p>
                </div>
            </div>

            <div className="flex items-center text-gray-700 font-normal text-base shrink-0 w-1/2 pr-4 sm:pr-0"> 
                <div className="flex flex-col w-40 text-left shrink-0">
                    <span className="text-xl font-semibold text-[#242645] leading-[125%] mb-1 hidden sm:block">
                        Date
                    </span>
                    <span className="text-base font-medium text-[#8C8CA1] leading-[125%] whitespace-nowrap">
                        {formatDate()}
                    </span>
                </div>
                
                <div className="flex flex-col w-40 text-left ml-16 shrink-0"> 
                    <span className="text-xl font-semibold text-[#242645] leading-[125%] mb-1 hidden sm:block">
                        Time
                    </span>
                    <span className="text-base font-medium text-[#8C8CA1] leading-[125%] whitespace-nowrap">
                        {formatTime()}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function LiveSessionsPage() {
    const { startStream } = useLiveStreamStore.getState();
    const [ongoingSessions, setOngoingSessions] = useState<LiveSession[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<{ id: string, counsellorId: string, name: string } | null>(null);
    const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
    const [selectedUpcomingSession, setSelectedUpcomingSession] = useState<{ id: string, counsellorId: string, name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        unlockScroll();
        
        const fetchSessions = async () => {
            try {
                setLoading(true);
                setError(null);
                const [ongoing, upcoming] = await Promise.all([
                    getAllOngoingLiveSessions(),
                    getAllUpcomingLiveSessions(),
                ]);
                
                setOngoingSessions(ongoing);
                setUpcomingSessions(upcoming);
            } catch (err) {
                console.error("Failed to fetch sessions:", err);
                setError("Failed to load ongoing sessions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleAvatarClick = (counsellorId: string, liveSessionId: string, counsellorName: string) => {
        setSelectedSession({ 
            id: liveSessionId, 
            counsellorId: counsellorId, 
            name: counsellorName 
        });
        setIsModalOpen(true);
    };

    const handleUpcomingCardClick = (counsellorId: string, liveSessionId: string, counsellorName: string) => {
        setSelectedUpcomingSession({ 
            id: liveSessionId, 
            counsellorId: counsellorId, 
            name: counsellorName 
        });
        setIsUpcomingModalOpen(true);
    };

    const handleJoinStream = (playbackId: string) => {
        if (!selectedSession) return;
        startStream(
            'livepeer', 
            playbackId,
            `Live Session with ${selectedSession.name}`,
            'Join our interactive session'
        );
        setIsModalOpen(false);
    };


    const renderOngoingContent = () => {
        if (loading) {
            return <div className="p-8 text-center text-gray-600">Loading ongoing sessions...</div>;
        }

        if (error) {
            return <div className="p-8 text-center text-red-500">{error}</div>;
        }

        if (ongoingSessions.length === 0) {
            return (
                <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
                    No ongoing live sessions at the moment.
                </div>
            );
        }
        
        return (
            <div className="flex overflow-x-auto pb-4 gap-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {ongoingSessions.map((session) => (
                    <OngoingSessionAvatar 
                        key={session.liveSessionId} 
                        session={session} 
                        onClick={handleAvatarClick}
                    />
                ))}
            </div>
        );
    };

    const renderUpcomingContent = () => {
        if (loading) {
            return <div className="p-8 text-center text-gray-600">Loading upcoming sessions...</div>;
        }

        if (error) {
            return <div className="p-8 text-center text-red-500">{error}</div>;
        }

        if (upcomingSessions.length === 0) {
            return (
                <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
                    <p className="text-xl text-gray-600 font-semibold">
                        No upcoming sessions are currently scheduled.
                    </p>
                </div>
            );
        }
        
        return (
            <div className="flex flex-col">
                {upcomingSessions.map((session, index) => (
                    <div key={session.liveSessionId}>
                        <UpcomingSessionItem session={session} onClick={handleUpcomingCardClick} />
                        
                        {index < upcomingSessions.length - 1 && (
                            <hr style={{ 
                                borderColor: '#E6E6E7',
                                borderWidth: '1px',
                                opacity: 1,
                                margin: '0 0 0 0',
                                width: '100%',
                            }} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 pt-20 md:pt-28 pb-8 px-4 min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 
                    className="text-2xl font-medium mb-6"
                    style={{ 
                        color: '#13097D',
                        fontFamily: 'Poppins', 
                        fontWeight: 500,
                        lineHeight: '125%',
                    }}
                >
                    Ongoing Sessions
                </h1>

                {renderOngoingContent()}

                <h2 
                    className="text-2xl font-medium mt-12 mb-6"
                    style={{ 
                        color: '#13097D',
                        fontFamily: 'Poppins', 
                        fontWeight: 500,
                        lineHeight: '125%',
                    }}
                >
                    Upcoming Sessions
                </h2>
                {renderUpcomingContent()}
                
            </main>
            <OngoingSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                liveSessionId={selectedSession?.id ?? null}
                counsellorId={selectedSession?.counsellorId ?? null}
                counsellorName={selectedSession?.name ?? 'Counselor'}
                onJoinStream={handleJoinStream}
            />
            <UpcomingSessionModal
                isOpen={isUpcomingModalOpen}
                onClose={() => setIsUpcomingModalOpen(false)}
                liveSessionId={selectedUpcomingSession?.id ?? null}
                counsellorId={selectedUpcomingSession?.counsellorId ?? null}
                counsellorName={selectedUpcomingSession?.name ?? 'Counselor'}
            />
        </div>
    );
}