const BASE_URL = "https://live.tradovateapi.com/v1";

const EMAIL = "TDFYG25954802293";
const PASSWORD = "r*rN?RrZ327!";

async function login() {

    const response = await fetch(
        `${BASE_URL}/auth/accesstokenrequest`,
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name: EMAIL,
                password: PASSWORD,
                appId: "journal",
                appVersion: "1.0",
                cid: 0,
                sec: ""
            })
        }
    );
console.log(response.status);
    const data = await response.json();

    console.log("LOGIN RESPONSE:");
    console.log(data);

}

login();