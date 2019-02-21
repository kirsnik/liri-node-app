require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");



var nodeArg = process.argv;
var liriCommand = nodeArg[2];
var liriArg = '';
for (i = 3; i < nodeArg.length; i++) {
    liriArg += nodeArg[i] + ' ';
}

function spotifySong(song) {
    fs.appendFile('./log.txt', 'User Command: node liri.js spotify ' + song + '\n\n', (err) => {if (err) throw err;});
    
    var search = (song === '') ? search = 'Danger Zone' : search = song;
    
    spotify.search({
        type: 'track',
        query: search
    }, function (error, data) {
        if(error) {
            var errorStr1 = 'Error occurred: Retrieving Spotify track -- ' + error;
            fs.appendFile('./log.txt', 'utf8', errorStr1, (err) => {
                if (err) throw err;
                console.log(errorStr1);
            });
            return;
        } else {
            var songInfo = data.tracks.items[0];
            if (!songInfo) {
                var errorStr2 = 'ERROR: No song info retrieved, please check the spelling of the song name!';

                // Append the error string to the log file
                fs.appendFile('./log.txt', 'utf8', errorStr2, (err) => {
                    if (err) throw err;
                    console.log(errorStr2);
                });
                return;
            } else {
                var outputStr =
                    '*****************************************************************************************************************************\n' +
                    '*****************************************************************************************************************************\n' +
                    '*****************************************************************************************************************************\n' +
                    '~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
                    'Song Information:\n' +
                    '~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
                    'Song Name: ' + songInfo.name + '\n' +
                    'Artist: ' + songInfo.artists[0].name + '\n' +
                    'Album: ' + songInfo.album.name + '\n' +
                    'Preview Here: ' + songInfo.preview_url + '\n' +
                    '*****************************************************************************************************************************\n' +
                    '*****************************************************************************************************************************\n' +
                    '*****************************************************************************************************************************\n' +
                    '*****************************************************************************************************************************\n';

                fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                    if (err) throw err;
                    console.log(outputStr);
                });
            }
        }
    });
}



// OMDB 
function runOMDB(search) {
        var URL = "http://www.omdbapi.com/?t=" + search + "&plot=full&tomatoes=true&apikey=" + keys.APIkey.API;
        axios.get(URL).then(function (response) {
            var jsonData = response.data;
            var movieData =
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n' +
                '~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
                'Movie Information:\n' +
                '~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
                "Title:" + jsonData.Title + '\n' +
                "Year of release:" + jsonData.Year + '\n' +
                "IMDB rating: " + jsonData.imdbRating + '\n' +
                "Rotten Tomatoes rating: " + jsonData.Ratings[1].Source + '\n' +
                "Country where produced: " + jsonData.Country + '\n' +
                "Language: " + jsonData.Language + '\n' +
                "Cast: " + jsonData.Actors + '\n' +
                "Plot: " + jsonData.Plot + '\n'+
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n';

            //print movieData to console
            console.log(movieData)
        }
        );
}




function BandInTown(artist) {

        var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=trilogy";
        axios.get(URL).then(function (response) {
            var jsonData = response.data;
            var movieData =
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n' +
                '~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
                'Movie Information:\n' +
                '~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
                'Venue: ' + data[i].venue.name  + '\n' +
                'City: ' + data[i].venue.city  + '\n' +
                'Date & Time: ' + data[i].datetime  + '\n' +
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n' +
                '*****************************************************************************************************************************\n';

            //print movieData to console
            console.log(movieData)
        }
        );
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
            var cmdString = data.split(',');
            var command = cmdString[0].trim();
            var param = cmdString[1].trim();

            switch (command) {
                case 'spotify':
                    spotifySong(param);
                    break;
                case 'do-what-it-says':
                spotifyThisSong(param);
                    break;
                case 'movie':
                    retrieveOBDBInfo(param);
                    break;
                case 'bands':
                BandInTown(param);
                    break;
                    
            }
        }
    });
}


if (liriCommand === `spotify`) {
    spotifySong(liriArg);
} else if (liriCommand === `do-what-it-says`) {
    spotifyThisSong();
}  else if (liriCommand === `movie`) {
	runOMDB(liriArg);
}   else if (liriCommand === `bands`) {
	BandInTown(liriCommand);
} else {
    fs.appendFile('./log.txt', 'User Command: ' + nodeArg + '\n\n', (err) => {
        if (err) throw err;
        outputStr = 'Usage:\n' +
            '    node liri.js spotify "<song_name>"\n';
        fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
            if (err) throw err;
            console.log(outputStr);
        });
    });
}