module.exports = function (req) {
  const DATA = require('./data');
  const bearerHeader = req.headers['authorization'];
  let username;

  if (bearerHeader) {
    const tokenElements = bearerHeader.split('=');
    username = tokenElements[1];
  }
  
  const employee = DATA.employees.find(
    employee => employee.username === username
  );

  return employee
}
