import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import ReviewCard from "./ReviewCard";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, size = 16 }) => {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FFC107" : "#E0E0E0"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const RatingBar = ({ label, count, maxCount, color }) => {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ width: 36, fontSize: 13, color: "#555", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: "#ECECEC", borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 99,
            transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
      <span style={{ width: 36, fontSize: 13, color: "#888", textAlign: "right", fontFamily: "'DM Sans', sans-serif" }}>{count}</span>
    </div>
  );
};

// ── Modal (desktop) view ──────────────────────────────────────────────────────
const ModalView = ({ reviews, onClose, ratingCounts, avgRating, totalReviews, activeFilter, setActiveFilter }) => {
  const maxCount = Math.max(...Object.values(ratingCounts));
  const barColors = { 5: "#4CAF50", 4: "#8BC34A", 3: "#FFC107", 2: "#FF9800", 1: "#F44336" };
  const topReview = reviews.slice().sort((a, b) => b.rating - a.rating)[0];

  const filtered = activeFilter === "All" ? reviews : reviews.filter((r) => r.rating === Number(activeFilter));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col p-5 gap-5 rounded-2xl w-[1005px]"
        style={{
          background:"linear-gradient(0deg, rgba(198, 221, 240, 0.25) 0%, rgba(198, 221, 240, 0.25) 100%), #FFF"
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a" }}>Student Reviews</span>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#F5F5F5",
              borderRadius: "50%",
              width: 30,
              height: 30,
              cursor: "pointer",
              fontSize: 16,
              color: "#555",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ display: "flex", gap: 20, borderBottom: "1px solid #F0F0F0" }}>
          {/* Bar chart */}
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar key={star} label={["Five","Four","Three","Two","One"][5 - star]} count={ratingCounts[star] ?? 0} maxCount={maxCount} color={barColors[star]} />
            ))}
          </div>

          {/* Highlight card */}
          {topReview && (
            <div
              className="flex flex-col gap-2.5 w-[409px] bg-[#fff7e0] p-3"
            >
              <p className="text-(--text-main) font-semibold text-[1rem] ">
                {topReview.text.slice(0, 40)}...
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span className="text-xl font-bold text-black" >{avgRating.toFixed(1)}</span>
                <span className="text-sm font-bold">/5</span>
              </div>
              <StarRating rating={Math.round(avgRating)} size={24} />
              <p className="text-sm text-(--text-main)  font-medium">
                {topReview.text.slice(0, 70)}…
              </p>
            </div>
          )}
        </div>

        <hr className="h-px w-full bg-[#D6d6d6]"/>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #F0F0F0", flexWrap: "wrap" }}>
          {["All", "5", "4", "3", "2", "1"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center text-xs justify-center gap-2.5 border rounded-2xl py-1 px-4 ${activeFilter ==f ? "border-[#2f43f2] text-[#2f43f2]": " text-[#2A2A2A] border-(--text-muted)"}`}
            >
              {f !== "All" && <span style={{ color: "#FFC107" }}>★</span>}
              {f}
            </button>
          ))}
        </div>

        {/* Review list */}
        <div className="overflow-y-auto max-w-[722px] flex flex-col gap-4">
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "#aaa", padding: "24px 0", fontSize: 14 }}>No reviews for this rating.</p>
          ) : (
            filtered.map((r, i) => <ReviewCard key={i} review={r} />)
          )}
        </div>
      </div>
    </div>
  );
};

// ── Mobile (full-page) view ───────────────────────────────────────────────────
const MobileView = ({ reviews, onBack, ratingCounts, avgRating, activeFilter, setActiveFilter }) => {
  const maxCount = Math.max(...Object.values(ratingCounts));
  const barColors = { 5: "#4CAF50", 4: "#8BC34A", 3: "#FFC107", 2: "#FF9800", 1: "#F44336" };
  const filtered = activeFilter === "All" ? reviews : reviews.filter((r) => r.rating === Number(activeFilter));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(0deg, rgba(198, 221, 240, 0.25) 0%, rgba(198, 221, 240, 0.25) 100%), #FFF",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        zIndex: 1001,
      }}
    >
      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px 12px" }}>
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#1a1a1a",
            padding: 0,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={22} strokeWidth={2.25} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 17, color: "#1a1a1a" }}>Student Reviews</span>
      </div>

      {/* Rating bars */}
      <div style={{ padding: "0 20px 12px" }}>
        {[5, 4, 3, 2, 1].map((star) => (
          <RatingBar key={star} label={["Five","Four","Three","Two","One"][5 - star]} count={ratingCounts[star] ?? 0} maxCount={maxCount} color={barColors[star]} />
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, padding: "8px 20px", flexWrap: "wrap", borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0" }}>
        {["All", "5", "4", "3", "2", "1"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex items-center gap-1 border rounded-2xl py-1 px-2.5 ${activeFilter ==f ? "border-[#2f43f2] text-[#2f43f2]": " text-[#2A2A2A] border-(--text-muted)"}`}
          >
            {f}
            {f !== "All" && <FaStar fill="#ffc107" size={18}/>}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div
      className="flex flex-col overflow-y-auto gap-3 px-5 py-4"
      >
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", padding: "24px 0", fontSize: 14 }}>No reviews for this rating.</p>
        ) : (
          filtered.map((r, i) => <ReviewCard key={i} review={r} />)
        )}
      </div>
    </div>
  );
};

