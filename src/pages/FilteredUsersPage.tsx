import React, { useState, useEffect, useMemo } from 'react';
import { API_CONFIG } from "@/api/config";
import { Calendar, Clock, MapPin, BookOpen, Globe } from 'lucide-react'; // Icons for better UI

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  photoSmall: string | null;
  city: string | null;
  interestedCourse: string;
  languagesKnow: string | null;
  userInterestedStateOfCounsellors?: string[];
  dateCreated?: {
    seconds: number;
    nanos?: number;
  };
}

const FilteredUsersPage = () => {
  // --- State ---
  const [allUsers, setAllUsers] = useState<User[]>([]); // Stores all data from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter Inputs
  const [selectedDate, setSelectedDate] = useState('2025-12-07');
  const [startTime, setStartTime] = useState(''); // Format "HH:mm"
  const [endTime, setEndTime] = useState('');     // Format "HH:mm"

  // --- Helpers ---
  
  // Parse XML Response (Fallback for when API returns XML)
  const parseXMLResponse = (xmlText: string): User[] => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const outerUsersNode = xmlDoc.getElementsByTagName("users")[0];
      if (!outerUsersNode) return [];

      const userNodes = outerUsersNode.getElementsByTagName("users");
      const parsedUsers: User[] = [];

      for (let i = 0; i < userNodes.length; i++) {
        const node = userNodes[i];
        const getTagVal = (tagName: string) => node.getElementsByTagName(tagName)[0]?.textContent || "";

        // Parse States
        const stateNodes = node.getElementsByTagName("userInterestedStateOfCounsellors");
        const states: string[] = [];
        if (stateNodes.length > 0) {
            const innerStates = stateNodes[0].getElementsByTagName("userInterestedStateOfCounsellors");
            for(let j=0; j<innerStates.length; j++) {
                if(innerStates[j].textContent) states.push(innerStates[j].textContent!);
            }
        }

        const seconds = parseInt(node.getElementsByTagName("seconds")[0]?.textContent || "0");

        parsedUsers.push({
          userId: getTagVal("userId"),
          firstName: getTagVal("firstName"),
          lastName: getTagVal("lastName"),
          photoSmall: getTagVal("photoSmall") || null,
          city: getTagVal("city") || null,
          interestedCourse: getTagVal("interestedCourse"),
          languagesKnow: getTagVal("languagesKnow") || null,
          userInterestedStateOfCounsellors: states,
          dateCreated: { seconds }
        });
      }
      return parsedUsers;
    } catch (e) {
      console.error("XML Parse Error:", e);
      return [];
    }
  };

  // --- API Call ---
  const fetchUsers = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const fullUrl = `${API_CONFIG.baseUrl}/api/dashboard/filterUsersByDate?date=${date}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      const textData = await response.text();

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      let finalUsers: User[] = [];

      if (textData.trim().startsWith("<")) {
        finalUsers = parseXMLResponse(textData);
      } else {
        try {
          const jsonData = JSON.parse(textData);
          finalUsers = jsonData.users || [];
        } catch (e) {
            // If JSON parse fails, try XML parser as backup
            finalUsers = parseXMLResponse(textData);
        }
      }
      setAllUsers(finalUsers); 

    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever Date changes
  useEffect(() => {
    if (selectedDate) fetchUsers(selectedDate);
  }, [selectedDate]);


  // --- Filtering Logic (Time) ---
  const filteredUsers = useMemo(() => {
    if (!startTime && !endTime) return allUsers;

    return allUsers.filter(user => {
      if (!user.dateCreated?.seconds) return false;

      // Convert User's creation time to a Date object
      const userDate = new Date(user.dateCreated.seconds * 1000);
      
      // Get hours and minutes of the user
      const userHours = userDate.getHours();
      const userMinutes = userDate.getMinutes();
      const userTimeInMinutes = userHours * 60 + userMinutes;

      // Convert Start Filter to minutes
      let startInMinutes = 0;
      if (startTime) {
        const [h, m] = startTime.split(':').map(Number);
        startInMinutes = h * 60 + m;
      }

      // Convert End Filter to minutes (default to end of day if empty)
      let endInMinutes = 24 * 60; 
      if (endTime) {
        const [h, m] = endTime.split(':').map(Number);
        endInMinutes = h * 60 + m;
      }

      return userTimeInMinutes >= startInMinutes && userTimeInMinutes <= endInMinutes;
    });
  }, [allUsers, startTime, endTime]);


  // --- UI Render ---
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">User Dashboard</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-end">
            
            {/* Date Picker */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Start Time */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* End Time */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button 
              onClick={() => { setStartTime(''); setEndTime(''); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors h-[42px]"
            >
              Reset Time
            </button>

          </div>
        </div>

        {/* Content Area */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             <p className="mt-4 text-gray-500">Loading users...</p>
           </div>
        ) : error ? (
           <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
             <p className="text-red-700 font-medium">Error: {error}</p>
           </div>
        ) : (
           <div>
             <div className="flex justify-between items-center mb-4">
               <p className="text-gray-600">
                 Showing <strong>{filteredUsers.length}</strong> of {allUsers.length} users
               </p>
             </div>

             {/* Cards Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredUsers.map((user) => (
                 <div key={user.userId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
                   
                   {/* Card Header */}
                   <div className="p-5 flex items-start gap-4 border-b border-gray-50">
                     <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                       {user.photoSmall ? (
                         <img src={user.photoSmall} alt={user.firstName} className="h-full w-full rounded-full object-cover" />
                       ) : (
                         `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`
                       )}
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900 text-lg">
                         {user.firstName} {user.lastName}
                       </h3>
                       {user.city && (
                         <div className="flex items-center text-sm text-gray-500 mt-1">
                           <MapPin className="h-3 w-3 mr-1" />
                           {user.city}
                         </div>
                       )}
                     </div>
                   </div>

                   {/* Card Body */}
                   <div className="p-5 space-y-3 flex-grow">
                     <div className="flex items-start gap-2 text-sm text-gray-600">
                       <BookOpen className="h-4 w-4 mt-0.5 text-gray-400" />
                       <span className="font-medium text-gray-900">Course:</span> {user.interestedCourse || "N/A"}
                     </div>
                     
                     {user.userInterestedStateOfCounsellors && user.userInterestedStateOfCounsellors.length > 0 && (
                       <div className="flex items-start gap-2 text-sm text-gray-600">
                         <Globe className="h-4 w-4 mt-0.5 text-gray-400" />
                         <div>
                           <span className="font-medium text-gray-900">States: </span>
                           <div className="flex flex-wrap gap-1 mt-1">
                             {user.userInterestedStateOfCounsellors.map((state, idx) => (
                               <span key={idx} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                 {state}
                               </span>
                             ))}
                           </div>
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Card Footer */}
                   <div className="bg-gray-50 px-5 py-3 text-xs text-gray-500 flex justify-between items-center border-t border-gray-100">
                     <span>ID: {user.userId}</span>
                     <span>
                       {user.dateCreated?.seconds 
                         ? new Date(user.dateCreated.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                         : 'N/A'}
                     </span>
                   </div>

                 </div>
               ))}
             </div>

             {filteredUsers.length === 0 && (
               <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                 <p className="text-gray-500 text-lg">No users found in this time range.</p>
                 <button 
                   onClick={() => { setStartTime(''); setEndTime(''); }}
                   className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                 >
                   Clear Time Filters
                 </button>
               </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default FilteredUsersPage;