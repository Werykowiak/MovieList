using Microsoft.AspNetCore.Mvc;
using MovieListBackEnd.Dtos;
using MovieListBackEnd.Interfaces;
using MovieListBackEnd.Models;

namespace MovieListBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieStatusController : ControllerBase
    {
        private readonly IMovieStatusService _movieStatusService;

        public MovieStatusController(IMovieStatusService movieStatusService)
        {
            _movieStatusService = movieStatusService;
        }

        [HttpPost]
        public async Task<IActionResult> AddMovieStatus([FromBody] MovieStatusDto movieStatus)
        {
            var result = await _movieStatusService.AddAsync(new MovieStatusModel(movieStatus));
            return CreatedAtAction(nameof(GetMovieStatusById), new { id = result.Id }, result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieStatusById(int id)
        {
            try
            {
                var result = await _movieStatusService.GetByIdAsync(id);
                return Ok(new MovieStatusDto(result));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();

            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllMovieStatuses()
        {
            var result = await _movieStatusService.GetAllAsync();
            return Ok(result.Select(ms => new MovieStatusDto(ms)));
        }
        [HttpGet("batch")]
        public async Task<IActionResult> GetBatchStatuses([FromQuery] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("Empty ID list.");
            }
            var result = await _movieStatusService.GetBatchAsync(ids);
            return Ok(result.Select(ms => new MovieStatusDto(ms)));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovieStatus(int id, [FromBody] MovieStatusDto movieStatus)
        {
            try
            {
                var result = await _movieStatusService.UpdateAsync(id, new MovieStatusModel(movieStatus));
                return Ok(new MovieStatusDto(result));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovieStatus(int id)
        {
            var result = await _movieStatusService.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
