/**
 * Lead capture form — 3-step: address, contact, situation/timeline.
 * Extracted from Home.tsx so Home and CityPage can share a single instance.
 *
 * NOTE: This component intentionally mirrors the original Home.tsx LeadForm
 * implementation. A separate workstream is wiring Google Places autocomplete
 * into the address input — do not modify the form schema or behavior here
 * without coordinating.
 */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ArrowRight } from "lucide-react";

type LeadData = {
  address: string;
  name: string;
  phone: string;
  situation: string;
  timeline: string;
};

export default function LeadForm({ dark = false }: { dark?: boolean }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadData>>({});
  const [data, setData] = useState<LeadData>({
    address: "",
    name: "",
    phone: "",
    situation: "",
    timeline: "",
  });

  const set = (field: keyof LeadData, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep1 = () => {
    const e: Partial<LeadData> = {};
    if (!data.address.trim()) e.address = "Please enter your property address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<LeadData> = {};
    if (!data.name.trim()) e.name = "Please enter your name.";
    if (!data.phone.trim()) e.phone = "Please enter your phone number.";
    else if (!/^[\d\s().+\-]{7,}$/.test(data.phone)) e.phone = "Please enter a valid phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.situation || !data.timeline) {
      setErrors({
        situation: !data.situation ? "Please select your situation." : undefined,
        timeline: !data.timeline ? "Please select your timeline." : undefined,
      });
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = (field: keyof LeadData) =>
    `h-12 text-base rounded-none border-0 border-b-2 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full ${
      dark
        ? "border-white/50 text-white placeholder:text-white/60 focus:border-white"
        : "border-[#3D4145]/30 text-[#3D4145] placeholder:text-[#3D4145]/50 focus:border-[#2D6A3F]"
    } ${errors[field] ? "border-red-400" : ""}`;

  const labelClass = `text-xs font-semibold tracking-widest uppercase mb-1 block ${
    dark ? "text-white/60" : "text-[#3D4145]/50"
  }`;

  const errClass = "text-red-400 text-xs mt-1";

  const selectTriggerClass = `h-12 rounded-none border-0 border-b-2 bg-transparent focus:ring-0 w-full text-sm ${
    dark
      ? "border-white/50 text-white focus:border-white"
      : "border-[#3D4145]/30 text-[#3D4145] focus:border-[#2D6A3F]"
  }`;

  if (submitted) {
    return (
      <div className={`py-6 max-w-xl ${dark ? "text-white" : "text-[#3D4145]"}`}>
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="text-[#2D6A3F] w-7 h-7 flex-shrink-0" />
          <h3 className="font-semibold text-lg">You're all set, {data.name.split(" ")[0]}!</h3>
        </div>
        <p className={`text-sm leading-relaxed ${dark ? "text-white/70" : "text-[#3D4145]/65"}`}>
          We received your request for <strong>{data.address}</strong>. Expect a call from our team at{" "}
          <strong>{data.phone}</strong> within 24 hours with a no-obligation cash offer.
        </p>
      </div>
    );
  }

  const stepLabel = ["Property", "Contact", "Situation"];

  return (
    <div className="w-full max-w-xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                s < step
                  ? "bg-[#2D6A3F] text-white"
                  : s === step
                  ? dark
                    ? "bg-white text-[#3D4145]"
                    : "bg-[#3D4145] text-white"
                  : dark
                  ? "bg-white/20 text-white/40"
                  : "bg-[#3D4145]/15 text-[#3D4145]/40"
              }`}
            >
              {s < step ? <CheckCircle className="w-3.5 h-3.5" /> : s}
            </div>
            <span
              className={`text-xs tracking-wider uppercase ${
                s === step
                  ? dark
                    ? "text-white"
                    : "text-[#3D4145]"
                  : dark
                  ? "text-white/35"
                  : "text-[#3D4145]/35"
              }`}
            >
              {stepLabel[s - 1]}
            </span>
            {s < 3 && <div className={`w-6 h-px ${dark ? "bg-white/20" : "bg-[#3D4145]/15"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Property Address */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Property Address</label>
              <Input
                value={data.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="123 Main St, Salt Lake City, UT"
                className={inputClass("address")}
                autoFocus
              />
              {errors.address && <p className={errClass}>{errors.address}</p>}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="mt-2 flex items-center gap-2 h-12 px-8 bg-[#2D6A3F] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#1F4D2E] active:scale-[0.97] transition-all duration-150"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Contact Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Your Name</label>
              <Input
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="First and last name"
                className={inputClass("name")}
                autoFocus
              />
              {errors.name && <p className={errClass}>{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <Input
                value={data.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(801) 555-0100"
                type="tel"
                className={inputClass("phone")}
              />
              {errors.phone && <p className={errClass}>{errors.phone}</p>}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`h-12 px-6 text-sm font-semibold tracking-widest uppercase border transition-all duration-150 ${
                  dark
                    ? "border-white/30 text-white/70 hover:border-white hover:text-white"
                    : "border-[#3D4145]/30 text-[#3D4145]/60 hover:border-[#3D4145] hover:text-[#3D4145]"
                }`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 h-12 px-8 bg-[#2D6A3F] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#1F4D2E] active:scale-[0.97] transition-all duration-150"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Situation */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Why are you selling?</label>
              <Select value={data.situation} onValueChange={(v) => set("situation", v)}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select your situation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downsizing">Downsizing / Retirement</SelectItem>
                  <SelectItem value="relocation">Relocation / Job Change</SelectItem>
                  <SelectItem value="divorce">Divorce / Separation</SelectItem>
                  <SelectItem value="foreclosure">Facing Foreclosure</SelectItem>
                  <SelectItem value="inherited">Inherited Property</SelectItem>
                  <SelectItem value="repairs">Too Many Repairs</SelectItem>
                  <SelectItem value="financial">Financial Hardship</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.situation && <p className={errClass}>{errors.situation}</p>}
            </div>
            <div>
              <label className={labelClass}>How soon do you need to sell?</label>
              <Select value={data.timeline} onValueChange={(v) => set("timeline", v)}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select your timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">As soon as possible</SelectItem>
                  <SelectItem value="30days">Within 30 days</SelectItem>
                  <SelectItem value="60days">Within 60 days</SelectItem>
                  <SelectItem value="flexible">I'm flexible</SelectItem>
                  <SelectItem value="exploring">Just exploring options</SelectItem>
                </SelectContent>
              </Select>
              {errors.timeline && <p className={errClass}>{errors.timeline}</p>}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`h-12 px-6 text-sm font-semibold tracking-widest uppercase border transition-all duration-150 ${
                  dark
                    ? "border-white/30 text-white/70 hover:border-white hover:text-white"
                    : "border-[#3D4145]/30 text-[#3D4145]/60 hover:border-[#3D4145] hover:text-[#3D4145]"
                }`}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 h-12 px-8 bg-[#2D6A3F] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#1F4D2E] active:scale-[0.97] transition-all duration-150 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Get My Cash Offer"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
