import {API_CONFIG} from "./config"

export async function sendOtp(phone:string){
    const response = await fetch(`${API_CONFIG.authUrl}/api/v5/otp?otp_expiry=60&template_id=68b5c776e0c1181334577692&mobile=+91${phone}&authkey=467102AtlVNtF668b5bde6P1&realTimeResponse=1`,
        {
            'method':'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        }

    )

    if(!response.ok){
         throw new Error('Failed to send otp')
    }

    return response.json()
}

export async function verifyOtp(phone:string, otp:string){
    const response = await fetch(`${API_CONFIG.authUrl}/api/v5/otp/verify?otp=${otp}&mobile=+91${phone}`, {
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        }
    })

    if(!response.ok){
        throw new Error('otp verification failed')
    }
    return response.json()
}