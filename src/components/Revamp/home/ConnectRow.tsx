import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";
import SectionLabel from "./SectionLabel";
import { ArrowRight, MessagesSquare, HeartHandshake, Phone } from "lucide-react";
import { HELPLINE, WHATSAPP_CHAT_ENABLED, whatsappHref } from "@/data/homeExams";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.7 5.8.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.28l5.67-1.49a11.33 11.33 0 0 0 5.78 1.47h.01c6.25 0 11.34-5.09 11.35-11.35a11.28 11.28 0 0 0-3.33-8.03z" />
    </svg>
  );
}

const cardBase =
  "group h-full rounded-[18px] p-5 md:p-6 flex flex-col gap-2 border transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(14,22,41,0.10)] motion-reduce:hover:translate-y-0";

/** Three low-pressure ways in: a senior, WhatsApp updates, and help with stress. */
export default function ConnectRow() {
  return (
    <section aria-labelledby="connect-heading" className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionLabel className="mb-4 border border-[#E3E7F0]">Get help</SectionLabel>
        <h2 id="connect-heading" className="font-[Poppins] font-bold text-[22px] md:text-[30px] text-[#0E1629] leading-tight mb-4 md:mb-6">
          Not sure who to ask? Start here
        </h2>
        <p className="font-[Poppins] text-[14px] md:text-[15px] text-[#4B5563] -mt-2 mb-4 md:mb-6">
          Or call our helpline:{" "}
          <a href={`tel:${HELPLINE.tel}`} className="inline-flex items-center gap-1 font-semibold text-[#2F43F2] hover:underline">
            <Phone className="w-4 h-4" aria-hidden="true" />
            {HELPLINE.display}
          </a>
        </p>
        <motion.ul {...revealProps} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <li>
            <Link to="/pro-buddies" className={`${cardBase} bg-[#EEF0FE] border-[#DCE1FD]`}>
              <MessagesSquare className="w-7 h-7 text-[#2F43F2]" aria-hidden="true" />
              <span className="font-[Poppins] font-semibold text-[17px] text-[#0E1629]">Chat with a college senior</span>
              <span className="font-[Poppins] text-[14px] text-[#374151] leading-snug">
                Ask about campus life, fees, hostels and placements — from someone already there.
              </span>
              <span className="mt-auto pt-2 inline-flex items-center gap-1.5 font-[Poppins] font-semibold text-[14px] text-[#2F43F2]">
                Find a ProBuddy <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
          <li>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={`${cardBase} bg-[#E9F9EF] border-[#C9F0D7]`}>
              <WhatsAppIcon className="w-7 h-7 text-[#1DA851]" />
              <span className="font-[Poppins] font-semibold text-[17px] text-[#0E1629]">
                {WHATSAPP_CHAT_ENABLED ? "Ask us on WhatsApp" : "Exam updates on WhatsApp"}
              </span>
              <span className="font-[Poppins] text-[14px] text-[#374151] leading-snug">
                {WHATSAPP_CHAT_ENABLED
                  ? "Message a ProCounsel counsellor about your exam, colleges or counselling rounds. A real person replies."
                  : "CAT, NEET and JEE dates, results and counselling rounds — the day they're announced."}
              </span>
              <span className="mt-auto pt-2 inline-flex items-center gap-1.5 font-[Poppins] font-semibold text-[14px] text-[#146C43]">
                {WHATSAPP_CHAT_ENABLED ? "Start a chat" : "Join the channel"} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </a>
          </li>
          <li>
            <Link to="/counsellor-listing" className={`${cardBase} bg-[#FFF4EC] border-[#FBDCC6]`}>
              <HeartHandshake className="w-7 h-7 text-[#C2410C]" aria-hidden="true" />
              <span className="font-[Poppins] font-semibold text-[17px] text-[#0E1629]">Feeling stressed about results?</span>
              <span className="font-[Poppins] text-[14px] text-[#374151] leading-snug">
                That's normal. Talk it through with a counsellor and leave with a clear next step.
              </span>
              <span className="mt-auto pt-2 inline-flex items-center gap-1.5 font-[Poppins] font-semibold text-[14px] text-[#C2410C]">
                Talk to a counsellor <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        </motion.ul>
      </div>
    </section>
  );
}
