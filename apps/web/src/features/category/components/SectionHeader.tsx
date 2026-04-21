import { manrope, public_sans } from "@/app/fonts";


interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  center?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  titleClassName = `${manrope.className} text-2xl sm:text-3xl text-black font-extrabold tracking-tight`,
  subtitleClassName = `${public_sans.className} text-gray-600 font-medium text-md md:text-lg lg:text-xl tracking-tight `,
  center = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-6 md:mb-8 mt-4 ${
        center ? "text-center" : ""
      }`}
    >
      <div
        className={`flex flex-col md:flex-row md:items-center font-extrabold ${manrope.className} ${
          center ? "md:justify-center" : "md:justify-between"
        } gap-1 md:gap-0`}
      >
        <h2 >
          <span className={titleClassName}>{title}</span>
        </h2>
        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
      </div>
    </div>
  );
}
