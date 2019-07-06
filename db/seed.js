var DB = require("../models").models;

var userCreate = function() {
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

