import express from "express";
import fetchScores from "./fetchScores.js"
import cors from "cors";

const app = express();
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Use this port for access to endpoint
const port = 3001;

// Custom endpoint to get external scores
app.get("/api/scores", async (req, res) => {
    const { movieID, movieName, releaseDate } = req.query;

    // Attempt to get scores and return through response
    try {
        const ratings = await fetchScores(movieID, movieName, releaseDate);
        console.log(`${movieName} - IMDB: ${ratings[0]} | RT: ${ratings[1]}`)
        res.json({
            scores: {
                imdb: ratings[0],
                rt: ratings[1]
            }
        });

    } catch (error) {
        console.error("Error scraping data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Start listening on specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
