/** Site copy and metadata — edit here instead of scattering strings across layouts. */
export const site = {
  title: 'Yujing Wang',
  description: 'Notes and projects by Yujing Wang — doctor-turned-engineer.',
  /** Used in RSS and meta tags. */
  author: 'Yujing Wang',
  /** Home page: short paragraphs introducing the author. */
  intro: [
    "Hi, I'm Yujing! I'm currently an MSCS student at Northeastern University's Silicon Valley campus. Before making the leap into software, I actually trained as a physician. I completed my internal medicine residency, specializing in gastroenterology, at the Second Affiliated Hospital of Zhejiang University School of Medicine.",
    "Currently, under the supervision of Prof. Yoon, I'm leading V.O.I.C.E., an AI-powered virtual patient simulation platform for speech-language pathology (SLP) education.",
    "When I step away from my laptop, I love traveling, hunting down new food spots, and spending time with my nine-year-old cat, Choudan, who is entirely convinced I'm also a cat and keeps me on a strict daily play schedule.",
  ],
  /** Primary navigation. */
  nav: [
    { href: '/', label: 'Home' },
    { href: '/notes/', label: 'Notes' },
  ],
} as const;
