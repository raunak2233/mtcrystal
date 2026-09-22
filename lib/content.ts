/**
 * Static marketing copy that is not admin-managed. Kept in one module so the
 * same lists feed both the rendered sections and the structured data, and so a
 * future admin screen only has to replace this one source.
 */

export type ServiceCity = {
  name: string;
  region: string;
  /** Indicative door delivery window, shown as a reassurance not a promise. */
  eta: string;
};

/**
 * Delivery coverage highlights. Shipping is pan-India; these are the metros we
 * call out because they are where most orders come from.
 */
export const SERVICE_CITIES: ServiceCity[] = [
  { name: "Delhi NCR", region: "Delhi, Noida, Gurugram, Ghaziabad", eta: "1-3 days" },
  { name: "Mumbai", region: "Maharashtra", eta: "2-4 days" },
  { name: "Bengaluru", region: "Karnataka", eta: "2-4 days" },
  { name: "Hyderabad", region: "Telangana", eta: "2-4 days" },
  { name: "Chennai", region: "Tamil Nadu", eta: "3-5 days" },
  { name: "Pune", region: "Maharashtra", eta: "2-4 days" },
  { name: "Kolkata", region: "West Bengal", eta: "3-5 days" },
  { name: "Ahmedabad", region: "Gujarat", eta: "2-4 days" },
  { name: "Jaipur", region: "Rajasthan", eta: "2-4 days" },
  { name: "Lucknow", region: "Uttar Pradesh", eta: "2-4 days" },
  { name: "Chandigarh", region: "Punjab & Haryana", eta: "2-4 days" },
  { name: "Indore", region: "Madhya Pradesh", eta: "3-5 days" },
];

export type Faq = { question: string; answer: string };

export const GENERAL_FAQS: Faq[] = [
  {
    question: "Are MT Crystals bracelets made with real gemstones?",
    answer:
      "Yes. Every bracelet is strung with 100% natural gemstone beads, sourced from trusted Indian suppliers and checked for authenticity before we string them. We never use dyed glass or plastic imitations.",
  },
  {
    question: "How do I choose the right crystal for me?",
    answer:
      "Start with your intention rather than the stone. Browse by what you want to invite in - calm, love, protection, confidence or prosperity - and pick the bracelet you feel drawn to. If you are unsure, message us and we will suggest a combination.",
  },
  {
    question: "What is the right bracelet size?",
    answer:
      "Our bracelets are strung on a strong elastic cord and comfortably fit wrists between 6 and 7.5 inches. Measure your wrist with a tape or a strip of paper and add roughly half an inch for a relaxed fit. Custom sizes can be requested on WhatsApp.",
  },
  {
    question: "Are the crystals cleansed and energised before dispatch?",
    answer:
      "Yes. Each bracelet is cleansed and charged before it is packed, so it reaches you ready to wear. A simple care card with cleansing instructions is included in every order.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "We deliver to every serviceable PIN code in India. Metro cities usually receive orders in 2-4 working days, and other locations in 4-7 working days. Tracking details are shared as soon as your parcel leaves us.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "You can pay securely with UPI, credit and debit cards, net banking and popular wallets through Razorpay. Cash on delivery is available on serviceable PIN codes.",
  },
  {
    question: "Can I return or exchange a bracelet?",
    answer:
      "If a bracelet arrives damaged or is not what you ordered, write to us within 48 hours of delivery with an unboxing photo and we will replace it. Because crystals are personal items, used bracelets cannot be returned.",
  },
  {
    question: "How should I care for my crystal bracelet?",
    answer:
      "Keep it away from perfume, chlorine and harsh soap, and take it off before swimming or bathing. Cleanse it once a month under moonlight or with sound, and store it in the pouch it arrived in.",
  },
];

export const PRODUCT_FAQS: Faq[] = [
  {
    question: "How long does delivery take?",
    answer:
      "Orders are dispatched within 24-48 hours. Metro cities usually receive them in 2-4 working days and other PIN codes in 4-7 working days.",
  },
  {
    question: "Is cash on delivery available?",
    answer:
      "Yes, cash on delivery is available on serviceable PIN codes across India, along with UPI, cards and net banking through our secure Razorpay checkout.",
  },
  {
    question: "Will the bracelet look exactly like the photo?",
    answer:
      "Every stone is natural, so shade, banding and inclusions vary slightly from bead to bead. Your bracelet will match the listing in stone type and size, with its own unique character.",
  },
  {
    question: "Can I wear more than one crystal bracelet together?",
    answer:
      "Yes. Most of our crystals stack well - for example rose quartz with amethyst for calm and compassion. Avoid pairing several high-energy stones if you are new to crystals.",
  },
];

export type CrystalStep = {
  title: string;
  description: string;
};

export const RITUAL_STEPS: CrystalStep[] = [
  {
    title: "Set your intention",
    description:
      "Hold the bracelet, take a slow breath and name what you want to invite in. Intention is what turns a beautiful bead into a daily reminder.",
  },
  {
    title: "Wear it daily",
    description:
      "Wear it on your left wrist to receive energy and on the right to project it outward. Consistency matters far more than duration.",
  },
  {
    title: "Cleanse every month",
    description:
      "Leave it under moonlight overnight, rest it on a selenite plate, or pass it through incense smoke to clear what it has absorbed.",
  },
  {
    title: "Recharge and reset",
    description:
      "Once cleansed, restate your intention. If your goal has changed, switch to a crystal that matches where you are now.",
  },
];
