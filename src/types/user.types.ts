// User-related types

export type UserRole = 'staff' | 'approvelevel1' | 'approvelevel2' | 'finance';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  created_at?: string;
}
