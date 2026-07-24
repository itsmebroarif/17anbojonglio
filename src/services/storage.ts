import {
  Competition,
  Participant,
  Registration,
  Score,
  Winner,
  Certificate,
  Doorprize,
  AppSettings,
  ActivityLog
} from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  COMPETITIONS: '17an_competitions',
  PARTICIPANTS: '17an_participants',
  REGISTRATIONS: '17an_registrations',
  SCORES: '17an_scores',
  WINNERS: '17an_winners',
  CERTIFICATES: '17an_certificates',
  DOORPRIZES: '17an_doorprizes',
  SETTINGS: '17an_settings',
  HISTORY: '17an_history'
};

export const DEFAULT_SETTINGS: AppSettings = {
  eventName: 'CHAMPIONSHIP ALL IN ONE',
  eventYear: 2026,
  theme: 'merah-putih',
  logoUrl: '',
  headOfCommittee: 'Ahmad Subardjo, S.T.',
  location: 'Lapangan Warga Depok',
  prefixRule: 'AUTO',
  certificateTemplateText: 'Diberikan sebagai bentuk penghargaan atas prestasi dan partisipasi aktif dalam menyemarakkan HUT Kemerdekaan Republik Indonesia.',
  autoBackup: true,
  colorTheme: '#dc2626'
};

export const SEED_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    name: 'Balap Karung Helm',
    category: 'Anak-anak',
    description: 'Lomba balap karung menggunakan helm keselamatan melintasi jarak 10 meter.',
    location: 'Lapangan Utama',
    date: '2026-08-17',
    time: '08:00',
    maxParticipants: 30,
    pointFirst: 100,
    pointSecond: 60,
    pointThird: 30,
    status: 'Ongoing',
    prefix: 'BK'
  },
  {
    id: 'comp-2',
    name: 'Makan Kerupuk Raksasa',
    category: 'Anak-anak',
    description: 'Lomba memakan kerupuk yang digantung tanpa menggunakan tangan.',
    location: 'Panggung Utama',
    date: '2026-08-17',
    time: '09:30',
    maxParticipants: 24,
    pointFirst: 100,
    pointSecond: 60,
    pointThird: 30,
    status: 'Upcoming',
    prefix: 'MK'
  },
  {
    id: 'comp-3',
    name: 'Tarik Tambang Kebangsaan',
    category: 'Dewasa',
    description: 'Adu kekuatan antar regu 5 orang menarik tambang.',
    location: 'Lapangan Timur',
    date: '2026-08-17',
    time: '14:00',
    maxParticipants: 16,
    pointFirst: 150,
    pointSecond: 90,
    pointThird: 45,
    status: 'Upcoming',
    prefix: 'TT'
  },
  {
    id: 'comp-4',
    name: 'Balon Joget Pasangan',
    category: 'Remaja',
    description: 'Berjoget berpasangan sambil menahan balon di dahi hingga musik berhenti.',
    location: 'Panggung Utama',
    date: '2026-08-17',
    time: '11:00',
    maxParticipants: 20,
    pointFirst: 100,
    pointSecond: 60,
    pointThird: 30,
    status: 'Finished',
    prefix: 'BJ'
  },
  {
    id: 'comp-5',
    name: 'Mobile Legends Bang Bang (MLBB)',
    category: 'Remaja',
    description: 'Turnamen e-sport kualifikasi kustom 5v5.',
    location: 'Area Posko Digital',
    date: '2026-08-16',
    time: '19:30',
    maxParticipants: 16,
    pointFirst: 200,
    pointSecond: 120,
    pointThird: 60,
    status: 'Finished',
    prefix: 'ML'
  }
];

export const SEED_PARTICIPANTS: Participant[] = [
  {
    id: 'part-1',
    name: 'Arif Alexander',
    age: 12,
    gender: 'L',
    whatsapp: '081234567890',
    email: 'arif@example.com',
    address: 'Jl. Merdeka No. 17',
    createdAt: new Date().toISOString()
  },
  {
    id: 'part-2',
    name: 'Siti Nurhaliza',
    age: 10,
    gender: 'P',
    whatsapp: '081298765432',
    address: 'Jl. Proklamasi No. 45',
    createdAt: new Date().toISOString()
  },
  {
    id: 'part-3',
    name: 'Budi Santoso',
    age: 28,
    gender: 'L',
    whatsapp: '085612349876',
    address: 'Jl. Garuda No. 8',
    createdAt: new Date().toISOString()
  },
  {
    id: 'part-4',
    name: 'Dewi Rahmawati',
    age: 16,
    gender: 'P',
    whatsapp: '087811223344',
    address: 'Jl. Pancasila No. 5',
    createdAt: new Date().toISOString()
  },
  {
    id: 'part-5',
    name: 'Eko Prasetyo',
    age: 35,
    gender: 'L',
    whatsapp: '089988776655',
    address: 'Jl. Diponegoro No. 10',
    createdAt: new Date().toISOString()
  }
];

