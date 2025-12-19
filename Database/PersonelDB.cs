using Akilli_Kutuphane_Yonetim_Sistemi.Model;
using MySql.Data.MySqlClient;

namespace Akilli_Kutuphane_Yonetim_Sistemi.Database
{
    public class PersonelDb
    {
        private readonly DatabaseConnection _db;

        public PersonelDb(DatabaseConnection db)
        {
            _db = db;
        }

        public Personel? PersonelGiris(string eposta,string sifre)
        {
            using var conn = _db.GetConnection();
            conn.Open();
            string sql = "select * from personeller where sifre = @sifre and eposta = @eposta";
            using var cmd = new MySqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@sifre", sifre);
            cmd.Parameters.AddWithValue("@eposta",eposta);
            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return new Personel(
                    reader.GetInt32("id"),
                    reader.GetString("ad_soyad"),
                    reader.GetString("eposta"),
                    reader.GetString("sifre"),
                    reader.GetString("telefon")
                    );
            }
            return null;
        }

        public void PersonelAta(int id)
        {
            OgrencilerDB odb = new OgrencilerDB(_db);
            var ogrenci = odb.ogrenciGetir(id);
            using var conn = _db.GetConnection();
            conn.Open();
            using var transaction = conn.BeginTransaction();

            try
            {
                string deleteSql = "DELETE FROM ogrenciler WHERE id = @id";
                using var deleteCmd = new MySqlCommand(deleteSql, conn, transaction);
                deleteCmd.Parameters.AddWithValue("@id", id);
                deleteCmd.ExecuteNonQuery();

                string insertSql = @"INSERT INTO personeller 
                             (ad_soyad, eposta, sifre, telefon)
                             VALUES (@ad_soyad, @eposta, @sifre, @telefon)";

                using var insertCmd = new MySqlCommand(insertSql, conn, transaction);
                insertCmd.Parameters.AddWithValue("@ad_soyad", ogrenci.FullName);
                insertCmd.Parameters.AddWithValue("@eposta", ogrenci.Email);
                insertCmd.Parameters.AddWithValue("@sifre", ogrenci.Password);
                insertCmd.Parameters.AddWithValue("@telefon", ogrenci.Telephone);
                insertCmd.ExecuteNonQuery();

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
        public List<Personel> GetAll()
        {
            var list = new List<Personel>();

            using var conn = _db.GetConnection();
            conn.Open();

            string sql = "SELECT * FROM personeller";
            using var cmd = new MySqlCommand(sql, conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new Personel(
                
                    reader.GetInt32("id"),
                    reader.GetString("ad_soyad"),
                    reader.GetString("eposta"),
                    reader.GetString("sifre"),
                    reader.GetString("telefon")
                ));
            }

            return list;
        }

        public void AddPersonel(Personel p)
        {
            using var conn = _db.GetConnection();
            conn.Open();

            string sql = @"INSERT INTO personeller 
                           (ad_soyad, eposta, sifre, telefon)
                           VALUES (@FullName, @Email, @Password, @Telephone)";

            using var cmd = new MySqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@FullName", p.FullName);
            cmd.Parameters.AddWithValue("@Email", p.Email);
            cmd.Parameters.AddWithValue("@Password", p.Password);
            cmd.Parameters.AddWithValue("@Telephone", p.Telephone);

            cmd.ExecuteNonQuery();
        }
    }
}
