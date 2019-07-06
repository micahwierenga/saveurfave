module.exports = function(sequelize, Sequelize) {
	var model = sequelize.define('favorite_movie', {
		favorite_movie_id: Sequelize.STRING,
		user_id: Sequelize.INTEGER
	})
	return model;
};

