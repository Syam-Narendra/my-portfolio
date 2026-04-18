export const profile = {
  name: "Syam Narendra",
  avatarUrl: "https://avatars.githubusercontent.com/u/124170193",
  tagline: "24 • Backend Systems Engineer",
  statusChecking: "Checking activity...",
  statusReady: "Available for opportunities",
};

export const nav = {
  logoUrl: "/images/logos/sn-logo.svg",
  logoAlt: "Syam Narendra",
  links: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Books", href: "/books" },
    { label: "Blogs", href: "/blogs" },
  ] as { label: string; href: string }[],
};

export const meta = {
  title: "Syam Narendra - Backend Systems Engineer",
  description:
    "Syam Narendra -   Backend Systems Engineer from India building Scalable and Reliable Systems",
};
export const socialLinks = [
  { label: "GitHub", href: "https://github.com/syam-narendra", icon: "github" },
  { label: "X", href: "https://x.com/MrAdbhutam", icon: "twitter" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/syamnarendra/",
    icon: "linkedin",
  },
  { label: "Mail", href: "mailto:syam35@protonmail.com", icon: "mail" },
];

// ── GitHub ───────────────────────────────────────────────────────────
export const github = {
  username: "syam-narendra",
};

// ── Visitor Count ────────────────────────────────────────────────────
let visitorCount = 100;

export function getVisitorCount() {
  return ++visitorCount;
}

export const experience = [
  {
    company: "Beacon.li",
    companyUrl: "https://beacon.li",
    logoUrl: "/images/logos/beacon-logo.jpg",
    role: "AI Backend Engineer",
    type: "Full-time",
    period: ["Mar 2026", "Present"] as [string, string],
    skills: [
      "C#",
      "ASP.NET Core",
      "YARP",
      "SQL Server",
      "JavaScript",
      "Playwright",
    ],
  },
  {
    company: "itD Tech",
    companyUrl: "https://itdtech.com/",
    logoUrl: "/images/logos/itd-logo.jpg",
    role: "Full Stack Developer",
    type: "Full-time",
    period: ["Nov 2023", "Feb 2026"] as [string, string],
    skills: ["Python", "FastMCP", "Docker", "ngrok", "OpenAI"],
  },
  {
    company: "ThoughtWorks",
    companyUrl: "https://thoughtworks.com/",
    logoUrl: "/images/logos/tw-logo.jpg",
    role: "Backend Developer Intern",
    type: "Internship",
    period: ["May 2019", "Jun 2019"] as [string, string],
    skills: ["Python", "FastMCP", "Docker", "ngrok", "OpenAI"],
  },
];

export const education = [
  {
    institution: "Indian Institute of Technology, IIT Guwahati",
    url: "https://www.iitg.ac.in/",
    logoUrl: "/images/logos/iitg-logo.jpg",
    degree: "Bachelor of Science (Hons) in Data Science and AI",
    sub: "Data Science and AI",
    period: ["Sep 2025", "2029"] as [string, string],
  },
  {
    institution: "Aditya Engineering College",
    url: "https://adityauniversity.in",
    logoUrl: "/images/logos/aditya-logo.jpg",
    degree: "Diploma in Computer Science",
    sub: "Computer Science",
    period: ["July 2017", "March 2020"] as [string, string],
  },
];

// ── Books ────────────────────────────────────────────────────────────
export interface Book {
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  language: "english" | "telugu";
  rating?: number;
  review?: string;
}

export const booksCurrentlyReading: Book[] = [
  {
    title: "చివరకు మిగిలేది",
    author: "బుచ్చిబాబు",
    coverUrl: "/images/books/chivaraku-migiledi.webp",
    genre: "నవల",
    language: "telugu",
  },
];

