// Handle opening and closing of modals
function createCloseModalEventListeners() {
  // Grab elements with the close-modal-button class
  let closeModalButtons = document.getElementsByClassName('close-modal-button');
  // Loop through the elements and add the click event listener
  for(let i = 0; i < closeModalButtons.length; i++) {
    closeModalButtons[i].addEventListener('click', function(event) {
      // Grab the closest modal class
      let modal = this.closest('.modal');
      // Remove the class that is displaying the modal
      modal.classList.remove('is-active');
    })
  }
}

createCloseModalEventListeners();

function createOpenModalEventListeners() {
  // Grab elements with the open-modal-button class
  let openModalButtons = document.getElementsByClassName('open-modal-button');
  // Loop through the elements and add the click event listener
  for(let i = 0; i < openModalButtons.length; i++) {
    openModalButtons[i].addEventListener('click', function(event) {
      // Determine which modal to open by grabbing the data-modal-type attribute
      let modalType = this.getAttribute('data-modal-type');
      // Add the class that is displaying the modal
      document.getElementById(modalType).classList.add('is-active');
    })
  }
}

createOpenModalEventListeners();

function closeModal(modalId) {
  // Get modal by id
  let modal = document.getElementById(modalId);
  // Reset form inside modal if form exists
  let form = modal.querySelector('#' + modalId + ' form');
  if(form) {
    form.reset()
  }
  modal.classList.remove('is-active');
}

function openModal(modalId) {
  let modal = document.getElementById(modalId);
  modal.classList.add('is-active');
}

// Signup
let signupSubmitButton = document.getElementById('signup-submit');
signupSubmitButton.addEventListener('click', function(event) {
  event.preventDefault();
  // Get values from form fields
  let formUsername = document.getElementById('signup-username').value;
  let formEmail = document.getElementById('signup-email').value;
  let formPassword = document.getElementById('signup-password').value;
  // Create object to set as request body
  let newUserData = {
    username: formUsername,
    email: formEmail,
    password: formPassword
  }
  // Use fetch to create new user
  fetch("/api/users/", {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUserData),
  })
  .then(res => res.json())
  .then(response => {
    // If the user creation is successful, store data
    setSessionStorage('user_id', response.user.id)
    setSessionStorage('token', response.token)
    // If the user creation is successful, set the user's username in header
    setUserName(response.user.id)
    // If the user creation is successful, hide signup/login buttons and show logout button
    handleLoginAndLogout()
  })
  .catch(error => console.error('Error: ', error));

  closeModal('signup-modal');
});

// Login
let loginSubmitButton = document.getElementById('login-submit');
loginSubmitButton.addEventListener('click', function(event) {
  event.preventDefault();
  // Get values from form fields
  let formEmail = document.getElementById('login-email').value;
  let formPassword = document.getElementById('login-password').value;
  // Create object to set as request body
  let loginUserData = {
    email: formEmail,
    password: formPassword
  }
  // Use fetch to log in user
  fetch("/loginUser/", {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginUserData),
  })
  .then(res => res.json())
  .then(response => {
    // If the user creation is successful, either put error message in modal
    // or store data, set the username, and hide/show the appropriate buttons
    if(response['message']) {
      document.getElementById('invalid-login-message').innerHTML = response['message'];
      document.getElementById('login-password').classList.add('is-danger');
    } else {
      setSessionStorage('user_id', response.user.id)
      setSessionStorage('token', response.token)
      setUserName(response.user.id)
      handleLoginAndLogout()
      // Only close the modal if there are no errors
      closeModal('login-modal');
    }
  })
  .catch(error => {
    console.error('Error: ', error)
  });
});

// Logout
let logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', function(event) {
  event.preventDefault();
  // Clear session storage
  sessionStorage.clear();
  // Hide logout button and show signup/login buttons
  handleLoginAndLogout();
})

// Handle session storage
function setSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
}

function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}

// Check if user is logged in based on session storage
function isLoggedIn() {
  return (sessionStorage && sessionStorage.user_id) ? true : false;
}

