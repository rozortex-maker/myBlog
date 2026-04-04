const q = query(
    collection(db, "posts"), 
    where("isPublic", "==", true), // Sadece paylaşılanlar
    orderBy("createdAt", "desc")
);