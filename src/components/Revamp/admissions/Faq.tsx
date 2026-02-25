import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq() {
    const faqData = [
        {
            question: "What do you mean by career counselling?",
            answer: "Career counselling means helping a student understand which career path suits them. Many students feel confused about courses and future options. Through proper career counselling and career guidance for students, we help them think clearly and take the next step with confidence.",
            keywords: ["career counselling", "career guidance for students"]
        },
        {
            question: "Is career counselling after 12th really necessary?",
            answer: "For many students, yes. Career counselling after 12th helps avoid wrong decisions at an important stage. With the right career guidance and counselling, students can choose a course and college that matches their interests and long-term goals.",
            keywords: ["career counselling after 12th", "career guidance and counselling"]
        },
        {
            question: "How does online career counselling work?",
            answer: "Online career counselling is a simple one-to-one discussion with a counsellor. The student talks openly about doubts and plans, and we provide clear career guidance for students based on their situation, without the need to visit any office.",
            keywords: ["online career counselling", "career guidance for students"]
        },
        {
            question: "Do you provide personal support and is it affordable?",
            answer: "Yes. We offer affordable career coaching so that students can access the right help without stress. Each student receives support from a personal career coach who provides honest career counselling and guidance throughout the decision-making process.",
            keywords: ["affordable career coaching", "personal career coach", "career counselling"]
        },
    ]

    const [open, setOpen] = useState<number | null>(null)

    const toggleFaq = (index: number) => {
        setOpen(open === index ? null : index)
    }

    return (
        <div className="w-full bg-[#C6DDF040]">
            <div className="max-w-[1440px] px-[60px] mx-auto py-10 flex flex-col gap-8">
                <img src="/faq.svg" alt="faq_image" className="h-[29px] w-[88px]" />
                <div className="flex flex-col gap-4">
                    {faqData.map((item, index) => (
                        <div 
                            key={index} 
                            className="w-full max-w-[1320px] bg-white rounded-lg overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between py-[18px] px-[24px] text-left cursor-pointer transition-colors duration-200 hover:bg-white group"
                            >
                                <span 
                                    className="font-[Poppins] font-medium text-[18px] leading-[100%] text-(--text-main)"
                                    style={{ verticalAlign: "middle" }}
                                >
                                    {item.question}
                                </span>
                                <ChevronDown 
                                    className={`flex-shrink-0 transition-transform duration-200 text-(--text-main) ${
                                        open === index ? "rotate-180" : ""
                                    }`}
                                    size={24}
                                />
                            </button>
                            <div 
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    open === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                }`}
                            >
                                <div className="px-[24px] pb-[18px]">
                                    <p className="font-[Poppins] font-normal text-[18px] leading-[100%] text-(--text-muted) mt-[18px]">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}