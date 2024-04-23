module.exports = function (app) {
  const DATA = require('../data');

  app.get('/core/api/v1/employees/:userId/remaining-days-off', (req, res) => {
    const userId = req.params['userId'];
    const requests = DATA.requests.filter(request => {
      return (
        request.employeeDetails.employeeId === userId &&
        request.type !== 'MEDICAL' &&
        (request.status === 'APPROVED' || request.status === 'PENDING')
      );
    });

    let numberOfDays = 0;

    requests.forEach(request => {
      numberOfDays += Number(request.noOfDays);
    });

    const employee = DATA.employees.find(emp => emp.id === userId);

    remainingDays = employee.totalVacationDays - numberOfDays;

    res.status(200).contentType('application/json').send(
      JSON.stringify({
        remainingDays,
      })
    );
  });

  app.get('/core/api/v1/requests/by-period', (req, res) => {
    const startDate = req.query['startDate'];
    const endDate = req.query['endDate'];
    const teamName = req.query['teamName'];

    if (teamName) {
      employees = DATA.employees.filter(
        empl => empl.teamDetails.name === teamName
      );
    } else {
      employees = DATA.employees;
    }

    employees.forEach(empl => {
      if (empl.status === 'INACTIVE') {
        index = employees.indexOf(empl);
        if (index > -1) {
          employees.splice(index, 1);
        }
      }
    });

    requestsByTeamAndMonth = {
      employeeLeaveRequests: employees.map(empl => {
        let medicalDays = 0;
        let vacationDays = 0;
        const requests = DATA.requests.filter(request => {
          if (
            startDate &&
            endDate &&
            new Date(request.startDate) < new Date(startDate) &&
            new Date(request.endDate) > new Date(endDate)
          ) {
            return false;
          }
          if (request.status !== 'APPROVED') {
            return false;
          }
          if (request.employeeDetails.employeeId === empl.id) {
            if (request.type === 'MEDICAL') {
              medicalDays = medicalDays + Number(request.noOfDays);
            } else {
              if (request.type === 'VACATION') {
                vacationDays = vacationDays + Number(request.noOfDays);
              }
            }
          }
          return true;
        });

        /**
         * @type  {EmployeeLeaveRequestDetailsBE}
         */
        return {
          firstName: empl.firstName,
          lastName: empl.lastName,
          noOfVacationDays: medicalDays,
          noOfMedicalDays: vacationDays,
          leaveRequests: requests.filter(
            request => request.employeeDetails.employeeId === empl.id
          ),
        };
      }),
    };

    res
      .status(200)
      .contentType('application/json')
      .send(JSON.stringify(requestsByTeamAndMonth));
  });

  app.get('/core/api/v1/misc/legally-days-off', (req, res) => {
    const years = req.query['years'];
    const periods = req.query['periods'];
    response = {
      items: DATA.legalDaysOff.filter(legallyDayOff => {
        if (years) {
          if (
            legallyDayOff.date.split('-')[0] >= years.split(',')[0] &&
            legallyDayOff.date.split('-')[0] < years.split(',')[1]
          ) {
            return true;
          }
          return false;
        }
        if (periods && !years) {
          if (
            legallyDayOff.date.substring(0, 7) >= periods.split(',')[0] &&
            legallyDayOff.date.substring(0, 7) < periods.split(',')[1]
          ) {
            return true;
          }
          return false;
        }
        return true;
      }),
    };

    res
      .status(200)
      .contentType('application/json')
      .send(JSON.stringify(response));
  });
};
