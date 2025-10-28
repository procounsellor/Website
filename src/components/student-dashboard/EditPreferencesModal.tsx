import { useState } from 'react';
import type { User } from '@/types/user';
import type { CousrseApiLogin, StatesApiResponse } from '@/types/academic';
import { useAuthStore } from '@/store/AuthStore';
import { updateUser, getCoursesOnborading, getSates } from '@/api/auth';
import toast from 'react-hot-toast';
import { Check, X, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PatchUser } from '@/types';

interface EditCourseViewProps {
  selectedCourse: string | null;
  onCourseSelect: (name: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const EditCourseView: React.FC<EditCourseViewProps> = ({
  selectedCourse,
  onCourseSelect,
  onSubmit,
  isSubmitting,
}) => {
  const { data: courses = [], isLoading: loading } = useQuery({
    queryKey: ['coursesOnboarding'],
    queryFn: getCoursesOnborading,
    staleTime: 1000 * 60 * 5,
  });

  const getCardStyle = (name: string) => {
    return selectedCourse === name
      ? 'bg-[#13097D] text-white'
      : 'bg-white hover:shadow-lg';
  };
  const getTextStyle = (name: string, type: 'primary' | 'secondary') => {
    if (selectedCourse === name) return 'text-white';
    return type === 'primary' ? 'text-gray-800' : 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="text-center p-10 flex justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#13097D]" />
        <span className="ml-2">Loading courses...</span>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-[#343C6A] mb-6">Select Preferred Course</h2>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: CousrseApiLogin) => (
            <button
              key={course.courseId}
              onClick={() => onCourseSelect(course.name)}
              className={`transform rounded-xl border p-5 text-center transition-all duration-200 ${getCardStyle(course.name)}`}
            >
              <img src={`/courseIcon/${course.image}`} alt={`${course.name} icon`} className="mb-4 h-24 w-24 object-contain mx-auto" />
              <h3 className={`text-lg font-bold ${getTextStyle(course.name, 'primary')}`}>{course.name}</h3>
              <p className={`text-sm ${getTextStyle(course.name, 'secondary')}`}>
                {course.duration}
              </p>
              <p className={`mt-2 text-sm ${getTextStyle(course.name, 'secondary')}`}>
                {course.tagline}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            onClick={onSubmit}
            className="rounded-lg bg-[#FA660F] px-12 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:bg-orange-300 min-w-[160px]"
            disabled={!selectedCourse || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Update Course'}
          </button>
        </div>
      </div>
    </>
  );
};

interface EditStatesViewProps {
  selectedStates: string[];
  onStateSelect: (stateName: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const EditStatesView: React.FC<EditStatesViewProps> = ({
  selectedStates,
  onStateSelect,
  onSubmit,
  isSubmitting,
}) => {
  const { data: states = [], isLoading: loading } = useQuery({
    queryKey: ['statesOnboarding'],
    queryFn: getSates,
    staleTime: 1000 * 60 * 5,
  });
  const isSelected = (name: string) => selectedStates.includes(name);

  if (loading) {
    return (
      <div className="text-center p-10 flex justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#13097D]" />
        <span className="ml-2">Loading states...</span>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-[#343C6A] mb-6">Select Preferred States</h2>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((state: StatesApiResponse) => (
            <button
              key={state.name}
              onClick={() => onStateSelect(state.name)}
              className={`relative flex flex-col items-center justify-center rounded-xl border p-6 transition-colors duration-200 ${
                isSelected(state.name) ? 'border-transparent bg-[#13097D] text-white' : 'bg-white hover:shadow-lg'
              }`}
            >
              <img src={`/stateIcons/${state.image}`} alt={`${state.name} icon`} className="mb-3 h-12 w-12 object-contain mx-auto" />
              <h3 className="font-semibold">{state.name}</h3>
              <div
                className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded border-2 ${
                  isSelected(state.name) ? 'border-white bg-white text-[#13097D]' : 'border-gray-300'
                }`}
              >
                {isSelected(state.name) && <Check size={14} strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            onClick={onSubmit}
            className="rounded-lg bg-[#FA660F] px-12 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:bg-orange-300 min-w-[160px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Update States'}
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
  const queryClient = useQueryClient();

  const [selectedCourse, setSelectedCourse] = useState(currentUser.interestedCourse || null);
  const [selectedStates, setSelectedStates] = useState(currentUser.userInterestedStateOfCounsellors || []);

  const { mutate: updateUserMutation, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: PatchUser) => {
      if (!userId || !token) throw new Error('Authentication error.');
      return updateUser(userId, payload, token);
    },
    onSuccess: () => {
      toast.success('Preferences updated!');
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      setTimeout(onClose, 500);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update.');
    },
  });

  const handleCourseSelect = (name: string) => {
    setSelectedCourse(name);
  };

  const handleStateSelect = (stateName: string) => {
    setSelectedStates((prev: string[]) =>
      prev.includes(stateName)
        ? prev.filter((s: string) => s !== stateName)
        : [...prev, stateName]
    );
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    const finalPayload: PatchUser = {
      interestedCourse: selectedCourse,
      userInterestedStateOfCounsellors: selectedStates || [],
    };

    updateUserMutation(finalPayload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-[#F5F7FA] p-6 md:p-8 shadow-lg flex flex-col max-h-[90vh] h-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"><X /></button>
        
        {mode === 'course' && (
          <EditCourseView
            selectedCourse={selectedCourse}
            onCourseSelect={handleCourseSelect}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        
        {mode === 'states' && (
          <EditStatesView
            selectedStates={selectedStates}
            onStateSelect={handleStateSelect}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default EditPreferencesModal;