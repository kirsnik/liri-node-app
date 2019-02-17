require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');


var nodeArg = process.argv;
var liriCommand = nodeArg[2];
var liriArg = '';
for (i = 3; i < nodeArg.length; i++) {
    liriArg += nodeArg[i] + ' ';
}

function spotifySong(song) {
    fs.appendFile('./log.txt', 'User Command: node liri.js spotify ' + song + '\n\n', (err) => {
        if (err) throw err;
    });

    var search = (song === '') ? search = 'No Leaf Clover Metallica' : search = song;
    spotify.search({
        type: 'track',
        query: search
    }, function (error, data) {
        if (error) {
            var errorStr1 = 'ERROR: Retrieving Spotify track -- ' + error;
            fs.appendFile('./log.txt', errorStr1, (err) => {
                if (err) throw err;
                console.log(errorStr1);
            });
            return;
        } else {
            var songInfo = data.tracks.items[0];
            if (!songInfo) {
                var errorStr2 = 'ERROR: No song info retrieved, please check the spelling of the song name!';

                // Append the error string to the log file
                fs.appendFile('./log.txt', errorStr2, (err) => {
                    if (err) throw err;
                    console.log(errorStr2);
                });
                return;
            } else {
                // Pretty print the song information
                var outputStr =
                    '*************************\n' +
                    '*************************\n' +
                    '*************************\n' +
                    '------------------------\n' +
                    'Song Information:\n' +
                    '------------------------\n' +
                    'Song Name: ' + songInfo.name + '\n' +
                    'Artist: ' + songInfo.artists[0].name + '\n' +
                    'Album: ' + songInfo.album.name + '\n' +
                    'Preview Here: ' + songInfo.preview_url + '\n' +
                    '*************************\n' +
                    '*************************\n' +
                    '*************************\n' +
                    '*************************\n';

                // Append the output to the log file
                fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                    if (err) throw err;
                    console.log(outputStr);
                });
            }
        }
    });
}

// retrieveOMDBInfo will retrieve information on a movie from the OMDB database
function retrieveOBDBInfo(movie) {
    // Append the command to the log file
    fs.appendFile('./log.txt', 'User Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
        if (err) throw err;
    });

    // If no movie is provided, LIRI defaults to 'Mr. Nobody'
    var search;
    if (movie === '') {
        search = 'Mr. Nobody';
    } else {
        search = movie;
    }

    // Replace spaces with '+' for the query string
    search = search.split(' ').join('+');

    // Construct the query string
    var queryStr = 'http://www.omdbapi.com/?t=' + search + '&plot=full&tomatoes=true';

    // Send the request to OMDB
    request(queryStr, function (error, response, body) {
        if (error || (response.statusCode !== 200)) {
            var errorStr1 = 'ERROR: Retrieving OMDB entry -- ' + error;

            // Append the error string to the log file
            fs.appendFile('./log.txt', errorStr1, (err) => {
                if (err) throw err;
                console.log(errorStr1);
            });
            return;
        } else {
            var data = JSON.parse(body);
            if (!data.Title && !data.Released && !data.imdbRating) {
                var errorStr2 = 'ERROR: No movie info retrieved, please check the spelling of the movie name!';

                // Append the error string to the log file
                fs.appendFile('./log.txt', errorStr2, (err) => {
                    if (err) throw err;
                    console.log(errorStr2);
                });
                return;
            } else {
                // Pretty print the movie information
                var outputStr = '------------------------\n' +
                    'Movie Information:\n' +
                    '------------------------\n\n' +
                    'Movie Title: ' + data.Title + '\n' +
                    'Year Released: ' + data.Released + '\n' +
                    'IMBD Rating: ' + data.imdbRating + '\n' +
                    'Country Produced: ' + data.Country + '\n' +
                    'Language: ' + data.Language + '\n' +
                    'Plot: ' + data.Plot + '\n' +
                    'Actors: ' + data.Actors + '\n' +
                    'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
                    'Rotten Tomatoes URL: ' + data.tomatoURL + '\n';

                // Append the output to the log file
                fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                    if (err) throw err;
                    console.log(outputStr);
                });
            }
        }
    });
}

function spotifyThisSong() {
    fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
        if (err) throw err;
    });
    fs.readFile('./random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log('ERROR: Reading random.txt -- ' + error);
            return;
        } else {
            // Split out the command name and the parameter name
            var cmdString = data.split(',');
            var command = cmdString[0].trim();
            var param = cmdString[1].trim();

            switch (command) {
                case 'spotify':
                    spotifySong(param);
                    break;

                case 'movie-this':
                    retrieveOBDBInfo(param);
                    break;
            }
        }
    });
}

// Determine which LIRI command is being requested by the user
if (liriCommand === `spotify`) {
    spotifySong(liriArg);

} else if (liriCommand === `do-what-it-says`) {
    spotifyThisSong();

} else {
    // Append the command to the log file
    fs.appendFile('./log.txt', 'User Command: ' + nodeArg + '\n\n', (err) => {
        if (err) throw err;

        // If the user types in a command that LIRI does not recognize, output the Usage menu 
        // which lists the available commands.
        outputStr = 'Usage:\n' +
            '    node liri.js spotify "<song_name>"\n';

        // Append the output to the log file
        fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
            if (err) throw err;
            console.log(outputStr);
        });
    });
}