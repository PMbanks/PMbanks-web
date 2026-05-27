import fetch from "node-fetch";

const response = await fetch("https://demo-api.tradovate.com/v1/auth/accesstokenrequest", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "TDFYU625937536",
        password: "r*rN?RrZ327!",
        appId: "TradingDashboard",
        appVersion: "1.0",
        cid: 0,
        sec: ""
    })
});

const data = await response.json();

console.log(data);