// Handle elements/actions based on logged in status
function handleLoginAndLogout() {
  let signupDiv = document.getElementById('signup-div');
  let loginDiv = document.getElementById('login-div');
  let logoutDiv = document.getElementById('logout-div');
  let usernameDiv = document.getElementById('username-div');
  let loggedIn = isLoggedIn();
  // If the user is logged in, show the signup/login buttons and hide logout button
  if(loggedIn) {
    signupDiv.classList.add('hide');
    loginDiv.classList.add('hide');
    logoutDiv.classList.remove('hide');
    usernameDiv.classList.remove('hide');
    if(sessionStorage.user_id) {
      setUserName(sessionStorage.user_id);
    }
  // If the user is not logged in, hide the signup/login buttons and show logout button
  } else {
    signupDiv.classList.remove('hide');
    loginDiv.classList.remove('hide');
    logoutDiv.classList.add('hide');
    usernameDiv.classList.add('hide');
    setUserName();
  }
}

handleLoginAndLogout();

// Set username in upper-right corner if user is logged in
function setUserName(id) {
  let user_id = sessionStorage.user_id ? sessionStorage.user_id : id;
  if(user_id) {
    // Use fetch to get user data by user id
    fetch('/api/users/' + user_id)
    .then(res => res.json())
    .then(response => {
      document.getElementById('username-display').innerHTML = response.username;
    })
    .catch(error => console.error('Error: ', error));
  } else {
    document.getElementById('username-display').innerHTML = '';
  }
}

// Movie search by title
let movieSearchButton = document.getElementById('movie-search-button');
movieSearchButton.addEventListener('click', function(event) {
  event.preventDefault();
  // Encode the movie title so that special characters won't prevent success
  let title = encodeURIComponent(document.getElementById('movie-search-input').value);
  // Use fetch to get search results
  fetch('/api/searchMovies/?title=' + title)
  .then(res => res.json())
  .then(response => {
    // If successful response, either display error message or pass data to prepare the movie list
    if(response['message']) {
      document.getElementById('movie-results-list').innerHTML = '<p id="movie-results-no-results" class="has-text-danger">' + response['message'] + '</p>';
    } else {
      prepareMovieList(response);
    }
  })
  .catch(error => console.error('Error: ', error));
  // Clear search field after clicking search button
  document.getElementById('movie-search-input').value = '';
});

// Create movie list from movie search
function prepareMovieList(movies) {
  // If the search returns movies, create the html and append it to the html
  let movieList = '<h2 id="movie-result-header">Results</h2>';
  for(let i = 0; i < movies.length; i++) {
    let odd = (i % 2 == 0) ? '' : ' item-odd';
    movieList += '<p class="movie-result-item' + odd + '"><span class="movie-results-title">' + movies[i].Title + '</span><a class="button is-success details-button open-modal-button" data-movie-id="' + movies[i].imdbID + '" data-modal-type="movie-details-modal">Details</a></p>';
  }
  document.getElementById('movie-results-list').innerHTML = movieList;
  // Attach event listener to the Details buttons because they are created dynamically
  // rather than existing on page load
  console.log('movieSearchButton');
  createDetailsButtonEventListener();
}

// Movie details button functionality
function createDetailsButtonEventListener() {
  let detailsButton = document.getElementsByClassName('details-button');
  for(let i = 0; i < detailsButton.length; i++) {
    detailsButton[i].addEventListener('click', function(event) {
      console.log('___________JJJJJ__________');
      let movieId = this.getAttribute('data-movie-id');
      let user_id = sessionStorage.user_id ? sessionStorage.user_id : null;
      console.log('uzter id: ', user_id);
      // When a Details button is clicked, get the movie details by the imdb id
      if(user_id) {
        fetch('/api/searchMovies/' + movieId + '/' + user_id)
        .then(res => res.json())
        .then(response => {
          console.log('User Success: ', response);
          prepareMovieDetails(response);
        })
        .catch(error => console.error('Error: ', error));
      } else {
        fetch('/api/searchMovies/' + movieId)
        .then(res => res.json())
        .then(response => {
          console.log('Non-user Success: ', response);
          prepareMovieDetails(response);
        })
        .catch(error => console.error('Error: ', error));
      }
      document.getElementById('movie-details-modal').classList.add('is-active');
    })
  }
}
console.log('page load');
createDetailsButtonEventListener();

