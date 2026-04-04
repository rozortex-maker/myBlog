import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const postContainer = document.getElementById("postContainer");

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadPosts(user); // Giriş yapmışsa kullanıcı bilgisiyle yükle
    } else {
        if(postContainer) postContainer.innerHTML = "<p style='color:white; text-align:center;'>Raporları görmek için lütfen giriş yapın.</p>";
    }
});

async function loadPosts(currentUser) {
    try {
        // SADECE GİRİŞ YAPAN KULLANICININ KENDİ POSTLARINI GETİR
        // (Böylece Home sayfasında başkasının postu veya Public postlar karışmaz)
        const q = query(
            collection(db, "posts"), 
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        if(!postContainer) return;
        postContainer.innerHTML = ""; 

        if (querySnapshot.empty) {
            postContainer.innerHTML = "<p style='color:white; text-align:center;'>Henüz bir raporunuz bulunmuyor.</p>";
            return;
        }

        querySnapshot.forEach((docSnapshot) => {
            const post = docSnapshot.data();
            const docId = docSnapshot.id;
            
            // Butonların görüneceği HTML yapısı
            const postHTML = `
                <div class="post target active">
                    <div class="post-actions">
                        <button class="action-btn delete-btn" onclick="deletePost('${docId}')" title="Sil">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <button class="action-btn share-btn" onclick="sharePost('${docId}')" title="Public'te Paylaş">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                    </div>
                    
                    <img src="${post.imageUrl || ''}" alt="post-image">
                    <h1>${post.title}</h1>
                    <p>${post.content}</p>
                    
                    <div class="authorAndDate">
                        <span>Yazar: ${post.author}</span>
                        <span>${new Date(post.createdAt).toLocaleDateString("tr-TR")}</span>
                    </div>
                </div>
            `;
            postContainer.innerHTML += postHTML;
        });

        // Modalları aktif et
        if (typeof window.setupModal === "function") {
            window.setupModal();
        }

    } catch (error) { 
        console.error("Hata:", error); 
        if(postContainer) postContainer.innerHTML = "<p>Raporlar yüklenirken bir hata oluştu.</p>";
    }
}

// Paylaşma ve Silme fonksiyonlarını global yap (onclick çalışması için)
window.sharePost = async (id) => {
    try {
        await updateDoc(doc(db, "posts", id), { isPublic: true });
        alert("Rapor Public sayfasında paylaşıldı! 🛸");
        window.location.reload();
    } catch (err) { 
        console.error(err);
        alert("Paylaşma hatası!"); 
    }
};

window.deletePost = async (id) => {
    if (confirm("Bu raporu imha etmek istediğine emin misin?")) {
        try {
            await deleteDoc(doc(db, "posts", id));
            alert("Rapor başarıyla silindi. 💥");
            window.location.reload();
        } catch (err) { 
            console.error(err);
            alert("Silme hatası!"); 
        }
    }
};