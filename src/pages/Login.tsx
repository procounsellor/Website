import { useAuthStore } from "@/store/AuthStore"
import { LoginCard } from "@/components";

export default function Login(){
    const {sendOtp, verifyOtp, isLoginToggle} = useAuthStore();
    return (
        <>
        {isLoginToggle && <LoginCard/>}
        </>
    )
}