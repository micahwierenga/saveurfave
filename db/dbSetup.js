var DB = require("../models");

// To reset the db, run node dbSetup.js inside the db directory.
// Setting force to true runs DROP TABLE IF EXISTS.
DB.sequelize.sync({force: true}).then(function(){
  process.exit();
});