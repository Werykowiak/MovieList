using Microsoft.EntityFrameworkCore;
using MovieListBackEnd.Dtos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieListBackEnd.Models
{
    public class MovieStatusModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public bool Watched { get; set; }
        [Range(0, 10)]
        [Precision(4, 2)]
        public decimal? Rating { get; set; }
        public string Comment { get; set; }

        public MovieStatusModel(MovieStatusDto dto) 
        {
            Id = dto.Id;
            Watched = dto.Watched;
            Rating = dto.Rating;
            Comment = dto.Comment;
        }
        public MovieStatusModel() { }
    }
}
