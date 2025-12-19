let seciliKitapId = null;
let talepEdilecekKitapId = null;
let talepler = []; 

const bookListEl = document.getElementById("book-list");
const resultsCountEl = document.getElementById("results-count");
const bookDetailsBody = document.getElementById("book-details-body");

const searchQueryInput = document.getElementById("search-query");
const filterCategorySelect = document.getElementById("filter-category");
const filterAuthorInput = document.getElementById("filter-author");
const filterYearInput = document.getElementById("filter-year");
const btnSearch = document.getElementById("btn-search");

const requestModal = document.getElementById("request-modal");
const closeRequestModalBtn = document.getElementById("close-request-modal");
const cancelRequestBtn = document.getElementById("cancel-request");
const confirmRequestBtn = document.getElementById("confirm-request");
const requestBookTitleEl = document.getElementById("request-book-title");
const requestStartDateInput = document.getElementById("request-start-date");
const requestEndDateInput = document.getElementById("request-end-date");

const simpleRequestsListEl = document.getElementById("simple-requests-list");


const summaryActiveEl = document.getElementById("summary-active-requests");
const summaryPendingEl = document.getElementById("summary-pending-requests");
const summaryOverdueEl = document.getElementById("summary-overdue");

let aktifTalepSayisi = 0;
let beklemedeTalepSayisi = 0;
let gecikmisTalepSayisi = 0; 

function ozetGuncelle() {
  summaryActiveEl.textContent = aktifTalepSayisi;
  summaryPendingEl.textContent = beklemedeTalepSayisi;
  summaryOverdueEl.textContent = gecikmisTalepSayisi;
}


function taleplerListesiniCiz() {
  simpleRequestsListEl.innerHTML = "";

  if (!talepler.length) {
    const li = document.createElement("li");
    li.style.color = "#4b5563";
    li.textContent = "Henüz bir ödünç talebiniz yok.";
    simpleRequestsListEl.appendChild(li);
    return;
  }

  talepler.forEach((t) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "4px";

    const textContainer = document.createElement("span");
    textContainer.style.display = "flex";
    textContainer.style.alignItems = "center";
    textContainer.style.gap = "6px";
    textContainer.style.flexWrap = "wrap";


    const kitapAdi = document.createElement("span");
    kitapAdi.textContent = t.kitapBaslik;
    kitapAdi.style.fontWeight = "600";
    kitapAdi.style.color = "#2563eb";

  
    const tarihler = document.createElement("span");
    tarihler.textContent = `(${t.baslangic} - ${t.bitis})`;
    tarihler.style.color = "#6b7280";
    tarihler.style.fontSize = "12px";

    
    const durum = document.createElement("span");
    durum.textContent = t.durum;
    durum.style.fontWeight = "500";
    durum.style.fontSize = "12px";
    
    if (t.durum === "Beklemede") {
      durum.style.color = "#2563eb";
    } else if (t.durum === "Onaylandı") {
      durum.style.color = "#16a34a";
    } else if (t.durum === "Teslim Edildi") {
      durum.style.color = "#059669";
    } else if (t.durum === "Gecikmiş") {
      durum.style.color = "#dc2626";
    } else {
      durum.style.color = "#6b7280";
    }

    textContainer.append(kitapAdi, tarihler, "-", durum);

    const btn = document.createElement("button");
    btn.className = "btn btn-cancel";
    btn.style.padding = "3px 8px";
    btn.textContent = "İptal Et";
    btn.addEventListener("click", () => {
      
      if (t.durum === "Beklemede") {
        aktifTalepSayisi = Math.max(0, aktifTalepSayisi - 1);
        beklemedeTalepSayisi = Math.max(0, beklemedeTalepSayisi - 1);
        ozetGuncelle();
      }
      talepler = talepler.filter((x) => x.id !== t.id);
      taleplerListesiniCiz();
    });

    li.append(textContainer, btn);
    simpleRequestsListEl.appendChild(li);
  });
}


function kitapBul(kitapId) {
  return kitaplar.find((k) => k.kitap_id === kitapId);
}


