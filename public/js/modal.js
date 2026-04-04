const modal = document.getElementById("postModal");
const closeBtn = document.querySelector(".close-btn");

// Global fonksiyon olarak tanımlıyoruz ki public.js çağırabilsin
window.setupModal = function() {
    const posts = document.querySelectorAll('.post.target');
    
    posts.forEach(post => {
        post.onclick = (e) => {
            // Eğer butona tıklanırsa modalı açma (sil/paylaş butonları için)
            if (e.target.closest('.post-actions')) return;

            document.getElementById("modalTitle").innerText = post.querySelector('h1').innerText;
            document.getElementById("modalImg").src = post.querySelector('img').src;
            document.getElementById("modalFullText").innerText = post.querySelector('p').innerText;
            document.getElementById("modalMeta").innerHTML = post.querySelector('.authorAndDate').innerHTML;
            
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        };
    });
}

if(closeBtn) {
    closeBtn.onclick = () => { 
        modal.style.display = "none"; 
        document.body.style.overflow = "auto"; 
    };
}

window.onclick = (event) => { 
    if (event.target == modal) { 
        modal.style.display = "none"; 
        document.body.style.overflow = "auto"; 
    } 
};