import { useState } from 'react';
import toast from 'react-hot-toast';
import ClientCard from './ClientCard';
import type { Client } from '@/types/client';

const initialMyClients: Client[] = [
  { id: '1', name: 'Subhash Ghai', imageUrl: '/profile1.jpg', course: 'Engineering Student', preferredStates: ['Maharashtra', 'Kerala', 'Tamil Nadu', 'Karnataka'] },
  { id: '2', name: 'Priya Sharma', imageUrl: '/profile2.jpg', course: 'Medical Student', preferredStates: ['Delhi', 'Uttar Pradesh'] },
  { id: '3', name: 'Amit Singh', imageUrl: '/profile1.jpg', course: 'Commerce Student', preferredStates: ['Gujarat', 'Rajasthan'] },
];

const initialPendingRequests: Client[] = [
    { id: '4', name: 'Sumant Kumar', imageUrl: '/profile1.jpg', course: 'Engineering Student', preferredStates: ['Maharashtra', 'Kerala', 'Tamil Nadu', 'Karnataka', 'Uttar Pradesh'] },
    { id: '5', name: 'Alia Bhatt', imageUrl: '/profile2.jpg', course: 'Arts Student', preferredStates: ['Maharashtra', 'Goa'] },
];

type SubTab = 'My Clients' | 'Pending Request';

export default function ClientsTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('My Clients');
  
  const [myClients, setMyClients] = useState<Client[]>(initialMyClients);
  const [pendingRequests, setPendingRequests] = useState<Client[]>(initialPendingRequests);

  const TABS: SubTab[] = ['My Clients', 'Pending Request'];

  const handleAccept = (clientId: string, clientName: string) => {
    const clientToMove = pendingRequests.find(p => p.id === clientId);
    if (clientToMove) {
      setMyClients(prevClients => [clientToMove, ...prevClients]);
      setPendingRequests(prevRequests => prevRequests.filter(p => p.id !== clientId));
      toast.success(`Subscription request from ${clientName} accepted.`);
    }
  };

  const handleReject = (clientId: string, clientName: string) => {
    setPendingRequests(prevRequests => prevRequests.filter(p => p.id !== clientId));
    toast.error(`Subscription request from ${clientName} rejected.`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EFEFEF]">
      <div className="flex items-center gap-2 mb-5">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 text-base font-medium rounded-full transition-colors duration-200 ${
              activeSubTab === tab 
              ? 'bg-[#E8E7F2] text-[#13097D]' 
              : 'bg-transparent text-[#13097D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="divide-y divide-gray-200 -mt-5">
        {activeSubTab === 'My Clients' && myClients.map(client => (
          <ClientCard key={client.id} client={client} variant="client" />
        ))}

        {activeSubTab === 'Pending Request' && pendingRequests.map(client => (
          <ClientCard 
            key={client.id} 
            client={client} 
            variant="pending"
            onAccept={() => handleAccept(client.id, client.name)}
            onReject={() => handleReject(client.id, client.name)}
          />
        ))}
      </div>
    </div>
  );
}