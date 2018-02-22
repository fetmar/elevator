// the elevator handles mobile updates for tangerine.
const express    = require('express');

// Set up the router
const app = express();
app.use(require('body-parser').json()); // use json
app.use(require('cors')());            // add cors headers

// pixel art proof of life
app.get('/', function(req, res){ res.status(200).send('<body><canvas id="big-img" width="200" height="200" style="width:200px;height:200px;margin:auto;top:0;left:0;right:0;bottom:0;position:absolute;"></canvas></body><script>var img;(img = new Image()).src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAMUlEQVQImWNggIL+3v7/MMyADJAEURUgSyBLlpaW/kc3jgRJbHbCJWCgtLT0PwzDxABjNFZ91xzTOwAAAABJRU5ErkJggg==";var big = document.getElementById("big-img").getContext("2d");big.imageSmoothingEnabled = false;big.drawImage(img,0,0,10,10,0,0,200,200);</script>'); });

// Return the version file in a group.
app.get('/version/:group', require('./routes/version').route);

// Return ids and revs for everything in byDKey.
app.post('/revs/:group', require('./routes/revs').route);

// Returns any docs requested and not blacklisted.
app.post('/fetch/:group', require('./routes/fetch').route);

module.exports = app;
