# saveurfave

## Description
SAVEURFAVE is a single page application that utilizes the [OMDB](http://www.omdbapi.com/) API to request movie data. The user can search for movies and then add them to their favorite movies list.

## Heroku App Link
[https://saveurfave.herokuapp.com/](https://saveurfave.herokuapp.com/)

## User stories
<ol>
	<li>User can sign up for a new account or log in to an existing account.</li>
	<li>When logged in, the signup and login buttons will be hidden, the logout button will display, and the user's username will display.</li>
	<li>User's password will be hashed.</li>
	<li>User can search for movies by title whether or not they are logged in.</li>
	<li>The first ten results of the user's search will be returned.</li>
	<li>If the user's search returns no results, a message will display, letting them know that no results were found.</li>
	<li>From the search view, user can view details of search results.</li>
	<li>From the search view, user can add movie to their favorites list.</li>
	<li>From the search view, user can remove movie from their favorites list.</li>
	<li>User can toggle back and forth between the search view and favorites view.</li>
	<li>If the user is not logged in, they will be prompted to sign up or log in if they attempt to toggle to the favorites view.</li>
	<li>If the user is logged in, but has not added any movies to their favorites, they will see a message instructing them to add movies.</li>
	<li>From the favorites view, user can view details of search results.</li>
	<li>From the favorites view, user can add movie to their favorites list.</li>
	<li>From the favorites view, user can remove movie from their favorites list either from the details modal or from the favorites list.</li>
	<li>User can log out.</li>
	<li>When the user logs out, the logout button will be hidden, the user's username will be hidden, and the signup and login buttons will display.</li>
</ol>

## Cloning this repo
In order to successfully clone and run this repo, follow the instructions below:
<ol>
	<li>After cloning this repo, run <code>npm install</code>.</li>
	<li>Create an <code>.env</code> in the root directory. In this file, set a variable of <code>TOKEN_CODE</code> and give it a value of your choosing. Also, set a variable of <code>OMDB_API_KEY</code> and set it's value to your omdb api key. If you do not have one, create an account at <a href="http://www.omdbapi.com/apikey.aspx" target="_blank">http://www.omdbapi.com/apikey.aspx</a> by choosing the FREE option and entering your email. Your key will be sent to you.</li>
	<li>Create a <code>omdb_favorites</code> database using postgres. Then, update the path in <code>/models/index.js/</code> to point to your local db. Hopefully, all you'll need to do is update <code>micahwierenga</code> to point to your machine, though you may need to confirm that the port is still <code>5432</code>. If you do not have postgres installed, you can do so <a href="https://www.postgresql.org/download/" target="_blank">here</a>.</li>
	<li>Once the <code>omdb_favorites</code> db is created, you can seed the <code>users</code> table if you'd like. To do so, run <code>node db/dbSetup.js</code> from the root directory. Then run <code>node db/seed.js</code> from the root directory. (You may want to change the values in the user object in the <code>seed.js</code> file first.)</li>
	<li>Now run <code>node server.js</code> or <code>nodemon server.js</code> to get the app up and running!</li>
</ol>

## Notes
<ol>
	<li>This codebase was retooled to use an MVC structure.</li>
	<li>Students can benefit from being exposed to this structure because it can help them begin to understand separation of concerns. This would also make each file a bit more palatable in trying to understand because they can make connections by toggling between shorter files rather than scrolling up and down a longer file.</li>
	<li>The challenge of the MVC structure have to do with learning how to follow the data from the client to the server, specifically understanding the roles of routes and their relationships with controllers, as well as the relationship between controllers and models. It can be quite a task to attempt to juggle those relationships as they navigate the file structure. And, sometimes it's good to see routes and controllers together at first before splitting them apart just to more easily understand how they are linked.</li>
</ol>
