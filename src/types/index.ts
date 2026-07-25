export type Category = 'Anak-anak' | 'Remaja' | 'Dewasa' | 'Umum';

export type RegistrationStatus = 'Waiting' | 'Called' | 'Ready' | 'Playing' | 'Finished' | 'Disqualified';

export type CompetitionStatus = 'Upcoming' | 'Ongoing' | 'Finished';

export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: 'L' | 'P';
  whatsapp: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Competition {
  id: string;
  name: string;
  category: Category;
  description: string;
  location: string;
  date: string;
  time: string;
  maxParticipants: number;
  thumbnailUrl?: string;
  pointFirst: number;
  pointSecond: number;
  pointThird: number;
  status: CompetitionStatus;
  prefix: string;
}

export interface Registration {
  id: string;
  participantId: string;
  competitionId: string;
  participantNumber: string; // e.g., BK-001
  status: RegistrationStatus;
  registeredAt: string;
}

export interface Score {
  id: string;
  competitionId: string;
  participantId: string;
  judgeName: string;
  score: number;
  notes?: string;
  round?: string;
  createdAt: string;
}

export interface Winner {
  id: string;
  competitionId: string;
  firstPlaceId?: string;
  secondPlaceId?: string;
  thirdPlaceId?: string;
  decidedAt: string;
  notes?: string;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  participantId: string;
  competitionId: string;
  title: 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Peserta';
  issueDate: string;
  verificationCode: string;
  qrCodeUrl?: string;
}

export interface Doorprize {
  id: string;
  name: string;
  sponsor?: string;
  categoryFilter: 'Semua' | Category;
  winnerParticipantId?: string;
  wonAt?: string;
}

export interface AppSettings {
  eventName: string;
  eventYear: number;
  theme: 'merah-putih' | 'dark' | 'light';
  logoUrl?: string;
  headOfCommittee: string;
  location: string;
  prefixRule: string;
  certificateTemplateText: string;
  autoBackup: boolean;
  colorTheme: string;
  lastBackupAt?: string;
}

export interface WaTemplate {
  id: string;
  title: string;
  category: 'panggilan' | 'pengingat' | 'selesai' | 'pengumuman' | 'lainnya';
  content: string;
  isDefault?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
