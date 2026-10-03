export type BranchType =
  | 'Computer Engineering'
  | 'Artificial Intelligence & Data Science'
  | 'Information Technology'
  | 'Electronics & Telecommunication'
  | 'Mechanical Engineering';

export interface StudentProfile {
  name: string;
  branch: BranchType;
  classYear: string;
  division: string;
  rollNo: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  interestedAreas: string[]; // e.g. Tech tags
  interestedSubjects: string[]; // e.g. Studies tags (C Programming, Data Structures, Mathematics, etc.)
  interestedCommittees: string[];
  futurePath: string;
  semester?: string;
  residenceType?: string;
  primaryGoal?: string;
  preferredFormat?: string;
  stats: {
    activityScore: number;
    communitiesJoined: number;
    networkCount: number;
  };
  avatar: string;
  favourites: string[]; // IDs of workshops, events, or communities
  bookmarkedMaterials: string[]; // IDs of saved study materials
  history: {
    id: string;
    title: string;
    type: 'Workshop' | 'Seminar' | 'Event' | 'Hackathon' | 'Guest Lecture';
    date: string;
    status: 'Registered' | 'Attended' | 'Certificate Earned';
    communityName: string;
  }[];
}

export interface Community {
  id: string;
  name: string;
  shortCode: string;
  category: 'Technical' | 'Robotics & Hardware' | 'Competitive Coding' | 'Entrepreneurship' | 'Creative & Design';
  shortDesc: string;
  detailedInfo: string;
  leadName: string;
  leadRole: string;
  leadBranch: string;
  leadContact: string;
  membersCount: number;
  tags: string[];
  gradient: string;
  accentColor: string;
  joined: boolean;
  upcomingEventCount: number;
  faqs: { question: string; answer: string }[];
}

export interface WorkshopOrEvent {
  id: string;
  title: string;
  type: 'Workshop' | 'Seminar' | 'Hackathon' | 'Guest Lecture';
  communityId: string;
  communityName: string;
  date: string;
  time: string;
  venue: string;
  speakers: { name: string; role: string; org: string }[];
  seatsTotal: number;
  seatsLeft: number;
  tags: string[];
  summary: string;
  prerequisites: string;
  image: string;
  isRecommended: boolean;
  registered: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderRole: string;
  avatar: string;
  timestamp: string;
  content: string;
  isMine?: boolean;
  isAnnouncement?: boolean;
  isTyping?: boolean;
}

export interface MentorPeer {
  id: string;
  name: string;
  role: 'Senior Mentor' | 'Club Lead' | 'Peer Junior';
  branch: string;
  year: string;
  specialties: string[];
  bio: string;
  avatar: string;
  connected: boolean;
  unreadCount?: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  branch: BranchType | 'All Engineering Branches';
  year: string;
  fileType: 'PDF Notes' | 'Handout & Lab Code' | 'Question Bank' | 'Formula Sheet';
  fileSize: string;
  author: string;
  downloadsCount: number;
  description: string;
  tags: string[];
  previewUrl?: string;
  updatedAt: string;
}

export interface CampusCalendarItem {
  id: string;
  title: string;
  category: 'Exam' | 'Assignment' | 'Workshop' | 'Seminar' | 'Hackathon';
  date: string;
  time: string;
  venueOrLink: string;
  branch: string;
  year: string;
  description: string;
  priority: 'High' | 'Medium' | 'Normal';
  deadlineDate?: string;
}

export interface AlumniProfile {
  id: string;
  name: string;
  gradYear: string;
  currentRole: string;
  company: string;
  branch: string;
  domain: string[];
  bio: string;
  avatar: string;
  linkedin: string;
  openForMentorship: boolean;
  connected: boolean;
  experienceYears: number;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'Internship' | 'Hackathon' | 'Freelance Gig' | 'Fellowship';
  stipendOrPrize: string;
  location: string;
  deadline: string;
  eligibility: string;
  description: string;
  skillsRequired: string[];
  applyUrl: string;
  featured?: boolean;
  applied?: boolean;
}
