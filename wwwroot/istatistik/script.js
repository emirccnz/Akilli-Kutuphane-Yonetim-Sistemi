const API_STATS_URL = "http://localhost:5000/api/istatistikler";

    document.addEventListener("DOMContentLoaded", () => {
        getIstatistikler();
    });

    async function getIstatistikler() {
        try {
            const response = await fetch(API_STATS_URL);
            const data = await response.json(); 
           
          
            document.getElementById("statToplam").innerText = data.toplam;
            document.getElementById("statIade").innerText = data.iade;
            document.getElementById("statGecikmis").innerText = data.gecikmis;

         
            updateChart(data.grafikVerisi);

         
            const liste = document.getElementById("enCokOkunanListesi");
            liste.innerHTML = "";
            data.topKitaplar.forEach((kitap, index) => {
                liste.innerHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <span class="fw-bold">${index + 1}. ${kitap.baslik}</span>
                            <div class="small text-muted">${kitap.yazar}</div>
                        </div>
                        <span class="badge bg-primary rounded-pill">${kitap.okunmaSayisi} kez</span>
                    </li>
                `;
            });

        } catch (err) { console.error("Veri hatası:", err); }
    }

function updateChart(veriDizisi) {
    const ctx = document.getElementById('borrowChart').getContext('2d');
        
        
new Chart(ctx, {
    type: 'line', 
    data: {
        labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
        datasets: [{
            label: 'Ödünç Alınan Kitap Sayısı',
            data: veriDizisi, 
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)', 
            borderWidth: 2,
            tension: 0.4, 
            fill: true 
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
    });
}