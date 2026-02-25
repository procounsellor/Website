import { SeeAllButton } from "../components/LeftRightButton";
import FancyCard from "../probuddies/CollegeCard"

const blogData = {
  title:
    "Product Management Masterclass, you will learn with head of product Customer Plateform",
  author: "Sarah Jhonson",
  readTime: "10 mins readd",
  imageUrl: "/blogCard.jpg",
};
export default function Blogs() {
  return (
    <div className="bg-[#C6DDF040] w-full h-full">
      <div className="grid grid-cols-2 max-w-[1440px] mx-auto px-[60px] py-10">
        <div>
          <div className="w-fit flex items-center justify-center rounded-[6px] gap-2 bg-white py-1 px-3">
            <div className="bg-[#0E1629] h-4 w-4"></div>

            <p className="text-(--text-main) font-semibold text-[0.875rem]">
              Blogs
            </p>
          </div>

          <h2 className="mt-5 max-w-[554px] text-(--text-muted) font-medium text-[1.25rem] ">
            Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at risus a tortor ut quam in. 
          </h2>
        </div>




        <div className="flex flex-col gap-10.5">
            <div className="flex gap-9">
            <FancyCard/>
            <FancyCard/>
        </div>

        <div className="flex items-center justify-end">
            <SeeAllButton/>
        </div>
        </div>




      </div>
    </div>
  );
}
