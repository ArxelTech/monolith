export interface InterestInterface {
  id: string;
  interest: string;
}

export type Interestcreateable = Omit<InterestInterface, 'id'>;
export type Interestupdateable = Partial<Interestcreateable>;
