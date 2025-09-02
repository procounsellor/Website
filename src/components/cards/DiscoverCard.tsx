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
};

export function DiscoverCard({ card, hFull }: DiscoverCardProps){
  const isVertical = card.layout === "vertical";
  const cardFlexDirection = card.layout === "image-left" ? "sm:flex-row-reverse" : "sm:flex-row";

  return(
    <Card className={`group p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col ${
        !isVertical ? cardFlexDirection + " sm:items-center" : ""
      } ${hFull ? "h-full" : ""}`}
    >
      <div className={`${isVertical ? "w-full mb-2" : "sm:w-1/3 flex-shrink-0 mb-2 sm:mb-0 sm:pl-2"}`}>
        <img
          src={card.imageUrl}
          alt={card.title}
          className={`w-full h-full rounded-lg object-cover object-top transition-transform duration-300 group-hover:scale-102 ${
            isVertical ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}
        />
      </div>

      <div className={`${isVertical ? "w-full" : "sm:w-2/3 sm:pr-2"}`}>
        <span className="inline-block text-[15px] font-semibold text-[#13097D] bg-[#E7F0F9] px-2 py-0.5 rounded-full mb-1">
          {card.tag}
        </span>

        <h3 className={`font-semibold ${isVertical ? "text-lg sm:text-xl" : "text-base"} text-black`}>
          {card.title}
        </h3>

        <p className="text-black mt-0.5 text-xs sm:text-sm">
          {card.description}
        </p>
      </div>
    </Card>
  )
}
