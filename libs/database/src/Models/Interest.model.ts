export interface Interest {
  id: string;
  interest: string;
}

export type Interestcreateble = Omit<Interest, 'id'>;
export type Interestupdateable = Partial<Interestcreateble>;
