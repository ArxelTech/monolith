export interface Event {
  id: string;
  userId: string;
  title: string;
  description: string;
  pictures: Array<string>;
  videoUrl: string;
  state: string;
  lga: string;
  address: string;
  time: Date;
  date: Date;
  people: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

export type Eventcreateable = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;
export type Eventupdatable = Partial<Eventcreateable>;
