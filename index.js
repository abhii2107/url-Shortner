const express = require("express")
const urlRoute = require("./routes/url")
const { connectToMongoDB } = require("./connect")
const { handleGetAnalytics } = require("./controllers/url")
const URL = require("./models/url")
const app = express();
const PORT = 8001;

app.use(express.json());

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("mongodb connected"))
app.use("/url", urlRoute)

app.get("/analytics/:shortId", handleGetAnalytics)

app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send("Short link not found");
        }

        return res.redirect(entry.redirectUrl);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Unable to process redirect");
    }
});

app.listen(PORT, () => console.log(`Server started at Port ${PORT}`))