export const SEED_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-1',
    participantId: 'part-1',
    competitionId: 'comp-1',
    participantNumber: 'BK-001',
    status: 'Playing',
    registeredAt: new Date().toISOString()
  },
  {
    id: 'reg-2',
    participantId: 'part-2',
    competitionId: 'comp-1',
    participantNumber: 'BK-002',
    status: 'Ready',
    registeredAt: new Date().toISOString()
  },
  {
    id: 'reg-3',
    participantId: 'part-3',
    competitionId: 'comp-3',
    participantNumber: 'TT-001',
    status: 'Waiting',
    registeredAt: new Date().toISOString()
  },
  {
    id: 'reg-4',
    participantId: 'part-4',
    competitionId: 'comp-4',
    participantNumber: 'BJ-001',
    status: 'Finished',
    registeredAt: new Date().toISOString()
  },
  {
    id: 'reg-5',
    participantId: 'part-1',
    competitionId: 'comp-4',
    participantNumber: 'BJ-002',
    status: 'Finished',
    registeredAt: new Date().toISOString()
  }
];

export const SEED_WINNERS: Winner[] = [
  {
    id: 'win-1',
    competitionId: 'comp-4',
    firstPlaceId: 'part-4',
    secondPlaceId: 'part-1',
    thirdPlaceId: 'part-2',
    decidedAt: new Date().toISOString(),
    notes: 'Pertandingan sengit 3 babak'
  }
];

export const SEED_DOORPRIZES: Doorprize[] = [
  {
    id: 'dp-1',
    name: 'Sepeda Gunung Polygon',
    sponsor: 'Toko Sepeda Jaya',
    categoryFilter: 'Semua'
  },
  {
    id: 'dp-2',
    name: 'Kipas Angin Cosmos',
    sponsor: 'Ibu RT 05',
    categoryFilter: 'Dewasa'
  },
  {
    id: 'dp-3',
    name: 'Paket Alat Tulis & Tas Sekolah',
    sponsor: 'Karang Taruna',
    categoryFilter: 'Anak-anak'
  },
  {
    id: 'dp-4',
    name: 'Smartwatch Sport',
    sponsor: 'Donatur Warga',
    categoryFilter: 'Remaja'
  }
];

// LocalStorage Helper Utilities
export class StorageService {
  static get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error reading key ${key} from LocalStorage:`, e);
      return fallback;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error setting key ${key} in LocalStorage:`, e);
    }
  }

  static initializeDefaults(force = false): void {
    if (force || !localStorage.getItem(STORAGE_KEYS.COMPETITIONS)) {
      this.set(STORAGE_KEYS.COMPETITIONS, SEED_COMPETITIONS);
      this.set(STORAGE_KEYS.PARTICIPANTS, SEED_PARTICIPANTS);
      this.set(STORAGE_KEYS.REGISTRATIONS, SEED_REGISTRATIONS);
      this.set(STORAGE_KEYS.SCORES, []);
      this.set(STORAGE_KEYS.WINNERS, SEED_WINNERS);
      this.set(STORAGE_KEYS.CERTIFICATES, []);
      this.set(STORAGE_KEYS.DOORPRIZES, SEED_DOORPRIZES);
      this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      this.set(STORAGE_KEYS.HISTORY, [
        {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          action: 'System Initialized',
          details: 'Data awal perlombaan 17an berhasil disiapkan.'
        }
      ]);
    }
  }

  static getAllData() {
    return {
      competitions: this.get<Competition[]>(STORAGE_KEYS.COMPETITIONS, []),
      participants: this.get<Participant[]>(STORAGE_KEYS.PARTICIPANTS, []),
      registrations: this.get<Registration[]>(STORAGE_KEYS.REGISTRATIONS, []),
      scores: this.get<Score[]>(STORAGE_KEYS.SCORES, []),
      winners: this.get<Winner[]>(STORAGE_KEYS.WINNERS, []),
      certificates: this.get<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []),
      doorprizes: this.get<Doorprize[]>(STORAGE_KEYS.DOORPRIZES, []),
      settings: this.get<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
      history: this.get<ActivityLog[]>(STORAGE_KEYS.HISTORY, [])
    };
  }

  static restoreAllData(data: any) {
    if (!data) return false;
    if (data.competitions) this.set(STORAGE_KEYS.COMPETITIONS, data.competitions);
    if (data.participants) this.set(STORAGE_KEYS.PARTICIPANTS, data.participants);
    if (data.registrations) this.set(STORAGE_KEYS.REGISTRATIONS, data.registrations);
    if (data.scores) this.set(STORAGE_KEYS.SCORES, data.scores);
    if (data.winners) this.set(STORAGE_KEYS.WINNERS, data.winners);
    if (data.certificates) this.set(STORAGE_KEYS.CERTIFICATES, data.certificates);
    if (data.doorprizes) this.set(STORAGE_KEYS.DOORPRIZES, data.doorprizes);
    if (data.settings) this.set(STORAGE_KEYS.SETTINGS, data.settings);
    if (data.history) this.set(STORAGE_KEYS.HISTORY, data.history);
    return true;
  }
}
