using MovieListBackEnd.Models;

namespace MovieListBackEnd.Interfaces
{
    public interface IMovieStatusService
    {
        public Task<MovieStatus> AddAsync(MovieStatus movieStatus);
        public Task<MovieStatus> GetByIdAsync(int id);
        public Task<List<MovieStatus>> GetAllAsync();
        public Task<MovieStatus> UpdateAsync(int id, MovieStatus movieStatus);
        public Task<bool> DeleteAsync(int id);
    }
}
