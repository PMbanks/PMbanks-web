import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";

const themes = [
    "theme-black",
    "theme-white",
    "theme-darkblue",
    "theme-purple",
    "theme-darkred",
    "theme-darkbrown"
];

export async function applyTheme(themeName){

    themes.forEach(theme => {
        document.body.classList.remove(theme);
    });

    document.body.classList.add(themeName);

    const user = auth.currentUser;

    if(user){

        await setDoc(
            doc(db, "users", user.uid),
            {
                theme: themeName
            },
            { merge: true }
        );

    }

}

export async function loadTheme(){

    const user = auth.currentUser;

    if(!user) return;

    const userDoc = await getDoc(
        doc(db, "users", user.uid)
    );

    if(userDoc.exists()){

        const data = userDoc.data();

        if(data.theme){

            applyTheme(data.theme);

        }

    }

}