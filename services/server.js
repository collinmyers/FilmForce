import express from "express";
import scoreScraper from "./scoreScraper.js"
import cors from "cors";

const app = express();
app.use(cors({
    origin: '*', // Replace with your client's domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

const port = 3001; // Choose a port

app.get("/api/scrape", async (req, res) => {
    const { title, year } = req.query;

    try {
        const ratings = await scoreScraper(title, year);
        console.log(ratings)
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
