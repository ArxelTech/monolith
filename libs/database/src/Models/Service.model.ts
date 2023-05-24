export interface Service {
  id: string;
  service: string;
}

export type ServiceCreate = Omit<Service, 'id'>;
export type ServiceUpdate = Partial<ServiceCreate>;
