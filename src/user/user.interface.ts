import { User } from '@prisma/client';

export type UserCreateable = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UserUpdateable = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
