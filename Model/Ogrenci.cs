namespace Akilli_Kutuphane_Yonetim_Sistemi.Model
{
    public class Ogrenci : User
    {
        private string Okul_numarasi { get; set; }
        public Ogrenci(int Id, string FullName, string Email, string Password, string Telephone, string okul_numarasi) : base(Id, FullName, Email, Password, Telephone)
        {
            Okul_numarasi = okul_numarasi;
        }
        public string OkulNumarasi
        {
            get { return Okul_numarasi; }
        }
    }
}
