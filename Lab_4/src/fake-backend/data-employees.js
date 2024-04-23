/**
 * @type {EmployeeBE}
 */
const EMPLOYEES = [
  {
    id: "1",
    firstName: "Alex",
    lastName: "Deac",
    username: "alex",
    teamDetails: { id: "2", name: "Frontend" },
    email: "alex.deac@axonsoft.ro",
    totalVacationDays: "25",
    role: ["TEAM_LEAD"],
    v: "1",
    contractStartDate: "2022-09-17",
    status: 'ACTIVE'
  },
  {
    id: "2",
    firstName: "Ionel",
    lastName: "Gretyniuc",
    username: "ionel",
    teamDetails: { id: "3", name: "HR" },
    email: "ionel.gretyniuc@axonsoft.ro",
    totalVacationDays: "25",
    role: ["HR"],
    v: "1",
    contractStartDate: "2022-09-17",
    status: 'ACTIVE'
  },
  {
    id: "3",
    firstName: "Maria",
    lastName: "Popescu",
    username: "maria",
    teamDetails: { id: "2", name: "Frontend" },
    email: "maria.popescu@axonsoft.ro",
    totalVacationDays: "27",
    role: ["USER"],
    v: "1",
    contractStartDate: "2022-11-29",
    status: 'ACTIVE'
  },
  {
    id: "4",
    firstName: "Anca",
    lastName: "Muresan",
    username: "anca",
    teamDetails: { id: "1", name: "Backend" },
    email: "anca.muresan@axonsoft.ro",
    totalVacationDays: "20",
    role: ["USER"],
    v: "1",
    contractStartDate: "2022-11-29",
    status: 'ACTIVE'
  },
  {
    id: "5",
    firstName: "Paula",
    lastName: "Petrinca",
    username: "paula.petrinca",
    teamDetails: { id: "1", name: "Backend" },
    email: "p.paula@axonsoft.ro",
    totalVacationDays: "20",
    role: ["USER", "TEAM_LEAD"],
    v: "1",
    contractStartDate: "2022-11-29",
    status: 'ACTIVE'
  },
];

module.exports = EMPLOYEES;
