import { getSliders } from "@/services";
import { Suspense } from "react";
import SliderClient from "./SliderClient";
import SliderSkeleton from "./SliderSkeleton";

export default function Slider() {
  return (
    <Suspense fallback={<SliderSkeleton />}>
      <SliderServer />
    </Suspense>
  );
}

async function SliderServer() {
  try {
    const sliders = await getSliders();
    if (!sliders || sliders.length === 0) {
      return <SliderSkeleton />;
    }
    return <SliderClient sliders={sliders} />;
  } catch {
    return <SliderSkeleton />;
  }
}
