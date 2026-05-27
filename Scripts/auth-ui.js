import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "./firebase.js";
document.body.insertAdjacentHTML("beforeend", `

<!-- AUTH MODAL -->
<div id="authModal" class="auth-overlay">

    <div class="auth-box">

        <div class="auth-header">
            <h2 id="authTitle">Welcome Back</h2>
            <p id="authSubtitle">
                Login to continue your trading journey
            </p>
        </div>

        <div class="auth-form">

            <input
            type="email"
            id="authEmail"
            placeholder="Email address">

            <input
            type="password"
            id="authPassword"
            placeholder="Password">

            <input
            type="password"
            id="authConfirmPassword"
            placeholder="Confirm password"
            style="display:none;">

            <button id="authSubmitBtn">
                Login
            </button>

            <button id="switchAuthMode">
                Need an account? Register
            </button>

            <button id="forgotPasswordBtn">
                Forgot password?
            </button>

        </div>

    </div>

</div>

<!-- TOAST -->
<div id="toast" class="toast"></div>

`);

const authStyle = document.createElement("style");

authStyle.innerHTML = `

.auth-overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.75);
    backdrop-filter:blur(12px);

    display:none;
    align-items:center;
    justify-content:center;

    z-index:99999;
}

.auth-overlay.active{
    display:flex;
}

.auth-box{
    width:400px;
    max-width:90%;

    background:rgba(20,25,35,.92);

    border:1px solid rgba(255,255,255,.08);

    border-radius:28px;

    padding:32px;

    box-shadow:
    0 20px 80px rgba(0,0,0,.5);

    animation:authPop .35s ease;
}

@keyframes authPop{
    from{
        opacity:0;
        transform:translateY(20px) scale(.95);
    }
    to{
        opacity:1;
        transform:none;
    }
}

.auth-header{
    text-align:center;
    margin-bottom:24px;
}

.auth-header h2{
    font-size:2rem;
    margin-bottom:8px;
}

.auth-header p{
    color:#8b949e;
    font-size:.95rem;
}

.auth-form{
    display:flex;
    flex-direction:column;
    gap:14px;
}

.auth-form input{
    background:rgba(255,255,255,.05);

    border:1px solid rgba(255,255,255,.08);

    color:white;

    padding:14px 16px;

    border-radius:14px;

    font-size:.95rem;

    outline:none;

    transition:.25s;
}

.auth-form input:focus{
    border-color:#667eea;
    box-shadow:0 0 0 4px rgba(102,126,234,.15);
}

#authSubmitBtn{
    background:linear-gradient(
    135deg,
    #667eea,
    #764ba2
    );

    border:none;
    color:white;

    padding:14px;

    border-radius:14px;

    font-weight:700;

    cursor:pointer;

    transition:.25s;
}

#authSubmitBtn:hover{
    transform:translateY(-2px);
}

#switchAuthMode,
#forgotPasswordBtn{
    background:none;
    border:none;

    color:#8b949e;

    cursor:pointer;

    font-size:.9rem;
}

#switchAuthMode:hover,
#forgotPasswordBtn:hover{
    color:white;
}

.toast{
    position:fixed;

    top:30px;
    right:30px;

    background:rgba(20,25,35,.95);

    border:1px solid rgba(255,255,255,.08);

    color:white;

    padding:14px 18px;

    border-radius:14px;

    z-index:999999;

    opacity:0;
    transform:translateY(-10px);

    pointer-events:none;

    transition:.3s;
}

.toast.show{
    opacity:1;
    transform:none;
}

`;

document.head.appendChild(authStyle);

function toast(message){

    const t = document.getElementById("toast");

    t.textContent = message;

    t.classList.add("show");

    setTimeout(()=>{
        t.classList.remove("show");
    },3000);

}

window.toast = toast;
let isLogin = true;

const authModal =
document.getElementById("authModal");

const authTitle =
document.getElementById("authTitle");

const authSubtitle =
document.getElementById("authSubtitle");

const authEmail =
document.getElementById("authEmail");

const authPassword =
document.getElementById("authPassword");

const authConfirmPassword =
document.getElementById("authConfirmPassword");

const authSubmitBtn =
document.getElementById("authSubmitBtn");

const switchAuthMode =
document.getElementById("switchAuthMode");

const forgotPasswordBtn =
document.getElementById("forgotPasswordBtn");

authModal.classList.add("active");

switchAuthMode.onclick = () => {

    isLogin = !isLogin;

    if(isLogin){

        authTitle.textContent =
        "Welcome Back";

        authSubtitle.textContent =
        "Login to continue your trading journey";

        authSubmitBtn.textContent =
        "Login";

        authConfirmPassword.style.display =
        "none";

        switchAuthMode.textContent =
        "Need an account? Register";

    }else{

        authTitle.textContent =
        "Create Account";

        authSubtitle.textContent =
        "Start building your trading empire";

        authSubmitBtn.textContent =
        "Register";

        authConfirmPassword.style.display =
        "block";

        switchAuthMode.textContent =
        "Already have an account? Login";

    }

};

authSubmitBtn.onclick = async () => {

    const email =
    authEmail.value.trim();

    const password =
    authPassword.value.trim();

    const confirmPassword =
    authConfirmPassword.value.trim();

    if(!email || !password){

        toast("Fill all fields");

        return;
    }

    try{

        if(isLogin){

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            toast("Login successful 🔥");

            authModal.classList.remove("active");

        }else{

            if(password !== confirmPassword){

                toast("Passwords do not match");

                return;
            }

            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            toast("Account created 🔥");

            authModal.classList.remove("active");

        }

    }catch(error){

        toast(error.message);

    }

};

forgotPasswordBtn.onclick = async () => {

    const email =
    authEmail.value.trim();

    if(!email){

        toast("Enter your email first");

        return;
    }

    try{

        await sendPasswordResetEmail(
            auth,
            email
        );

        toast("Password reset email sent");

    }catch(error){

        toast(error.message);

    }

};