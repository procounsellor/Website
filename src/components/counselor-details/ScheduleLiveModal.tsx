import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, Users, BookOpen, Check } from 'lucide-react';
import { createLiveSession, type CreateLiveSessionRequest } from '@/api/liveSession';
import { getCoursesByCounsellorId, type CounsellorCourse } from '@/api/counsellorCourses';
import toast from 'react-hot-toast';
import BroadcastView from '@/components/live/BroadcastView';

interface ScheduleLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  counsellorId: string;
  counselorName: string;
  token: string;
  onSessionCreated?: () => void;
}

export default function ScheduleLiveModal({
  isOpen,
  onClose,
  counsellorId,
  token,
  onSessionCreated,
}: ScheduleLiveModalProps) {
  const [liveType, setLiveType] = useState<'DIRECT_LIVE' | 'SCHEDULED_LIVE'>('DIRECT_LIVE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [forWhom, setForWhom] = useState<'ALL_STUDENTS' | 'SUBSCRIBERS' | 'COURSE'>('ALL_STUDENTS');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [streamKey, setStreamKey] = useState('');
  const [liveSessionId, setLiveSessionId] = useState('');
  const [scheduledSession, setScheduledSession] = useState<any>(null);
  const [courses, setCourses] = useState<CounsellorCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

 
  useEffect(() => {
    if (isOpen && counsellorId) {
      fetchCourses();
    }
  }, [isOpen, counsellorId]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const fetchedCourses = await getCoursesByCounsellorId(counsellorId, token); 
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourseId(courseId === selectedCourseId ? '' : courseId);
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    // Check device BEFORE API call for DIRECT_LIVE
    if (liveType === 'DIRECT_LIVE') {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        toast.error('Please use a laptop or computer to go live. Mobile streaming coming soon!');
        return;
      }
    }

    if (liveType === 'SCHEDULED_LIVE') {
      if (!date || !startTime || !endTime) {
        toast.error('Please select date, start time, and end time');
        return;
      }
    }

    if (forWhom === 'COURSE' && !selectedCourseId) {
      toast.error('Please select a course');
      return;
    }

    setLoading(true);

    try {
      // Create single session with courseId if COURSE is selected
      const requestData: CreateLiveSessionRequest = {
        counsellorId,
        type: liveType,
        date: liveType === 'SCHEDULED_LIVE' ? date : null,
        startTime: liveType === 'SCHEDULED_LIVE' ? startTime : null,
        endTime: liveType === 'SCHEDULED_LIVE' ? endTime : null,
        title,
        forWhom,
        courseId: forWhom === 'COURSE' ? selectedCourseId : null,
        description,
      };

      const response = await createLiveSession(requestData, token);

      if (response.success) {
        if (liveType === 'DIRECT_LIVE') {
          const streamKey = response.data?.streamKey;
          const sessionId = response.data?.sessionData?.liveSessionId;
          if (streamKey && sessionId) {
            setStreamKey(streamKey);
            setLiveSessionId(sessionId);
            setShowBroadcast(true);
          } else {
            toast.error('Failed to get stream key or session ID');
          }
        } else {
          toast.success('Live session scheduled successfully!');
          if (response.data?.sessionData) {
            setScheduledSession(response.data.sessionData);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to create live session');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBroadcast = () => {
    setShowBroadcast(false);
    setStreamKey('');
    setLiveSessionId('');
    onClose();
    // Silently refetch sessions in background
    if (onSessionCreated) {
      onSessionCreated();
    }
    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setForWhom('ALL_STUDENTS');
    setSelectedCourseId('');
  };

  const handleCloseScheduled = () => {
    setScheduledSession(null);
    onClose();
    // Silently refetch sessions in background
    if (onSessionCreated) {
      onSessionCreated();
    }
    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setForWhom('ALL_STUDENTS');
    setSelectedCourseId('');
  };

  // Show broadcast view for direct live
  if (showBroadcast && streamKey && liveSessionId) {
    return (
      <BroadcastView
        streamKey={streamKey}
        counselorId={counsellorId}
        streamTitle={title}
        liveSessionId={liveSessionId}
        onClose={handleCloseBroadcast}
      />
    );
  }

  // Show confirmation for scheduled live
  if (scheduledSession) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
          <button
            onClick={handleCloseScheduled}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Scheduled!</h2>
            <p className="text-gray-600">Your live session has been successfully scheduled</p>
          </div>

          <div className="space-y-4 bg-gray-50 rounded-xl p-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{scheduledSession.title}</h3>
              <p className="text-sm text-gray-600">{scheduledSession.description}</p>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-[#13097D]" />
              <span>{new Date(scheduledSession.date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-[#13097D]" />
              <span>{scheduledSession.startTime} - {scheduledSession.endTime}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5 text-[#13097D]" />
              <span>{scheduledSession.forWhom.replace('_', ' ')}</span>
            </div>
          </div>

          <button
            onClick={handleCloseScheduled}
            className="w-full mt-6 bg-[#655E95] hover:bg-[#655E95]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Show scheduling form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative">
        <div className="shrink-0 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Schedule Live Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
          {/* Live Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Session Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLiveType('DIRECT_LIVE')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  liveType === 'DIRECT_LIVE'
                    ? 'border-[#13097D] bg-[#E8E7F2]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Video className={`w-6 h-6 mb-2 ${liveType === 'DIRECT_LIVE' ? 'text-[#13097D]' : 'text-gray-400'}`} />
                <h3 className="font-semibold text-gray-800">Go Live Now</h3>
                <p className="text-xs text-gray-600 mt-1">Start streaming immediately</p>
              </button>

              <button
                onClick={() => setLiveType('SCHEDULED_LIVE')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  liveType === 'SCHEDULED_LIVE'
                    ? 'border-[#13097D] bg-[#E8E7F2]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Calendar className={`w-6 h-6 mb-2 ${liveType === 'SCHEDULED_LIVE' ? 'text-[#13097D]' : 'text-gray-400'}`} />
                <h3 className="font-semibold text-gray-800">Schedule Later</h3>
                <p className="text-xs text-gray-600 mt-1">Plan for a specific time</p>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Session Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., JEE Preparation Strategy"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13097D] focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you'll cover in this session..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#13097D] focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Date and Time (only for scheduled) */}
          {liveType === 'SCHEDULED_LIVE' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <style>{`
                    input[type="date"]::-webkit-calendar-picker-indicator {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      height: 100%;
                      margin: 0;
                      padding: 0;
                      cursor: pointer;
                      opacity: 0;
                    }
                    input[type="date"]::-webkit-datetime-edit {
                      color: #232323;
                    }
                    input[type="date"]::-webkit-calendar-picker-indicator:hover {
                      background: transparent;
                    }
                  `}</style>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full h-10 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-4 cursor-pointer hover:border-[#13097D] transition-colors text-sm font-medium focus:ring-2 focus:ring-[#13097D] focus:border-[#13097D] outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    style={{ colorScheme: 'light', accentColor: '#13097D' }}
                  />
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <div className="relative">
                    <style>{`
                      input[type="time"]::-webkit-calendar-picker-indicator {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        cursor: pointer;
                        opacity: 0;
                      }
                      input[type="time"]::-webkit-datetime-edit {
                        color: #232323;
                      }
                    `}</style>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full h-10 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-4 cursor-pointer hover:border-[#13097D] transition-colors text-sm font-medium focus:ring-2 focus:ring-[#13097D] focus:border-[#13097D] outline-none"
                      style={{ colorScheme: 'light', accentColor: '#13097D' }}
                    />
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <div className="relative">
                    <style>{`
                      input[type="time"]::-webkit-calendar-picker-indicator {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        cursor: pointer;
                        opacity: 0;
                      }
                      input[type="time"]::-webkit-datetime-edit {
                        color: #232323;
                      }
                    `}</style>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full h-10 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-4 cursor-pointer hover:border-[#13097D] transition-colors text-sm font-medium focus:ring-2 focus:ring-[#13097D] focus:border-[#13097D] outline-none"
                      style={{ colorScheme: 'light', accentColor: '#13097D' }}
                    />
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Audience Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Who can join?</label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#13097D] transition-all">
                <input
                  type="radio"
                  name="audience"
                  value="ALL_STUDENTS"
                  checked={forWhom === 'ALL_STUDENTS'}
                  onChange={(e) => setForWhom(e.target.value as any)}
                  className="mr-3 w-4 h-4 text-[#13097D] border-gray-300 focus:ring-[#13097D] accent-[#13097D]"
                />
                <Users className="w-5 h-5 text-gray-400 mr-2" />
                <span className="font-medium text-gray-700">All Students</span>
              </label>

              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#13097D] transition-all">
                <input
                  type="radio"
                  name="audience"
                  value="SUBSCRIBERS"
                  checked={forWhom === 'SUBSCRIBERS'}
                  onChange={(e) => setForWhom(e.target.value as any)}
                  className="mr-3 w-4 h-4 text-[#13097D] border-gray-300 focus:ring-[#13097D] accent-[#13097D]"
                />
                <Users className="w-5 h-5 text-gray-400 mr-2" />
                <span className="font-medium text-gray-700">Subscribers Only</span>
              </label>

              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#13097D] transition-all">
                <input
                  type="radio"
                  name="audience"
                  value="COURSE"
                  checked={forWhom === 'COURSE'}
                  onChange={(e) => setForWhom(e.target.value as any)}
                  className="mr-3 w-4 h-4 text-[#13097D] border-gray-300 focus:ring-[#13097D] accent-[#13097D]"
                />
                <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
                <span className="font-medium text-gray-700">Specific Course</span>
              </label>
            </div>
          </div>

          {/* Course Selection (if COURSE is selected) */}
          {forWhom === 'COURSE' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Course {loadingCourses && <span className="text-xs text-gray-500">(Loading...)</span>}
              </label>
              {courses.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide border border-gray-200 rounded-lg p-2">
                  {courses.map((course) => (
                    <label
                      key={course.courseId}
                      className={`flex items-center gap-3 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedCourseId === course.courseId
                          ? 'border-[#13097D] bg-[#E8E7F2]'
                          : 'border-gray-200 hover:border-[#13097D]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="course"
                        checked={selectedCourseId === course.courseId}
                        onChange={() => handleCourseSelection(course.courseId)}
                        className="w-4 h-4 text-[#13097D] border-gray-300 focus:ring-[#13097D] accent-[#13097D]"
                      />
                      {course.courseThumbnailUrl && (
                        <img
                          src={course.courseThumbnailUrl}
                          alt={course.courseName}
                          className="w-10 h-10 object-cover rounded shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{course.courseName}</p>
                        <p className="text-xs text-[#13097D] font-semibold">₹{course.coursePriceAfterDiscount}</p>
                      </div>
                      {selectedCourseId === course.courseId && (
                        <Check className="w-5 h-5 text-[#13097D] shrink-0" />
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 p-3 border border-gray-200 rounded-lg">
                  {loadingCourses ? 'Loading courses...' : 'No courses available'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 bg-gray-50 border-t border-gray-200 rounded-b-2xl px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#655E95] hover:bg-[#655E95]/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                <span>{liveType === 'DIRECT_LIVE' ? 'Go Live' : 'Schedule Session'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
