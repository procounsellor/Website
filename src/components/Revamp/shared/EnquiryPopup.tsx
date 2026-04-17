import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const ENQUIRY_AUTO_SHOWN_KEY = "revamp-enquiry-auto-shown";
const SHOW_DELAY_MS = 14000;

export default function EnquiryPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const hasAutoShown = sessionStorage.getItem(ENQUIRY_AUTO_SHOWN_KEY) === "true";
    if (hasAutoShown) return;

    const timerId = window.setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem(ENQUIRY_AUTO_SHOWN_KEY, "true");
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const digitsOnlyPhone = phone.replace(/\D/g, "");

    if (!trimmedName || !trimmedEmail || digitsOnlyPhone.length < 10) {
      toast.error("Please enter valid name, number, and email.");
      return;
    }

    toast.success("Thanks for your enquiry. We will contact you soon.");
    setIsVisible(false);
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 h-40 w-12 items-center justify-center rounded-l-2xl bg-[#0E1629] text-white font-poppins text-[13px] font-semibold tracking-[0.08em] cursor-pointer shadow-[-10px_10px_25px_rgba(14,22,41,0.3)] transition-colors hover:bg-[#1a2645]"
      >
        <span className="rotate-270 whitespace-nowrap">Enquiry</span>
      </button>

      {isVisible && (
        <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center bg-[#0E1629]/35 backdrop-blur-[2px]">
          <div className="w-107.5 rounded-2xl border border-[#DDE3F0] bg-white shadow-[0_24px_54px_rgba(14,22,41,0.25)] overflow-hidden">
            <div className="flex items-center justify-between bg-[#0E1629] px-5 py-4">
              <h3 className="font-poppins text-[17px] font-semibold text-white">
                Quick Enquiry
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close enquiry form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
              <p className="font-poppins text-[14px] text-[#6B7280]">
                Share your details and our team will contact you shortly.
              </p>

              <input
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-12 rounded-xl border border-[#E5E7EB] px-4 font-poppins text-[14px] outline-none focus:border-[#2F43F2]"
              />

              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                className="h-12 rounded-xl border border-[#E5E7EB] px-4 font-poppins text-[14px] outline-none focus:border-[#2F43F2]"
              />

              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="h-12 rounded-xl border border-[#E5E7EB] px-4 font-poppins text-[14px] outline-none focus:border-[#2F43F2]"
              />

              <button
                type="submit"
                className="mt-1 h-12 cursor-pointer rounded-xl bg-[#2F43F2] font-poppins text-[15px] font-semibold text-white transition-colors hover:bg-[#2437d1]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
