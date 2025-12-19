const API_ODUNC_URL = "http://localhost:5000/api/odunc"; 

    document.addEventListener("DOMContentLoaded", () => {
        getGunlukOzet();
        getTalepler();
    });

  
    async function getGunlukOzet() {
        const res = await fetch(`${API_ODUNC_URL}/ozet`);
        const data = await res.json();
        
        document.getElementById("gunlukTeslim").innerText = data.teslimCount + " Kitap";
        document.getElementById("gunlukIade").innerText = data.iadeCount + " Kitap";
        document.getElementById("gunlukBekleyen").innerText = data.bekleyenCount + " Adet";
    }

    
    async function getTalepler() {
        const res = await fetch(`${API_ODUNC_URL}/talepler`); 
        const talepler = await res.json();
        
        const tbody = document.getElementById("talepListesi");
        tbody.innerHTML = "";

        talepler.forEach(talep => {
        
            let durumClass = "badge-bekliyor";
            let durumMetin = "Onay Bekliyor";
            let butonHTML = "";

            if (talep.durum === 0) { 
                durumClass = "badge-bekliyor";
                durumMetin = "Onay Bekliyor";
               
                butonHTML = `
                    <button class="btn btn-sm btn-success" onclick="durumGuncelle(${talep.id}, 1)">
                        <i class="fa-solid fa-check"></i> Onayla
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="durumGuncelle(${talep.id}, -1)">
                        <i class="fa-solid fa-xmark"></i> Reddet
                    </button>
                `;
            } else if (talep.durum === 1) { 
                durumClass = "badge-hazir";
                durumMetin = "Hazırlandı";
                
                butonHTML = `
                    <button class="btn btn-sm btn-primary w-100" onclick="durumGuncelle(${talep.id}, 2)">
                        <i class="fa-solid fa-hand-holding"></i> Teslim Et
                    </button>
                `;
            } else if (talep.durum === 2) { 
                durumClass = "bg-success";
                durumMetin = "Teslim Edildi";
               
                butonHTML = `
                    <button class="btn btn-sm btn-secondary w-100" onclick="durumGuncelle(${talep.id}, 3)">
                        <i class="fa-solid fa-rotate-left"></i> İade Al
                    </button>
                `;
            }

         
            let satirClass = "";
            if(talep.uyeRolu === "Personel") {
                satirClass = "row-disabled";
                butonHTML = `<button class="btn btn-sm btn-secondary" disabled><i class="fa-solid fa-ban"></i> Yasak</button>`;
                durumClass = "badge-yasak";
                durumMetin = "Yasaklı Talep";
            }

            const row = `
                <tr class="${satirClass}">
                    <td>#${talep.id}</td>
                    <td>
                        <div class="fw-bold">${talep.uyeAdSoyad}</div>
                        <div class="small text-muted">${talep.uyeNo}</div>
                    </td>
                    <td>${talep.kitapAdi}</td>
                    <td>${new Date(talep.talepTarihi).toLocaleDateString("tr-TR")}</td>
                    <td><span class="badge ${durumClass}">${durumMetin}</span></td>
                    <td class="text-end">${butonHTML}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }


    async function durumGuncelle(talepId, yeniDurumKod) {
        if(!confirm("Durumu güncellemek istediğinize emin misiniz?")) return;

        try {
            await fetch(`${API_ODUNC_URL}/guncelle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: talepId, durum: yeniDurumKod })
            });
       
            getTalepler();
            getGunlukOzet();
        } catch (err) { alert("İşlem başarısız!"); }
    }