export const booksRead: Book[] = [
  {
    title: "మహాప్రస్థానం",
    author: "శ్రీశ్రీ",
    coverUrl: "/images/books/mahaprasthanam.jpg",
    genre: "కవిత",
    language: "telugu",
    rating: 5,
    review: "తెలుగు కవిత్వంలో విప్లవాత్మక మార్పు తీసుకొచ్చిన ఉద్యమ కావ్యం. పీడితుల వేదన, సమసమాజ కాంక్ష శ్రీశ్రీ పదాల్లో నిప్పులా జ్వలిస్తాయి. ఆధునిక తెలుగు కవిత్వానికి దిశానిర్దేశం చేసిన అమర రచన.",
  },
  {
    title: "అమృతం కురిసిన రాత్రి",
    author: "దేవరకొండ బాలగంగాధర తిలక్",
    coverUrl: "/images/books/amrutam_kurisina_ratri.jpg",
    genre: "కవిత",
    language: "telugu",
    rating: 5,
    review: "తిలక్ కవిత్వంలో జీవన వేదన, ప్రేమ, ఒంటరితనం అద్భుతంగా కలగలసిపోయాయి. ప్రతి కవిత మనసును తాకే లాలిత్యంతో మెరుస్తుంది. తెలుగు ప్రగతిశీల కవిత్వంలో అత్యమూల్యమైన సంకలనం.",
  },
  {
    title: "అసమర్థుని జీవయాత్ర",
    author: "త్రిపురనేని గోపీచంద్",
    coverUrl: "/images/books/asamardhuni-jivayatra.jpg",
    genre: "నవల",
    language: "telugu",
    rating: 4,
    review: "తెలుగులో మనస్తత్వ విశ్లేషణకు మార్గం చూపిన నవల. ఒక అసమర్థుని జీవన సంఘర్షణ ద్వారా మానవ స్వభావాన్ని నిశితంగా ఆవిష్కరించిన రచన. తెలుగు సాహిత్యంలో చిరస్థాయి స్థానం సంపాదించుకున్న కృతి.",
  },
  {
    title: "కాళికాంబ సప్తశతి",
    author: "పోతులూరి వీరబ్రహ్మేంద్ర స్వామి",
    coverUrl: "/images/books/kalikamba-saptasati.jpg",
    genre: "పద్యాలు",
    language: "telugu",
    rating: 4,
    review: "ఆధ్యాత్మిక తత్వాన్ని పద్య రూపంలో నిక్షిప్తం చేసిన అపూర్వ రచన. వీరబ్రహ్మేంద్రస్వామి జ్ఞానదృష్టి ప్రతి పద్యంలో ప్రతిఫలిస్తుంది. శక్తి తత్వాన్ని అన్వేషించే పాఠకులకు ఆధ్యాత్మిక వెలుగు ప్రసాదించే కృతి.",
  },
  {
    title: "జరుగుతున్నది జగన్నాటకం",
    author: "అరిపిరాల సత్యప్రసాద్",
    coverUrl: "/images/books/jaruguthunnadi.jpg",
    genre: "నవల",
    language: "telugu",
    rating: 3,
    review: "",
  },
];

export const booksMeta = {
  title: "Books – Syam Narendra",
  description:
    "A collection of books that made me pause, think, and see things differently.",
  heading: "Books",
  subheading:
    "A collection of books that made me pause, think, and see things differently.\nSome for growth, some for curiosity, and some that just stayed with me.",
};

// ── Projects ─────────────────────────────────────────────────────────
export interface Project {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  githubUrl?: string;
  imageUrl: string;
}

export const projects: Project[] = [
  {
    title: "AI Gateway Proxy",
    description:
      "A high-performance API gateway built with YARP that routes LLM requests across multiple providers with automatic failover, rate limiting, and usage tracking.",
    tags: ["C#", "ASP.NET Core", "YARP", "Redis"],
    githubUrl: "https://github.com/syam-narendra",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop",
  },
  {
    title: "MCP Server Framework",
    description:
      "A FastMCP-based server framework for building Model Context Protocol servers with built-in tool management, resource handling, and prompt templates.",
    tags: ["Python", "FastMCP", "Docker", "OpenAI"],
    githubUrl: "https://github.com/syam-narendra",
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=340&fit=crop",
  },
  {
    title: "Invoice Management System",
    description:
      "Full-stack invoicing platform with PDF generation, GST calculations, client management, and automated payment reminders.",
    tags: ["React", "Node.js", "PostgreSQL", "PDF"],
    url: "https://example.com",
    githubUrl: "https://github.com/syam-narendra",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop",
  },
  {
    title: "Real-time Chat Engine",
    description:
      "WebSocket-based chat system supporting group conversations, file sharing, read receipts, and end-to-end encryption.",
    tags: ["TypeScript", "WebSocket", "Redis", "MongoDB"],
    githubUrl: "https://github.com/syam-narendra",
    imageUrl:
      "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&h=340&fit=crop",
  },
  {
    title: "E-Commerce Platform",
    description:
      "Scalable e-commerce backend with inventory management, payment integration, order tracking, and multi-vendor support.",
    tags: ["Python", "FastAPI", "Stripe", "Docker"],
    githubUrl: "https://github.com/syam-narendra",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=340&fit=crop",
  },
  {
    title: "DevOps Dashboard",
    description:
      "Monitoring dashboard that aggregates metrics from multiple services, displays real-time health checks, and sends alerts via Slack.",
    tags: ["React", "Grafana", "Prometheus", "Go"],
    url: "https://example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop",
  },
];

