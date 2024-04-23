const findUserByToken = require('../find-user-by-token');

module.exports = function (app) {
  const DATA = require('../data');

  app.get('/core/api/v1/requests', (req, res) => {
    const startDate = req.query['startDate'];
    const endDate = req.query['endDate'];
    const searchText = req.query['search'];
    const status = req.query['status'];
    const type = req.query['type'];

    const USER = findUserByToken(req);

    const role = USER.role[0];

    const team = USER.teamDetails;

    const requests = DATA.requests.filter(request => {
      if (
        startDate &&
        new Date(request.startDate).getTime() < new Date(startDate).getTime()
      ) {
        return false;
      }

      if (endDate && new Date(request.endDate) > new Date(endDate)) {
        return false;
      }
      if (searchText) {
        const employee = DATA.employees.find(
          empl => empl.id === request.employeeDetails.employeeId
        );
        if (employee) {
          if (
            !employee.firstName
              .toLowerCase()
              .includes(searchText.toLowerCase()) &&
            !employee.lastName.toLowerCase().includes(searchText.toLowerCase())
          ) {
            return false;
          }
        }
        if (!employee) {
          return false;
        }
      }

      if (status && request.status !== status) {
        return false;
      }

      if (type && request.type !== type) {
        return false;
      }
      const employeeId = request.employeeDetails.employeeId;
      const employee = DATA.employees.find(emp => emp.id === employeeId);

      if (role === 'TEAM_LEAD' && team.id !== employee.teamDetails.id) {
        return false;
      }

      return true;
    });

    res
      .status(200)
      .contentType('application/json')
      .send(JSON.stringify({ items: requests }));
  });

  app.get('/core/public/api/requests/approved', (req, res) => {
    const startDate = req.query['startDate'];
    const endDate = req.query['endDate'];
    const teamId = req.query['teamId'];

    const requests = DATA.requests.filter(request => {
      if (startDate && new Date(request.startDate) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(request.endDate) > new Date(endDate)) {
        return false;
      }
      if (request.status !== 'APPROVED') {
        return false;
      }
      if (teamId) {
        const employee = DATA.employees.find(
          empl => empl.id === request.employeeId
        );
        if (employee.teamId !== teamId) {
          return false;
        }
      }
      return true;
    });
    res
      .status(200)
      .contentType('application/json')
      .send(JSON.stringify(requests));
  });

  app.patch(
    '/core/api/v1/employees/:userId/requests/:requestId',
    (req, res) => {
      const reqBody = req.body;
      const userId = req.params['userId'];
      const requestId = req.params['requestId'];
      const requestStatus = reqBody['type'];
      const rejectionReason = reqBody['rejectionReason'];
      const v = reqBody['v'];
      const EMPLOYEE = findUserByToken(req);

      const employee = DATA.employees.find(employee => employee.id === userId);
      const request = DATA.requests.find(r => r.id === requestId);

      if (!request) {
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
      }
      if (request.status !== 'PENDING') {
        res
          .status(400)
          .contentType('application/json')
          .send({
            errors: [
              {
                errorCode: 'LEAVE_REQUEST_PATCH_NOT_ALLOWED',
              },
            ],
          });
      }
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

      if (request) {
        if (requestStatus === 'APPROVAL') {
          request.status = 'APPROVED';
        } else {
          request.status = 'REJECTED';
          request.rejectionReason = rejectionReason;
        }
        request.mdfUsr = EMPLOYEE.id;
        res.status(204).contentType('application/json').send(request);
      }
    }
  );

  app.get('/core/public/api/requests/:requestId', (req, res) => {
    const requestId = req.params['requestId'];

    const requestIndex = DATA.requests.findIndex(
      request => request.requestId === requestId
    );

    if (requestIndex === -1) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'E0001C400',
              devMessage: 'Something is not valid in the request',
            },
          ],
        });
    }

    res
      .status(200)
      .contentType('application/json')
      .send(JSON.stringify(DATA.requests[requestIndex]));
  });
};
