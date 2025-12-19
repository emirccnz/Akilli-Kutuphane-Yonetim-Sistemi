using Akilli_Kutuphane_Yonetim_Sistemi.Model;
using MySql.Data.MySqlClient;
namespace Akilli_Kutuphane_Yonetim_Sistemi.Database
{
    public class OgrencilerDB
    {
        private readonly DatabaseConnection _db;

        public OgrencilerDB(DatabaseConnection db)
        {
            _db = db;
        }
        public Ogrenci? OgrenciGiris(string eposta, string sifre)
        {
            using var conn = _db.GetConnection();
            conn.Open();
            string sql = "select * from ogrenciler where sifre = @sifre and eposta = @eposta";
            using var cmd = new MySqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@sifre", sifre);
            cmd.Parameters.AddWithValue("@eposta", eposta);
            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return new Ogrenci(
                    reader.GetInt32("id"),
                    reader.GetString("ad_soyad"),
                    reader.GetString("eposta"),
                    reader.GetString("sifre"),
                    reader.GetString("telefon"),
                    reader.GetString("okul_numarasi")
                    );
            }
            return null;
        }
        public List<Ogrenci> GetAll()
        {
            var list = new List<Ogrenci>();

            using var conn = _db.GetConnection();
            conn.Open();

            string sql = "SELECT * FROM ogrenciler";
            using var cmd = new MySqlCommand(sql, conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new Ogrenci(

                    reader.GetInt32("id"),
                    reader.GetString("ad_soyad"),
                    reader.GetString("eposta"),
                    reader.GetString("sifre"),
                    reader.GetString("telefon"),
                    reader.GetString("okul_numarasi")
                ));
            }

            return list;
        }

        public void ogrenciEkle(Ogrenci o)
        {
            using var conn = _db.GetConnection();
            conn.Open();

            string sql = @"INSERT INTO ogrenciler 
                           (ad_soyad, eposta, sifre,okul_numarasi, telefon)
                           VALUES (@FullName, @Email, @Password,@okul_numarasi, @Telephone)";

            using var cmd = new MySqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@FullName", o.FullName);
            cmd.Parameters.AddWithValue("@Email", o.Email);
            cmd.Parameters.AddWithValue("@Password", o.Password);
            cmd.Parameters.AddWithValue("@Telephone", o.Telephone);
            cmd.Parameters.AddWithValue("@okul_numarasi",o.OkulNumarasi);

            cmd.ExecuteNonQuery();
        }

        public Ogrenci? ogrenciGetir(int id)
        {
            using var conn = _db.GetConnection();
            conn.Open();

            string sql = "select * from ogrenciler where ogrenci_id = @id";
            using var cmd = new MySqlCommand( sql, conn);
            cmd.Parameters.AddWithValue("@id", id);
            var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return new Ogrenci(

                    reader.GetInt32("id"),
                    reader.GetString("ad_soyad"),
                    reader.GetString("eposta"),
                    reader.GetString("sifre"),
                    reader.GetString("telefon"),
                    reader.GetString("okul_numarasi")
                );
            }
            return null;
        }
    }
}
