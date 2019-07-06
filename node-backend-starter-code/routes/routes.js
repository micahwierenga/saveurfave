const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.js');
const favoriteMoviesController = require('../controllers/favoriteMovies.js');

// User Routes

// index
router.get('/api/users', usersController.index);

// create
router.post('/api/users', usersController.create);

// show
router.get('/api/users/:id', usersController.show);

// update
router.put('/api/users/:id', usersController.update);

// destroy
router.delete('/api/users/:id', usersController.destroy);

// login
router.post('/loginUser', usersController.loginUser);


// Movies Routes

// search index
router.get('/api/searchMovies/', favoriteMoviesController.search);

// search show
router.get('/api/searchMovies/:id', favoriteMoviesController.searchOne);

// find favorite by user id and movie id
router.get('/api/favorites/:user_id/:favorite_movie_id', favoriteMoviesController.findByMovieIdAndUserId);

// find favorites by user id
router.get('/api/favorites/:user_id', favoriteMoviesController.findByUserId);

// index
router.get('/api/favorites', favoriteMoviesController.index);

// create
router.post('/api/favorites', favoriteMoviesController.create);

// show
router.get('/api/favorite/:id', favoriteMoviesController.show);

// update
router.put('/api/favorites/:id', favoriteMoviesController.update);

// destroy
router.delete('/api/favorites/:id', favoriteMoviesController.destroy);

module.exports = router;