import UserDetails from "@/components/Revamp/user-profile/UserDetails";
import UserTabs from "@/components/Revamp/user-profile/UserTabs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile(){
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                navigate('/dashboard-student');
            }
        };
        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [navigate]);

    return (
        <div
            className="min-h-screen"
            style={{
                background:
                    "linear-gradient(0deg, rgba(198, 221, 240, 0.25) 0%, rgba(198, 221, 240, 0.25) 100%), #FFF",
            }}
        >
            <div className="w-full border-b border-[#E3E8F4] bg-white">
                <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-3">
                    <p className="text-[0.875rem] text-(--text-muted) font-medium">
                        Admission <span className="mx-1">{">"}</span>{" "}
                        <span className="text-(--text-main)">Profile</span>
                    </p>
                </div>
            </div>

            <section className="relative pt-6">
                <div
                    className="absolute top-0 left-0 w-full h-40 bg-center bg-cover"
                    style={{ backgroundImage: "url('/profilebg.jpg')" }}
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full mx-auto max-w-[1440px] px-4 md:px-30 flex flex-col md:flex-row justify-center items-center gap-6 text-center pb-12">
                    <UserDetails/>
                    <UserTabs/>
                </div>
            </section>
        </div>
    );
}