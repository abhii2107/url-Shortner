const express = require("express")

const path = require("path")
const cookieParser = require("cookie-parser")
const { connectToMongoDB } = require("./connect")
const { handleGetAnalytics } = require("./controllers/url")
const URL = require("./models/url")
const{restrictToLoggedinUserOnly,checkAuth} = require("./middleware/auth")
const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRouter");
const userRoute = require('./routes/user')

const app = express();
const PORT = 8001;
 

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());


app.set("view engine","ejs")
app.set('views',path.resolve("./views"));//views ki file iss folder pe padi hai





connectToMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("mongodb connected"))


app.use("/url",restrictToLoggedinUserOnly ,urlRoute) // you need to logged in to acces anything
app.use("/",staticRoute)
app.use("/user",checkAuth,userRoute)


app.get("/analytics/:shortId", handleGetAnalytics)

app.get("/url/:shortId", async (req, res) => {
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
            { returnDocument: 'after' }
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