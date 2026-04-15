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
    MatDialogModule
  ],
  templateUrl: './MovieList.component.html',
  styleUrls: ['./MovieList.component.scss']
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
  constructor(private route: ActivatedRoute, private tmdbService: TMDBService, private movieListService: MovieListService) { }

  @ViewChild('paginator') paginator!: MatPaginator;


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const newCategory = params['category'] || 'popular';

      // Resetujemy do 1 strony TYLKO jeśli zmieniła się kategoria
      if (this.category !== newCategory) {
        this.category = newCategory;
        this.currentPage = 1;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
      }
      setTimeout(() => this.triggerLoad());
    });
  }

  triggerLoad() {
    this.isLoading = true;
    this.cdr.detectChanges();

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
      data: { Rating: movie.movieStatus?.Rating || null, Comment: movie.movieStatus?.Comment || '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!movie.movieStatus) {
          movie.movieStatus = new MovieStatus(movie.id,true, result.Rating, result.Comment);
          this.cdr.detectChanges();
          this.movieListService.addToWatch(movie.movieStatus).subscribe({
            next: () => {
              this._snackBar.open('Rating saved', 'OK', { duration: 3000 });
              this.cdr.detectChanges();
            },
            error: (err) => {
              this._snackBar.open('Error saving status', 'Close', { duration: 5000 });
            }
          });
        } else {
          movie.movieStatus.watched = true;
          movie.movieStatus.rating = result.Rating;
          movie.movieStatus.comment = result.Comment;
          this.movieListService.updateMovieStatus(movie.movieStatus).subscribe({
            next: () => {
              this._snackBar.open('Rating saved', 'OK', { duration: 3000 });
              this.cdr.detectChanges();
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