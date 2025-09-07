import {API_CONFIG} from './config'

const baseUrl = API_CONFIG.baseUrl


export async function  sendOtp(phone:string) {
    try{
        const response = await fetch(`${baseUrl}/api/auth/generateOtp?phoneNumber=${phone}`, {
            method:'POST',
            headers:{
                Accept:'application/json'
            }
        })

        if(!response.ok){
            throw new Error(`HTTP ${response.status}: Failed to send otp`)
        }

        const data = await response.json()
        console.log('Send otp response:', data)

        return data

    }catch(error){
        console.error(error)
        throw(error)
    }
    
}

export async function verifyOtp(phone: string, otp: string) {
    try {
        const response = await fetch(`${baseUrl}/api/auth/verifyAndUserSignup?phoneNumber=${phone}&otp=${otp}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: OTP verification failed`)
        }

        const data = await response.json()
        console.log('Verify OTP Response:', data)
        return data

    } catch (error) {
        console.error('Verify OTP Error:', error)
        throw error
    }
}