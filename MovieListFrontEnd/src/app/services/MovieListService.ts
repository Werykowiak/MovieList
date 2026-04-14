import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {MovieStatus} from '../Dtos/MovieStatus'

@Injectable({
  providedIn: 'root'
})
export class MovieListService{
    private readonly apiUrl = environment.myApiUrl;
    constructor(private http: HttpClient) {}
    addToWatch(movieId: number): Observable<any> {
        const newMovieStatus = new MovieStatus(movieId);
        return this.http.post(`${this.apiUrl}/MovieStatus`, newMovieStatus);
    }
}