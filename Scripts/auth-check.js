import {
    auth,
    onAuthStateChanged
} from "./firebase.js";

const DEV_MODE = true;

onAuthStateChanged(auth, (user) => {

    if(!user && !DEV_MODE){

        window.location.href =
        "../Auth/login.html";

    }

});