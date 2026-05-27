import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile
} from "./firebase.js";

// SIGNUP
const signupBtn =
document.getElementById("signupBtn");

if (signupBtn) {

    signupBtn.addEventListener("click",
    async () => {
const username =
document.getElementById("username").value;
        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        try {
const userCredential =
await createUserWithEmailAndPassword(
    auth,
    email,
    password
);

await updateProfile(
    userCredential.user,
    {
        displayName: username
    }
);
showNotification(
    "✅ Account created successfully!",
    "success"
);
            window.location.href =
            "../index.html";

        } catch(error){

            showNotification(
                error.message,
                "error"
            );

        }

    });

}
// LOGIN
const loginBtn =
document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click",
    async () => {

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
showNotification(
    "✅ Logged in successfully!",
    "success"
);
            window.location.href =
            "../index.html";

        } catch(error){
showNotification(
    error.message,
    "error"
);
        }

    });

}
// RESET PASSWORD
const resetBtn =
document.getElementById("resetBtn");

if (resetBtn) {

    resetBtn.addEventListener("click",
    async () => {

        const email =
        document.getElementById("email").value;

        try {

            await sendPasswordResetEmail(
                auth,
                email
            );
showNotification(
    "✅ Password reset email sent! Check spam/junk folder too.",
    "success"
);

        } catch(error){

            showNotification(
                error.message,
                "error"
            );

        }

    });

}
function showNotification(message, type = "success") {

    const notification =
    document.createElement("div");

    notification.textContent = message;

    notification.style.position = "fixed";
    notification.style.top = "30px";
    notification.style.right = "30px";
    notification.style.padding = "16px 22px";
    notification.style.borderRadius = "14px";
    notification.style.fontFamily = "Inter,sans-serif";
    notification.style.fontWeight = "600";
    notification.style.zIndex = "99999";
    notification.style.color = "white";
    notification.style.backdropFilter = "blur(10px)";
    notification.style.boxShadow =
    "0 10px 30px rgba(0,0,0,.35)";
    notification.style.transform =
    "translateY(-20px)";
    notification.style.opacity = "0";
    notification.style.transition =
    "all .35s ease";

    if(type === "success"){

        notification.style.background =
        "linear-gradient(135deg,#16a34a,#22c55e)";

    } else {

        notification.style.background =
        "linear-gradient(135deg,#dc2626,#ef4444)";
    }

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.style.opacity = "1";
        notification.style.transform =
        "translateY(0)";

    }, 50);

    setTimeout(() => {

        notification.style.opacity = "0";
        notification.style.transform =
        "translateY(-20px)";

        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 4000);

}
// PROTECT PAGES
onAuthStateChanged(auth, (user) => {

    const protectedPages = [
        "index.html",
        "journal.html",
        "analytics.html",
        "calendar.html",
        "payouts.html",
        "propfirms.html",
        "rules.html",
        "routine.html",
        "trading.html"
    ];

    const currentPage =
    window.location.pathname
    .split("/")
    .pop();

    const authPages = [
        "login.html",
        "signup.html",
        "forgot-password.html"
    ];

    // NOT LOGGED IN
    if (!user &&
        protectedPages.includes(currentPage)) {
if (currentPage === "index.html") {

 window.location.href =
"Auth/login.html";

} else {

window.location.href =
"../Auth/login.html";
}
    }

    // ALREADY LOGGED IN
    if (user &&
        authPages.includes(currentPage)) {

        window.location.href =
        "../index.html";
    }

});