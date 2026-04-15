import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TMDBService } from './services/tmdbService';
import { MovieListService } from './services/MovieListService';
import { Movie } from './Dtos/movie';
import { MovieStatus } from './Dtos/MovieStatus';
import { CommonModule } from '@angular/common'; // Dla *ngFor, pipe 'number' i 'slice'
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, map } from 'rxjs/operators';
@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './MovieList.component.html',
  styleUrls: ['./MovieList.component.scss']
})
export class MovieListComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  movies: Movie[] = [];
  currentPage: number = 0;
  total_results: number = 0;
  category: string = '';
  isLoading: boolean = false;
  loadingToWatchIds = new Set<number>();
  constructor(private route: ActivatedRoute, private tmdbService: TMDBService, private movieListService: MovieListService) { }

  @ViewChild('paginator') paginator!: MatPaginator;


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'] || 'popular';
      this.currentPage = 1;
      this.isLoading = false;
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
      setTimeout(() => this.triggerLoad());
    });
  }

  triggerLoad() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.tmdbService.getMovies(this.category, this.currentPage).pipe(
      // 1. Pobieramy filmy z TMDB
      switchMap(response => {
        const tmdbMovies = response.results;
        const movieIds = tmdbMovies.map((m: any) => m.id);

        // 2. Pobieramy statusy z Twojego backendu
        return this.movieListService.getBatchMovieStatus(movieIds).pipe(
          map(statuses => {
            // 3. Łączymy dane wewnątrz strumienia
            const enrichedMovies = tmdbMovies.map((movie: any) => {
              // Szukamy statusu (używamy luźnego porównania == dla pewności typów)
              const foundStatus = statuses.find((s: any) => (s.id || s.Id) == movie.id);

              return {
                ...movie,
                movieStatus: foundStatus || null
              };
            });

            return {
              results: enrichedMovies,
              total_results: response.total_results
            };
          })
        );
      }),
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (finalData) => {
        // PRZYPISUJEMY TYLKO RAZ - Angular na pewno to zauważy
        this.movies = finalData.results;
        this.total_results = Math.min(finalData.total_results, 500 * 20);

        console.log('Finalne filmy w komponencie:', this.movies);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Błąd w potoku danych:', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.triggerLoad();
  }
  addToWatch(id: number) {
  // 1. Blokujemy przycisk (asynchronicznie, by uniknąć NG0100)
  Promise.resolve().then(() => {
    this.loadingToWatchIds.add(id);
    this.cdr.detectChanges();
  });

  this.movieListService.addToWatch(id).pipe(
    finalize(() => {
      this.loadingToWatchIds.delete(id);
      this.cdr.detectChanges();
    })
  )
  .subscribe({
    next: (newStatus: MovieStatus) => {
      // 2. Znajdujemy film na liście i doklejamy mu status z odpowiedzi
      this.movies = this.movies.map(movie => {
        if (movie.id === id) {
          return {
            ...movie,
            movieStatus: newStatus // Doklejamy to, co zwrócił backend
          };
        }
        return movie;
      });

      this._snackBar.open('Added to watch', 'OK', { duration: 3000 });
      this.cdr.detectChanges(); // Wymuszamy odświeżenie widoku (ikony/przyciski)
    },
    error: (err) => {
      this._snackBar.open('Error saving status', 'Close', { duration: 5000 });
    }
  });
}

  isAddingToWatch(id: number): boolean {
    return this.loadingToWatchIds.has(id);
  }
}