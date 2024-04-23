export interface UserDetails {
  roles: string[],
  username: string,
  employeeId: string,
  teamDetails: {
    id: string,
    name: string
  }
}
