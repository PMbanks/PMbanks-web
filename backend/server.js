import express from "express";
import cors from "cors";

import admin from "firebase-admin";

import fs from "fs";

const serviceAccount = JSON.parse(
    fs.readFileSync("./firebase-key.json", "utf8")
    
);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
let liveData = {
    symbol: "--",
    bid: "--",
    ask: "--",
    openPnL: "--",
    equity: "--",
    accountId: "--"
};

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        status: "Backend running"
    });
});
app.get("/live-data", (req, res) => {
    res.json(liveData);
});
app.post("/update-live-data", (req, res) => {

    liveData = req.body;

    console.log("UPDATED LIVE DATA");

    res.json({
        success: true
    });

});

app.post("/save-trade", async (req, res) => {

    try {

        const trade = req.body;

        await db.collection("trades").add({
            ...trade,
            createdAt: new Date()
        });

        console.log("TRADE SAVED:", trade);

        res.json({
            success: true
        });

    } catch(error){

        console.log(error);

        res.status(500).json({
            success:false
        });

    }

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});