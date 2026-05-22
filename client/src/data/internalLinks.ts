/**
 * Bidirectional internal link map for SEO.
 * Cities link to relevant blog posts; blog posts link to relevant cities.
 */

export type InternalLink = {
  href: string;
  label: string;
  type: "city" | "blog";
};

// Blog posts that are relevant to each city slug
export const CITY_TO_BLOG: Record<string, InternalLink[]> = {
  "salt-lake-city-utah": [
    { href: "/blog/sell-house-fast-salt-lake-city-without-realtor", label: "How to sell your SLC home without a realtor", type: "blog" },
    { href: "/blog/cash-buyers-vs-traditional-listing-utah", label: "Cash buyers vs traditional listing: Utah cost comparison", type: "blog" },
    { href: "/blog/utah-foreclosure-timeline-escape-paths", label: "Utah foreclosure timeline + 3 escape paths", type: "blog" },
  ],
  "provo-utah": [
    { href: "/blog/cash-buyers-vs-traditional-listing-utah", label: "Cash buyers vs traditional listing: Utah cost comparison", type: "blog" },
    { href: "/blog/utah-foreclosure-timeline-escape-paths", label: "Utah foreclosure timeline + 3 escape paths", type: "blog" },
  ],
  "ogden-utah": [
    { href: "/blog/cash-buyers-vs-traditional-listing-utah", label: "Cash buyers vs traditional listing: Utah cost comparison", type: "blog" },
    { href: "/blog/utah-foreclosure-timeline-escape-paths", label: "Utah foreclosure timeline + 3 escape paths", type: "blog" },
  ],
  "logan-utah": [
    { href: "/blog/cash-buyers-vs-traditional-listing-utah", label: "Cash buyers vs traditional listing: Utah cost comparison", type: "blog" },
  ],
  "st-george-utah": [
    { href: "/blog/cash-buyers-vs-traditional-listing-utah", label: "Cash buyers vs traditional listing: Utah cost comparison", type: "blog" },
    { href: "/blog/utah-foreclosure-timeline-escape-paths", label: "Utah foreclosure timeline + 3 escape paths", type: "blog" },
  ],
  "idaho-falls-idaho": [
    { href: "/blog/7-day-cash-close-idaho", label: "What to expect from a 7-day cash close in Idaho", type: "blog" },
  ],
  "pocatello-idaho": [
    { href: "/blog/7-day-cash-close-idaho", label: "What to expect from a 7-day cash close in Idaho", type: "blog" },
  ],
  "twin-falls-idaho": [
    { href: "/blog/7-day-cash-close-idaho", label: "What to expect from a 7-day cash close in Idaho", type: "blog" },
  ],
  "burley-idaho": [
    { href: "/blog/7-day-cash-close-idaho", label: "What to expect from a 7-day cash close in Idaho", type: "blog" },
  ],
  "rexburg-idaho": [
    { href: "/blog/7-day-cash-close-idaho", label: "What to expect from a 7-day cash close in Idaho", type: "blog" },
  ],
  "boise-idaho": [
    { href: "/blog/7-day-cash-close-idaho", label: "What to expect from a 7-day cash close in Idaho", type: "blog" },
  ],
  "billings-montana": [
    { href: "/blog/selling-inherited-property-montana", label: "Selling an inherited property in Montana: 4 options compared", type: "blog" },
  ],
  "missoula-montana": [
    { href: "/blog/selling-inherited-property-montana", label: "Selling an inherited property in Montana: 4 options compared", type: "blog" },
  ],
  "great-falls-montana": [
    { href: "/blog/selling-inherited-property-montana", label: "Selling an inherited property in Montana: 4 options compared", type: "blog" },
  ],
};

// City pages that are relevant to each blog post slug
export const BLOG_TO_CITY: Record<string, InternalLink[]> = {
  "sell-house-fast-salt-lake-city-without-realtor": [
    { href: "/sell-my-house-fast-salt-lake-city-utah", label: "Sell my house fast Salt Lake City, UT", type: "city" },
    { href: "/sell-my-house-fast-provo-utah", label: "Sell my house fast Provo, UT", type: "city" },
    { href: "/sell-my-house-fast-ogden-utah", label: "Sell my house fast Ogden, UT", type: "city" },
  ],
  "cash-buyers-vs-traditional-listing-utah": [
    { href: "/sell-my-house-fast-salt-lake-city-utah", label: "Sell my house fast Salt Lake City, UT", type: "city" },
    { href: "/sell-my-house-fast-provo-utah", label: "Sell my house fast Provo, UT", type: "city" },
    { href: "/sell-my-house-fast-st-george-utah", label: "Sell my house fast St. George, UT", type: "city" },
  ],
  "7-day-cash-close-idaho": [
    { href: "/sell-my-house-fast-idaho-falls-idaho", label: "Sell my house fast Idaho Falls, ID", type: "city" },
    { href: "/sell-my-house-fast-boise-idaho", label: "Sell my house fast Boise, ID", type: "city" },
    { href: "/sell-my-house-fast-twin-falls-idaho", label: "Sell my house fast Twin Falls, ID", type: "city" },
  ],
  "selling-inherited-property-montana": [
    { href: "/sell-my-house-fast-billings-montana", label: "Sell my house fast Billings, MT", type: "city" },
    { href: "/sell-my-house-fast-missoula-montana", label: "Sell my house fast Missoula, MT", type: "city" },
    { href: "/sell-my-house-fast-great-falls-montana", label: "Sell my house fast Great Falls, MT", type: "city" },
  ],
  "utah-foreclosure-timeline-escape-paths": [
    { href: "/sell-my-house-fast-salt-lake-city-utah", label: "Sell my house fast Salt Lake City, UT", type: "city" },
    { href: "/sell-my-house-fast-provo-utah", label: "Sell my house fast Provo, UT", type: "city" },
    { href: "/sell-my-house-fast-ogden-utah", label: "Sell my house fast Ogden, UT", type: "city" },
  ],
};
