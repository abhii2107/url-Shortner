const {nanoid} = require("nanoid")
const URL = require("../models/url")
async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({error: 'url is required'})
    const shortId = nanoid(8);
    await URL.create({
        shortId : shortId,
        redirectUrl:body.url,
        visitHistory:[],
    })

    return res.json({id : shortId})
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    if (!shortId) {
        return res.status(400).json({ error: "shortId is required" });
    }

    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short link not found" });
    }

    const clickHistory = Array.isArray(result.visitHistory) ? result.visitHistory : [];

    return res.json({
        totalClicks: clickHistory.length,
        analytics: clickHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}