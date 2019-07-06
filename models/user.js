module.exports = function(sequelize, Sequelize) {
	var model = sequelize.define('user', {
		email: Sequelize.STRING,
		password: Sequelize.STRING,
		username: Sequelize.STRING
	})
	return model;
};