export interface SliderImage {
  id: string;
  imageUrl: string;
  internalLink: string;
  isActive: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export interface Slider {
  id: string;
  name: string;
  images: SliderImage[];
  isActive: boolean;
}
