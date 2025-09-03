import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CounselorCardSkeleton() {
  return (
    <Card 
      className="group flex flex-col bg-white mx-auto w-full"
      style={{
        maxWidth: '320px',
        height: 'auto',
        minHeight: '451px',
        borderRadius: '21.51px',
        background: '#FFFFFF',
        boxShadow: '0px 0px 4px 0px #23232340',
        opacity: 1,
        boxSizing: 'border-box',
        padding: 0
      }}
    >
      <div 
        className="relative overflow-hidden mx-auto mt-5"
        style={{
          width: '90%',
          maxWidth: '349px',
          height: 'auto',
          aspectRatio: '349/289',
          borderRadius: '20px',
          opacity: 1,
        }}
      >
        <Skeleton className="w-full h-full rounded-[20px]" />
      </div>

      <div 
        className="flex flex-col items-center text-center flex-1 justify-center px-4"
        style={{ 
          padding: '30px 14px 14px 14px'
        }}
      >

        <Skeleton className="h-6 sm:h-7 w-32 sm:w-40 mb-3" />
        

        <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 mb-4" />
        
        <div className="flex items-center justify-between w-full max-w-[200px]">
          <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
          <Skeleton className="h-5 sm:h-6 w-12 sm:w-16 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function AllCounselorCardSkeleton() {
  return (
    <Card 
      className="group flex flex-col bg-white mx-auto w-full"
      style={{
        maxWidth: '320px',
        height: 'auto',
        minHeight: '420px',
        borderRadius: '24px',
        border: '1px solid #EFEFEF',
        boxShadow: '0px 0px 4px 0px #2323231F',
        background: '#FFFFFF',
        opacity: 1,
        boxSizing: 'border-box',
        padding: '16px'
      }}
    >
      <div className="overflow-hidden rounded-2xl mb-3 w-full"
        style={{
          height: 'auto',
          aspectRatio: '1/1',
        }}
      >
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <Skeleton className="h-5 sm:h-6 w-28 sm:w-36 mb-1" />
        
        <Skeleton className="h-3 sm:h-4 w-20 sm:w-28 mb-1" />
        
        <div className="flex items-center gap-1 mb-2">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-20 sm:w-24" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-4 sm:w-6" />
            </div>
            <Skeleton className="h-3 w-3 sm:w-4" />
            <Skeleton className="h-3 w-4 sm:w-6" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-6 sm:w-8" />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-2" />
        
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 sm:h-8 w-6 sm:w-8 rounded" />
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
        </div>
      </div>
    </Card>
  );
}
