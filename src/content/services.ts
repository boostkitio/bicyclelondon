import type { ServiceContent } from "@/components/page/service-page";

export const services: Record<string, ServiceContent> = {
  bicycle: {
    eyebrow: "Meet Bicycle",
    title: "Our ecosystem",
    logo: "/images/logo-bicycle-white.png",
    heroImage: "/images/heroes/bicycle.jpg",
    featureImage: "/images/feature-bicycle.jpg",
    lead: [
      "Our ecosystem is free from muscle memory and typical legacy-driven thinking.",
      "We don’t have to do everything for every client. Put simply: if we’re your media agency, you get our industry-leading creativity built in. If we’re your creative agency, you get proper media thinking woven into the work. But when it all comes together, something special happens.",
    ],
    sections: [
      {
        heading: "You don’t need to buy everything from us to get world-class integration",
        body: [
          "Media planning and buying is in our DNA, but we like to think of ourselves as ‘the newest version of the oldest model’. We provide integrated solutions for the modern media world, traversing brand & performance and creative & media, driving sustainable growth for our clients.",
        ],
      },
    ],
  },

  blade: {
    eyebrow: "Performance consultancy",
    title: "Meet Blade",
    logo: "/images/logo-blade.png",
    heroImage: "/images/heroes/blade.jpg",
    featureImage: "/images/feature-blade.jpg",
    lead: [
      "Blade is our specialised unit that redefines traditional performance marketing. Creatively and data-driven.",
    ],
    points: [
      {
        title: "People over ‘users’",
        body: "We see people as people, a community not a commodity. We treat media as a creative, cultural force, pioneering qual and data techniques to understand how and why people really experience media today.",
      },
      {
        title: "Data at both ends",
        body: "Data smarts run through our business like a stick of rock. We use it at ‘both ends’: big data feeding our upstream strategy, alongside data engineers automating and sharpening the biddable buying process.",
      },
      {
        title: "Naturally brand x performance",
        body: "We reject the idea of a linear customer journey in favour of messy, real-world experiences. Creatively and data-driven.",
      },
    ],
    badges: [
      { src: "/images/badges/google-partner.jpg", alt: "Google Partner" },
      { src: "/images/badges/meta-certified.png", alt: "Meta Certified Company" },
      { src: "/images/badges/tiktok.jpg", alt: "TikTok Creative Exchange" },
      { src: "/images/badges/amazon-ads.png", alt: "Amazon Ads Verified Partner" },
    ],
    sections: [
      {
        heading: "Certified across the platforms that matter",
        body: [
          "Google Partner, Meta Certified, TikTok Creative Exchange advertiser and Amazon Ads Verified Partner. The credentials behind the performance.",
        ],
      },
    ],
  },

  studio: {
    eyebrow: "Creative studio",
    title: "Meet Studio",
    logo: "/images/logo-studio.png",
    heroImage: "/images/heroes/studio.jpg",
    featureImage: "/images/feature-studio.jpg",
    lead: [
      "We provide our clients with a cohesive suite of creative solutions, from brand to performance, online to offline, and everything in between.",
      "Bicycle Studio is a direct response to our clients’ growing need for the rapid development of creative assets that align with increasingly complex media plans. We streamline the process, ensuring creative output is innovative and perfectly synchronised with strategic media objectives.",
    ],
    points: [
      { title: "Brand & creative strategy", body: "Brand and creative platforms and strategy that give the work a foundation." },
      { title: "Concepting & delivery", body: "Creative concepting and delivery that turns strategy into ideas." },
      { title: "Actionable creative", body: "Creative built for the realities of the media plan." },
      { title: "Production & delivery", body: "Production and delivery that ships, fast." },
    ],
  },

  ripple: {
    eyebrow: "Influencer & social",
    title: "Meet Ripple",
    logo: "/images/logo-ripple.png",
    heroImage: "/images/heroes/ripple.jpg",
    featureImage: "/images/feature-ripple.jpg",
    lead: [
      "Our integrated, social-first solution. Ripple combines our own organic social hub with an influencer offering powered by our partnership with Hypetap.",
    ],
    points: [
      { title: "Influencers & creators", body: "All influencers are selected through real data analysis, end-to-end audits and human vetting." },
      { title: "Briefing & experience", body: "Every response works with committed influencers and pre-defined creative concepts." },
      { title: "Campaigns & management", body: "Strategies tailored to each brief and supported with paid amplification where required." },
      { title: "Performance & data", body: "Live and post-campaign reporting across data, insights, sentiment and learnings." },
    ],
    sections: [
      {
        heading: "Now expanding into organic social, from Manchester",
        body: [
          "Bicycle is expanding beyond London with a Manchester-based social shop, led by incoming managing partner Natalie Jackson. Ripple grows beyond influencer to the full breadth of social marketing, helping clients integrate social seamlessly into their media strategies and working tightly with Bicycle Studio and Bicycle Blade.",
        ],
      },
    ],
  },

  international: {
    eyebrow: "Bicycle International",
    title: "Are you a multi-market brand?",
    logo: "/images/logo-international.png",
    heroImage: "/images/heroes/international.jpg",
    featureImage: "/images/feature-international.jpg",
    lead: [
      "Someone who wants to venture into new markets seamlessly and quickly? Who needs cross-market activity and craves the independent spirit, but fears a bland, identikit network solution is the only option? We’ve got good news for you.",
    ],
    sections: [
      {
        heading: "One stop, independent, international",
        body: [
          "Bicycle International is a fully-staffed business operating out of our Bicycle London HQ, delivering the ‘Power of And’ through a one-stop independent international media offering.",
          "Our unique ‘Open Source, Closed Loop’ model delivers centralised strategy and investment from our UK hub, while working with clients and media owners directly in-market to ensure best-in-class local implementation.",
        ],
      },
      {
        heading: "Where we work",
        body: [
          "We’re currently active across the UK, Ireland, Scandinavia, mainland Europe, North America, Nigeria and the UAE. Our international clients include Zooplus, Estrid, Movember and OFX, handling a combined annual media investment in excess of $40m.",
        ],
      },
    ],
  },
};
