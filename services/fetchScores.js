"use strict";
import axios from "axios-https-proxy-fix"; // in case proxy support is needed using library w/ proxy fix
import date from 'date-and-time'
import { readFileSync } from 'fs';

export default async function fetchScores(movieID, movieName, releaseDate) {

    const words = releaseDate.split(' ');
    const year = words[words.length - 1];

    let imdbScore = undefined;
    let rottenTomatoesScore = undefined;

    // const rtHTML = await getPage(`https://www.rottentomatoes.com/m/${rottenTomatoesFormatter(movieName)}`);
    // // rottenTomatoesScore = rtHTML.substring(rtHTML.indexOf('tomatometerscore="') + 18, rtHTML.indexOf('tomatometerscore="') + 20) + "%";

    // console.log(rtHTML)

    try {
        console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to use OMDB...\x1b[0m`)
        const tmdbAPIKey = "?api_key=ab1e98b02987e9593b705864efaf4798";

        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/external_ids${tmdbAPIKey}`);
        const externalIDs = await res.json();
        const imdbID = externalIDs.imdb_id;

        const omdbAPIKey = "2d14329a"
        const omdbRes = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${omdbAPIKey}`);
        const omdbDetails = await omdbRes.json();

        imdbScore = `${omdbDetails.imdbRating}/10`;
        rottenTomatoesScore = omdbDetails.Ratings[1].Value;

        if (imdbScore === undefined || rottenTomatoesScore === undefined) throw Error;
        else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScore(s) Retrieved...\x1b[0m`)

    } catch {
        try {

            if (rottenTomatoesScore === undefined) {
                console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to Scrape Rotten Tomatoes...\x1b[0m`)

                const rtHTML = await getPage(`https://www.rottentomatoes.com/m/${rottenTomatoesFormatter(movieName)}`);
                rottenTomatoesScore = rtHTML.substring(rtHTML.indexOf('tomatometerscore="') + 18, rtHTML.indexOf('tomatometerscore="') + 20) + "%";

            } else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScore(s) Retrieved from Rotten Tomatoes...\x1b[0m`)

            if (imdbScore === undefined) {
                console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to Scrape IMDB...\x1b[0m`)

                const imdbHTML = await getPage(`https://www.imdb.com/title/${movieID}`);
                imdbScore = imdbHTML.substring(imdbHTML.indexOf('sc-bde20123-1 cMEQkK') + 22, imdbHTML.indexOf('sc-bde20123-1 cMEQkK') + 25) + "/10";
            } else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScore(s) Retrieved from IMDB...\x1b[0m`)

            if (imdbScore === undefined || rottenTomatoesScore === undefined) throw Error;
            else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScore(s) Retrieved...\x1b[0m`)


        } catch {

            console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mAttempting to Scrape Google...\x1b[0m`)

            let html = "";

            html = await getPage(`https://www.google.com/search?q=${movieName}+(${year})+movie`)

            console.log(`https://www.google.com/search?q=${googleFormatter(movieName)}+(${year})+movie`)


            let ratingsSection = html.substring(html.indexOf('<a class="TZahnb vIUFYd"'), html.indexOf('title="Rotten Tomatoes"'));


            if (imdbScore === undefined) {
                imdbScore = ratingsSection.substring(ratingsSection.indexOf('class="gsrt KMdzJ"') + 38, ratingsSection.indexOf('/10') + 3);

                if (imdbScore === undefined || imdbScore.length > 6) {
                    console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mScore(s) Unable to Get Score ...\x1b[0m`)
                    imdbScore = "N/A";
                }

            } else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScore(s) IMDB Score Retrieved from Google...\x1b[0m`)


            if (rottenTomatoesScore === undefined) {
                rottenTomatoesScore = ratingsSection.substring(ratingsSection.lastIndexOf('class="gsrt KMdzJ"') + 38, ratingsSection.indexOf('%</span') + 1);


                if (rottenTomatoesScore === undefined || rottenTomatoesScore.length > 3) {
                    console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mScore(s) Unable to Get Score ...\x1b[0m`)
                    rottenTomatoesScore = "N/A";
                }

            } else console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[32mScore(s) Rotten Tomatoes Score Retrieved from Google ...\x1b[0m`)
        }
    }

    return [imdbScore, rottenTomatoesScore]
}

function rottenTomatoesFormatter(inputString) {
    // Remove special characters using a regular expression
    const cleanedString = inputString.replace(/[^\w\s]/gi, '');

    // Replace whitespaces with underscores
    const finalString = cleanedString.replace(/\s+/g, '_');

    return finalString.toLowerCase();
}

function googleFormatter(inputString) {
    // Remove special characters using a regular expression
    const cleanedString = inputString.replace(/[^\w\s]/gi, '');

    // Replace whitespaces with underscores
    const finalString = cleanedString.replace(/\s+/g, '+');

    return finalString.toLowerCase();
}


async function getPage(url) { // Function that sends get request to designated site passed in

    let userAgent = randomUserAgent(); // Passing a user agent into local variable userAgent to be used in GET request4

    try {

        let proxy = await getProxy(); // Get random proxy

        let proxySplit = proxy.split(":"); // Split proxy into an array

        let response = await axios.get(url, {
            headers: { 'User-Agent': `${userAgent}` }, // Custom user agent passed into header
            proxy: { host: proxySplit[0], port: proxySplit[1], auth: { username: proxySplit[2], password: proxySplit[3] } } // Passing parameters for proxy
        }); // Sending request to url w/ custom user agent and proxy

        console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[33mUsing ${proxySplit[0]} as proxy...\x1b[0m`)

        let data = response.data;

        return data;

    } catch (err) {
        console.log(`${date.format(new Date(), 'MM/DD/YYYY HH:mm:ss')} \x1b[31mUnable to parse HTML, GET error...\x1b[0m`);
    } // If get request results in an error, display an issue and log it
}

async function getProxy() { // Gets random proxy from a list
    const proxyArray = readFileSync('./proxy.txt', 'utf8').split('\r'); // Reading from proxy.txt
    let unformattedproxy = proxyArray[Math.floor(Math.random() * (proxyArray.length - 1))]; // Random proxy from the array
    let proxy = unformattedproxy.replace('\n', '') // Removing the newline character

    console.log(proxy)

    return proxy.toString(); // Return string representation of the proxy
}

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