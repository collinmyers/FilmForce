import express from "express";
import fetchScores from "./fetchScores.js"
import cors from "cors";

const app = express();
app.use(cors({
    origin: '*', // Replace with your client's domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

const port = 3001; // Choose a port

app.get("/api/scores", async (req, res) => {
    const { movieID, movieName, releaseDate } = req.query;

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
