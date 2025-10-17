import { useState, useEffect } from 'react';
import { getSates } from '@/api/auth';
import type { StatesApiResponse } from '@/types';
import { Loader2, Search, Check } from 'lucide-react';

interface StateSelectionStepProps {
  selectedStates: string[];
  onStateSelect: (stateName: string) => void;
}

export default function StateSelectionStep({ selectedStates, onStateSelect }: StateSelectionStepProps) {
  const [states, setStates] = useState<StatesApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const stateData = await getSates();
        setStates(stateData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch states');
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center p-10"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="font-montserrat">
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search States"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStates.map((state) => {
                const isSelected = selectedStates.includes(state.name);
                return (
                    <button
                        key={state.name}
                        onClick={() => onStateSelect(state.name)}
                        className={`relative text-center p-5 border-2 rounded-xl transition-all duration-200 flex flex-col items-center justify-center ${
                            isSelected ? 'bg-[#13097D] border-[#13097D] text-white' : 'bg-white border-gray-200 hover:shadow-lg hover:border-blue-600'
                        }`}
                    >
                        <div className={`absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded border-2 ${isSelected ? 'bg-white border-white' : 'border-gray-300'}`}>
                            {isSelected && <Check size={16} className="text-[#13097D]" />}
                        </div>
                        <img src={`/stateIcons/${state.image}`} alt={`${state.name} icon`} className="h-12 w-12 object-contain mx-auto mb-2" />
                        <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>{state.name}</h3>
                    </button>
                );
            })}
        </div>
    </div>
  );
}