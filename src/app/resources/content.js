import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Syam",
  lastName: "Narendra",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "AI/ML Backend Engineer",
  avatar: "/images/avatar.jpg",
  location: "Hyderabad/ Rajahmundry",
  languages: ["English", "Telugu"],
};

const newsletter = {
  display: true,
  title: <>Get in Touch</>,
  description: (
    <>
      I occasionally write about design, technology, and share thoughts on the
      intersection of creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Syam-Narendra",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://linkedin.com/in/syamnarendra",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:syam35@protonmail.com",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>{person.role}</>,
  subline: (
    <>
      I'm Syam Narendra, an
      <InlineCode>AI/ML and Backend Engineer</InlineCode>, specializing in
      JavaScript and Python, adept at leveraging libraries like TensorFlow,
      PyTorch, Scikit-learn, and Pandas to build intelligent solutions.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        AI/ML engineer with a passion for designing and implementing
        cutting-edge solutions. Proficient in developing vector search
        algorithms, neural networks, and advanced vector embeddings. Skilled in
        LLM and stable diffusion techniques to enhance model stability and
        performance. Expertise in containerization with Docker and automating
        workflows with CI/CD pipelines. Python developer with extensive
        experience in frameworks like PyTorch and scikit-learn. Committed to
        continuous learning and innovation in artificial intelligence and
        machine learning domains
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "iTalent Digital",
        timeframe: "Nov 2023 - Present",
        role: "AI/ML Engineer",
        achievements: [
          <>
            Command-Line Tool: Developed a custom CLI tool using the cac npm
            module to automate and improve internal workflows, ensuring better
            efficiency in regular tasks.
          </>,
          <>
            WordPress Search API: Designed and developed an API for WordPress
            websites to scrape data, transform it into vector embeddings, and
            enable efficient vector-based search, providing more accurate
            results compared to traditional keyword-based searches.
          </>,
          <>
            Internal Productivity Application: Created a full-stack web
            application similar to a copilot, integrated with OpenAI API and
            Vercel AI SDK, to help employees access and utilise knowledge from
            internal company data.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/iTalent.jpeg",
            alt: "iTalent Cover Pic",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Thought Works",
        timeframe: "May 2019 - June 2019",
        role: "Nodejs Intern",
        achievements: [
          <>
            Worked Closely with the Dev Team to design RESTful APIs, Gained
            Hands On Experience with Node and Express Js
          </>,
          <>
            Conducted code reviews, identified areas for improvement to maintain
            code quality and performance.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: false, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Jakarta",
        description: <>Studied software engineering.</>,
      },
      {
        name: "Build the Future",
        description: <>Studied online marketing and personal branding.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Back-End Development",
        description: <>Python, Node.js, Go, SQL, Postgresql, Redis</>,
        images: [
          {
            src: "https://i.ibb.co/W0qGwvF/kisspng-learning-to-program-using-python-programming-langu-tic-tac-toe-logo-5b47098b9492c9-360030891.png",
            alt: "Python image",
            width: 6,
            height: 6,
          },
          {
            src: "https://i.ibb.co/WDcdhg3/pngwing-com.png",
            alt: "Node image",
            width: 6,
            height: 6,
          },

          {
            src: "https://i.ibb.co/yspQnrw/SQL.png",
            alt: "Sql image",
            width: 6,
            height: 6,
          },
        ],
      },
      {
        title: "Front-End Development",
        description: <>TypeScript, React js</>,
        images: [
          {
            src: "https://i.ibb.co/xfkNsdR/kisspng-react-javascript-library-redux-user-interface-tesseract-5b52265d078074-260379741532110429030.png",
            alt: "React image",
            width: 6,
            height: 6,
          },
        ],
      },
      {
        title: "Full Stack Frameworks",
        description: <>Next.js,Remix</>,
        images: [
          {
            src: "https://i.ibb.co/HtQFrny/next-js.png",
            alt: "NextJs image",
            width: 6,
            height: 6,
          },
          {
            src: "https://i.ibb.co/3rY8X1Z/20250120-122900.png",
            alt: "Remix image",
            width:6,
            height:6
          },
        ],
      },
      {
        title: "Big Data",
        description: <>Apache Spark, Hadoop, Kafka,</>,
      },
      {
        title: "Machine Learning & AI",
        description: (
          <>LangChain, HuggingFace, OpenCV,Vector Embeddings/Search</>
        ),
      },
    ],
  },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-03.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { about, blog, gallery, home, newsletter, person, social, work };
