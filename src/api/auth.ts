export async function sendOtp(phone: string) {
    try {
        const templateId = import.meta.env.VITE_MSG91_TEMPLATE_ID
        const authKey = import.meta.env.VITE_MSG91_AUTH_KEY
        
        if (!templateId || !authKey) {
            throw new Error('MSG91 configuration missing. Please check environment variables.')
        }

        const response = await fetch(`/api/msg91/otp?otp_expiry=60&template_id=${templateId}&mobile=+91${phone}&authkey=${authKey}&realTimeResponse=1`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to send otp`)
        }

        const data = await response.json()
        console.log('Send OTP Response:', data)
        
        if (data.type === 'error' || data.message?.includes('error')) {
            throw new Error(data.message || 'Failed to send OTP')
        }

        return data
    } catch (error) {
        console.error('Send OTP Error:', error)
        throw error
    }
}

export async function verifyOtp(phone: string, otp: string) {
    try {
        const authKey = import.meta.env.VITE_MSG91_AUTH_KEY
        
        if (!authKey) {
            throw new Error('MSG91 auth key missing. Please check environment variables.')
        }

        const response = await fetch(`/api/msg91/otp/verify?otp=${otp}&mobile=+91${phone}&authkey=${authKey}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: OTP verification failed`)
        }

        const data = await response.json()
        console.log('Verify OTP Response:', data)
        
        if (data.type === 'error' || data.message?.toLowerCase().includes('invalid') || data.message?.toLowerCase().includes('wrong')) {
            throw new Error(data.message || 'Invalid OTP')
        }
        
        if (data.type !== 'success' && !data.message?.toLowerCase().includes('verified')) {
            throw new Error('OTP verification failed')
        }

        return data
    } catch (error) {
        console.error('Verify OTP Error:', error)
        throw error
    }
}