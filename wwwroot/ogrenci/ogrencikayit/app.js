document.getElementById("ogrenciKayitForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const ad = document.getElementById("ad").value.trim();
  const soyad = document.getElementById("soyad").value.trim();
  const ogrenciNo = document.getElementById("ogrenciNo").value.trim();
  const telefon = document.getElementById("telefon").value.trim();
  const email = document.getElementById("email").value.trim();
  const sifre = document.getElementById("sifre").value;

  const hata = document.getElementById("hataMesaji");

 
  if (ad === "") {
    hata.textContent = "Ad alanı boş bırakılamaz.";
    return;
  }

  if (soyad === "") {
    hata.textContent = "Soyad alanı boş bırakılamaz.";
    return;
  }

  if (ogrenciNo === "") {
    hata.textContent = "Öğrenci numarası boş bırakılamaz.";
    return;
  }

  if (telefon === "") {
    hata.textContent = "Telefon numarası boş bırakılamaz.";
    return;
  }

  if (email === "") {
    hata.textContent = "E-posta alanı boş bırakılamaz.";
    return;
  }

  if (sifre === "") {
    hata.textContent = "Şifre alanı boş bırakılamaz.";
    return;
  }


  const parolaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!parolaRegex.test(sifre)) {
    hata.textContent =
      "Parola en az 8 karakter olmalı ve bir büyük harf, bir küçük harf ile bir sayı içermelidir.";
    return;
  }

 
  hata.style.color = "green";
  hata.textContent = "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...";

  setTimeout(() => {
    window.location.href = "../ogrencigiris/index.html";
  }, 1500);
});
