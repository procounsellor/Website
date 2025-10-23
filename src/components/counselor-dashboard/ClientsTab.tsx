import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import ClientCard from './ClientCard';
import type { Client, ApiClient, ApiPendingRequest } from '@/types/client';
import type { User } from '@/types/user';
import { getSubscribedClients, getPendingRequests, respondToSubscriptionRequest } from '@/api/counselor-Dashboard';
import { Loader2, Search } from 'lucide-react';

type SubTab = 'My Clients' | 'Pending Request';

interface Props {
  user: User;
  token: string;
}

function isPendingRequest(client: any): client is ApiPendingRequest {
    return 'userFullName' in client;
}

export default function ClientsTab({ user, token }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('My Clients');
  
  const [myClients, setMyClients] = useState<Client[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const TABS: SubTab[] = ['My Clients', 'Pending Request'];

  const formatClients = (apiData: (ApiClient | ApiPendingRequest)[]): Client[] => {
    return apiData.map((item) => {
        if (isPendingRequest(item)) {
            return {
                id: item.userId,
                name: item.userFullName,
                imageUrl: item.userSmallPhotoUrl || `https://ui-avatars.com/api/?name=${item.userFullName}`,
                course: item.userInterestedCourse,
                preferredStates: [],
                manualSubscriptionRequestId: item.manualSubscriptionRequestId,
            };
        } else {
            return {
                id: item.userId,
                name: `${item.firstName} ${item.lastName}`,
                imageUrl: item.photoSmall || `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}`,
                course: item.course,
                preferredStates: item.userInterestedStateOfCounsellors || [],
                manualSubscriptionRequestId: item.manualSubscriptionRequestId,
            };
        }
    });
  };

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const counselorId = user.userName;
      const apiClients = await getSubscribedClients(counselorId, token);
      setMyClients(formatClients(apiClients));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients.");
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  const fetchPendingRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const counselorId = user.userName;
      const apiPending = await getPendingRequests(counselorId, token);
      setPendingRequests(formatClients(apiPending));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pending requests.");
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);


  useEffect(() => {
    if (activeSubTab === 'My Clients') {
      fetchClients();
    } else if (activeSubTab === 'Pending Request') {
      fetchPendingRequests();
    }
  }, [activeSubTab, fetchClients, fetchPendingRequests]);

  const [isResponding, setIsResponding] = useState<string | null>(null);

  const handleAccept = async (client: Client) => {
    if (!client.manualSubscriptionRequestId) return toast.error("Request ID is missing.");
    setIsResponding(client.id);
    try {
      await respondToSubscriptionRequest(client.manualSubscriptionRequestId, 'completed', token);
      setMyClients(prevClients => [client, ...prevClients]);
      setPendingRequests(prevRequests => prevRequests.filter(p => p.id !== client.id));
      toast.success(`Subscription request from ${client.name} accepted.`);
    } catch (error) {
    } finally {
      setIsResponding(null);
    }
  };

  const handleReject = async (client: Client) => {
    if (!client.manualSubscriptionRequestId) return toast.error("Request ID is missing.");
    setIsResponding(client.id);
    try {
      await respondToSubscriptionRequest(client.manualSubscriptionRequestId, 'rejected', token);
      setPendingRequests(prevRequests => prevRequests.filter(p => p.id !== client.id));
      toast.error(`Subscription request from ${client.name} rejected.`);
    } catch (error) {
    } finally {
      setIsResponding(null);
    }
  };
  
  const filteredClients = useMemo(() => {
    const listToFilter = activeSubTab === 'My Clients' ? myClients : pendingRequests;
    if (!searchQuery) {
      return listToFilter;
    }
    return listToFilter.filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, myClients, pendingRequests, activeSubTab]);

  
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }
    if (error) {
      return <div className="text-center py-16 text-red-500">{error}</div>;
    }
    
    return filteredClients.length > 0 ? (
      filteredClients.map(client => 
        <ClientCard 
            key={client.id} 
            client={client} 
            variant={activeSubTab === 'My Clients' ? 'client' : 'pending'}
            onAccept={() => handleAccept(client)}
            onReject={() => handleReject(client)}
            isResponding={isResponding === client.id}
        />
      )
    ) : (
      <div className="text-center py-16 text-gray-500">
          {searchQuery ? `No clients found for "${searchQuery}"` : 
            (activeSubTab === 'My Clients' ? 'You do not have any subscribed clients yet.' : 'There are no pending requests.')
          }
      </div>
    );
  };

  return (
    <div className="md:bg-white md:p-6 md:rounded-2xl md:border md:border-[#EFEFEF]">
      <div className="relative mb-4 md:hidden">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
            type="text"
            placeholder="Search Clients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#EFEFEF] rounded-xl text-sm placeholder:text-[#8C8CA1] focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="bg-white p-2 rounded-xl border border-[#EFEFEF] md:bg-transparent md:p-0 md:border-none md:mb-5">
        <div className="flex items-center gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
                setSearchQuery('');
              }}
              className={`flex-1 md:flex-none px-4 py-2 text-[12px] md:text-base font-medium rounded-full transition-colors duration-200 ${
                activeSubTab === tab 
                ? 'bg-[#E8E7F2] text-[#13097D]' 
                : 'bg-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:block md:gap-0 md:divide-y md:divide-gray-200 md:mt-0 mt-4">
        {renderContent()}
      </div>
    </div>
  );
}