// Get movie details when Details button is clicked
function prepareMovieDetails(movieDetails) {
  let keys = Object.keys(movieDetails);
  for(let i = 0; i < keys.length; i++) {
    let lowerKey = keys[i].toLowerCase();
    let element = document.getElementById('movie-details-' + lowerKey);
    if(element) {
      element.innerHTML = movieDetails[keys[i]];
    }
  }
  document.getElementById('movie-details-image-container').innerHTML = '<img src="' + movieDetails.Poster + '" id="movie-details-image">';
  let ratingsList = '';
  for(let i = 0; i < movieDetails.Ratings.length; i++) {
    ratingsList += '<li>&nbsp;&nbsp;&nbsp;<em>' + movieDetails.Ratings[i].Source + ':</em> ' + movieDetails.Ratings[i].Value + '</li>';
  }
  document.getElementById('movie-details-ratings-list').innerHTML = ratingsList;
  setMovieDetailsButton(movieDetails.favorite_movie_table_id, movieDetails.inUserFavorites);
}

function setMovieDetailsButton(favorite_movie_table_id, in_user_favorites) {
  if(!in_user_favorites) {
    document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="add-to-favorites-button" class="button is-success">Add to Favorites</button>';
    createAddToFavoritesListener();
  } else {
    document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="remove-from-favorites-button" class="button is-danger" data-movie-id="' + favorite_movie_table_id + '"">Remove From Favorites</button>';
    createRemoveFromFavoritesListenerById();
  }
  // let user_id = sessionStorage.user_id ? sessionStorage.user_id : null;
  // if(movie_id) {
  //   fetch('/api/favorites/' + user_id + '/' + movie_id)
  //   .then(res => res.json())
  //   .then(response => {
  //     if(!response['movie']) {
  //       document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="add-to-favorites-button" class="button is-success">Add to Favorites</button>';
  //       createAddToFavoritesListener();
  //     } else {
  //       document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="remove-from-favorites-button" class="button is-danger" data-movie-id="' + response['movie']['id'] + '"">Remove From Favorites</button>';
  //       createRemoveFromFavoritesListenerById();
  //     }
  //   })
  //   .catch(error => console.error('Error: ', error));
  // }
}

function createAddToFavoritesListener() {
  let addToFavoritesButton = document.getElementById('add-to-favorites-button');
  addToFavoritesButton.addEventListener('click', function(event) {
    event.preventDefault();
    let loggedIn = isLoggedIn();
    if(!loggedIn) {
      document.getElementById('add-or-view-text').innerHTML = 'add';
      openModal('not-logged-in-modal');
      closeModal('movie-details-modal');
    } else {
      let movie_id = document.getElementById('movie-details-imdbid').innerHTML;
      let user_id = sessionStorage.user_id;
      let newFavoriteMovieData = {
        favorite_movie_id: movie_id,
        user_id: user_id
      }

      fetch("/api/favorites/", {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFavoriteMovieData),
      })
      .then(res => res.json())
      .then(response => {
        document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="remove-from-favorites-button" class="button is-danger" data-movie-id="' + response['id'] + '"">Remove From Favorites</button>';
        createRemoveFromFavoritesListenerById();
      })
      .catch(error => console.error('Error: ', error));
    }
  });
}

