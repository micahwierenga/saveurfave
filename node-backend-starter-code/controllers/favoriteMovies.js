const request = require('request');
const db = require('../models');
const FavoriteMovie = db.models.FavoriteMovie;
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const omdbUrl = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY;  

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

function searchOne(req, res) {
	let url = omdbUrl + "&i=" + req.params.id;
	request(url, function(err, response, body) {
	    res.json(JSON.parse(body));
	})
};

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

function findByUserId(req, res) {
	FavoriteMovie.findAll({
		where: {
			user_id: req.params.user_id
		}
	})
	.then(function(movies) {
		let movieList = [];

		for(let i = 0; i < movies.length; i++) {
		    let requestUrl = omdbUrl + '&i=' + movies[i].favorite_movie_id;
		    request(requestUrl, function(err, response, body) {
		    	let parsedBody = JSON.parse(body);
		    	parsedBody.id = movies[i].id;
		    	movieList.push(parsedBody);
			    if(movieList.length == movies.length) {
			    	res.json(movieList);
			    }
		    })
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
	    	console.log(favoriteMovie);
	    	res.json(favoriteMovie);
	    });
};

function create(req, res) {
	FavoriteMovie.create(req.body)
	    .then(function(newFavoriteMovie) {
	    	console.log(newFavoriteMovie);
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
	console.log('req.params.id: ', req.params.id);
	FavoriteMovie.findByPk(req.params.id)
	    .then(function(favoriteMovie) {
	    	return favoriteMovie.destroy();
	    })
	    .then(function(favoriteMovie) {
	    	res.json(favoriteMovie);
	    });
}

module.exports.search = search;
module.exports.searchOne = searchOne;
module.exports.findByMovieIdAndUserId = findByMovieIdAndUserId;
module.exports.findByUserId = findByUserId;
module.exports.index = index;
module.exports.show = show;
module.exports.create = create;
module.exports.update = update;
module.exports.destroy = destroy;