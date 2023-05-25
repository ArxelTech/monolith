export interface ServiceInterface {
  id: string;
  service: string;
}

export type ServiceCreateable = Pick<ServiceInterface, 'service'>;
export type ServiceUpdateable = Partial<ServiceCreateable>;
