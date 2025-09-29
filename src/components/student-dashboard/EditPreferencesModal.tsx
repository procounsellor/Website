// src/components/student-dashboard/EditPreferencesModal.tsx

import { useState, useEffect } from 'react';
import type { User } from '@/types/user';
import type { CousrseApiLogin, StatesApiResponse } from '@/types/academic';
import { useAuthStore } from '@/store/AuthStore';
import { updateUser, getCoursesOnborading, getSates } from '@/api/auth';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';

interface EditCourseViewProps {
  selectedCourse: string | null;
  onCourseSelect: (name: string) => void;
}

const EditCourseView: React.FC<EditCourseViewProps> = ({ selectedCourse, onCourseSelect }) => {
  const [courses, setCourses] = useState<CousrseApiLogin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(false);
        const courseData = await getCoursesOnborading();
        setCourses(courseData);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center p-10">Loading courses...</div>;

  return (
    <>
      <h2 className="text-2xl font-bold text-[#343C6A] mb-6">Select Preferred Course</h2>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <button
              key={course.courseId}
              onClick={() => onCourseSelect(course.name)}
              className={`transform rounded-xl border p-5 text-center transition-all duration-200 ${
                selectedCourse === course.name ? 'bg-[#13097D] text-white' : 'bg-white hover:shadow-lg'
              }`}
            >
              <h3 className={`text-lg font-bold ${selectedCourse === course.name ? 'text-white' : 'text-gray-800'}`}>{course.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

interface EditStatesViewProps {
  selectedStates: string[];
  onStateSelect: (stateName: string) => void;
  onSubmit: () => void;
}

const EditStatesView: React.FC<EditStatesViewProps> = ({ selectedStates, onStateSelect, onSubmit }) => {
  const [states, setStates] = useState<StatesApiResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const statesData = await getSates();
        setStates(statesData);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  const isSelected = (name: string) => selectedStates.includes(name);
  if (loading) return <div className="text-center p-10">Loading states...</div>;

  return (
    <>
      <h2 className="text-2xl font-bold text-[#343C6A] mb-6">Select Preferred States</h2>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((state) => (
            <button
              key={state.name}
              onClick={() => onStateSelect(state.name)}
              className={`relative flex flex-col items-center justify-center rounded-xl border p-6 transition-colors duration-200 ${
                isSelected(state.name) ? 'border-transparent bg-[#13097D] text-white' : 'bg-white hover:shadow-lg'
              }`}
            >
              <h3 className="font-semibold">{state.name}</h3>
              <div className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded border-2 ${isSelected(state.name) ? 'border-white bg-white text-[#13097D]' : 'border-gray-300'}`}>
                {isSelected(state.name) && <Check size={14} strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex justify-end">
          <button onClick={onSubmit} className="rounded-lg bg-[#FA660F] px-12 py-3 font-semibold text-white transition-colors hover:bg-orange-600">
            Update States
          </button>
        </div>
      </div>
    </>
  );
};

interface EditPreferencesModalProps {
  mode: 'course' | 'states';
  currentUser: User;
  onClose: () => void;
}

const EditPreferencesModal: React.FC<EditPreferencesModalProps> = ({ mode, currentUser, onClose }) => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const [selectedCourse, setSelectedCourse] = useState(currentUser.interestedCourse || null);
  const [selectedStates, setSelectedStates] = useState(currentUser.userInterestedStateOfCounsellors || []);

  const handleCourseSelect = (name: string) => {
    setSelectedCourse(name);
    handleSubmit({ interestedCourse: name });
  };

  const handleStateSelect = (stateName: string) => {
    setSelectedStates((prev: string[]) =>
      prev.includes(stateName) 
        ? prev.filter((s: string) => s !== stateName) 
        : [...prev, stateName]
    );
  };

  const handleSubmit = async (overrideData?: Partial<User>) => {
    const payload = {
      interestedCourse: selectedCourse,
      userInterestedStateOfCounsellors: selectedStates,
      ...overrideData,
    };

    const finalPayload = {
    ...payload,
    userInterestedStateOfCounsellors: payload.userInterestedStateOfCounsellors || [],
  };

    try {
      if (!userId || !token) throw new Error("Authentication error.");
      await updateUser(userId, finalPayload, token);
      toast.success('Preferences updated!');
      setTimeout(onClose, 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#F5F7FA] p-6 md:p-8 shadow-lg flex flex-col max-h-[90vh] h-[700px]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"><X/></button>
        {mode === 'course' && (
          <EditCourseView
            selectedCourse={selectedCourse}
            onCourseSelect={handleCourseSelect}
          />
        )}
        {mode === 'states' && (
          <EditStatesView
            selectedStates={selectedStates}
            onStateSelect={handleStateSelect}
            onSubmit={() => handleSubmit()}
          />
        )}
      </div>
    </div>
  );
};

export default EditPreferencesModal;