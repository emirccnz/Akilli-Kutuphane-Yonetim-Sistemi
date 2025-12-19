using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;

namespace Akilli_Kutuphane_Yonetim_Sistemi.Database
{
    public class DatabaseConnection
    {
        private readonly string _connectionString;

        public DatabaseConnection(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MySqlConnection");
        }

        public MySqlConnection GetConnection()
        {
            return new MySqlConnection(_connectionString);
        }
    }
}
