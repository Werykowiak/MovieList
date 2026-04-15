import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieStatus } from '../Dtos/MovieStatus'

@Injectable({
    providedIn: 'root'
})
export class MovieListService {
    private readonly apiUrl = environment.myApiUrl;
    constructor(private http: HttpClient) { }
    addToWatch(movieId: number): Observable<any> {
        const newMovieStatus = new MovieStatus(movieId);
        return this.http.post(`${this.apiUrl}/MovieStatus`, newMovieStatus);
    }
    getBatchMovieStatus(movieIds: number[]): Observable<MovieStatus[]> {
        let params = new HttpParams();

        // Dodajemy każdy ID jako osobny parametr o tym samym kluczu 'ids'
        movieIds.forEach(id => {
            params = params.append('ids', id.toString());
        });
        return this.http.get<MovieStatus[]>(`${this.apiUrl}/MovieStatus/batch`, { params });
    }
}
