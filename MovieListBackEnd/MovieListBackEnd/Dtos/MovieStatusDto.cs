using Microsoft.EntityFrameworkCore;
using MovieListBackEnd.Models;
using System.ComponentModel.DataAnnotations;

namespace MovieListBackEnd.Dtos
{
    public class MovieStatusDto
    {
        public int Id { get; set; }
        public bool Watched { get; set; }
        [Range(0, 10)]
        [Precision(4, 2)]
        public decimal? Rating { get; set; }
        public string Comment { get; set; }

        public MovieStatusDto(MovieStatusModel model) 
        {
            Id = model.Id;
            Watched = model.Watched;
            Rating = model.Rating;
            Comment = model.Comment;
        }

        public MovieStatusDto() { }
    }
}