function filtreliKitaplar() {
  const q = searchQueryInput.value.trim().toLowerCase();
  const kategori = filterCategorySelect.value;
  const yazar = filterAuthorInput.value.trim().toLowerCase();
  const yil = filterYearInput.value ? Number(filterYearInput.value) : null;

  return kitaplar.filter((kitap) => {
    if (kategori && kitap.kategori !== kategori) return false;
    if (yazar && !kitap.yazar.toLowerCase().includes(yazar)) return false;
    if (yil && kitap.yayin_yili !== yil) return false;

    if (!q) return true;

    const metin = (kitap.baslik + " " + kitap.yazar).toLowerCase();
    return metin.includes(q);
  });
}


function listeyiCiz(liste) {
  bookListEl.innerHTML = "";

  if (!liste.length) {
    resultsCountEl.textContent = "Sonuç bulunamadı";
    const li = document.createElement("li");
    li.textContent = "Arama kriterlerinize uygun kitap bulunamadı.";
    li.style.fontSize = "13px";
    li.style.color = "#6b7280";
    li.style.padding = "4px 2px";
    bookListEl.appendChild(li);
    bookDetailsBody.classList.add("empty");
    bookDetailsBody.innerHTML = "<p>Bir kitap seçerek detaylarını görebilirsiniz.</p>";
    seciliKitapId = null;
    return;
  }

  resultsCountEl.textContent = `${liste.length} kitap bulundu`;

  liste.forEach((kitap) => {
    const li = document.createElement("li");
    li.className = "book-item";
    li.dataset.id = kitap.kitap_id;

    if (kitap.kitap_id === seciliKitapId) {
      li.classList.add("active");
    }

    const badge = document.createElement("div");
    badge.className = "book-badge";
    badge.textContent = kitap.baslik[0] || "?";

    const main = document.createElement("div");
    main.className = "book-main";

    const title = document.createElement("div");
    title.className = "book-title";
    title.textContent = kitap.baslik;

    const meta = document.createElement("div");
    meta.className = "book-meta";
    meta.textContent = `${kitap.yazar} • ${kitap.yayin_yili}`;

    const tags = document.createElement("div");
    tags.className = "book-tags";
    const tagCategory = document.createElement("span");
    tagCategory.className = "tag tag-soft";
    tagCategory.textContent = kitap.kategori;
    const tagShelf = document.createElement("span");
    tagShelf.className = "tag";
    tagShelf.textContent = kitap.raf_bilgisi || "-";
    tags.append(tagCategory, tagShelf);

    main.append(title, meta, tags);

    const stock = document.createElement("div");
    stock.className = "book-stock";
    const stockText = document.createElement("span");

    if (kitap.stok_adedi > 3) {
      stockText.className = "stock-available";
      stockText.textContent = `${kitap.stok_adedi} adet mevcut`;
    } else if (kitap.stok_adedi > 0) {
      stockText.className = "stock-low";
      stockText.textContent = `Sınırlı stok (${kitap.stok_adedi})`;
    } else {
      stockText.className = "stock-none";
      stockText.textContent = "Stokta yok";
    }

    stock.appendChild(stockText);

    li.append(badge, main, stock);
    li.addEventListener("click", () => {
      seciliKitapId = kitap.kitap_id;
      listeyiCiz(filtreliKitaplar());
      detayCiz(kitap);
    });

    bookListEl.appendChild(li);
  });

  
  if (!seciliKitapId && liste.length) {
    seciliKitapId = liste[0].kitap_id;
    detayCiz(liste[0]);
    const firstItem = bookListEl.querySelector(".book-item");
    if (firstItem) firstItem.classList.add("active");
  }
}


