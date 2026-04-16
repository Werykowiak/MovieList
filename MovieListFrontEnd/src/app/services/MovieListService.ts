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
    addToWatch(movieStatus: MovieStatus): Observable<any> {
        console.log('Adding to watch:', movieStatus);
        return this.http.post(`${this.apiUrl}/MovieStatus`, movieStatus);
    }
    getBatchMovieStatus(movieIds: number[]): Observable<MovieStatus[]> {
        let params = new HttpParams();
        movieIds.forEach(id => {
            params = params.append('ids', id.toString());
        });
        return this.http.get<MovieStatus[]>(`${this.apiUrl}/MovieStatus/batch`, { params });
    }
    deleteMovieStatus(movieId: number){
        return this.http.delete(`${this.apiUrl}/MovieStatus/${movieId}`)
    }
    updateMovieStatus(movieStatus: MovieStatus){
        console.log('Updating movie status:', movieStatus);
        return this.http.put(`${this.apiUrl}/MovieStatus/${movieStatus.id}`, movieStatus);
    }
    getToWatchMovies(): Observable<MovieStatus[]> {
        return this.http.get<MovieStatus[]>(`${this.apiUrl}/MovieStatus/ToWatch`);
    }
    getWatchedMovies(): Observable<MovieStatus[]> {
        return this.http.get<MovieStatus[]>(`${this.apiUrl}/MovieStatus/Watched`);
    }

}
