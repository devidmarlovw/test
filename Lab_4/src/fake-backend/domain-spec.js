/**
 * @typedef EmployeeBE
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} username
 * @property {string} email
 * @property {string} crtUsr
 * @property {string} crtTms
 * @property {string} mdfUsr
 * @property {string} mdfTms
 * @property {'EMPLOYEE'|'HR'|'TEAMLEAD'} role
 * @property {'ACTIVE'|'INACTIVE'} status
 * @property {string} contractStartDate
 * @property {string} contractEndDate
 * @property {string} v
 * @property {TeamBE} teamDetails
 * @property {number} totalVacationDays
 */

/**
 * @typedef RequestBE
 * @property {string} id
 * @property {string} crtUsr
 * @property {string} crtTms
 * @property {string} mdfUsr
 * @property {string} mdfTms
 * @property {string} startDate
 * @property {string} endDate
 * @property {'PENDING'|'APPROVED'|'REJECTED'} status
 * @property {'VACATION'|'MEDICAL'} type
 * @property {string} description
 * @property {string} rejectReason
 * @property {string} noOfDays
 * @property {number} v
 * @property {EmployeeDetailsBE} employeeDetails
 */

/**
 * @typedef EmployeeDetailsBE
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} employeeId
 */

/**
 * @typedef TeamBE
 * @property {number | string} id
 * @property {string} name
 * @property {string} crtUsr
 * @property {string} crtTms
 * @property {string} mdfUsr
 * @property {string} mdfTms
 * @property {'ACTIVE'|'INACTIVE'} status
 */

/**
 * @typedef FreeDayBE
 * @property {string} name
 * @property {string} startDate
 * @property {string} endDate
 */

/**
 * @typedef HolidayBE
 * @property {string} employeeId
 * @property {string} startDate
 * @property {string} endDate
 * @property {'PENDING'|'APPROVED'|'REJECTED'} status
 * @property {'VACATION'|'MEDICAL'} type
 * @property {string} description
 * @property {string} rejectReason
 * @property {string} noOfDays
 * @property {number} v
 * @property {EmployeeDetailsBE} employeeDetails
 */

/**
 * @typedef LegallyDaysOffBE
 * @property {string} date
 * @property {string} description
 */

/**
 * @typedef LegallyDaysOffDetailsListBE
 * @property {Array<LegallyDaysOffBE>} items
 */

/**
 * @typedef DataBE
 * @property {Array<TeamBE>} teams
 * @property {Array<EmployeeBE>} employees
 * @property {Array<RequestBE>} requests
 * @property {Array<FreeDayBE>} freeDays
 * @property {Array<HolidayBE>} holidays
 * @property {Array<LegallyDaysOffBE>} legalDaysOff
 */

/**
 * @typedef AddHolidayBE
 * @property {Array<string>} employeeIds
 * @property {string} noDays
 * @property {'INCREASE'|'DECREASE'} type
 * @property {string} description
 */

/**
 * @typedef LegalDayOff
 * @property {Date} date
 * @property {string} description
 */


