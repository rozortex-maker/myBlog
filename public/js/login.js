import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Hoş geldin! Giriş başarılı. 🛸");
        window.location.href = "../index.html";
    } catch (error) {
        alert("Hata: " + error.message);
    }
});