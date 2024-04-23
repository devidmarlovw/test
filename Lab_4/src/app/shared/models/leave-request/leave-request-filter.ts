export interface LeaveRequestFilter {
  status: StatusFilter;
  startDate?: string;
  endDate?: string;
  search?: string;
  type: TypeFilter;
}

export enum StatusFilter {
  ALL = 'ALL',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum TypeFilter {
  ALL = 'ALL',
  MEDICAL = 'MEDICAL',
  VACATION = 'VACATION',
}
