import benefits from "@/data/benefits.json";

/**
 * Every editable piece of text on the storefront.
 *
 * The values here are the defaults that ship with the site. The admin panel
 * shows these labels and lets the client overwrite the text; only the changed
 * values are stored in the `site_texts` table, so deleting a row (or the whole
 * table) simply falls back to the copy below.
 *
 * Keep keys stable: they are the database primary key.
 */

export type ContentField = {
  key: string;
  label: string;
  value: string;
  /** Render a textarea instead of a single-line input. */
  multiline?: boolean;
  hint?: string;
};

export type ContentGroup = {
  id: string;
  title: string;
  description: string;
  fields: ContentField[];
};

const field = (
  key: string,
  label: string,
  value: string,
  options: { multiline?: boolean; hint?: string } = {}
): ContentField => ({ key, label, value, ...options });

const trustFields: ContentField[] = [
  field("shared.trust.1.title", "Trust item 1 - heading", "100% Natural Stones"),
  field(
    "shared.trust.1.description",
    "Trust item 1 - text",
    "Authentic gemstones, never dyed glass or plastic lookalikes.",
    { multiline: true }
  ),
  field("shared.trust.2.title", "Trust item 2 - heading", "Cleansed & Energised"),
  field(
    "shared.trust.2.description",
    "Trust item 2 - text",
    "Every bracelet is charged before it is packed and shipped.",
    { multiline: true }
  ),
  field("shared.trust.3.title", "Trust item 3 - heading", "Pan-India Delivery"),
  field(
    "shared.trust.3.description",
    "Trust item 3 - text",
    "Free shipping above Rs. 999, tracked door-to-door.",
    { multiline: true }
  ),
  field("shared.trust.4.title", "Trust item 4 - heading", "Secure Payments"),
  field(
    "shared.trust.4.description",
    "Trust item 4 - text",
    "UPI, cards, net banking and COD via encrypted checkout.",
    { multiline: true }
  ),
  field("shared.trust.5.title", "Trust item 5 - heading", "Easy Replacement"),
  field(
    "shared.trust.5.description",
    "Trust item 5 - text",
    "Damaged in transit? We replace it within 48 hours.",
    { multiline: true }
  ),
  field("shared.trust.6.title", "Trust item 6 - heading", "Guidance Included"),
  field(
    "shared.trust.6.description",
    "Trust item 6 - text",
    "Not sure which crystal? Talk to us before you buy.",
    { multiline: true }
  ),
];

const statFields: ContentField[] = [
  field("shared.stats.1.value", "Stat 1 - number", "2017"),
  field("shared.stats.1.label", "Stat 1 - label", "Crafting since"),
  field("shared.stats.2.value", "Stat 2 - number", "12,000+"),
  field("shared.stats.2.label", "Stat 2 - label", "Bracelets delivered"),
  field("shared.stats.3.value", "Stat 3 - number", "4.8/5"),
  field("shared.stats.3.label", "Stat 3 - label", "Average rating"),
  field("shared.stats.4.value", "Stat 4 - number", "100%"),
  field("shared.stats.4.label", "Stat 4 - label", "Natural gemstones"),
];

