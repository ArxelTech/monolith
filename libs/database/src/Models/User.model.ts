export interface User {
  id: string;
  email: string;
  password: string;
  username?: string;
  avatar: string;
  emailVerified: boolean;
  verified: boolean;
  facebookId: string;
  googleId: string;
  interests: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  isBusiness: boolean;
  services: Array<string>;
}

export type Usercreatebale = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type Userupdatebale = Partial<Usercreatebale>;
