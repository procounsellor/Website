import type { Infrastructure } from '@/types/academic';

interface InfrastructureTabProps {
  infrastructure?: Infrastructure[];
  campusSize?: string;
  collegeName?: string;
}

// Real campus description + photo gallery for this college. Previously this tab
// described IIT Delhi's 325-acre campus on every single college page.
const InfrastructureTab = ({
  infrastructure = [],
  campusSize,
  collegeName = 'This college',
}: InfrastructureTabProps) => {
  const sections = infrastructure.filter(
    (section) =>
      section?.infraDescription?.trim() ||
      (section?.infraPhotos || []).length > 0 ||
      (section?.infraVideo || []).length > 0,
  );

  const overview = campusSize?.trim()
    ? `${collegeName} has a campus spread over ${campusSize} acres.`
    : '';

  if (sections.length === 0 && !overview) {
    return (
      <div className="p-4 min-h-[200px] rounded-lg flex items-center justify-center text-center text-[#718EBF] font-medium">
        Campus and infrastructure details for this college have not been published yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {overview && (
        <div className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] p-3.5 md:p-4">
          <h3
            className="text-[#343C6A] font-semibold text-[18px] md:text-[20px] leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Campus
          </h3>
          <p
            className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[125%] mt-2"
            style={{ fontFamily: 'Poppins' }}
          >
            {overview}
          </p>
        </div>
      )}

      {sections.map((section, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] flex flex-col gap-4 p-3.5 md:p-4"
        >
          {section.infraDescription?.trim() && (
            <p
              className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[150%]"
              style={{ fontFamily: 'Poppins' }}
            >
              {section.infraDescription}
            </p>
          )}

          {(section.infraPhotos || []).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {section.infraPhotos.map((photo) => (
                <img
                  key={photo.linkId ?? photo.photoUrl}
                  src={photo.photoUrl}
                  alt={`${collegeName} campus`}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-4/3 object-cover rounded-xl bg-[#F5F5F5]"
                />
              ))}
            </div>
          )}

          {(section.infraVideo || []).length > 0 && (
            <div className="flex flex-col gap-2">
              {section.infraVideo.map((video) => (
                <a
                  key={video.linkId ?? video.videoUrl}
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#343C6A] font-semibold text-[14px] md:text-[16px] underline"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Watch the {collegeName} campus tour
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InfrastructureTab;
