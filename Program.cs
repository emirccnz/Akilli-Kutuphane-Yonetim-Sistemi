using Akilli_Kutuphane_Yonetim_Sistemi.Database;
using Akilli_Kutuphane_Yonetim_Sistemi.Database;
var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<DatabaseConnection>();

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
