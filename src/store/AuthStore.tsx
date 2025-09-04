import {create} from 'zustand'
import { sendOtp, verifyOtp } from '@/api/auth'



interface AuthState{
    user:{id:string} | null
    loginToggle:boolean
    toggleLogin:()=>void
    sendOtp: (phone:string)=> Promise<void>
    verifyOtp: (phone:string, opt:string) => Promise<void>
    isAuthenticated:boolean
    setAuth:()=>void

}

export const useAuthStore = create<AuthState>((set)=>({
    user:null,
    isAuthenticated:false,
    loginToggle:false,
    toggleLogin: ()=>{set((state)=>({loginToggle:!state.loginToggle}))},

    sendOtp: async(phone:string) => await sendOtp(phone),

    verifyOtp: async(phone:string, otp:string)=>{
        await verifyOtp(phone, otp)
        set({
            user:{id:phone},
            isAuthenticated:true,
            loginToggle:false
        })
    },
    setAuth:()=>{
        set({isAuthenticated:true})
    }


}))