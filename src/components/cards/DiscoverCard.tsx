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
      className={`group ${isVertical ? "p-4 sm:p-6" : "p-2 sm:p-3"} rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col ${
        !isVertical ? cardFlexDirection + " sm:items-center" : ""
      } ${hFull ? "h-full" : ""}`}
      onClick={onClick}
    >
      <div className={`${isVertical ? "w-full mb-4" : "sm:w-1/3 flex-shrink-0 mb-2 sm:mb-0 sm:pl-2"}`}>
        <img
          src={card.imageUrl}
          alt={card.title}
          className={`w-full h-full rounded-lg object-cover object-top transition-transform duration-300 ${
            isVertical ? "aspect-[16/10] h-[280px]" : "aspect-[4/3]"
          }`}
        />
      </div>

      <div className={`${isVertical ? "w-full px-2" : "sm:w-2/3 sm:pr-2"}`}>
        <span className="inline-block text-[16px] font-semibold text-[#13097D] bg-[#E7F0F9] px-3 py-1 rounded-full mb-2">
          {card.tag}
        </span>

        <h3 className={`font-semibold ${isVertical ? "text-xl sm:text-2xl mb-2" : "text-base"} text-black`}>
          {card.title}
        </h3>

        <p className={`text-gray-600 ${isVertical ? "text-sm sm:text-base" : "text-xs sm:text-sm"} mt-1`}>
          {card.description}
        </p>
      </div>
    </Card>
  )
}