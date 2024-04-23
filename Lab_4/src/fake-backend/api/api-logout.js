const { send } = require("process");

module.exports = function (app) {
    const DATA = require("../data");
    app.post("/core/api/v1/logout", (req,res) => {
      const reqBody = req.body;
       USER = require("./api-login").USER;
       USER = null;
       res.status(200).contentType("application/json").send();
    });

  };