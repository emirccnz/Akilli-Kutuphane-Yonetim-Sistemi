const API_URL = "http://localhost:5000/api/uyeler";

document.addEventListener("DOMContentLoaded", () => {
    getUyeler();
});

 
async function getUyeler() {
    try {
        const response = await fetch(API_URL);
        const uyeler = await response.json();
            
        const tbody = document.getElementById("uyeListesi");
        tbody.innerHTML = "";

        uyeler.forEach(uye => {
                
            let rolBadge = uye.rol === 'Öğrenci' 
                ? `<span class="badge bg-info text-dark">Öğrenci</span>` 
                : `<span class="badge bg-warning text-dark">Personel</span>`;

            const row = `
                <tr>
                    <td>${uye.id}</td>
                    <td>${uye.adSoyad}</td>
                    <td>${uye.eposta}</td>
                    <td>${rolBadge}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="uyeSil(${uye.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (err) { console.error("Hata:", err); }
}


async function uyeEkle(e) {
    e.preventDefault(); 
        
    const yeniUye = {
        adSoyad: document.getElementById("uyeAdSoyad").value,
        eposta: document.getElementById("uyeEposta").value,
        rol: document.getElementById("uyeRol").value
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(yeniUye)
        });
        alert("Üye başarıyla eklendi!");
        getUyeler(); 
    } catch (err) { alert("Ekleme başarısız!"); }
}

  
async function uyeSil(id) {
    if(confirm("Silmek istediğine emin misin?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        getUyeler();
    }
}