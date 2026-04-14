import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { TmdbResponse } from '../models/tmdbResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TMDBService{
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;
  constructor(private http: HttpClient) {}
  getMovies(category: string,page: number = 1): Observable<TmdbResponse>{

    const params = new HttpParams()
      //.set('language', 'en-US')
      .set('page', page.toString());
    const headers = new HttpHeaders({
    'accept': 'application/json',
    'Authorization': `Bearer ${this.apiKey}`
    });
      
    return this.http.get<TmdbResponse>(`${this.apiUrl}/movie/${category}`, { headers, params });
  }
}