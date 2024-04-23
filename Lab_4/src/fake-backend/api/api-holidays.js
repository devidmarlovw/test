const { send } = require('process');
const DATA = require('../data');

module.exports = function (app) {
  const DATA = require('../data');

  app.get('/core/public/api/holidays', (req, res) => {
    const employeeId = req.query['employeeId'];
    const startDate = req.query['startDate'];
    const endDate = req.query['endDate'];

    const holidays = DATA.holidays.filter(holiday => {
      if (employeeId && employeeId !== holiday.employeeId) {
        return false;
      }
      if (startDate && new Date(holiday.startDate) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(holiday.endDate) > new Date(endDate)) {
        return false;
      }
      return true;
    });
    res
      .status(200)
      .contentType('application/json')
      .send(JSON.stringify(holidays));
  });

  app.get('/core/api/v1/employees/:userId/requests', (req, res) => {
    const startDate = req.query['startDate'];
    const endDate = req.query['endDate'];
    const userId = req.params['userId'];
    const employee = DATA.employees.find(employee => employee.id === userId);

    if (!employee) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'EMPLOYEE_NOT_FOUND',
            },
          ],
        });
    } else {
      const requests = DATA.requests.filter(request => {
        if (request.employeeDetails) {
          if (request.employeeDetails.employeeId !== userId) {
            return false;
          }
        }
        return true;
      });

      res
        .status(200)
        .contentType('application/json')
        .send(JSON.stringify({ items: requests }));
    }
  });

  app.put('/core/api/v1/employees/:userId/requests/:requestId', (req, res) => {
    const requestId = req.params['requestId'];
    const userId = req.params['userId'];
    const reqBody = req.body;
    const type = reqBody.type;
    const description = reqBody.description;
    const startDate = reqBody.startDate;
    const endDate = reqBody.endDate;
    const v = reqBody.v;

    const employee = DATA.employees.find(employee => employee.id === userId);

    const requestIndex = DATA.requests.findIndex(
      request => request.id === requestId
    );

    const request = DATA.requests.find(req => req.id === requestId);
    const version = request.v;

    if (request.employeeDetails.employeeId !== employee.id) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'LEAVE_REQUEST_NOT_FOUND',
            },
          ],
        });
    } else {
      if (request.v !== v) {
        res
          .status(400)
          .contentType('application/json')
          .send({
            errors: [
              {
                errorCode: 'LEAVE_REQUEST_UPDATE_VERSION_CONFLICT',
              },
            ],
          });
      }
      if (request.status === 'REJECTED') {
        res
          .status(400)
          .contentType('application/json')
          .send({
            errors: [
              {
                errorCode: 'LEAVE_REQUEST_UPDATE_ALREADY_REJECTED',
              },
            ],
          });
      }
      DATA.requests[requestIndex] = {
        id: requestId,
        crtUsr: employee.crtUsr,
        crtTms: employee.crtTms,
        mdfUsr: employee.mdfUsr,
        mdfTms: employee.mdfTms,
        startDate: startDate,
        endDate: endDate,
        status: 'PENDING',
        type: type,
        description: description,
        rejectReason: request.rejectReason,
        noOfDays: request.noOfDays,
        v: Number(request.v) + 1,
        employeeDetails: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          employeeId: userId,
        },
      };

      res
        .status(204)
        .contentType('application/json')
        .send(DATA.requests[requestIndex]);
    }
  });

  app.post('/core/api/v1/employees/:userId/requests', (req, res) => {
    const reqBody = req.body;
    const userId = req.params['userId'];
    const employee = DATA.employees.find(employee => employee.id === userId);
    const startDate = new Date(reqBody.startDate);
    const endDate = new Date(reqBody.endDate);

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

    remainingDays = employee.totalVacationDays - numberOfDays;

    if (!employee) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'EMPLOYEE_NOT_FOUND',
            },
          ],
        });
    } else {
      diff = endDate.getTime() - startDate.getTime();
      pickedDays = diff / (1000 * 60 * 60 * 24) + 1;

      if (remainingDays - pickedDays >= 0) {
        let idR = 1;
        for (i = 1; i < 20; ) {
          if (DATA.requests.find(req => i.toString() === req.id)) {
            i++;
          } else {
            idR = i.toString();
            break;
          }
        }
        DATA.requests.push({
          id: idR,
          crtUsr: employee.id,
          crtTms: employee.crtTms,
          mdfUsr: employee.mdfUsr,
          mdfTms: employee.mdfTms,
          startDate: reqBody.startDate,
          endDate: reqBody.endDate,
          status: 'PENDING',
          type: reqBody.type,
          description: reqBody.description,
          rejectReason: '',
          noOfDays: pickedDays,
          v: 0,
          employeeDetails: {
            firstName: employee.firstName,
            lastName: employee.lastName,
            employeeId: employee.id,
          },
        });

        remainingDays = remainingDays - pickedDays;

        res
          .status(201)
          .contentType('application/json')
          .send({ items: DATA.requests });
      } else {
        if (remainingDays - pickedDays < 0) {
          res.status(400).contentType('application/json');
          send({
            errors: [
              {
                errorCode: 'LEAVE_REQUEST_CREATE_INVALID_NO_DAYS_OFF',
              },
            ],
          });
        }
      }
    }
  });

  app.get('/core/public/api/freeDays', (req, res) => {
    const startDate = req.query['startDate'];
    const endDate = req.query['endDate'];

    const requests = DATA.legalDaysOff.filter(request => {
      if (startDate && new Date(request.startDate) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(request.endDate) > new Date(endDate)) {
        return false;
      }
      return true;
    });
    res
      .status(200)
      .contentType('application/json')
      .send(JSON.stringify(requests));
  });

  app.delete(
    '/core/api/v1/employees/:employeeId/requests/:requestId',
    (req, res) => {
      const requestId = req.params['requestId'];
      if (requestId) {
        requests = DATA.requests;
        const request = DATA.requests.find(r => r.id === requestId);
        const index = DATA.requests.indexOf(request);

        if (
          request &&
          (request.status === 'APPROVED' || request.status === 'PENDING')
        ) {
          requests.splice(index, 1);
          res.status(204).contentType('application/json').send();
        }
      } else {
        res
          .status(400)
          .contentType('application/json')
          .send({
            errors: [
              {
                errorCode: 'LEAVE_REQUEST_NOT_FOUND',
                devMessage: 'The request does not exist!',
              },
            ],
          });
      }
    }
  );
};
