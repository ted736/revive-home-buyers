import type { BlogPost } from "@/types/blog";
import sellHouseSlcWithoutRealtor from "./sell-house-fast-salt-lake-city-without-realtor";
import cashBuyersVsTraditional from "./cash-buyers-vs-traditional-listing-utah";
import sevenDayCashClose from "./7-day-cash-close-idaho";
import sellingInheritedMontana from "./selling-inherited-property-montana";
import utahForeclosure from "./utah-foreclosure-timeline-escape-paths";

export const BLOG_POSTS: BlogPost[] = [
  sellHouseSlcWithoutRealtor,
  cashBuyersVsTraditional,
  sevenDayCashClose,
  sellingInheritedMontana,
  utahForeclosure,
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
