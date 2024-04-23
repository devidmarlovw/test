module.exports = function (app) {
  const DATA = require('../data');

  app.get('/core/api/v1/employees', (req, res) => {
    const teamId = req.query['teamId'];
    if (!teamId || teamId === 'ALL') {
      employees = DATA.employees;
    } else {
      employees = DATA.employees.filter(
        employee => employee.teamDetails.id === teamId
      );
    }

    // setTimeout(()=>{
    res
      .status(200)
      .contentType('application/json')
      .send(JSON.stringify({ items: employees }));
    // }, 5000);
  });

  app.post('/core/api/v1/employees', (req, res) => {
    const reqBody = req.body;
    const usernameFromEmployee = DATA.employees.find(
      employee => employee.username === reqBody.username
    );
    const team = DATA.teams.find(
      team => Number(team.id) === Number(reqBody.teamId)
    );

    if (usernameFromEmployee) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'KEYCLOAK_CREATE_EMPLOYEE_USERNAME_CONFLICT',
            },
          ],
        });
    } else {
      const newEmpIndex =
        DATA.employees.push({
          id: `${DATA.employees.length + 1}`,
          firstName: reqBody.firstName,
          lastName: reqBody.lastName,
          username: reqBody.username,
          email: reqBody.email,
          role: reqBody.role,
          totalVacationDays: reqBody.noDaysOff,
          teamDetails: { id: reqBody.teamId, name: team.name },
          contractStartDate: reqBody.contractStartDate,
        }) - 1;
      res
        .status(201)
        .contentType('application/json')
        .send({ items: DATA.employees[newEmpIndex] });
    }
  });

  app.patch('/core/api/v1/employees/:id', (req, res) => {
    const reqBody = req.body;
    const id = req.params['id'];
    const teamId = reqBody['teamId'];
    const team = DATA.teams.find(team => Number(team.id) === Number(teamId));
    const employee = DATA.employees.find(empl => empl.id === id);
    const version = employee.v;

    if (reqBody.v < version) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'EMPLOYEE_UPDATE_VERSION_CONFLICT',
              devMessage: "Conflict on employee's versions!",
            },
          ],
        });
    } else {
      newEmployee = {
        id: id,
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        username: employee.username,
        teamDetails: { id: team.id, name: team.name },
        email: reqBody.email,
        totalVacationDays: employee.totalVacationDays,
        role: [reqBody.role],
        status: 'ACTIVE',
        contractStartDate: employee.contractStartDate,
        v: reqBody.v,
      };
      employees = DATA.employees;
      const index = employees.indexOf(employee);
      employees[index] = newEmployee;
      res
        .status(204)
        .contentType('application/json')
        .send({ items: employees });
    }
  });

  app.patch('/core/api/v1/employees/:id/inactivate', (req, res) => {
    const id = req.params['id'];
    employees = DATA.employees;
    const employee = DATA.employees.find(empl => empl.id === id);

    if (employee) {
      newEmployee = {
        ...employee,
        status: 'INACTIVE',
      };
      employees = DATA.employees;
      const index = employees.indexOf(employee);
      employees[index] = newEmployee;

      res
        .status(204)
        .contentType('application/json')
        .send({ items: employees });
    } else {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'E0001C400',
              devMessage: 'The employee does not exist!',
            },
          ],
        });
    }
  });

  app.get('/core/public/api/employees/:id', (req, res) => {
    const id = req.params['id'];
    const employee = DATA.employees.find(r => r.id === id);
    if (employee) {
      res.status(200).contentType('application/json').send(employee);
    }
  });

  app.post('/core/api/v1/employees/daysOff', (req, res) => {
    const reqBody = req.body;
    const employeeIds = reqBody['employeeIds'];
    const noDays = reqBody['noDays'];

    if (!reqBody.employeeIds) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 400,
              message:
                'NotNull.employeeYearlyDaysOffModificationRequest.employeeIds',
            },
          ],
        });
    }

    if (!reqBody.noDays) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 400,
              message:
                'NotNull.employeeYearlyDaysOffModificationRequest.noDays',
            },
          ],
        });
    }

    if (!reqBody.type) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 400,
              message: 'NotNull.employeeYearlyDaysOffModificationRequest.type',
            },
          ],
        });
    }

    if (!reqBody.description) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              message:
                'NotNull.employeeYearlyDaysOffModificationRequest.description',
              errorCode: '400',
            },
          ],
        });
    }

    for (let i = 0; i < employeeIds.length; i++) {
      const employee = DATA.employees.find(empl => empl.id === employeeIds[i]);
      const index = DATA.employees.indexOf(employee);
      if (reqBody.type === 'INCREASE') {
        const totalVacationDays = +employee.totalVacationDays + +noDays;
        employee.totalVacationDays = totalVacationDays;
        DATA.employees[index] = employee;
      } else {
        if (noDays > employee.totalVacationDays) {
          res
            .status(400)
            .contentType('application/json')
            .send({
              errors: [
                {
                  errorCode: 'EMPLOYEE_YEARLY_DAYS_OFF_DECREASE_NOT_PERMITTED',
                },
              ],
            });
        } else {
          const totalVacationDays = +employee.totalVacationDays - noDays;
          employee.totalVacationDays = totalVacationDays;
          DATA.employees[index] = employee;
        }
      }
    }
    res
      .status(204)
      .contentType('application/json')
      .send({ items: DATA.employees });
  });
};
