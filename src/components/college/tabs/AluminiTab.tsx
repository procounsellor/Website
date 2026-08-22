import AlumniCard from './AlumniCard';
import type { Alumni } from '@/types/academic';

interface AluminiTabProps {
  alumni?: Alumni[];
}

// Real notable alumni for this college. Previously a hard-coded list of four
// famous founders shown identically on every college page.
const AluminiTab = ({ alumni = [] }: AluminiTabProps) => {
  const items = alumni.filter((person) => person?.name?.trim());

  if (items.length === 0) {
    return (
      <div className="p-4 min-h-[200px] rounded-lg flex items-center justify-center text-center text-[#718EBF] font-medium">
        Notable alumni for this college have not been published yet.
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-[23px] md:justify-start">
      {items.map((person, index) => {
        const batch = [person.branch, person.graduationYear && `Class of ${person.graduationYear}`]
          .filter(Boolean)
          .join(', ');
        const position = [person.jobTitle, person.company].filter(Boolean).join(', ');

        return (
          <AlumniCard
            key={person.alumniId ?? `${person.name}-${index}`}
            name={person.name}
            batch={batch}
            position={position}
            imageUrl={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=F3F4F6&color=374151&size=400`}
          />
        );
      })}
    </div>
  );
};

export default AluminiTab;
