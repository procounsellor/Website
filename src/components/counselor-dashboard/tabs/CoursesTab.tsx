import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CourseType } from '@/types/course';
import CourseCard from '@/components/course-cards/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import CreateCourseCard from '@/components/course-cards/CreateCourseCard';




type SubTab = 'PYQ' | 'Test Series' | 'Courses';




const mockCourse:CourseType[] = [
  {
    id:"121dd23",
    name:'Course Name',
    subject:"Physics",
    price:"1200",
    rating:"4.5",
    reviews:"23",
    image:'/mockCourse.svg',
  },
    {
    id:"121dd23",
    name:'Course Name',
    subject:"Physics",
    price:"1200",
    rating:"4.5",
    reviews:"23",
    image:'/mockCourse.svg',
  },
    {
    id:"121dd23",
    name:'Course Name',
    subject:"Physics",
    price:"1200",
    rating:"4.5",
    reviews:"23",
    image:'/mockCourse.svg',
  },
    {
    id:"121dd23",
    name:'Course Name',
    subject:"Physics",
    price:"1200",
    rating:"4.5",
    reviews:"23",
    image:'/mockCourse.svg',
  },
    {
    id:"121dd23",
    name:'Course Name',
    subject:"Physics",
    price:"1200",
    rating:"4.5",
    reviews:"23",
    image:'/mockCourse.svg',
  },
    {
    id:"121dd23",
    name:'Course Name',
    subject:"Physics",
    price:"1200",
    rating:"4.5",
    reviews:"23",
    image:'/mockCourse.svg',
  },
    {
    id:"121dd23",
    name:'Course Name',
    subject:"Physics",
    price:"1200",
    rating:"4.5",
    reviews:"23",
    image:'/mockCourse.svg',
  },
    {
    id:"121dd23",
    name:'Course Name',
    subject:"Physics",
    price:"1200",
    rating:"4.5",
    reviews:"23",
    image:'/mockCourse.svg',
  }
]





export default function CourseTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('PYQ');
  const {role} = useAuthStore()
  const navigate = useNavigate()
  const [createCourse, setCreateCourse] = useState(false);

  // const {data, isLoading, error} = useQuery({
  //   queryKey:["course"],
  //   queryFn: () => fetch(`url`).then((res)=>res.json()),
  // })
  


  const TABS: SubTab[] = ['PYQ', 'Courses', 'Test Series'];

   
  // const renderContent = () => {
  //   if (isLoading) {
  //     return <div className="text-center py-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
  //   }
  //   if (error) {
  //     return <div className="text-center py-16 text-red-500">{(error as Error).message}</div>;
  //   }
    
  //   return data.length > 0 ? (
  //     data.map(client => 
  //       <ClientCard 
  //           key={client.id} 
  //           client={client} 
  //           variant={activeSubTab === 'My Clients' ? 'client' : 'pending'}
  //           onAccept={() => handleAccept(client)}
  //           onReject={() => handleReject(client)}
  //           isResponding={respondingId === client.id && (isAccepting || isRejecting)}
  //       />
  //     )
  //   ) : (
  //     <div className="text-center py-16 text-gray-500">
  //         {searchQuery ? `No clients found for "${searchQuery}"` : 
  //           (activeSubTab === 'My Clients' ? 'You do not have any subscribed clients yet.' : 'There are no pending requests.')
  //         }
  //     </div>
  //   );
  // };

  function onClose(){
    setCreateCourse(false)
  }



  return (
    <div className="md:bg-white md:py-5 md:px-4 md:rounded-2xl md:border md:border-[#EFEFEF]">
      <div className="bg-white p-2 rounded-xl border border-[#EFEFEF] md:bg-transparent md:p-0 md:border-none md:mb-5">
      <div className='flex justify-between'>
          <div className="flex items-center gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
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

        <button
        onClick={()=>setCreateCourse(true)}
        className='flex bg-[#655E95] hover:bg-[#655E95]/90 rounded-2xl md:rounded-[0.75rem] cursor-pointer text-clip border text-xs py-2 lg:py-3 px-3 lg:px-6 text-white items-center justify-center lg:font-semibold'
        >
          Create a Course
        </button>
      </div>

      </div>

      <div className="grid gap-2 grid-cols-2 md:grid-col-4 lg:grid-cols-5 mt-2">
        {mockCourse.map(course => 
          <div key={course.id} className='cursor-pointer' onClick={()=>navigate(`/detail/${course.id}/${role}`)}>
            <CourseCard key={course.id} course={course} role={role? role : "counselor"}/>
          </div>
        )}
      </div>

      {createCourse && <CreateCourseCard onClose={onClose}/>}
    </div>
  );
}