// ── Main exported component ───────────────────────────────────────────────────
/**
 * Props:
 *   reviews: Array<{ name: string, date: string, text: string, rating: number (1-5) }>
 *   defaultView?: "modal" | "mobile"   (default: "modal")
 */
export default function StudentReviews({ reviews = [], defaultView = "modal", onClose }) {
  const [view, setView] = useState(defaultView);
  const [activeFilter, setActiveFilter] = useState("All");
  const isMobileScreen = typeof window !== "undefined" && window.innerWidth < 768;
  const overlayView = isMobileScreen ? "mobile" : "modal";

  const ratingCounts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] ?? 0) + 1;
    return acc;
  }, {});

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const totalReviews = reviews.length;

  const sharedProps = { reviews, ratingCounts, avgRating, totalReviews, activeFilter, setActiveFilter };

  if (onClose) {
    return (
      <>
        {/* Google Font */}
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');`}</style>
        {overlayView === "modal" ? (
          <ModalView {...sharedProps} onClose={onClose} />
        ) : (
          <MobileView {...sharedProps} onBack={onClose} />
        )}
      </>
    );
  }

  return (
    <>
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');`}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", padding: 32 }}>
        {/* Toggle buttons */}
        <div style={{ display: "flex", gap: 10, fontFamily: "'DM Sans', sans-serif" }}>
          <button
            onClick={() => setView("modal")}
            style={{
              padding: "8px 20px",
              borderRadius: 99,
              border: "none",
              background: view === "modal" ? "#1a1a1a" : "#ECECEC",
              color: view === "modal" ? "#fff" : "#555",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Modal / Desktop
          </button>
          <button
            onClick={() => setView("mobile")}
            style={{
              padding: "8px 20px",
              borderRadius: 99,
              border: "none",
              background: view === "mobile" ? "#1a1a1a" : "#ECECEC",
              color: view === "mobile" ? "#fff" : "#555",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Mobile View
          </button>
        </div>

        {/* Views */}
        {view === "modal" && (
          <ModalView {...sharedProps} onClose={() => {}} />
        )}
        {view === "mobile" && (
          <MobileView {...sharedProps} onBack={() => setView("modal")} />
        )}
      </div>
    </>
  );
}

// ── Demo usage (remove in production) ────────────────────────────────────────
const demoReviews = [
  { name: "Josheph kuruvilla", date: "2 week ago", rating: 5, text: "Lorem ipsum dolor sit amet consectetur, pharetra ultrices congue dictum lectus, morbi libero donec tellus nulla, tellus nisl dignissim ut ullamcorper arcu a nisi." },
  { name: "Josheph kuruvilla", date: "2 week ago", rating: 4, text: "Lorem ipsum dolor sit amet consectetur, pharetra ultrices congue dictum lectus, morbi libero donec tellus nulla, tellus nisl dignissim ut ullamcorper arcu a nisi." },
  { name: "Aditya Sharma", date: "3 week ago", rating: 5, text: "Excellent mentor! Really helped me understand complex topics with great patience and clarity." },
  { name: "Priya Mehta", date: "1 month ago", rating: 3, text: "Good sessions but could improve on timing and structured delivery of content." },
  { name: "Rahul Verma", date: "1 month ago", rating: 2, text: "Expected more detailed coverage of the topics. Sessions felt rushed at times." },
  { name: "Sneha Iyer", date: "2 months ago", rating: 5, text: "Absolutely loved the sessions. Very interactive and the mentor was always responsive." },
];

export function Demo() {
  return <StudentReviews reviews={demoReviews} defaultView="modal" />;
}
