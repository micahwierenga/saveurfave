const request = require('request');
const db = require('../models');
const FavoriteMovie = db.models.FavoriteMovie;
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const omdbUrl = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY;  

// Search omdb for submitted title
function search(req, res) {
	let url = omdbUrl + "&s=" + req.query.title;
	request(url, function(err, response, body) {
	    let movies = JSON.parse(body).Search;
	    if(!movies) {
	    	res.json({message: 'No results found'});
	    } else {
	    	res.json(movies);
	    }
	})
}

// Search omdb for movie by it's imdbID
function searchOneByMovieId(req, res) {
	let url = omdbUrl + "&i=" + req.params.id;
	request(url, function(err, response, body) {
	    res.json(JSON.parse(body));
	})
};

// Search db and omdb for one movie with imdbId and user id.
// First get all of the user's favorite movies. Then,
// check if returned movie is one of the user's favorites.
// If it is, add the user id and inUserFavorites properties
// to use on the front-end.
function searchOneByMovieIdAndUserId(req, res) {
	let movie_id = req.params.movie_id;
	let user_id = req.params.user_id;
	let url = omdbUrl + "&i=" + movie_id;
	FavoriteMovie.findAll({
		where: {
			user_id: user_id
		}
	})
	.then(function(userMovies) {
		request(url, function(err, response, body) {
			let parsedMovie = JSON.parse(body);
			for(let i = 0; i < userMovies.length; i++) {
				if(userMovies[i].favorite_movie_id == parsedMovie.imdbID) {
					parsedMovie.inUserFavorites = true;
					parsedMovie.favorite_movie_table_id = userMovies[i].id;
				}
			}
			res.json(parsedMovie);
		})
	})
}

// Search db by movie id and user id
function findByMovieIdAndUserId(req, res) {
	FavoriteMovie.findOne({
		where: {
			user_id: req.params.user_id,
			favorite_movie_id: req.params.favorite_movie_id
		}
	})
	.then(function(movie) {
    	res.json({movie: movie});
    });
}

// Search db for all user's favorited movies. Then get
// details of each movie, add the db id to each movie object.
function findByUserId(req, res) {
	FavoriteMovie.findAll({
		where: {
			user_id: req.params.user_id
		}
	})
	.then(function(movies) {
		if(movies.length < 1) {
			res.json({message: 'No results found'});
		} else {
			let movieList = [];

			for(let i = 0; i < movies.length; i++) {
			    let requestUrl = omdbUrl + '&i=' + movies[i].favorite_movie_id;
			    request(requestUrl, function(err, response, body) {
			    	let parsedBody = JSON.parse(body);
			    	parsedBody.id = movies[i].id;
			    	movieList.push(parsedBody);
			    	// Because of the asynchronous nature of the request functionality,
			    	// don't return altered movie objects until the movieList array length
			    	// and the user's movies array length are equal. Then sort by id to 
			    	// keep a consistent list.
				    if(movieList.length == movies.length) {
				    	movieList.sort((a, b) => (a.id > b.id) ? 1 : -1);
				    	res.json(movieList);
				    }
			    })
			}
		}
    })
}

function index(req, res) {
	FavoriteMovie.findAll()
	    .then(function(favoriteMovies) {
	    	res.json(favoriteMovies);
	    });
};

function show(req, res) {
	FavoriteMovie.findByPk(req.params.id)
	    .then(function(favoriteMovie) {
	    	res.json(favoriteMovie);
	    });
};

function create(req, res) {
	FavoriteMovie.create(req.body)
	    .then(function(newFavoriteMovie) {
	    	res.json(newFavoriteMovie);
	    });
};

function update(req, res) {
	FavoriteMovie.findByPk(req.params.id)
	    .then(function(favoriteMovie) {
	    	return favoriteMovie.updateAttributes(req.body);
	    })
	    .then(function(favoriteMovie) {
	    	res.json(favoriteMovie);
	    });
};

function destroy(req, res) {
	FavoriteMovie.findByPk(req.params.id)
	    .then(function(favoriteMovie) {
	    	return favoriteMovie.destroy();
	    })
	    .then(function(favoriteMovie) {
	    	res.json(favoriteMovie);
	    });
}

module.exports.search = search;
module.exports.searchOneByMovieId = searchOneByMovieId;
module.exports.findByMovieIdAndUserId = findByMovieIdAndUserId;
module.exports.searchOneByMovieIdAndUserId = searchOneByMovieIdAndUserId;
module.exports.findByUserId = findByUserId;
module.exports.index = index;
module.exports.show = show;
module.exports.create = create;
module.exports.update = update;
module.exports.destroy = destroy;