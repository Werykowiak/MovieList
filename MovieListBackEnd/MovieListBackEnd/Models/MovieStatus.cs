using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieListBackEnd.Models
{
    public class MovieStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public bool Watched { get; set; }
        [Range(0, 10)]
        [Precision(4, 2)]
        public decimal Rating { get; set; }
        public string Comment { get; set; }
    }
}