function detayCiz(kitap) {
  bookDetailsBody.classList.remove("empty");
  bookDetailsBody.innerHTML = "";

  const infoSection = document.createElement("div");
  infoSection.className = "details-section";

  const infoTitle = document.createElement("h4");
  infoTitle.textContent = kitap.baslik;

  const infoMeta = document.createElement("div");
  infoMeta.className = "book-meta";
  infoMeta.textContent = `${kitap.yazar} • ${kitap.yayin_yili}`;

  infoSection.append(infoTitle, infoMeta);

  const gridSection = document.createElement("div");
  gridSection.className = "details-section";
  const gridTitle = document.createElement("h4");
  gridTitle.textContent = "Kitap Bilgileri";

  const grid = document.createElement("div");
  grid.className = "details-grid";

  const fields = [
    ["Kategori", kitap.kategori],
    ["Raf Bilgisi", kitap.raf_bilgisi || "-"],
    ["Stok", kitap.stok_adedi > 0 ? `${kitap.stok_adedi} adet` : "Stokta yok"],
  ];

  fields.forEach(([label, value]) => {
    const labelEl = document.createElement("div");
    labelEl.className = "details-row-label";
    labelEl.textContent = label;

    const valueEl = document.createElement("div");
    valueEl.className = "details-row-value";
    valueEl.textContent = value;

    grid.append(labelEl, valueEl);
  });

  gridSection.append(gridTitle, grid);

  const summarySection = document.createElement("div");
  summarySection.className = "details-section";
  const summaryTitle = document.createElement("h4");
  summaryTitle.textContent = "Özet";
  const summaryText = document.createElement("p");
  summaryText.textContent = kitap.ozet || "Bu kitap için özet bilgisi girilmemiş.";
  summarySection.append(summaryTitle, summaryText);

  const actions = document.createElement("div");
  actions.className = "details-actions";
  const btn = document.createElement("button");
  btn.className = "btn btn-primary";
  btn.textContent = "Ödünç Talebi Gönder";

  if (kitap.stok_adedi === 0) {
    btn.disabled = true;
    btn.textContent = "Stokta Yok";
  }

  btn.addEventListener("click", () => modalAc(kitap));
  actions.appendChild(btn);

  bookDetailsBody.append(infoSection, gridSection, summarySection, actions);
}


function modalAc(kitap) {
  talepEdilecekKitapId = kitap.kitap_id;
  requestBookTitleEl.textContent = kitap.baslik;

  const today = new Date().toISOString().slice(0, 10);
  requestStartDateInput.value = today;

  const end = new Date();
  end.setDate(end.getDate() + 7);
  requestEndDateInput.value = end.toISOString().slice(0, 10);

  requestModal.classList.remove("hidden");
}

function modalKapat() {
  requestModal.classList.add("hidden");
  talepEdilecekKitapId = null;
}

closeRequestModalBtn.addEventListener("click", modalKapat);
cancelRequestBtn.addEventListener("click", modalKapat);

requestModal.addEventListener("click", (e) => {
  if (e.target === requestModal) {
    modalKapat();
  }
});

confirmRequestBtn.addEventListener("click", () => {
  if (!talepEdilecekKitapId) return;

  const baslangic = requestStartDateInput.value;
  const bitis = requestEndDateInput.value;

  if (!baslangic || !bitis) {
    alert("Lütfen başlangıç ve bitiş tarihlerini seçin.");
    return;
  }

  if (new Date(bitis) < new Date(baslangic)) {
    alert("Bitiş tarihi, başlangıç tarihinden önce olamaz.");
    return;
  }

 
  aktifTalepSayisi += 1;
  beklemedeTalepSayisi += 1;
  ozetGuncelle();

 
  const kitap = kitapBul(talepEdilecekKitapId);
  talepler.push({
    id: Date.now(),
    kitapId: talepEdilecekKitapId,
    kitapBaslik: kitap ? kitap.baslik : `Kitap #${talepEdilecekKitapId}`,
    baslangic,
    bitis,
    durum: "Beklemede",
  });
  taleplerListesiniCiz();

  alert("Ödünç alma talebiniz örnek olarak kaydedildi (sadece frontend).");
  modalKapat();
});


function init() {
  const liste = filtreliKitaplar();
  listeyiCiz(liste);
  ozetGuncelle();
  taleplerListesiniCiz();

  btnSearch.addEventListener("click", () => {
    seciliKitapId = null;
    listeyiCiz(filtreliKitaplar());
  });

  searchQueryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      seciliKitapId = null;
      listeyiCiz(filtreliKitaplar());
    }
  });

  [filterCategorySelect, filterAuthorInput, filterYearInput].forEach((el) => {
    el.addEventListener("change", () => {
      seciliKitapId = null;
      listeyiCiz(filtreliKitaplar());
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
document.getElementById("btn-logout").addEventListener("click", function () {
  window.location.href = "../ogrencigiris/index.html";
});


