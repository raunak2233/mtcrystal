import { BadgeCheck, Sparkles, Truck } from "lucide-react";

const MESSAGES = [
  { icon: Truck, text: "Free shipping across India on orders above Rs. 999" },
  { icon: BadgeCheck, text: "100% natural, lab-checked gemstones" },
  { icon: Sparkles, text: "Every bracelet cleansed & energised before dispatch" },
];

/**
 * Thin promise strip above the header. It cycles on phones (where only one
 * message fits) and shows all three side by side from `sm` up.
 */
export function AnnouncementBar() {
  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 text-white">
      <div className="container mx-auto hidden px-4 sm:block">
        <ul className="flex items-center justify-center gap-6 py-2 text-[11px] font-medium tracking-wide md:gap-10 md:text-xs">
          {MESSAGES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 shrink-0 text-purple-100" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex overflow-hidden py-2 sm:hidden">
        {/* Duplicated track so the marquee loops without a visible jump. */}
        <div className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 text-[11px] font-medium">
          {[...MESSAGES, ...MESSAGES].map(({ icon: Icon, text }, index) => (
            <span key={`${text}-${index}`} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 shrink-0 text-purple-100" aria-hidden="true" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
