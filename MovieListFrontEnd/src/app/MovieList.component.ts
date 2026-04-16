import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TMDBService } from './services/tmdbService';
import { MovieListService } from './services/MovieListService';
import { Movie } from './Dtos/movie';
import { MovieStatus } from './Dtos/MovieStatus';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieRatingDialogComponent } from './MovieRatingDialogComponent'
@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './MovieList.component.html',
  styleUrls: ['./MovieList.component.css']
})
export class MovieListComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  movies: Movie[] = [];
  currentPage: number = 1;
  total_results: number = 0;
  category: string = '';
  isLoading: boolean = false;
  loadingToWatchIds = new Set<number>();
  searchQuery: string = '';
  isSearchMode: boolean = false;
  constructor(private route: ActivatedRoute, private tmdbService: TMDBService, private movieListService: MovieListService) { }

  @ViewChild('paginator') paginator!: MatPaginator;


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const newCategory = params['category'] || 'popular';

      if (this.category !== newCategory) {
        this.category = newCategory;
        this.currentPage = 1;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
      }
      setTimeout(() => this.triggerLoad());
    });

    this.route.queryParams.subscribe(queryParams => {
      const searchQuery = queryParams['q'];
      if (searchQuery) {
        this.searchQuery = searchQuery;
        this.isSearchMode = true;
        this.currentPage = 1;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        setTimeout(() => this.searchMovies(false));
      } else if (this.isSearchMode && this.category !== 'search') {
        this.isSearchMode = false;
        this.searchQuery = '';
      }
    });
  }

  triggerLoad() {
    this.isLoading = true;
    this.cdr.detectChanges();

    if (this.category === 'watched' || this.category === 'to-watch') {
      const isWatched = this.category === 'watched';
      const statusService = isWatched 
        ? this.movieListService.getWatchedMovies() 
        : this.movieListService.getToWatchMovies();

      statusService.pipe(
        switchMap(statuses => {
          const movieIds = statuses.map((s: any) => s.id || s.Id);
          if (movieIds.length === 0) {
            return Promise.resolve({ results: [], total_results: 0 });
          }
          const movieRequests = movieIds.map((id: number) => 
            this.tmdbService.getMovieDetails(id).pipe(
              map(movie => ({
                ...movie,
                movieStatus: statuses.find((s: any) => (s.id || s.Id) == id) || null
              }))
            )
          );
          return forkJoin(movieRequests).pipe(
            map((movies: any[]) => ({
              results: movies,
              total_results: movies.length
            }))
          );
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      ).subscribe({
        next: (finalData) => {
          this.movies = finalData.results;
          this.total_results = finalData.total_results;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.error('Błąd w potoku danych:', err);
          this.isLoading = false;
        }
      });
      return;
    }

    this.tmdbService.getMovies(this.category, this.currentPage).pipe(

      switchMap(response => {
        const tmdbMovies = response.results;
        const movieIds = tmdbMovies.map((m: any) => m.id);

        return this.movieListService.getBatchMovieStatus(movieIds).pipe(
          map(statuses => {
            const enrichedMovies = tmdbMovies.map((movie: any) => {
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

        this.movies = finalData.results;
        this.total_results = Math.min(finalData.total_results, 500 * 20);

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
    if (this.isSearchMode || this.category === 'search') {
      this.searchMovies(false);
    } else {
      this.triggerLoad();
    }
  }

  searchMovies(isNewSearch: boolean = true) {
    if (!this.searchQuery.trim()) return;
    
    this.isSearchMode = true;
    this.isLoading = true;
    
    if (isNewSearch) {
      this.currentPage = 1;
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
    }
    this.cdr.detectChanges();

    this.tmdbService.getSearchResults(this.searchQuery, this.currentPage).pipe(
      switchMap(response => {
        const tmdbMovies = response.results;
        const movieIds = tmdbMovies.map((m: any) => m.id);
        
        if (movieIds.length === 0) {
          return Promise.resolve({ results: [], total_results: 0 });
        }

        return this.movieListService.getBatchMovieStatus(movieIds).pipe(
          map(statuses => {
            const enrichedMovies = tmdbMovies.map((movie: any) => {
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
      })
    ).subscribe({
      next: (finalData) => {
        this.movies = finalData.results;
        this.total_results = finalData.total_results;
        this.isLoading = false;
        this.cdr.detectChanges();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Błąd wyszukiwania:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.isSearchMode = false;
    this.currentPage = 1;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.triggerLoad();
  }

  addToWatch(id: number) {
    Promise.resolve().then(() => {
      this.loadingToWatchIds.add(id);
      this.cdr.detectChanges();
    });
    let movieStatus = new MovieStatus(id);
    this.movieListService.addToWatch(movieStatus).pipe(
      finalize(() => {
        this.loadingToWatchIds.delete(id);
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (newStatus: MovieStatus) => {
        this.movies = this.movies.map(movie => {
          if (movie.id === id) {
            return {
              ...movie,
              movieStatus: newStatus
            };
          }
          return movie;
        });

        this._snackBar.open('Added to watch', 'OK', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this._snackBar.open('Error saving status', 'Close', { duration: 5000 });
      }
    });
  }

  deleteFromWatch(id: number) {
    Promise.resolve().then(() => {
      this.loadingToWatchIds.add(id);
      this.cdr.detectChanges();
    });
    this.movieListService.deleteMovieStatus(id).pipe(
      finalize(() => {
        const movie = this.movies.find(m => m.id === id);
        if (movie) {
          movie.movieStatus = null;
        }
        this.loadingToWatchIds.delete(id);
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this._snackBar.open('Deleted from to watch list', 'OK', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this._snackBar.open('Error saving status', 'Close', { duration: 5000 });
      }
    });

  }

  openRatingDialog(movie: any) {

    const dialogRef = this.dialog.open(MovieRatingDialogComponent, {
      width: '400px',
      data: { Rating: movie.movieStatus?.rating || null, Comment: movie.movieStatus?.comment || '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const movieId = movie.id;
        const movieIndex = this.movies.findIndex(m => m.id === movieId);
        if (movieIndex === -1) return;

        if (!this.movies[movieIndex].movieStatus) {
          const newStatus = new MovieStatus(this.movies[movieIndex].id, true, result.Rating, result.Comment);
          const updatedMovies = [...this.movies];
          updatedMovies[movieIndex] = { ...updatedMovies[movieIndex], movieStatus: newStatus };
          this.movies = updatedMovies;
          this.cdr.detectChanges();
          
          this.movieListService.addToWatch(newStatus).subscribe({
            next: () => {
              this._snackBar.open('Rating saved', 'OK', { duration: 3000 });
            },
            error: (err) => {
              this._snackBar.open('Error saving status', 'Close', { duration: 5000 });
            }
          });
        } else {
          const updatedStatus = {
            ...this.movies[movieIndex].movieStatus!,
            watched: true,
            rating: result.Rating,
            comment: result.Comment
          };
          const updatedMovies = [...this.movies];
          updatedMovies[movieIndex] = { ...updatedMovies[movieIndex], movieStatus: updatedStatus };
          this.movies = updatedMovies;
          this.cdr.detectChanges();
          
          this.movieListService.updateMovieStatus(updatedStatus).subscribe({
            next: () => {
              this._snackBar.open('Rating saved', 'OK', { duration: 3000 });
            },
            error: (err) => {
              this._snackBar.open('Error saving status', 'Close', { duration: 5000 });
            }
          });
        }
      }
    });
  }

  isAddingToWatch(id: number): boolean {
    return this.loadingToWatchIds.has(id);
  }
}