function createRemoveFromFavoritesListenerById() {
  let removeFromFavoritesButton = document.getElementById('remove-from-favorites-button');
  removeFromFavoritesButton.addEventListener('click', function(event) {
    event.preventDefault();
    let id = this.getAttribute('data-movie-id');

    fetch("/api/favorites/" + id, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(response => {
      document.getElementById('add-to-favorites-button-container').innerHTML = '<button id="add-to-favorites-button" class="button is-success">Add to Favorites</button>';
      createAddToFavoritesListener();
      let removeFromFavoritesButtons = document.getElementsByClassName('remove-from-favorites-button');
      for(let i = 0; i < removeFromFavoritesButtons.length; i++) {
        let favorite_movie_id_attribute = removeFromFavoritesButtons[i].getAttribute('data-favorite-movie-id');
        if(favorite_movie_id_attribute == id) {
          removeFromFavoritesButtons[i].remove();
          triggerFavoritesToggleButton();
        }
      }
    })
    .catch(error => console.error('Error: ', error));
  });
}

function createRemoveFromFavoritesListenerByClass() {
  let removeFromFavoritesButtons = document.getElementsByClassName('remove-from-favorites-button');
  for(let i = 0; i < removeFromFavoritesButtons.length; i++) {
    removeFromFavoritesButtons[i].addEventListener('click', function(event) {
      event.preventDefault();
      console.log('start that deletion');
      let id = this.getAttribute('data-favorite-movie-id');
      let url = "/api/favorites/";
      console.log('full url: ', url + id);

      fetch(url + id, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(response => {
        console.log('Success: ', response);
        let listItem = this.closest('.movie-result-item');
        listItem.remove();
        triggerFavoritesToggleButton();
      })
      .catch(error => console.error('Error: ', error));
    });
  }
}

function prepareFavoritesList(favorites) {
  if(favorites.length < 1) {
    document.getElementById('favorite-movies-list').innerHTML = '<p id="movie-results-no-results" class="has-text-danger">No results found. Use the search field to find movies and add them to your favorites.</p>';
  } else {
    let favoritesList = '<h2 id="movie-result-header">Favorites</h2>';

    for(let i = 0; i < favorites.length; i++) {
      let odd = (i % 2 == 0) ? '' : ' item-odd';
      favoritesList += '<p class="movie-result-item' + odd + '"><span class="movie-results-title">' + favorites[i].Title + '</span><span><a class="button is-success details-button open-modal-button" data-movie-id="' + favorites[i].imdbID + '" data-modal-type="movie-details-modal">Details</a><a class="button is-danger remove-from-favorites-button" data-favorite-movie-id="' + favorites[i].id + '"><i class="fas fa-trash"></i></a></span></p>';
    }
    document.getElementById('favorite-movies-list').innerHTML = favoritesList;
    createRemoveFromFavoritesListenerByClass();
    createOpenModalEventListeners();
    createDetailsButtonEventListener();
  }
}

function createFavoritesToggleButtonEventListener() {
  let favoritesToggleButton = document.getElementById('favorites-toggle-button');
  favoritesToggleButton.addEventListener('click', function(event) {
    event.preventDefault();
    let loggedIn = isLoggedIn();
    if(!loggedIn) {
      document.getElementById('add-or-view-text').innerHTML = 'view';
      openModal('not-logged-in-modal');
      closeModal('movie-details-modal');
    } else {
      getFavorites();
    }
  })
}

createFavoritesToggleButtonEventListener();

function getFavorites() {
  let user_id = sessionStorage.user_id ? sessionStorage.user_id : null;

  fetch('/api/favorites/' + user_id)
  .then(res => res.json())
  .then(response => {
    if(response['message']) {
      document.getElementById('favorite-movies-list').innerHTML = '<p id="movie-results-no-results" class="has-text-danger">' + response['message'] + '. Use the search field to find movies and add them to your favorites.</p>';
    } else {
      prepareFavoritesList(response);
    }
  })
  .catch(error => console.error('Error: ', error));
  toggleFavoritesView()
}

let searchToggleButton = document.getElementById('search-toggle-button');
searchToggleButton.addEventListener('click', function(event) {
  toggleSearchView();
})

function triggerFavoritesToggleButton() {
  let event = new Event('click');
  let favoritesToggleButton = document.getElementById('favorites-toggle-button');
  favoritesToggleButton.dispatchEvent(event);
}

function getFavoriteMoviesListChildNodeCount() {
  console.log('couuuunt: ', document.getElementById('favorite-movies-list').childElementCount);
  // return document.getElementById('favorite-movies-list').childElementCount;
}

function toggleSearchView() {
  document.getElementById('movie-search-and-results-container').classList.remove('hide')
  document.getElementById('favorite-movies-container').classList.add('hide')
  document.getElementById('search-toggle-button').classList.add('background-dark');
  document.getElementById('favorites-toggle-button').classList.remove('background-dark');
}

function toggleFavoritesView() {
  document.getElementById('favorite-movies-container').classList.remove('hide')
  document.getElementById('movie-search-and-results-container').classList.add('hide')
  document.getElementById('favorites-toggle-button').classList.add('background-dark');
  document.getElementById('search-toggle-button').classList.remove('background-dark');
}
