import styles from './CollegeCard.module.css'
export default function Card(){
    return <div className={`relative w-[308px] h-[280px] ${styles.cardWrapper}`}>
        <div className={`${styles.mainCard}`}>

        <img src="/college.jpg" alt="college_image" className={`${styles.image}`}/>

        <div className={`${styles.textCard}`}>
            <h1 className={`${styles.heading}`}>Lorem ipsum dolor sit amet consectetur. </h1>
        </div>

         <div className={`${styles.location}`}>
                <p>24 Courses | Hyderabad</p>
        </div>
    </div>
      <button className={`${styles.bottom}`}>
                <img src="/arrow.svg" alt="" />
            </button>
    </div>
}