export const projectsMeta = {
  title: "Projects – Syam Narendra",
  description: "A showcase of projects I've built and contributed to.",
  heading: "Projects",
  subheading:
    "Things I've built, broken, and rebuilt — mostly for fun, sometimes for real.",
};

// ── Blogs ────────────────────────────────────────────────────────────
export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  coverUrl: string;
}

export const blogs: BlogPost[] = [
  {
    title: "Building a Reverse Proxy with YARP in .NET",
    excerpt:
      "How I built a high-performance reverse proxy using Microsoft's YARP library, handling 10k+ requests per second with custom routing middleware.",
    date: "2026-04-10",
    readTime: "8 min read",
    tags: ["C#", "YARP", ".NET"],
    slug: "building-reverse-proxy-yarp",
    coverUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=300&fit=crop",
  },
  {
    title: "Why I Switched from REST to MCP for AI Tools",
    excerpt:
      "The Model Context Protocol changed how I think about AI tool integrations. Here's why MCP is a better fit than REST for LLM-powered applications.",
    date: "2026-03-22",
    readTime: "6 min read",
    tags: ["AI", "MCP", "Python"],
    slug: "rest-to-mcp-ai-tools",
    coverUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
  },
  {
    title: "Docker Compose for Local Development: A Practical Guide",
    excerpt:
      "Stop fighting with local environment setup. Here's my battle-tested Docker Compose configuration for full-stack development with hot reload.",
    date: "2026-03-05",
    readTime: "10 min read",
    tags: ["Docker", "DevOps", "DX"],
    slug: "docker-compose-local-dev",
    coverUrl:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=300&fit=crop",
  },
  {
    title: "Lessons from Building My First Production API",
    excerpt:
      "What I learned about error handling, logging, rate limiting, and database migrations the hard way — by shipping to real users.",
    date: "2026-02-14",
    readTime: "7 min read",
    tags: ["Backend", "API", "Lessons"],
    slug: "first-production-api-lessons",
    coverUrl:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=300&fit=crop",
  },
  {
    title: "Understanding Event-Driven Architecture",
    excerpt:
      "A deep dive into event sourcing, CQRS, and message queues. When to use them, when to avoid them, and how they changed our system design.",
    date: "2026-01-28",
    readTime: "12 min read",
    tags: ["Architecture", "Events", "System Design"],
    slug: "event-driven-architecture",
    coverUrl:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=300&fit=crop",
  },
];

export const blogsMeta = {
  title: "Blog – Syam Narendra",
  description:
    "Thoughts on backend engineering, AI, and building things that work.",
  heading: "Blog",
  subheading:
    "Thoughts, learnings, and occasional rants about building software.",
};

// ── About ────────────────────────────────────────────────────────────
export const about = [
  "I’m a backend-focused engineer who enjoys building systems from the ground up, especially where performance, scalability, and real-world use intersect. Lately, I’ve been diving deep into Rust, exploring how low level thinking can shape high impact products.",
  "I like going beyond just writing code whether it’s designing architectures, experimenting with recommendation systems, or building full-stack products that people actually use. I learn best by building, breaking, and rebuilding things better.",
  "For me, growth is about becoming sharper in how I think and build more intentional, more disciplined, and more aligned with creating systems that truly matter.",
];

// ── Quote ────────────────────────────────────────────────────────────
export const quote = {
  text: "I was not born with a whole lot of natural talent, but I work hard and I never give up! That is my gift; that is my ninja way!",
  author: "Rock Lee, Naruto",
};

// ── Footer ───────────────────────────────────────────────────────────
export const footer = {
  copyright: `© ${new Date().getFullYear()} Syam Narendra`,
  tagline: "Low-level thinking. High-level impact. Let's get Rusty.",
  emoji: "🐰",
};
