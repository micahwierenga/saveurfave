const bcrypt = require('bcryptjs');
const auth = require('../auth');
const db = require('../models');
const User = db.models.User;

function index(req, res) {
	User.findAll()
	    .then(function(users) {
	    	res.json(users);
	    });
};

function show(req, res) {
	User.findByPk(req.params.id)
	    .then(function(user) {
	    	console.log(user);
	    	res.json(user);
	    });
};

// Create new user on signin, using bcrypt and the 
// auth.js functionality to hash their password and
// create a token.
function create(req, res) {
	bcrypt.genSalt(10, function(err, salt) {
	   bcrypt.hash(req.body.password, salt, function(err, hash) {
	      req.body.password = hash;

	      User.create(req.body)
	         .then(function(user) {
	            if (!user) return error(res, "not saved");
	            auth.createJWT(user);
	            res.json({
	            	token: auth.createJWT(user),
	                user: user
	            });
	         })
	   });
	});
};

function update(req, res) {
	User.findByPk(req.params.id)
	    .then(function(user) {
	    	return user.updateAttributes(req.body);
	    })
	    .then(function(user) {
	    	res.json(user);
	    });
};

function destroy(req, res) {
	User.findByPk(req.params.id)
	    .then(function(user) {
	    	return user.destroy();
	    })
	    .then(function() {
	    	res.redirect('/index');
	    });
}

// Take login data and confirm that user's email and password match
function loginUser(req, res) {
  User.findOne({
     where: {
        email: req.body.email
     }
  }).then(function(user) {
  	// Get comparePassword method from user object
    let compare = 'user.$modelOptions.instanceMethods.comparePassword'

    // If user's email doesn't exist in db, return error
    if (!user) {
        return res.status(401).send({
           message: 'Invalid email or password.'
        });
    }

    validPassword = function() {
    	// Use bcrypt to compare submitted user password and db user password
        bcrypt.compare(req.body.password, user.dataValues.password, function(err, isMatch) {
        	// If the passwords match, send user and token back to front end
            if (isMatch === true) {
                res.send({
                    token: auth.createJWT(user),
                 	user: user
                });
            }
            // If the passwords do not match, send error
            else if (isMatch === false) {
              res.send({ message: 'Invalid password'});
            }
           
        });
    };
    validPassword();
  });
}

module.exports.index = index;
module.exports.show = show;
module.exports.create = create;
module.exports.update = update;
module.exports.destroy = destroy;
module.exports.loginUser = loginUser;
