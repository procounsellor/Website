import { Card } from "@/components/ui/card";

export type DiscoverCardData = {
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
  layout: "vertical" | "image-left" | "image-right";
};

type DiscoverCardProps = {
  card: DiscoverCardData;
  hFull?: boolean;
  onClick?: () => void;
};

export function DiscoverCard({ card, hFull, onClick }: DiscoverCardProps){
  const isVertical = card.layout === "vertical";
  const cardFlexDirection = card.layout === "image-left" ? "sm:flex-row-reverse" : "sm:flex-row";

  return(
    <Card 
      className={`p-3 sm:p-3 rounded-[20px] cursor-pointer flex flex-col border border-[#EFEFEF] shadow-[0px_0px_25px_0px_rgba(35,35,35,0.12)] transition-all duration-300 hover:shadow-lg ${
        !isVertical ? cardFlexDirection + " sm:items-center h-[183px]" : ""
      } ${hFull ? "h-full" : ""}`}
      onClick={onClick}
    >
      <div className={`${isVertical ? "w-full mb-2 h-[413px]" : "h-full sm:w-2/5 flex-shrink-0"}`}>
        <img
          src={card.imageUrl}
          alt={card.title}
          className={"w-full h-full rounded-lg object-cover object-top  group-hover:scale-100"}
        />
      </div>

      <div className={`${isVertical ? "w-full" : "h-full flex flex-col justify-center sm:w-3/5 sm:pl-4"}`}>
        <span className="w-fit inline-block text-[15px] font-semibold text-[#13097D] bg-[#E7F0F9] px-2 py-0.5 rounded-full mb-1">
          {card.tag}
        </span>

        <h3 className={`font-semibold ${isVertical ? "text-lg sm:text-xl" : "text-base"} text-[#242645]`}>
          {card.title}
        </h3>

        <p className="text-[#8C8CA1] mt-0.5 text-xs sm:text-sm">
          {card.description}
        </p>
      </div>
    </Card>
  )
}