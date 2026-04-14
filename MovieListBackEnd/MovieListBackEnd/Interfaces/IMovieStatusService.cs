using MovieListBackEnd.Models;

namespace MovieListBackEnd.Interfaces
{
    public interface IMovieStatusService
    {
        public Task<MovieStatusModel> AddAsync(MovieStatusModel movieStatus);
        public Task<MovieStatusModel> GetByIdAsync(int id);
        public Task<List<MovieStatusModel>> GetBatchAsync(List<int> ids);
        public Task<List<MovieStatusModel>> GetAllAsync();
        public Task<MovieStatusModel> UpdateAsync(int id, MovieStatusModel movieStatus);
        public Task<bool> DeleteAsync(int id);
    }
}
