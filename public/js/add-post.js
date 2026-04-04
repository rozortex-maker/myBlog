import { db, auth } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const postForm = document.getElementById("addPostForm");

// GENİŞLETİLMİŞ KARA LİSTE
const badWords = [
    "amk", "aq", "sik", "piç", "oç", "göt", "döt", "yavşak", "şerefsiz", "dalyarak",
    "fak", "fack", "siktir", "sg", "sq", "amq", "gavat", "ibne", "puşt", "meme", "daşşak"
]; 

if (postForm) {
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) { alert("Lütfen önce giriş yapın!"); return; }

        const title = document.getElementById("postTitle").value;
        const content = document.getElementById("postContent").value;
        const file = document.getElementById("file").files[0];

        if (!file) { alert("Lütfen bir resim seçin!"); return; }

        try {
            const submitBtn = document.getElementById("submitBtn");
            if(submitBtn) submitBtn.disabled = true;

            // --- GELİŞMİŞ FİLTRELEME (DÖT/G0T KORUMASI) ---
            let rawText = `${title} ${content}`.toLowerCase();
            
            // 1. Benzer Karakterleri Normalleştir (0->o, 3->e, 1->i, @->a vb.)
            let normalizedText = rawText
                .replace(/0/g, "o")
                .replace(/3/g, "e")
                .replace(/1/g, "i")
                .replace(/4/g, "a")
                .replace(/@/g, "a")
                .replace(/5/g, "s")
                .replace(/7/g, "t");

            // 2. Noktalama ve Boşlukları Sil (d.ö.t -> döt)
            let cleanText = normalizedText.replace(/[^a-z0-9ğüşıöç]/gi, "");

            // 3. Kontrol Et
            const hasBadWord = badWords.some(word => 
                rawText.includes(word) || 
                normalizedText.includes(word) || 
                cleanText.includes(word)
            );
            
            if (hasBadWord) {
                alert("⚠️ Galaktik Filtre: Uygunsuz kelime kullanımı tespit edildi (döt, g0t vb. dahil). Lütfen içeriği temizleyin!");
                if(submitBtn) submitBtn.disabled = false;
                return;
            }

            // --- GLOBAL API VE KAYIT İŞLEMLERİ (Aynen Devam) ---
            const profanityRes = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(rawText)}`);
            const hasGlobalProfanity = await profanityRes.text();

            if (hasGlobalProfanity === "true") {
                alert("⚠️ Global filtreye takıldınız!");
                if(submitBtn) submitBtn.disabled = false;
                return;
            }

            const formData = new FormData();
            formData.append("image", file);
            const apiKey = "56f9aaf8556874766e838f9817f0f07e"; 
            
            const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: formData });
            const imgbbData = await imgbbRes.json();

            if (imgbbData.success) {
                await addDoc(collection(db, "posts"), {
                    title: title,
                    content: content,
                    author: document.getElementById("postAuthor").value,
                    imageUrl: imgbbData.data.url,
                    userId: user.uid,
                    isPublic: false,
                    createdAt: Date.now()
                });
                alert("Rapor başarıyla kaydedildi! 🛸");
                window.location.href = "../index.html";
            } else {
                alert("Yükleme hatası!");
                if(submitBtn) submitBtn.disabled = false;
            }
        } catch (error) {
            console.error(error);
            alert("Hata oluştu.");
            if(submitBtn) submitBtn.disabled = false;
        }
    });
}