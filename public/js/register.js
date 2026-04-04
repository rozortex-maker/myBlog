import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
        window.location.href = "./login.html";
    } catch (error) {
        alert("Hata: " + error.message);
    }
});