const Sequelize = require('sequelize');
const pg = require('pg');

let sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://micahwierenga@localhost:5432/omdb_favorites', {
	dialect: 'postgres',
	protocol: 'postgres',
	login: true
});

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;

let User = sequelize.import('./user');

let FavoriteMovie = sequelize.import('./favorite_movie');

User.hasMany(FavoriteMovie);

module.exports.models = {
	User: User,
	FavoriteMovie: FavoriteMovie
};