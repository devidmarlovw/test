
let loggedUser  = null;

module.exports = function (app) {
  const DATA = require('../data');
  app.post('/core/api/v1/login', (req, res) => {
    const reqBody = req.body;
    const currentEmployee = DATA.employees.find(
      employee => employee.username === reqBody.username
    );

    if (!reqBody.username || !reqBody.password || !currentEmployee) {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'LOGIN_INVALID_CREDENTIALS',
            },
          ],
        });
    }

    const responseData = {
      accessToken: `AT username=${currentEmployee.username}`,
      refreshToken: 'RT',
      accessTokenExpirationTime: '3600',
      refreshTokenExpirationTime: '3600',
    };

    loggedUser = currentEmployee;
    // module.exports.USER = responseData;

    res.status(200).contentType('application/json').send(responseData);
  });

  app.post('/core/api/v1/refresh', (req, res) => {
    const reqBody = req.body;

    if (reqBody.refreshToken !== 'RT') {
      res
        .status(400)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'TOKEN_EXPIRED',
            },
          ],
        });
    }

    const responseData = {
      accessToken: `AT username=${loggedUser.username}`,
      refreshToken: 'RT',
      accessTokenExpirationTime: '3600',
      refreshTokenExpirationTime: '3600',
    };

    res.status(200).contentType('application/json').send(responseData);
  });

  app.get('/core/api/v1/user', (req, res) => {
    const DATA = require('../data');
    const employee = DATA.employees;

    const reqHeaders = req.headers;
    const accessToken = reqHeaders.authorization;
    const userName = accessToken.split('=')[1];

    const user = employee.find(employee => employee.username === userName);

    if (!user) {
      res
        .status(401)
        .contentType('application/json')
        .send({
          errors: [
            {
              errorCode: 'USERNAME_INVALID',
            },
          ],
        });
    }

    const responseData = {
      roles: user.role,
      username: user.username,
      employeeId: user.id,
      teamDetails: user.teamDetails,
    };

    return res.status(200).contentType('application/json').send(responseData);
  });
};
