import { useState, useEffect, useRef } from "react";
import type { FloatingIcon, FloatingProfile } from "@/lib/types";

const profiles = [
  "/avatars/1.svg",
  "/avatars/2.svg",
  "/avatars/3.svg",
  "/avatars/4.svg",
  "/avatars/5.svg",
  "/avatars/6.svg",
  "/avatars/7.svg",
  "/avatars/8.svg",
  "/avatars/9.svg",
  "/avatars/10.svg",
  "/avatars/11.svg",
];

const icons = [
  "/icons/1.svg",
  "/icons/2.svg",
  "/icons/3.svg",
  "/icons/4.svg",
  "/icons/5.svg",
  "/icons/6.svg",
  "/icons/7.svg",
  "/icons/8.svg",
  "/icons/9.svg",
  "/icons/10.svg",
];

const HEADER_HEIGHT = 80;
const DESIGN_WIDTH = 1444;
const DESIGN_HEIGHT = 592;

const profilePositions = [
  { x: 350, y: -30, size: 71 },
  { x: 66, y: 63, size: 72 },
  { x: 231, y: 167, size: 72 },
  { x: -15, y: 294, size: 81 },
  { x: 128, y: 416, size: 71 },
  { x: 332, y: 476, size: 96 }, // Avatar #6
  { x: 1014, y: 469, size: 69 },
  { x: 1198, y: 277, size: 64 },
  { x: 1071, y: 101, size: 75 },
  { x: 1311, y: 429, size: 93 },
  { x: 1350, y: 12, size: 103 },
];

const iconPositions = [
  { x: 168, y: 120, size: 50 },
  { x: 41, y: 208, size: 50 },
  { x: 203, y: 340, size: 30 },
  { x: 327, y: 402, size: 50 },
  { x: 87, y: 504, size: 30 },
  { x: 1092, y: 405, size: 48 },
  { x: 1251, y: 479, size: 50 },
  { x: 1368, y: 321, size: 40 },
  { x: 1275, y: 114, size: 50 },
  { x: 1147, y: 58, size: 40 },
];

const FloatingProfiles = () => {
  const [floatingProfiles, setFloatingProfiles] = useState<FloatingProfile[]>([]);
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update mouse position
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Recalculate positions on mount + resize
  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = rect.width / DESIGN_WIDTH;
      const scaleY = rect.height / DESIGN_HEIGHT;
      const scale = (scaleX + scaleY) / 2;

      const adjustedProfiles: FloatingProfile[] = profiles.map((profile, index) => {
        const pos = profilePositions[index];
        let size = pos.size * scale;

        // Slightly smaller on mobile
        if (window.innerWidth < 768) size *= 0.8;

        let baseY = pos.y * scaleY + HEADER_HEIGHT;
        // Clamp so it doesn't go below container
        if (baseY + size > rect.height) baseY = rect.height - size;

        return {
          id: index,
          image: profile,
          baseX: pos.x * scaleX,
          baseY,
          currentX: pos.x * scaleX,
          currentY: baseY,
          size,
        };
      });

      const adjustedIcons: FloatingIcon[] = icons.map((icon, index) => {
        const pos = iconPositions[index];
        let size = pos.size * scale;

        if (window.innerWidth < 768) size *= 0.8;

        let baseY = pos.y * scaleY + HEADER_HEIGHT;
        if (baseY + size > rect.height) baseY = rect.height - size;

        return {
          id: index,
          image: icon,
          baseX: pos.x * scaleX,
          baseY,
          currentX: pos.x * scaleX,
          currentY: baseY,
          size,
        };
      });

      setFloatingProfiles(adjustedProfiles);
      setFloatingIcons(adjustedIcons);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Update positions with mouse hover effect
  useEffect(() => {
    const updatePositions = () => {
      setFloatingProfiles((prev) =>
        prev.map((profile) => {
          const dx = mousePos.x - profile.baseX;
          const dy = mousePos.y - profile.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const moveX = (dx / distance) * force * 20;
            const moveY = (dy / distance) * force * 20;
            return { ...profile, currentX: profile.baseX + moveX, currentY: profile.baseY + moveY };
          }
          return {
            ...profile,
            currentX: profile.currentX + (profile.baseX - profile.currentX) * 0.1,
            currentY: profile.currentY + (profile.baseY - profile.currentY) * 0.1,
          };
        })
      );

      setFloatingIcons((prev) =>
        prev.map((icon) => {
          const dx = mousePos.x - icon.baseX;
          const dy = mousePos.y - icon.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const moveX = (dx / distance) * force * 15;
            const moveY = (dy / distance) * force * 15;
            return { ...icon, currentX: icon.baseX + moveX, currentY: icon.baseY + moveY };
          }
          return {
            ...icon,
            currentX: icon.currentX + (icon.baseX - icon.currentX) * 0.15,
            currentY: icon.currentY + (icon.baseY - icon.currentY) * 0.15,
          };
        })
      );
    };

    const interval = setInterval(updatePositions, 50);
    return () => clearInterval(interval);
  }, [mousePos]);

  return (
    <div ref={containerRef} className="absolute inset-0 top-[80px] pointer-events-none z-0">
      {floatingProfiles.map((profile) => (
        <div
          key={profile.id}
          className="absolute rounded-full border-4 border-white/50 shadow-md transition-all duration-300"
          style={{
            left: `${profile.currentX}px`,
            top: `${profile.currentY}px`,
            width: `${profile.size}px`,
            height: `${profile.size}px`,
            backgroundImage: `url(${profile.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {floatingIcons.map((icon) => (
        <div
          key={icon.id}
          className="absolute transition-all duration-300"
          style={{
            left: `${icon.currentX}px`,
            top: `${icon.currentY}px`,
            width: `${icon.size}px`,
            height: `${icon.size}px`,
            backgroundImage: `url(${icon.image})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingProfiles;
