
export type FloatingProfile ={
  id: number;
  image: string;
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  size: number;
}

export type FloatingIcon = {
  id: number;
  image: string;
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  size: number;
}

export type CatalogCardProps = {
  imageSrc: string;
  title: string;
  ctaLabel: string;
  badge: string;
  meta: string;
  submeta: string;
}

export type Counselor = {
  id: string; 
  name: string;
  description: string;
  experience: string;
  imageUrl: string;
  verified: boolean;
};