const ritualFields: ContentField[] = [
  field("shared.ritual.eyebrow", "Small heading above the title", "Your Crystal Ritual"),
  field(
    "shared.ritual.title",
    "Section heading",
    "Four small habits that keep your crystal working"
  ),
  field(
    "shared.ritual.subtitle",
    "Section description",
    "A bracelet is a daily reminder of an intention. Here is how our customers get the most out of theirs.",
    { multiline: true }
  ),
  field("shared.ritual.step1.title", "Step 1 - heading", "Set your intention"),
  field(
    "shared.ritual.step1.description",
    "Step 1 - text",
    "Hold the bracelet, take a slow breath and name what you want to invite in. Intention is what turns a beautiful bead into a daily reminder.",
    { multiline: true }
  ),
  field("shared.ritual.step2.title", "Step 2 - heading", "Wear it daily"),
  field(
    "shared.ritual.step2.description",
    "Step 2 - text",
    "Wear it on your left wrist to receive energy and on the right to project it outward. Consistency matters far more than duration.",
    { multiline: true }
  ),
  field("shared.ritual.step3.title", "Step 3 - heading", "Cleanse every month"),
  field(
    "shared.ritual.step3.description",
    "Step 3 - text",
    "Leave it under moonlight overnight, rest it on a selenite plate, or pass it through incense smoke to clear what it has absorbed.",
    { multiline: true }
  ),
  field("shared.ritual.step4.title", "Step 4 - heading", "Recharge and reset"),
  field(
    "shared.ritual.step4.description",
    "Step 4 - text",
    "Once cleansed, restate your intention. If your goal has changed, switch to a crystal that matches where you are now.",
    { multiline: true }
  ),
];

const cityFields: ContentField[] = [
  field("shared.cities.eyebrow", "Small heading above the title", "Delivering Nationwide"),
  field("shared.cities.title", "Section heading", "We ship crystals across India"),
  field(
    "shared.cities.subtitle",
    "Section description",
    "From Delhi NCR to Chennai, your bracelet is packed with care, cleansed before dispatch and tracked all the way to your door.",
    { multiline: true }
  ),
  field("shared.cities.highlight1.label", "Highlight 1 - heading", "Dispatched in 24-48 hrs"),
  field(
    "shared.cities.highlight1.detail",
    "Highlight 1 - text",
    "Packed and shipped on working days"
  ),
  field("shared.cities.highlight2.label", "Highlight 2 - heading", "Free above Rs. 999"),
  field("shared.cities.highlight2.detail", "Highlight 2 - text", "Tracked courier, door delivery"),
  field(
    "shared.cities.highlight3.label",
    "Highlight 3 - heading",
    "Every serviceable PIN code"
  ),
  field("shared.cities.highlight3.detail", "Highlight 3 - text", "Metros, tier-2 towns and beyond"),
  field(
    "shared.cities.note",
    "Line under the city list",
    "Don't see your city? We deliver to every serviceable PIN code in India.",
    { multiline: true }
  ),
  field("shared.cities.link", "Link text after that line", "Check your pincode with us"),
];

