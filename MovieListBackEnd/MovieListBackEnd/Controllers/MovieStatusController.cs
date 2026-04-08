using Microsoft.AspNetCore.Mvc;
using MovieListBackEnd.Interfaces;

namespace MovieListBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieStatusController: ControllerBase
    {
        private readonly IMovieStatusService _movieStatusService;

        public MovieStatusController(IMovieStatusService movieStatusService)
        {
            _movieStatusService = movieStatusService;
        }

        [HttpPost]
        public async Task<IActionResult> AddMovieStatus([FromBody] Models.MovieStatus movieStatus)
        {
            var result = await _movieStatusService.AddAsync(movieStatus);
            return CreatedAtAction(nameof(GetMovieStatusById), new { id = result.Id }, result);
        }
        [HttpGet("id")]
        public async Task<IActionResult> GetMovieStatusById(int id)
        {
            try
            {
                var result = await _movieStatusService.GetByIdAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();

            }
        }
    }
}
