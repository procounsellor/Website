import getAllPlans from "@/api/subscriptionPlans"
import PlansCard from "@/components/subscription-cards/PlansCard"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export function SubscriptionPage(){
    const location = useLocation()
    const {counselorId, userId, counselor} = location.state
    const [plans, setPlans] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    useEffect(()=>{
        const fetchPlans = async () => {
            try{
            setLoading(true)
            if(!counselorId && !userId){
                setError('no user id or counselor id found')
            }
            const data = await getAllPlans(counselorId, userId)
            setPlans(data)
                
            }catch(err){
                console.error(err)
            }finally{
                setLoading(false)
            }
        }

        fetchPlans()
    }, [counselorId, userId])


    console.log(plans)

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen bg-[#F5F7FA] mt-20 px-40">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin"
                        role="status"
                        aria-label="Loading"
                    />
                    <span className="text-sm text-gray-600">Loading...</span>
                </div>
            </div>
        )
    }

    if(error){
        return <div>
            {error}
        </div>
    }

    return <div className="w-full min-h-screen bg-[#F5F7FA] mt-20 px-40">
         <div className="flex flex-col items-center gap-6 justify-center py-10">
            <h1 className="flex flex-wrap justify-center text-[28px] font-semibold text-[#13097D] max-w-[523px]">Choose the best plan for your <span className="text-[#ff660a]">career guidance</span></h1>
            <PlansCard plan={plans} counselor={counselor}/>
         </div>
      
        

    </div>
}