const guidanceFields: ContentField[] = [
  field("shared.guidance.eyebrow", "Small heading above the title", "Not sure where to start?"),
  field(
    "shared.guidance.title",
    "Section heading",
    "Tell us what you need, we'll pick the crystal"
  ),
  field(
    "shared.guidance.subtitle",
    "Section description",
    "Share what you are working through - sleep, focus, anxiety, money blocks or a fresh start - and we will suggest a bracelet or a combination that fits. No pressure to buy.",
    { multiline: true }
  ),
  field("shared.guidance.primaryButton", "Main button text", "Get a recommendation"),
  field("shared.guidance.secondaryButton", "Second button text", "Browse the collection"),
  field("shared.guidance.whatsappTitle", "WhatsApp card - heading", "Chat on WhatsApp"),
  field("shared.guidance.whatsappNote", "WhatsApp card - text", "Fastest way to reach us"),
  field("shared.guidance.phoneNote", "Phone card - text", "Mon-Sat, 10am - 6pm IST"),
  field("shared.guidance.emailNote", "Email card - text", "We reply within a day"),
];

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    id: "home",
    title: "Home Page",
    description: "The headings and story text on the homepage.",
    fields: [
      field("home.showcase.eyebrow", "Shop-by-intention - small heading", "Shop By Intention"),
      field(
        "home.showcase.title",
        "Shop-by-intention - heading",
        "Find the crystal for what you need right now"
      ),
      field(
        "home.showcase.subtitle",
        "Shop-by-intention - description",
        "Calm, courage, love, protection or abundance - start with the feeling you want more of and we will point you to the stone.",
        { multiline: true }
      ),
      field("home.showcase.action", "Shop-by-intention - link text", "Browse everything"),

      field("home.bestSellers.eyebrow", "Best sellers - small heading", "Loved The Most"),
      field("home.bestSellers.title", "Best sellers - heading", "Best sellers"),
      field(
        "home.bestSellers.subtitle",
        "Best sellers - description",
        "The bracelets our customers keep coming back for, and gifting on.",
        { multiline: true }
      ),
      field("home.bestSellers.action", "Best sellers - link text", "See all best sellers"),
      field("home.bestSellers.button", "Best sellers - button text", "Shop all products"),

      field("home.newArrivals.eyebrow", "New arrivals - small heading", "Just In"),
      field("home.newArrivals.title", "New arrivals - heading", "New arrivals"),
      field(
        "home.newArrivals.subtitle",
        "New arrivals - description",
        "Fresh designs strung this month, in limited quantities.",
        { multiline: true }
      ),
      field("home.newArrivals.action", "New arrivals - link text", "View the full catalogue"),

      field("home.story.eyebrow", "Story - small heading", "Our Story"),
      field(
        "home.story.title",
        "Story - heading",
        "Handcrafted in India, worn every day"
      ),
      field(
        "home.story.paragraph1",
        "Story - first paragraph",
        "Since 2017, MT Crystals has been dedicated to bringing the ancient wisdom of crystal healing to modern life. Each bracelet is handcrafted with genuine gemstones, carefully selected for their unique properties and beauty.",
        { multiline: true }
      ),
      field(
        "home.story.paragraph2",
        "Story - second paragraph",
        "We believe in the transformative power of crystals to enhance well-being, promote positive energy, and support your journey toward balance and harmony.",
        { multiline: true }
      ),
      field("home.story.tile1.title", "Story tile 1 - heading", "Handcrafted"),
      field("home.story.tile1.copy", "Story tile 1 - text", "Strung by hand, one at a time"),
      field("home.story.tile2.title", "Story tile 2 - heading", "Authentic"),
      field("home.story.tile2.copy", "Story tile 2 - text", "100% genuine gemstones"),
      field("home.story.tile3.title", "Story tile 3 - heading", "Energised"),
      field("home.story.tile3.copy", "Story tile 3 - text", "Cleansed and charged"),
      field("home.story.tile4.title", "Story tile 4 - heading", "Quality"),
      field("home.story.tile4.copy", "Story tile 4 - text", "Premium beads and cord"),
      field("home.story.button", "Story - button text", "Read our story"),

      field("home.testimonials.eyebrow", "Reviews - small heading", "Real Stories"),
      field("home.testimonials.title", "Reviews - heading", "What our customers say"),
      field(
        "home.testimonials.subtitle",
        "Reviews - description",
        "Unedited words from people wearing our crystals every day.",
        { multiline: true }
      ),
      field("home.testimonials.button", "Reviews - button text", "Read more reviews"),

      field("home.promise.eyebrow", "Promise band - small heading", "The MT Crystals Promise"),
      field("home.promise.title", "Promise band - heading", "Why thousands of wrists trust us"),
      field(
        "home.promise.subtitle",
        "Promise band - description",
        "Sourcing, energising, packing and after-sales - the parts that are easy to cut corners on are the parts we don't.",
        { multiline: true }
      ),

      field("home.faq.eyebrow", "FAQ - small heading", "Good to know"),
      field("home.faq.title", "FAQ - heading", "Frequently asked questions"),
      field(
        "home.faq.subtitle",
        "FAQ - description",
        "Sizing, shipping, authenticity and care - answered.",
        { multiline: true }
      ),
    ],
  },
  {
    id: "about",
    title: "About Page",
    description: "The story, values and closing call-to-action on the About page.",
    fields: [
      field("about.hero.title", "Top banner - heading", "Our Story"),
      field(
        "about.hero.subtitle",
        "Top banner - description",
        "Bringing the healing power of crystals to people around the world since 2017",
        { multiline: true }
      ),
      field("about.mission.title", "Mission - heading", "Our Mission"),
      field(
        "about.mission.paragraph1",
        "Mission - first paragraph",
        "At Miracle Touch Crystals, our mission is to create high-quality crystal bracelets that not only look beautiful but also serve as powerful tools for personal growth, healing, and transformation. We believe that everyone deserves to experience the benefits of crystal energy in their daily lives.",
        { multiline: true }
      ),
      field(
        "about.mission.paragraph2",
        "Mission - second paragraph",
        "Founded in 2017, MT Crystals has grown from a small passion project into a beloved brand trusted by thousands of customers worldwide. Each bracelet is handcrafted with genuine gemstones, carefully selected for their unique properties and beauty.",
        { multiline: true }
      ),
      field("about.values.title", "Values - heading", "Our Values"),
      field("about.values.1.title", "Value 1 - heading", "Handcrafted with Love"),
      field(
        "about.values.1.copy",
        "Value 1 - text",
        "Every bracelet is carefully handcrafted with intention and care, ensuring the natural energy of the crystals is preserved.",
        { multiline: true }
      ),
      field("about.values.2.title", "Value 2 - heading", "100% Authentic"),
      field(
        "about.values.2.copy",
        "Value 2 - text",
        "We use only genuine, high-quality crystals and materials. No synthetic or fake stones, ever.",
        { multiline: true }
      ),
      field("about.values.3.title", "Value 3 - heading", "Energetically Cleansed"),
      field(
        "about.values.3.copy",
        "Value 3 - text",
        "All crystals are cleansed and charged before shipping to ensure they arrive with positive, pure energy.",
        { multiline: true }
      ),
      field("about.values.4.title", "Value 4 - heading", "Premium Quality"),
      field(
        "about.values.4.copy",
        "Value 4 - text",
        "We maintain the highest standards of craftsmanship and quality in every piece we create.",
        { multiline: true }
      ),
      field("about.values.5.title", "Value 5 - heading", "Community Focused"),
      field(
        "about.values.5.copy",
        "Value 5 - text",
        "We foster a supportive community of crystal enthusiasts who share experiences and inspire each other.",
        { multiline: true }
      ),
      field("about.values.6.title", "Value 6 - heading", "Customer Satisfaction"),
      field(
        "about.values.6.copy",
        "Value 6 - text",
        "Your happiness is our priority. We stand behind every product with excellent customer service.",
        { multiline: true }
      ),
      field("about.journey.title", "Journey - heading", "The Journey"),
      field(
        "about.journey.paragraph1",
        "Journey - first paragraph",
        "Miracle Touch Crystals was founded by a crystal enthusiast and holistic healer with over 15 years of experience in energy work. What began as a small passion project has grown into a beloved brand trusted by thousands of customers worldwide.",
        { multiline: true }
      ),
      field(
        "about.journey.paragraph2",
        "Journey - second paragraph",
        "The journey with crystals began during a challenging period when the founder discovered the healing properties of various stones. Amazed by their impact on well-being, she dedicated herself to studying crystal healing and eventually started creating handcrafted crystal bracelets for friends and family.",
        { multiline: true }
      ),
      field(
        "about.journey.paragraph3",
        "Journey - third paragraph",
        "The positive feedback was overwhelming, and she realized she could help more people by sharing her creations with a wider audience. Thus, MT Crystals was born with a mission to bring the healing power of crystals to everyone seeking balance and positive energy in their lives.",
        { multiline: true }
      ),
      field("about.why.title", "Why choose - heading", "Why Choose MT Crystals?"),
      field(
        "about.why.item1",
        "Why choose - point 1",
        "Ethically sourced crystals from trusted suppliers"
      ),
      field("about.why.item2", "Why choose - point 2", "Sustainable and eco-friendly packaging"),
      field(
        "about.why.item3",
        "Why choose - point 3",
        "Expert knowledge and guidance on crystal properties"
      ),
      field("about.why.item4", "Why choose - point 4", "Fast and secure shipping worldwide"),
      field("about.why.item5", "Why choose - point 5", "30-day satisfaction guarantee"),
      field(
        "about.cta.title",
        "Closing band - heading",
        "Ready to Start Your Crystal Journey?"
      ),
      field(
        "about.cta.subtitle",
        "Closing band - description",
        "Explore our collection and find the perfect crystal bracelet for your needs",
        { multiline: true }
      ),
      field("about.cta.button", "Closing band - button text", "Shop Now"),
    ],
  },
  {
    id: "benefits",
    title: "Benefits Page",
    description: "The heading and the crystal-by-crystal cards on the Benefits page.",
    fields: [
      field("benefits.hero.title", "Top banner - heading", "Crystal Healing Benefits"),
      field(
        "benefits.hero.subtitle",
        "Top banner - description",
        "Discover the ancient wisdom and modern science behind crystal healing. Each crystal carries unique properties to support your well-being.",
        { multiline: true }
      ),
      ...benefits.flatMap((benefit) => [
        field(`benefits.card.${benefit.id}.title`, `${benefit.title} - heading`, benefit.title),
        field(
          `benefits.card.${benefit.id}.description`,
          `${benefit.title} - text`,
          benefit.description,
          { multiline: true }
        ),
      ]),
      field(
        "benefits.cta.title",
        "Closing band - heading",
        "Ready to Experience the Benefits?"
      ),
      field(
        "benefits.cta.subtitle",
        "Closing band - description",
        "Explore our collection of handcrafted crystal bracelets and find the perfect match for your needs.",
        { multiline: true }
      ),
      field("benefits.cta.button", "Closing band - button text", "Shop Crystal Bracelets"),
    ],
  },
  {
    id: "gallery",
    title: "Gallery Page",
    description: "The heading and description above the gallery photos.",
    fields: [
      field("gallery.hero.title", "Top banner - heading", "Our Gallery"),
      field(
        "gallery.hero.subtitle",
        "Top banner - description",
        "Explore our beautiful collection of crystal bracelets and see the craftsmanship that goes into each piece.",
        { multiline: true }
      ),
    ],
  },
  {
    id: "category",
    title: "Category Page",
    description:
      "Text shared by every category page. Use {name} for the category name, {parent} for the parent category and {count} for the number of designs.",
    fields: [
      field("category.hero.eyebrow", "Small heading above the title", "Collection"),
      field(
        "category.hero.eyebrowParent",
        "Small heading above the title (inside a group)",
        "{parent} Collection",
        { hint: "{parent} becomes the parent category name." }
      ),
      field("category.hero.title", "Page heading", "{name} Crystal Bracelets", {
        hint: "{name} becomes the category name.",
      }),
      field(
        "category.hero.count",
        "Line under the description",
        "{designs} available - handcrafted, energised and shipped across India.",
        {
          multiline: true,
          hint:
            "The number is shown automatically in bold before this line. {designs} becomes design/designs.",
        }
      ),
      field("category.children.heading", "Sub-category heading", "Shop {name}", {
        hint: "{name} becomes the category name.",
      }),
      field("category.siblings.heading", "Sibling-category heading", "More in {parent}", {
        hint: "{parent} becomes the parent category name.",
      }),
      field("category.back", "Back button text", "Back to All Products"),
      field("category.empty.title", "Empty category - heading", "No products in {name} yet", {
        hint: "{name} becomes the category name.",
      }),
      field(
        "category.empty.body",
        "Empty category - text",
        "We are restocking this collection. Browse the rest of the catalogue, or tell us what you are looking for and we will let you know when it lands.",
        { multiline: true }
      ),
      field("category.empty.primary", "Empty category - first button", "View all products"),
      field("category.empty.secondary", "Empty category - second button", "Notify me"),
      field("category.trust.eyebrow", "Trust band - small heading", "Buy With Confidence"),
      field(
        "category.trust.title",
        "Trust band - heading",
        "What comes with every {name} bracelet",
        { hint: "{name} becomes the category name." }
      ),
      field(
        "category.trust.subtitle",
        "Trust band - description",
        "Authenticity, energising, packaging and after-sales support - included, not extra.",
        { multiline: true }
      ),
      field("category.faq.eyebrow", "FAQ - small heading", "Before You Order"),
      field("category.faq.title", "FAQ - heading", "Shipping, payment and sizing"),
    ],
  },
  {
    id: "header",
    title: "Header",
    description: "The logo text, menu labels and search boxes at the top of every page.",
    fields: [
      field("header.brand.name", "Logo name", "MT Crystals"),
      field("header.brand.tagline", "Logo tagline", "Miracle Touch"),
      field("header.menu.title", "Slide-out menu - heading", "Explore MT Crystals"),
      field(
        "header.menu.description",
        "Slide-out menu - description",
        "Browse collections, stories, and your account from one place.",
        { multiline: true }
      ),
      field("header.menu.categories", "Slide-out menu - category heading", "Shop By Category"),
      field("header.nav.home", "Menu link - Home", "Home"),
      field("header.nav.products", "Menu link - All Products", "All Products"),
      field("header.nav.gallery", "Menu link - Gallery", "Gallery"),
      field("header.nav.benefits", "Menu link - Benefits", "Benefits"),
      field("header.nav.testimonials", "Menu link - Testimonials", "Testimonials"),
      field("header.nav.about", "Menu link - About", "About"),
      field("header.nav.contact", "Menu link - Contact", "Contact"),
      field("header.account", "Account button", "Account"),
      field("header.myAccount", "Signed-in account link", "My Account"),
      field("header.login", "Login link", "Login / Signup"),
      field("header.admin", "Admin button", "Admin"),
      field("header.adminDashboard", "Admin menu link", "Admin Dashboard"),
      field(
        "header.search.desktop",
        "Search box - placeholder (desktop)",
        "Search for crystals, bracelets..."
      ),
      field("header.search.mobile", "Search box - placeholder (mobile)", "Search crystals..."),
    ],
  },
  {
    id: "footer",
    title: "Footer",
    description: "The column headings, links and copyright line at the bottom of every page.",
    fields: [
      field("footer.quickLinks", "Column heading - Quick Links", "Quick Links"),
      field("footer.link.home", "Quick link - Home", "Home"),
      field("footer.link.products", "Quick link - All Products", "All Products"),
      field("footer.link.benefits", "Quick link - Crystal Benefits", "Crystal Benefits"),
      field("footer.link.gallery", "Quick link - Gallery", "Gallery"),
      field("footer.link.about", "Quick link - About Us", "About Us"),
      field("footer.customerCare", "Column heading - Customer Care", "Customer Care"),
      field("footer.link.contact", "Care link - Contact Us", "Contact Us"),
      field("footer.link.testimonials", "Care link - Customer Reviews", "Customer Reviews"),
      field("footer.link.account", "Care link - My Account", "My Account"),
      field("footer.link.cart", "Care link - Shopping Cart", "Shopping Cart"),
      field("footer.intentions", "Column heading - Shop By Intention", "Shop By Intention"),
      field(
        "footer.deliveryHeading",
        "Delivery heading",
        "Crystal bracelet delivery across India"
      ),
      field(
        "footer.deliveryNote",
        "Delivery line after the city list",
        "and every other serviceable PIN code in India."
      ),
      field(
        "footer.copyright",
        "Copyright line (year is added automatically)",
        "MT Crystals - Miracle Touch Crystals. All rights reserved.",
        { multiline: true }
      ),
    ],
  },
  {
    id: "shared",
    title: "Shared Sections",
    description: "Bands that appear on the homepage, category pages and product pages.",
    fields: [...trustFields, ...statFields, ...ritualFields, ...cityFields, ...guidanceFields],
  },
];

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_GROUPS.flatMap((group) => group.fields.map((item) => [item.key, item.value]))
);

/** Replaces {name}-style placeholders in a stored line of text. */
export function fillTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match
  );
}
