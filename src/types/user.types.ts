export type UserRole = 'staff' | 'approver_l1' | 'approver_l2' | 'finance';

export interface UserProfile {
  role: UserRole;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  profile: {
    role: UserRole;
  };
}
