// Long-form "meet the Peloton" stories for /careers/team/[slug].
// Copy is each person's own first-person story, reproduced verbatim from the
// pages they were originally written on. Add a record here to publish a new
// story; no new page file is needed.

export type TeamStory = {
  slug: string;
  name: string;
  role: string; // PageHero lead
  jobTitle: string; // schema.org jobTitle
  avatar: string;
  initials: string;
  metaTitle: string;
  metaDescription: string;
  paragraphs: string[];
  signoff?: string;
  linkedin?: string; // only when a confirmed profile URL is supplied
};

export const TEAM_STORIES: TeamStory[] = [
  {
    slug: "mark-pavlika",
    name: "Mark Pavlika",
    role: "Chief People & Purpose Officer, People Team",
    jobTitle: "Chief People & Purpose Officer",
    avatar: "/team/mark-pavlika.png",
    initials: "MP",
    metaTitle: "Mark Pavlika, Chief People & Purpose Officer",
    metaDescription:
      "Today I am Chief People & Purpose Officer of the agency I dreamed of working at Bicycle London. Mark's story, from our People team.",
    paragraphs: [
      "I was brought up as a Jehovah's Witness in a strict household. At 16 I realised that I had no choice but to accept my sexuality and explore the LGBTQ+ community, and for 3 years I lived a double life because I couldn't face telling my parents.",
      "At 18 I befriended a man 37 years my senior, but he had other ideas. He fell for me and stalked me for 3 years, making my life hell. He was so infatuated with me that he wanted me to live with him, and he started writing abusive, hate-mail type letters to my parents to out me and to get me thrown out. One day he succeeded, and on the 9th February 1993, my parents gave me an ultimatum. Change or leave – I chose to leave.",
      "The next 2 years shaped my life forever to come. I lived on the streets, took drugs and met some very unsavoury people. It took all my might, and on 31st October 1994, almost 2 years after I left home, I took my last drug.",
      "I went on to get a junior job in finance and found a home with a housing association. I studied hard, and with my ambition and zeal for my new life I got to a senior position within 8 years. I then moved over to HR exclusively in 2005 and have been a senior practitioner since.",
      "For years I suffered from depression and anxiety, and eventually in 2010, 16 years of being clean, I discovered yoga and mindfulness. I credit these with saving my life, as they've helped me piece together the jigsaw pieces in my mind.",
      "Today I am Chief People & Purpose Officer of the agency I dreamed of working at, Bicycle London. I feel like a kid in a sweet shop and want to tell everyone about it.",
    ],
    signoff: "Pav x (aka known as Mark, Mario and Maz)",
  },
  {
    slug: "valeria-perticucci",
    name: "Valeria Perticucci",
    role: "Peloton Success Manager, People Team",
    jobTitle: "Peloton Success Manager",
    avatar: "/team/valeria-perticucci.png",
    initials: "VP",
    metaTitle: "Valeria Perticucci, Peloton Success Manager",
    metaDescription:
      "\"I'm an international mess\" - that's how I like to introduce myself. Valeria's story, from our People team.",
    paragraphs: [
      "“I'm an international mess” – that's how I like to introduce myself. A proud Third Culture Kid, I've lived across Germany, the UK, the Netherlands, Luxembourg and the US, shaped by a Belgian mother and an Italian and American father. I'm the eldest of four, which means I've always been the sensible one – reserved, studious and quietly observant.",
      "After studying Psychology & Biology at the University of Exeter (with a year abroad at Texas State), I started my career in early careers during the pandemic, helping others navigate the chaos of early adulthood. I've worked mostly in tech, supporting career-switchers and first-timers, before joining Bicycle in September. Media is still a new playground for me.",
      "I'm an introverted extrovert who discovered at uni that my love for going out was really a love for music. Festivals are my happy place (especially electronic ones), though I've got a soft spot for R&B and soul too. Most of my annual leave is spent chasing music across borders.",
      "Running has become my anchor, a space where I find discipline, clarity and movement. If someone ever asks me ‘when do you feel most alive’, I'll say race day. I can easily run a half marathon with zero headphones, just full vibes.",
      "I'm passionate about psychology, self-development and, lately, spirituality and wellness. I prefer deep conversations over small talk, and I've had my own journey with anxiety, depression and SAD – so if I seem extra sunny in summer, now you know why.",
    ],
    signoff: "Val / Valpal / Valeria x",
  },
];
