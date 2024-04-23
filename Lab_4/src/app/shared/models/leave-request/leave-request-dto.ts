export interface LeaveRequestDTO {
  id: string;
  crtUsr: string;
  crtTms: string;
  mdfUsr: string;
  mdfTms: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  description: string;
  rejectReason: string;
  noOfDays: string;
  v: number;
  employeeDetails: EmployeeDetails;

    emit(leaveRequest: LeaveRequestDTO): void;
}

export interface EmployeeDetails {
  firstName: string;
  lastName: string;
  employeeId: string;
}
