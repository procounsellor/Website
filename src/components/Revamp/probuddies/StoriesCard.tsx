import { Star } from "lucide-react";

export interface StoryItem {
  name: string;
  role: string;
  rating: number;
  /** Short headline for the card. Must differ per story — see the note below. */
  headline?: string;
  text: string;
  image: string;
}

function RatingStars({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const fillPercent = Math.max(0, Math.min(100, (rating - index) * 100));
    return { key: index, fillPercent };
  });

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <div key={star.key} className="relative h-4 w-4">
          <Star className="absolute inset-0 h-4 w-4 text-[#D1D5DB]" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${star.fillPercent}%` }}
          >
            <Star className="h-4 w-4 text-[#FBBF24]" fill="#FBBF24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// One DOM node per piece of text. This card used to render a `md:hidden`
// mobile block *and* a `hidden md:flex` desktop block, so every name, role and
// quote appeared twice in the served HTML and the hard-coded headline appeared
// six times across the three cards. CSS hid one copy from users but crawlers
// read the markup — that is the "duplicate testimonials" the AdSense review
// flagged. Everything below is a single element with responsive classes.
export default function StoriesCard({ active, story }: { active: boolean; story: StoryItem }) {
  return (
    <div
      className={`relative shrink-0 w-[290px] h-[181px] md:w-auto md:h-auto ${active ? "md:min-h-[320px] xl:min-h-[362px]" : "md:min-h-[286px] xl:min-h-[317px]"} ${active ? "md:max-w-[420px] xl:max-w-[498px]" : "md:max-w-[320px] xl:max-w-[370px]"}
    ${active ? "bg-[#0E1629] md:bg-(--text-main)" : "bg-white"} rounded-[15px]
    p-[12px] md:p-0 md:py-7 xl:py-9 md:px-4 flex flex-col md:gap-5 xl:gap-[30px]
    `}
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex items-center gap-[10px] md:gap-4">
          <img
            loading="lazy"
            decoding="async"
            src={story.image}
            alt={story.name}
            className={`${
              active
                ? "w-[36px] h-[36px] md:h-[72px] md:w-[72px] xl:h-20 xl:w-20"
                : "w-[36px] h-[36px] md:w-[64px] md:h-[64px] xl:w-[75px] xl:h-[75px]"
            } rounded-full object-cover`}
          />

          <div className="flex flex-col">
            <h3
              className={`${
                active
                  ? "text-[16px] md:text-[24px] xl:text-[30px] text-white"
                  : "text-[16px] md:text-[20px] xl:text-[22.5px] text-[#0E1629] md:text-(--text-main)"
              } font-semibold leading-none md:leading-normal`}
            >
              {story.name}
            </h3>
            <p
              className={`${
                active
                  ? "text-white text-[12px] md:text-[17px] xl:text-[22px]"
                  : "text-[#6B7280] md:text-(--text-muted) text-[12px] md:text-[14px] xl:text-[15px]"
              } font-normal leading-none md:leading-normal mt-1 md:mt-0`}
            >
              {story.role}
            </p>
          </div>
        </div>

        <div className="mt-1 md:mt-0 flex items-center md:items-end gap-2">
          <RatingStars rating={story.rating} />
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col gap-2 md:gap-4 items-start md:items-center w-full">
        {story.headline ? (
          <p
            className={`${
              active
                ? "text-white text-[14px] md:text-[21px] xl:text-2xl"
                : "text-[#0E1629] md:text-(--text-main) text-[14px] md:text-[19px] xl:text-[22.5px]"
            } font-medium leading-none md:leading-normal text-left md:text-center`}
          >
            {story.headline}
          </p>
        ) : null}
        <p
          className={`${
            active
              ? "text-white text-[12px] md:text-[14px] xl:text-[1rem]"
              : "text-[#6B7280] md:text-(--text-muted) text-[12px] md:text-[13px] xl:text-sm"
          } font-normal leading-[1.3] md:leading-normal text-left md:text-center line-clamp-3 md:line-clamp-none`}
        >
          {story.text}
        </p>
      </div>
    </div>
  );
}
