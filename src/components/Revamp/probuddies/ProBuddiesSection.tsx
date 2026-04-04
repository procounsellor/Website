import { SeeAllButton } from "../components/LeftRightButton";
import styles from "./CollegeSection.module.css";
import ProBuddyCard from "./ProBuddyCard";

const mockProBuddies = [
  {
    id: "pb-1",
    name: "Aditya Kumar",
    imageUrl: "/admissions/pro.jpg",
    rating: 4.8,
    yearLabel: "BTech 3rd Year",
    city: "Bengaluru",
    proCoins: 120,
  },
  {
    id: "pb-2",
    name: "Riya Sharma",
    imageUrl: "/probuddies_aaditya.jpg",
    rating: 4.7,
    yearLabel: "MBBS 2nd Year",
    city: "Delhi",
    proCoins: 95,
  },
  {
    id: "pb-3",
    name: "Nikhil Verma",
    imageUrl: "/admissions/pro.jpg",
    rating: 4.9,
    yearLabel: "BTech 4th Year",
    city: "Pune",
    proCoins: 140,
  },
  {
    id: "pb-4",
    name: "Sana Ali",
    imageUrl: "/probuddies_aaditya.jpg",
    rating: 4.6,
    yearLabel: "MBBS 3rd Year",
    city: "Lucknow",
    proCoins: 88,
  },
  {
    id: "pb-2",
    name: "Riya Sharma",
    imageUrl: "/probuddies_aaditya.jpg",
    rating: 4.7,
    yearLabel: "MBBS 2nd Year",
    city: "Delhi",
    proCoins: 95,
  },
];

export default function ProBuddiesSection() {
  return (
    <div className="flex flex-col gap-7  w-full h-[596px] py-10 ">
      <div className="flex flex-col md:flex-row justify-between mx-auto" style={{ width: "calc(420px * 3 + 30px * 2)" }}>
        <div className="flex items-start">
          <img src="/college.svg" alt="icon_avg" className="items-start" />
        </div>

        <h1 className="text-(--text-main) text-xs  md:text-2xl font-medium max-w-[811px] max-h-[108px]">
          Discover curated programs across mental wellness, assessments, admissions, and upskilling led by experienced professionals, built around your needs.
        </h1>
      </div>

      <div className="flex gap-6 justify-center">
        {mockProBuddies.map((buddy) => (
          <ProBuddyCard
            key={buddy.id}
            name={buddy.name}
            imageUrl={buddy.imageUrl}
            rating={buddy.rating}
            yearLabel={buddy.yearLabel}
            city={buddy.city}
            proCoins={buddy.proCoins}
          />
        ))}
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "25%" }} />
        </div>
        <SeeAllButton />
      </div>
    </div>
  );
}
