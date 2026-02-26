import { SeeAllButton } from "../components/LeftRightButton";
import FancyCard from "./CollegeCard";
import styles from "./CollegeSection.module.css";


export default function CollegeSection() {
  return (
    <div className="flex flex-col gap-7  w-full h-[596px] py-10 ">
      <div className="flex justify-between mx-auto" style={{ width: 'calc(420px * 3 + 30px * 2)' }}>
        <div className="flex items-start">
          <img src="/college.svg" alt="icon_avg" className="items-start" />
        </div>

        <h1 className="text-(--text-main) text-2xl font-medium max-w-[682px] max-h-[108px]">
          Discover curated programs across mental wellness, assessments,
          admissions, and upskilling led by experienced professionals, built
          around your needs.
        </h1>
      </div>


      <div className="flex gap-6 justify-center">
        <FancyCard />
        <FancyCard />
        <FancyCard />
        <FancyCard />
      </div>



      <div className={styles.controlsContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '25%' }}></div>
        </div>

        {/* <div className={styles.navButtons}>
          <button className={styles.navButton}>
            <img src="/arrow.svg" alt="Previous" className={styles.leftArrow} />
          </button>
          <button className={styles.navButton}>
            <img src="/arrow.svg" alt="Next" className={styles.rightArrow} />
          </button>
        </div> */}
        <SeeAllButton/>
      </div>
    </div>
  );
}