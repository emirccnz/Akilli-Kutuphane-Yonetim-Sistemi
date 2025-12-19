namespace Akilli_Kutuphane_Yonetim_Sistemi.Model
{
    public abstract class User
    {
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Telephone { get; set; }
            public int Id { get; set; }

            public User(int Id, string FullName, string Email, string Password)
            {
                this.Id = Id;
                this.FullName = FullName;
                this.Email = Email;
                this.Password = Password;
            }
            public User(int Id, string FullName, string Email, string Password, string Telephone) : this (Id, FullName, Email, Password)
            {
                this.Telephone = Telephone;
            }


        }
}
