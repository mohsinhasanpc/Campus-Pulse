import { INITIAL_COMMUNITIES, INITIAL_WORKSHOPS } from './data';
import { StudentProfile } from './types';

export interface FastMatchResult {
  matched: boolean;
  reply: string;
}

/**
 * High-speed local knowledge matcher for instant 0ms responses.
 * Detects common campus queries and generates punchy, structured answers immediately.
 */
export function getFastCampusAnswer(query: string, student?: Partial<StudentProfile>): FastMatchResult {
  const q = query.trim().toLowerCase();
  const branch = student?.branch || 'Computer Engineering';

  // 0. Greetings / Intro
  if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'namaste' || q.startsWith('who are you') || q.startsWith('what can you do')) {
    return {
      matched: true,
      reply: `**Hello! I am your CampusPulse AI Advisor 👋**\n\nI can help you with:\n• Finding the best technical club or committee for **${branch}**\n• Upcoming workshops, dates, and prerequisites\n• Freshman 1st-year coding roadmap & project ideas\n• Recruitment details for GDSC, ACM, Robotics, and E-Cell\n\nWhat would you like to explore today?`,
    };
  }

  // 1. Languages / What to learn first semester
  if (
    q.includes('language') ||
    q.includes('what to learn') ||
    q.includes('which language') ||
    q.includes('c++') ||
    q.includes('python') ||
    q.includes('programming')
  ) {
    return {
      matched: true,
      reply: `**Recommended Languages for 1st Year (${branch}):**\n\n• **C++ (Primary for DSA & Contests)**: Standard choice for campus placements and ACM ICPC rounds. Focus on STL.\n• **Python (Rapid Prototyping & AI)**: Perfect for scripting, automation, and basic machine learning.\n• **JavaScript / TypeScript (Web & Cloud)**: Required for building modern web applications with GDSC.\n• **Immediate Action**: Attend ACM's *Wednesday Coders Circle* in Lab 101 to build problem-solving fundamentals!`,
    };
  }

  // 2. Projects to build as a fresher
  if (q.includes('project') || q.includes('what should i build') || q.includes('portfolio') || q.includes('mini project')) {
    return {
      matched: true,
      reply: `**High-Impact 1st-Year Projects for ${branch}:**\n\n• **Full-Stack Student Portal**: Build a Next.js web application deployed to Google Cloud Run (Great for GDSC Solution Challenge).\n• **Autonomous Obstacle Bot**: Build an Arduino/ESP32 robot using ultrasonic sensors (Covered in RAS Oct 10 workshop).\n• **Competitive Coding Visualizer**: Build a search/sorting algorithm visualizer in C++ or React (ACM track).\n• **Tip**: Upload every project to GitHub with a clean README—seniors review repos during core team hiring!`,
    };
  }

  // 3. Hackathons / How to prepare
  if (q.includes('hackathon') || q.includes('solution challenge') || q.includes('coding contest') || q.includes('competition')) {
    return {
      matched: true,
      reply: `**Freshman Hackathon Winning Strategy:**\n\n1. **Form a 3-4 Person Team**: Pair 2 coders with 1 UI/UX designer from *Design Syndicate* and 1 presenter.\n2. **Master Starter Templates**: Prepare clean boilerplate (Next.js + Tailwind + Firebase/Supabase) before the hackathon starts.\n3. **Solve Real Campus Problems**: Judges love apps that solve local problems (e.g. lab scheduling, notes sharing).\n4. **Workshops to Attend**: *Full-Stack Cloud* (Oct 14) and *Generative AI* (Oct 17) organized by GDSC.`,
    };
  }

  // 4. Balancing academics & clubs / Time management
  if (q.includes('balance') || q.includes('time management') || q.includes('attendance') || q.includes('studies') || q.includes('cgpa')) {
    return {
      matched: true,
      reply: `**Balancing Clubs & Academics:**\n\n• **Rule of 5 Hours**: Dedicate maximum 4–6 hours on weekends to club projects without compromising weekday lectures.\n• **Synergy with Syllabus**: Joining **ACM** helps you ace DSA exams; joining **Robotics** helps with electronics & physics labs.\n• **Attendance**: Clubs provide official duty leave (OD) forms for inter-college hackathons and Robocon events.\n• **Study Material**: Ask senior mentors in the **Explore** tab for previous semester question banks!`,
    };
  }

  // 5. Which club is best for branch / 1st year
  if (
    (q.includes('which club') || q.includes('best club') || q.includes('recommend club') || q.includes('should i join')) &&
    (q.includes('year') || q.includes('student') || q.includes('freshman') || q.includes('branch') || q.includes('cs') || q.includes('engineer') || q.includes('me'))
  ) {
    if (branch.includes('Mechanical') || q.includes('mechanical') || q.includes('hardware')) {
      return {
        matched: true,
        reply: `**Top Recommendations for ${branch}:**\n\n• **Robotics & Automation Society (RAS)**: Best for CAD modeling, 3D printing, Robocon bot building, and microcontroller automation.\n• **E-Cell (Entrepreneurship Cell)**: Best for product hardware prototyping and startup incubation.\n• **Action Item**: Register for the *Autonomous Robotics Workshop* (Oct 10) in the Explore tab—kits provided!`,
      };
    }
    if (branch.includes('Electronics') || q.includes('electronics') || q.includes('entc') || q.includes('iot')) {
      return {
        matched: true,
        reply: `**Top Recommendations for ${branch}:**\n\n• **Robotics & Automation Society (RAS)**: Hands-on ESP32, sensor integration, ROS2, and PCB design.\n• **GDSC (Google Developer Student Club)**: Cloud IoT endpoints, backend APIs, and firmware telemetry.\n• **Action Item**: Join the Robotics workshop on Oct 10—freshmen get full breadboard and motor kits.`,
      };
    }
    return {
      matched: true,
      reply: `**Top Recommendations for 1st Year ${branch}:**\n\n• **GDSC (Google Developer Student Club)**: Master modern web apps, cloud deployment (Google Cloud Run), and hackathons.\n• **ACM Student Chapter**: Strengthen data structures & algorithms (DSA), C++ problem-solving, and ICPC contest prep.\n• **Robotics (RAS)**: Great if you want hands-on hardware/embedded experience.\n• **Next Step**: Check out the **Explore** tab to join community channels and RSVP for upcoming workshops!`,
    };
  }

  // 6. Robotics workshop prerequisites
  if (
    (q.includes('robot') || q.includes('ras') || q.includes('hardware')) &&
    (q.includes('prereq') || q.includes('require') || q.includes('need') || q.includes('bring') || q.includes('eligib'))
  ) {
    const ws = INITIAL_WORKSHOPS.find((w) => w.id === 'ws-1');
    return {
      matched: true,
      reply: `**Autonomous Robotics Workshop Prerequisites:**\n\n• **Prior Knowledge**: Zero experience required! Freshmen receive step-by-step guidance.\n• **Provided on Campus**: ESP32 microcontrollers, motor drivers, ultrasonic sensors, and breadboards.\n• **What to Bring**: Laptop with Arduino IDE installed & USB-C cable.\n• **Date & Venue**: ${ws ? `${ws.date}, ${ws.time} at ${ws.venue} (${ws.seatsLeft} seats left)` : 'Saturday, Oct 10 at Robotics Lab 204'}.\n• **Action**: Register immediately via the **Explore** tab!`,
    };
  }

  // 7. How to join GDSC / ACM core team
  if (
    (q.includes('join') || q.includes('recruitment') || q.includes('apply') || q.includes('selection')) &&
    (q.includes('core') || q.includes('team') || q.includes('lead') || q.includes('associate') || q.includes('gdsc') || q.includes('acm'))
  ) {
    return {
      matched: true,
      reply: `**Core Team Recruitment Guide for Freshmen:**\n\n1. **Active Participation**: Attend club workshops and participate in Q&A sessions. Leads track frequent attendees.\n2. **Mini Project**: Build at least one GitHub project (e.g. a simple responsive web app or Arduino gadget).\n3. **Application Window**: Junior Associate recruitment drives kick off in mid-October.\n4. **Direct Contact**: You can message lead **Rohan Deshmukh** (GDSC) or **Aditya Mehta** (ACM) right now in the **Messages** tab!`,
    };
  }

  // 8. GDSC Specific Info
  if (q.includes('gdsc') || q.includes('google developer')) {
    const comm = INITIAL_COMMUNITIES.find((c) => c.shortCode === 'GDSC');
    return {
      matched: true,
      reply: `**Google Developer Student Club (GDSC):**\n\n• **Lead**: ${comm?.leadName || 'Rohan Deshmukh'} (${comm?.leadRole || 'TE CS'})\n• **Focus**: Full-Stack Web Development, Google Cloud Run, Android/Flutter, and Solution Challenge.\n• **Upcoming Session**: *Modern Full-Stack Cloud & Scalable Web Apps* on Oct 14 in Seminar Hall 2.\n• **Perks**: Free Google Cloud training credits, Swag packs, and mentor networking.\n• **Action**: Click "Join Community" in the **Explore** tab to access the channel!`,
    };
  }

  // 9. Robotics / RAS Info
  if (q.includes('robotics') || q.includes('ras') || q.includes('robocon')) {
    const comm = INITIAL_COMMUNITIES.find((c) => c.shortCode === 'RAS');
    return {
      matched: true,
      reply: `**Robotics & Automation Society (RAS):**\n\n• **Lead**: ${comm?.leadName || 'Tanvi Kulkarni'} (${comm?.leadRole || 'BE Mech'})\n• **Focus**: Embedded systems, ROS2, Robocon national bot fabrication, and IoT sensors.\n• **Upcoming Workshop**: *Hands-On Autonomous Robotics & Sensor Integration* (Oct 10).\n• **Freshman Policy**: Complete starter hardware kits provided. No prior electronics experience needed!`,
    };
  }

  // 10. ACM Chapter Info
  if (q.includes('acm') || q.includes('competitive') || q.includes('icpc') || q.includes('leetcode')) {
    const comm = INITIAL_COMMUNITIES.find((c) => c.shortCode === 'ACM');
    return {
      matched: true,
      reply: `**ACM Student Chapter:**\n\n• **Lead**: ${comm?.leadName || 'Aditya Mehta'} (${comm?.leadRole || 'TE IT'}, Codeforces Candidate Master)\n• **Focus**: Algorithms, Data Structures, ICPC training, and C++ optimization.\n• **Weekly Meetups**: Wednesday Coders Circle (Lab 101) for peer code reviews and contest preparation.\n• **Upcoming Event**: *Algorithmic Problem Solving & ICPC Primer* on Oct 19.`,
    };
  }

  // 11. Career roadmap / 1st year guide
  if (q.includes('roadmap') || q.includes('guide') || q.includes('freshman plan') || q.includes('1st year') || q.includes('semester plan')) {
    return {
      matched: true,
      reply: `**⚡ 1st Year Engineering Roadmap (${branch}):**\n\n• **Phase 1 (Months 1–2)**: Git & GitHub, fundamentals of C++ or Python, clean code principles.\n• **Phase 2 (Months 3–4)**: Core DSA (arrays, maps, recursion) + Join **GDSC** or **ACM**.\n• **Phase 3 (Months 5–6)**: Build & deploy 2 real portfolio projects (e.g. Next.js web app or an IoT monitor).\n• **Pro-Tip**: Network with 3rd & 4th-year seniors in the **Explore** tab to get study materials and past exam patterns!`,
    };
  }

  // 12. Upcoming workshops and dates
  if (q.includes('workshop') || q.includes('event') || q.includes('date') || q.includes('schedule') || q.includes('seminar')) {
    const list = INITIAL_WORKSHOPS.slice(0, 3)
      .map((w) => `• **${w.title}** (${w.communityName}) — ${w.date} at ${w.time} [${w.venue}]`)
      .join('\n');
    return {
      matched: true,
      reply: `**Upcoming Campus Workshops & Seminars:**\n\n${list}\n\n*RSVP directly on the **Explore** or **Home** tabs before seats fill up!*`,
    };
  }

  // 13. E-Cell / Entrepreneurship
  if (q.includes('ecell') || q.includes('e-cell') || q.includes('startup') || q.includes('founder') || q.includes('business')) {
    const comm = INITIAL_COMMUNITIES.find((c) => c.shortCode === 'E-CELL');
    return {
      matched: true,
      reply: `**Entrepreneurship Cell (E-Cell):**\n\n• **Lead**: ${comm?.leadName || 'Vikramaditya Shinde'} (${comm?.leadRole || 'BE CS'})\n• **Focus**: Startup incubation, venture capital pitch days, and product prototyping.\n• **Key Event**: Annual Campus Shark Tank & Founder Bootcamp in January.\n• **Join**: Freshmen can join as outreach associates in the **Explore** tab!`,
    };
  }

  return { matched: false, reply: '' };
}
