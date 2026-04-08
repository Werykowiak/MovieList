using Microsoft.EntityFrameworkCore;
using MovieListBackEnd.Models;

namespace MovieListBackEnd
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<MovieStatus> MovieStatuses { get; set; }
    }
}
