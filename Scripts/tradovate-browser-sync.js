const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args));
const { chromium } = require('playwright');
let previousPosition = 0;
let activeTrade = null;

(async () => {

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto('https://trader.tradovate.com');

    console.log('LOGIN NOW');

    await page.waitForTimeout(30000);

    setInterval(async () => {

        const text = await page.locator('body').innerText();
        function extract(regex) {
            const match = text.match(regex);
            return match ? match[1] : null;
        }
const data = {

    symbol: extract(/(MNQ[MUZH]\d)/),

    bid: extract(/BID\s+([\d.]+)/),

    ask: extract(/ASK\s+([\d.]+)/),

    openPnL: extract(/OPEN P\/L\s+(-?[\d,.]+)/),

    equity: extract(/EQUITY\s+([\d,.]+)/),

    accountId: extract(/(TDFYG\d+)/),

    position: extract(/POSITION\s+(-?\d+)/)

};
        console.log('LIVE DATA');
        console.log(data);
        const currentPosition = Number(data.position || 0);

if(previousPosition === 0 && currentPosition !== 0){

    activeTrade = {
        symbol: data.symbol,
        entryPrice: currentPosition > 0 ? data.ask : data.bid,
        direction: currentPosition > 0 ? "LONG" : "SHORT",
        entryTime: new Date(),
        accountId: data.accountId
    };

    console.log("TRADE OPENED");
    console.log(activeTrade);
}
if(previousPosition !== 0 && currentPosition === 0 && activeTrade){

    activeTrade.exitPrice =
        activeTrade.direction === "LONG"
            ? data.bid
            : data.ask;

    activeTrade.exitTime = new Date();

    activeTrade.pnl = data.openPnL;

    console.log("TRADE CLOSED");
    console.log(activeTrade);

    await fetch("http://localhost:3000/save-trade", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(activeTrade)
    });

    activeTrade = null;
}
        await fetch("http://localhost:3000/update-live-data", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
});
previousPosition = currentPosition;

    }, 3000);

})();