import { useNavigate } from "react-router-dom";
import { useSearchStore } from "@/store/SearchStore";
import type { SearchResult } from "@/store/SearchStore";
import { Book, Users, Loader2 } from "lucide-react";
import { encodeCounselorId } from "@/lib/utils";

interface SearchResultsProps {
  onResultClick?: () => void;
}

const typeIcons = {
  exam: Book,
  counsellor: Users,
};

const typeColors = {
  exam: "text-blue-600 bg-blue-50",
  counsellor: "text-orange-600 bg-orange-50",
};

export function SearchResults({ onResultClick }: SearchResultsProps) {
  const { results, isSearching, query } = useSearchStore();
  const navigate = useNavigate();

  const handleResultClick = (result: SearchResult) => {
    const safeId = result.originalId || result.id; 

    switch(result.type) {
      case 'counsellor': {
        navigate(`/counsellor/${encodeCounselorId(safeId)}`);
        break;
      }
      case 'exam': {
        navigate(`/exams/${safeId}`);
        break;
      }
      default: {
        const baseRoute = result.type === 'counsellor' ? '/counselors' : `/${result.type}s`;
        navigate(baseRoute);
        break;
      }
    }
    onResultClick?.();
  };

  if (!query) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="mb-4">
          <Book className="w-12 h-12 mx-auto text-gray-300" />
        </div>
        <p className="text-sm">Start typing to search...</p>
      </div>
    );
  }

  const sortedResults = [...results].sort((a, b) => {
    const searchLower = query.toLowerCase();
    const aExact = a.name.toLowerCase() === searchLower ? 1 : 0;
    const bExact = b.name.toLowerCase() === searchLower ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;
    const aStarts = a.name.toLowerCase().startsWith(searchLower) ? 1 : 0;
    const bStarts = b.name.toLowerCase().startsWith(searchLower) ? 1 : 0;
    return bStarts - aStarts;
  });

  const groupedResults = sortedResults.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const hasResults = results.length > 0;

  return (
    <div className="max-h-96 overflow-y-auto">
      {!hasResults && isSearching && (
        <div className="p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FF660F]" />
          <p className="text-sm text-gray-500">Searching...</p>
        </div>
      )}

      {!hasResults && !isSearching && (
        <div className="p-6 text-center text-gray-500">
          <div className="mb-4">
            <Book className="w-12 h-12 mx-auto text-gray-300" />
          </div>
          <p className="text-sm">No results found for "{query}"</p>
        </div>
      )}

      {hasResults && (
        <>
          {Object.entries(groupedResults).map(([type, typeResults]) => (
            <div key={type} className="p-2 border-b last:border-0 border-gray-50">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
                {type}s
              </h3>
              <div className="space-y-1">
                {typeResults.map((result) => {
                  const IconComponent = typeIcons[result.type as keyof typeof typeIcons] || Book;
                  const colorClass = typeColors[result.type as keyof typeof typeColors] || "text-gray-600 bg-gray-50";
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full hover:cursor-pointer text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        {result.imageUrl ? (
                          <img
                            src={result.imageUrl}
                            alt={result.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + result.name;
                            }}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-[#FF660F] transition-colors truncate">
                            {result.name}
                          </p>
                          {result.subtitle && (
                            <p className="text-sm text-gray-500 truncate">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {isSearching && (
            <div className="p-3 border-t border-gray-50 flex items-center justify-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-[#FF660F]" />
              <span className="text-[10px] text-gray-400 uppercase font-medium">Updating results...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}