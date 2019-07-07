const Sequelize = require('sequelize');
const pg = require('pg');

// Initialize sequelize. If the cloud-based server has a defined DATABASE_URL, use that. Otherwise, use local db.
let sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://micahwierenga@localhost:5432/omdb_favorites', {
	dialect: 'postgres',
	protocol: 'postgres',
	login: true
});

// Export sequelize/Sequelize for use in models
module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;

// Import models in order to export them for use in controllers
let User = sequelize.import('./user');
let FavoriteMovie = sequelize.import('./favorite_movie');

module.exports.models = {
	User: User,
	FavoriteMovie: FavoriteMovie
};