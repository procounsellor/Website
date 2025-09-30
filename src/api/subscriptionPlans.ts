import { API_CONFIG } from "./config";

const {baseUrl} = API_CONFIG



export default async function getAllPlans(counselorId:string, userId:string){
    try{
        const token = localStorage.getItem('jwt')
        if(!token){
            return "auth token not found."
        }

        const response = await fetch(`${baseUrl}/api/plans/allPlans?counsellorId=${counselorId}&userId=${userId}`,
            {
                headers:{
                    Accept:'application/json',
                    authorization:`Bearer ${token}`
                }
            }
        )

        if(!response.ok){
            console.error(response.statusText)
        }

        const result = await response.json()

        return result
    }catch(err){
        console.error(err)
    }
}