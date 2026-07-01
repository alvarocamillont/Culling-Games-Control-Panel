export interface Sorcerer {
  id: string;
  name: string;
  colony: string;
  technique: string;
  points: number;
  status: 'Alive' | 'Deceased';
}

export interface KoganeLog {
  id: string;
  timestamp: string;
  text: string;
  type: 'system' | 'success' | 'danger' | 'transfer' | 'info';
}
