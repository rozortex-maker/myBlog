import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById("loginBtn");
    const regBtn = document.getElementById("regBtn");
    const addBtn = document.getElementById("addBtn");
    const pubBtn = document.getElementById("pubBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (user) {
        // GİRİŞ YAPILMIŞSA
        if (loginBtn) loginBtn.style.display = "none";
        if (regBtn) regBtn.style.display = "none";
        if (addBtn) addBtn.style.display = "inline-block";
        if (pubBtn) pubBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        // GİRİŞ YAPILMAMIŞSA
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (regBtn) regBtn.style.display = "inline-block";
        if (addBtn) addBtn.style.display = "none";
        if (pubBtn) pubBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";

        // Güvenlik
        if (window.location.pathname.includes("add.html")) {
            window.location.href = "../index.html";
        }
    }
});

// Çıkış Fonksiyonu
window.logout = () => {
    if (confirm("Çıkış yapmak istediğine emin misin?")) {
        signOut(auth).then(() => {
            // Dinamik yönlendirme
            const isInsidePages = window.location.pathname.includes("pages/");
            window.location.href = isInsidePages ? "../index.html" : "index.html";
        }).catch((error) => console.error("Çıkış Hatası:", error));
    }
};