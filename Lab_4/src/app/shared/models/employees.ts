export interface EmployeeDTO {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  teamDetails: {
      id: number,
      name: string
  },
  email: string,
  totalVacationDays: number,
  role:  string,
  v: number,
  contractStartDate: string,
  status: string;
}


export interface AddedEmployeeDTO {
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  role: string,
  teamId: number,
  contractStartDate: string,
  noDaysOff: number
}

export interface UpdatedEmployeeDTO {

    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    teamId: number,
    v: number

}
