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

function loginUser(req, res) {
  User.findOne({
     where: {
        email: req.body.email
     }
  }).then(function(user) {
     let compare = 'user.$modelOptions.instanceMethods.comparePassword'

     if (!user) {
        return res.status(401).send({
           message: 'Invalid email or password.'
        });
     }
     let p1 = user.dataValues.password,
         p2 = req.body.password;

     validPassword = function() {
        bcrypt.compare(req.body.password, user.dataValues.password, function(err, isMatch) {
           if (isMatch === true) {
              res.send({
                 token: auth.createJWT(user),
                 user: user
              });
            }
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
