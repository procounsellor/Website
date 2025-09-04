import { useAuthStore } from "@/store/AuthStore"
export default function Login(){
    const {isAuthenticated, sendOtp, verifyOtp, setAuth} = useAuthStore();
    return (
        <>
        {isAuthenticated && <p>This is when not authenticated</p>}
        <button onClick={setAuth}>
            click me
        </button>
        </>
    )
}