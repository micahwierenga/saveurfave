var DB = require("../models").models;

// To seed the users table, first run node dbSetup.js in the db directory.
// Then run node seed.js in the same directory. This will create the user
// below in the users table.
let userCreate = function() {
	return DB.User.create({
	    email: "micah@micah.com",
	    password:"micah",
	    username: "micah",
  	})
	.then(function(user) {
    	console.log(user);
	});
};


userCreate()
.then(function() {
	process.exit();
});

