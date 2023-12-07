"use strict";

// Import necessary modules
import axios from "axios-https-proxy-fix";
import date from 'date-and-time'
import { readFile } from 'fs/promises';

// Define the main function to fetch movie scores
export default async function fetchScores(movieID, movieName, releaseDate) {

    // Extract the year from the releaseDate
    const words = releaseDate.split(' ');
    const year = words[words.length - 1];

    // Initialize variables for IMDb and Rotten Tomatoes scores
    let imdbScore = undefined;
    let rottenTomatoesScore = undefined;

    try {
        // Attempt to use OMDB API to get movie details
        console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to use OMDB...\x1b[0m`)
        const tmdbAPIKey = "?api_key=ab1e98b02987e9593b705864efaf4798";

        // Use TMDB API to get external IDs including IMDb ID
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/external_ids${tmdbAPIKey}`);
        const externalIDs = await res.json();
        const imdbID = externalIDs.imdb_id;

        // Use OMDB API to get IMDb and Rotten Tomatoes scores
        const omdbAPIKey = "2d14329a"
        const omdbRes = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${omdbAPIKey}`);
        const omdbDetails = await omdbRes.json();

        // Extract IMDb and Rotten Tomatoes scores from OMDB response
        imdbScore = omdbDetails.imdbRating;
        if ((omdbDetails.Ratings).length > 1) {
            rottenTomatoesScore = omdbDetails.Ratings[1].Value
        }

        // Additional processing for Rotten Tomatoes score
        if (rottenTomatoesScore.length > 3) {
            rottenTomatoesScore = rottenTomatoesScore.substring(0, rottenTomatoesScore.indexOf('/'));
        }

        // Handle "N/A" values for IMDb and Rotten Tomatoes scores
        if (imdbScore === "N/A") {
            imdbScore = undefined;
        }
        if (rottenTomatoesScore === "N/A") {
            rottenTomatoesScore = undefined;
        }

        // Check if IMDb or Rotten Tomatoes scores are missing
        if (imdbScore === undefined || rottenTomatoesScore === undefined) {
            console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mUnable to Get all Scores from OMDB...\x1b[0m`);
            throw Error;
        } else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScores Retrieved from OMDB...\x1b[0m`)

    } catch {
        // If OMDB API fails, attempt to scrape scores from other sources

        try {
            // Attempt to scrape Rotten Tomatoes if its score is missing
            if (rottenTomatoesScore === undefined) {
                console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to Scrape Rotten Tomatoes...\x1b[0m`)

                // Use custom function to get HTML page content
                const rtHTML = await getPage(`https://www.rottentomatoes.com/m/${rottenTomatoesFormatter(movieName)}`);

                // Extract Rotten Tomatoes score from HTML
                rottenTomatoesScore = rtHTML.substring(rtHTML.indexOf('tomatometerscore="') + 18, rtHTML.indexOf('tomatometerscore="') + 20);

                // Check if the extracted value is a valid number
                if (!checkForNumber(rottenTomatoesScore)) rottenTomatoesScore = undefined;
            }

            // Attempt to scrape IMDb if its score is missing
            if (imdbScore === undefined) {
                console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to Scrape IMDB...\x1b[0m`)

                // Use custom function to get HTML page content
                const imdbHTML = await getPage(`https://www.imdb.com/title/${movieID}`);
                // Extract IMDb score from HTML
                imdbScore = imdbHTML.substring(imdbHTML.indexOf('sc-bde20123-1 cMEQkK') + 22, imdbHTML.indexOf('sc-bde20123-1 cMEQkK') + 25);
            }

            // Check if IMDb or Rotten Tomatoes scores are still missing
            if ((imdbScore === undefined || rottenTomatoesScore === undefined)) {
                console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mUnable to Get all Scores from IMDB or Rotten Tomatoes...\x1b[0m`);
                throw Error;
            } else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScore(s) Retrieved from IMDB and/or Rotten Tomatoes...\x1b[0m`)

        } catch {
            // If scraping from Rotten Tomatoes fails, attempt to scrape using the movie's release year
            try {
                if (rottenTomatoesScore === undefined) {
                    console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to Scrape Rotten Tomatoes with Year...\x1b[0m`)

                    // Use custom function to get HTML page content
                    const rtHTML = await getPage(`https://www.rottentomatoes.com/m/${rottenTomatoesFormatter(`${movieName}_${year}`)}`);

                    // Extract Rotten Tomatoes score from HTML
                    rottenTomatoesScore = rtHTML.substring(rtHTML.indexOf('tomatometerscore="') + 18, rtHTML.indexOf('tomatometerscore="') + 20);

                    // Check if the extracted value is a valid number
                    if (!checkForNumber(rottenTomatoesScore)) rottenTomatoesScore = undefined;

                    console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScore Retrieved from Rotten Tomatoes...\x1b[0m`)

                } else {
                    // If Rotten Tomatoes score is still missing, log an error
                    if (rottenTomatoesScore === undefined) console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mUnable to Get score from Rotten Tomatoes...\x1b[0m`);

                    throw Error;
                }
            } catch {
                // If scraping from Rotten Tomatoes with year fails, attempt to scrape from Google
                console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to Scrape Google...\x1b[0m`)

                // Use custom function to get HTML page content
                let html = await getPage(`https://www.google.com/search?q=${googleFormatter(movieName)}+(${year})+movie`)

                // Extract relevant section containing ratings information
                let ratingsSection = html.substring(html.indexOf('<a class="TZahnb vIUFYd"'), html.indexOf('title="Rotten Tomatoes"'));

                // If IMDb score is missing, extract it from the ratings section
                if (imdbScore === undefined) {
                    imdbScore = ratingsSection.substring(ratingsSection.indexOf('class="gsrt KMdzJ"') + 38, ratingsSection.indexOf('/10') + 3);

                    // Check if the extracted value is valid
                    if (imdbScore === undefined || imdbScore.length > 6 || imdbScore.length < 1) {
                        console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mUnable to Get Score ...\x1b[0m`)
                        imdbScore = "N/A";
                    } else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mIMDB Score Retrieved from Google...\x1b[0m`)
                }

                // If Rotten Tomatoes score is missing, extract it from the ratings section
                if (rottenTomatoesScore === undefined) {
                    rottenTomatoesScore = ratingsSection.substring(ratingsSection.lastIndexOf('class="gsrt KMdzJ"') + 38, ratingsSection.indexOf('%</span') + 1);

                    // Check if the extracted value is valid
                    if (rottenTomatoesScore === undefined || rottenTomatoesScore.length > 3 || rottenTomatoesScore.length < 1) {
                        console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mUnable to Get Score ...\x1b[0m`)
                        rottenTomatoesScore = "N/A";
                    } else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mRotten Tomatoes Score Retrieved from Google ...\x1b[0m`)
                }
            }
        }
    }

    // Ensure the scores are formatted correctly
    if (!rottenTomatoesScore.includes('%') && rottenTomatoesScore !== "N/A") {
        rottenTomatoesScore = rottenTomatoesScore + '%';
    }

    if (!imdbScore.includes('/10') && imdbScore !== "N/A") {
        imdbScore = imdbScore + '/10';
    }

    // Return the formatted scores
    return [imdbScore, rottenTomatoesScore]
}

// Helper function to check if a string contains a number
function checkForNumber(inputString) {
    const numberRegex = /\d/;
    return numberRegex.test(inputString);
}

// Helper function to format a string for Rotten Tomatoes
function rottenTomatoesFormatter(inputString) {
    // Remove special characters using a regular expression
    const cleanedString = inputString.replace(/[^\w\s]/gi, '');

    // Replace whitespaces with underscores
    const finalString = cleanedString.replace(/\s+/g, '_');

    return finalString.toLowerCase();
}

// Helper function to format a string for Google search
function googleFormatter(inputString) {
    // Remove special characters using a regular expression
    const cleanedString = inputString.replace(/[^\w\s]/gi, '');

    // Replace whitespaces with plus signs
    const finalString = cleanedString.replace(/\s+/g, '+');

    return finalString.toLowerCase();
}

// Helper function to get the HTML page content from a URL using a proxy
async function getPage(url) {
    try {
        // Generate a random user agent and get a random proxy
        let userAgent = randomUserAgent();
        let proxy = await getProxy();
        let proxySplit = proxy.split(":"); // Split proxy into an array

        // Send a GET request to the URL using the proxy and custom user agent
        let response = await axios.get(url, {
            headers: { 'User-Agent': `${userAgent}` },
            proxy: { host: proxySplit[0], port: proxySplit[1], auth: { username: proxySplit[2], password: proxySplit[3] } }
        });

        console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mUsing ${proxySplit[0]} as proxy...\x1b[0m`)

        // Return the HTML page content
        let data = response.data;
        return data;

    } catch (err) {
        // If there is an error in the GET request, log an error message
        console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mUnable to parse HTML, GET error...\x1b[0m`);
    }
}

// Helper function to read a proxy from a file
async function getProxy() {
    try {
        // Read the proxy file and return a randomly selected proxy
        const fileContent = await readFile('./services/proxy.txt', 'utf8');
        const proxyArray = fileContent.split('\r');

        let unformattedproxy = proxyArray[Math.floor(Math.random() * (proxyArray.length - 1))];
        let proxy = unformattedproxy.replace('\n', ''); // Removing the newline character

        return proxy.toString();
    } catch (error) {
        // If there is an error reading the file, log an error message
        console.error('Error reading the file:', error);
        throw error;
    }
}

// Helper function to generate a random user agent
function randomUserAgent() {
    const uAgentList = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.24',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/84.0.4147.105 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13.0; rv:106.0) Gecko/20100101 Firefox/106.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.24',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/92.0.4561.21',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/92.0.4561.33',
        'Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/92.0.4561.33',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/92.0.4561.33',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/92.0.4561.33',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42'
    ];

    let userAgentInfo = uAgentList[Math.floor(Math.random() * (uAgentList.length - 1))];

    return userAgentInfo;
}