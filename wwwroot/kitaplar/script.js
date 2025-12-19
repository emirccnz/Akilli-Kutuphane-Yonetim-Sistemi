const API_URL = "http://localhost:5000/api/kitaplar"; 

    
    document.addEventListener("DOMContentLoaded", () => {
        getKitaplar();
    });

    async function getKitaplar() {
        try {
            const response = await fetch(API_URL);
            const kitaplar = await response.json();
            
            const tabloGovdesi = document.getElementById("kitapListesi");
            tabloGovdesi.innerHTML = ""; 

            kitaplar.forEach(kitap => {
                
                let stokBadge = kitap.stokAdedi > 0 
                    ? `<span class="badge bg-success">${kitap.stokAdedi}</span>` 
                    : `<span class="badge bg-secondary">Tükendi</span>`;

                const satir = `
                    <tr>
                        <td>${kitap.id}</td>
                        <td class="fw-bold">${kitap.baslik}</td>
                        <td>${kitap.yazar}</td>
                        <td>${kitap.kategori}</td>
                        <td>${kitap.yayinYili}</td>
                        <td>${kitap.rafBilgisi}</td>
                        <td>${stokBadge}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary" onclick="kitapDuzenle(${kitap.id})">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="kitapSil(${kitap.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tabloGovdesi.innerHTML += satir;
            });
        } catch (error) {
            console.error("Hata oluştu:", error);
            alert("Veriler yüklenirken bir hata oluştu!");
        }
    }

    async function kitapSil(id) {
        if(confirm("Bu kitabı silmek istediğinize emin misiniz?")) {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                getKitaplar(); 
            } catch (error) {
                alert("Silme işlemi başarısız.");
            }
        }
    }