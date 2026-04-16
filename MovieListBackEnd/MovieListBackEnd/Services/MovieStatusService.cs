using Microsoft.EntityFrameworkCore;
using MovieListBackEnd.Interfaces;
using MovieListBackEnd.Models;

namespace MovieListBackEnd.Services
{
    public class MovieStatusService: IMovieStatusService
    {
        private readonly AppDbContext _context;
        public MovieStatusService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MovieStatusModel> AddAsync(MovieStatusModel movieStatus)
        {
            var result = await _context.MovieStatuses.AddAsync(movieStatus);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var movieStatus = await _context.MovieStatuses.FindAsync(id);
            if(movieStatus == null)
            {
                return false;
            }
            _context.MovieStatuses.Remove(movieStatus);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<MovieStatusModel>> GetAllAsync()
        {
            return await _context.MovieStatuses.ToListAsync();
        }
        public async Task<List<MovieStatusModel>> GetBatchAsync(List<int> ids)
        {
            return await _context.MovieStatuses.Where(ms => ids.Contains(ms.Id)).ToListAsync();
        }

        public async Task<MovieStatusModel> GetByIdAsync(int id)
        {
            var result = await _context.MovieStatuses.FindAsync(id);
            if(result == null)
            {
                throw new KeyNotFoundException($"MovieStatus with id {id} not found.");
            }
            return result;
        }

        public async Task<List<MovieStatusModel>> GetToWatchAsync()
        {
            return await _context.MovieStatuses.Where(ms => ms.Watched == false).ToListAsync();
        }

        public async Task<List<MovieStatusModel>> GetWatchedAsync()
        {
            return await _context.MovieStatuses.Where(ms => ms.Watched == true).ToListAsync();
        }

        public async Task<MovieStatusModel> UpdateAsync(int id, MovieStatusModel movieStatus)
        {
            var localMovieStatus = await _context.MovieStatuses.FindAsync(id);
            if (movieStatus == null)
            {
                throw new KeyNotFoundException($"MovieStatus with id {id} not found.");
            }
            _context.Entry(localMovieStatus).CurrentValues.SetValues(movieStatus);
            await _context.SaveChangesAsync();
            return localMovieStatus;
        }
    }
}
