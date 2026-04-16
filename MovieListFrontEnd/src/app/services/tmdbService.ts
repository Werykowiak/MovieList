import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TmdbResponse } from '../Dtos/tmdbResponse';
import { environment } from '../../environments/environment';
import { MovieStatus } from '../Dtos/MovieStatus';
import { Movie } from '../Dtos/movie';

@Injectable({
  providedIn: 'root'
})
export class TMDBService {
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;
  constructor(private http: HttpClient) { }
  getMovies(category: string, page: number = 1): Observable<TmdbResponse> {

    const params = new HttpParams()
      .set('page', page.toString());
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    return this.http.get<TmdbResponse>(`${this.apiUrl}/movie/${category}`, { headers, params });
  }
  getMovieDetails(movieId: number): Observable<Movie> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    return this.http.get<Movie>(`${this.apiUrl}/movie/${movieId}`, { headers });
  }
  getSearchResults(query: string, page: number = 1): Observable<TmdbResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('query', query);
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    return this.http.get<TmdbResponse>(`${this.apiUrl}/search/movie`, { headers, params });
  }
}