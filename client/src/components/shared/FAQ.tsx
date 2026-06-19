/**
 * FAQ accordion shared between Home and city landing pages.
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackPhoneClicked } from "@/lib/analytics";

const FAQS = [
  {
    q: "Will I get a fair price?",
    a: "Our offers are based on real comparable sales data and current market conditions — not a formula designed to lowball you. We're transparent about how we arrive at our number, and we'll walk you through it. Our goal is a deal that works for both of us.",
  },
  {
    q: "What if my house needs work?",
    a: "That's exactly why sellers come to us. We buy homes in any condition — foundation issues, outdated kitchens, deferred maintenance, fire damage, you name it. You don't fix a thing. We handle it after closing.",
  },
  {
    q: "How is this different from using a realtor?",
    a: "A realtor lists your home and waits for a buyer — which can take months, requires repairs and showings, and costs 5–6% in commissions. We buy directly, close fast, and charge zero fees. The tradeoff is our offer may be slightly below full retail — but many sellers find the certainty and savings more than make up for it.",
  },
  {
    q: "Are you investors or flippers?",
    a: "We're a local real estate investment company. We buy homes, renovate them, and either resell or hold them as rentals. We're transparent about this — we're not pretending to be something we're not. What we offer is speed, certainty, and zero hassle.",
  },
  {
    q: "What if I owe more than the house is worth?",
    a: "We can still help. We have experience with short sales and can work with your lender directly. Give us a call and we'll talk through your specific situation — there's no obligation.",
  },
  {
    q: "How fast can we close?",
    a: "As fast as 7 days from the time you accept our offer, depending on title work in your county. Most closings happen within 10–21 days. If you need more time, we can accommodate up to 30 days or more.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-[#F7F5F0]">
      <div className="container">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
          <div className="reveal">
            <span className="green-rule" />
            <span className="section-label">FAQ</span>
            <h2
              className="text-[#3D4145] mt-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.15,
              }}
            >
              Common
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>questions.</em>
            </h2>
            <p className="text-[#3D4145]/60 text-sm leading-relaxed font-light mt-4">
              Still have questions? Call us directly at{" "}
              <a
                href="tel:3854880220"
                onClick={() => trackPhoneClicked("faq")}
                className="text-[#2D6A3F] underline underline-offset-2"
              >
                (385) 488-0220
              </a>
              .
            </p>
          </div>

          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <Accordion type="single" collapsible className="space-y-0">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b border-[#3D4145]/10 last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-[#3D4145] font-medium py-5 hover:no-underline hover:text-[#2D6A3F] transition-colors text-sm [&>svg]:text-[#2D6A3F]">
                    <span style={{ fontFamily: "'Outfit', sans-serif" }}>{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#3D4145]/65 text-sm leading-relaxed font-light pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
