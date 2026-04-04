import { db } from "./firebase.js";
import { collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const container = document.getElementById("postContainer");

async function loadPublicPosts() {
    try {
        const q = query(
            collection(db, "posts"), 
            where("isPublic", "==", true), 
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        if (!container) return;
        
        container.innerHTML = ""; 

        if (querySnapshot.empty) {
            container.innerHTML = "<p style='text-align:center;'>Henüz paylaşılan bir rapor bulunmuyor.</p>";
            return;
        }

        querySnapshot.forEach((docSnapshot) => {
            const post = docSnapshot.data();
            const postHTML = `
                <div class="post target active">
                    <img src="${post.imageUrl || 'https://via.placeholder.com/300'}" alt="post-image">
                    <h1>${post.title}</h1>
                    <p>${post.content}</p>
                    <div class="authorAndDate">
                        <span><strong>Yazar:</strong> ${post.author}</span>
                        <span>${new Date(post.createdAt).toLocaleDateString("tr-TR")}</span>
                    </div>
                </div>
            `;
            container.innerHTML += postHTML;
        });

        // KRİTİK: Postlar yüklendikten sonra modalı onlara bağla
        if (typeof window.setupModal === "function") {
            window.setupModal();
        }

    } catch (error) {
        console.error("Public postlar yüklenirken hata oluştu:", error);
        if (container) container.innerHTML = "<p>Veriler yüklenirken bir sorun oluştu.</p>";
    }
}

loadPublicPosts();