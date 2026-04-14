import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TMDBService } from './services/tmdbService';
import { MovieListService } from './services/MovieListService';
import { Movie } from './Dtos/movie';
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

    this.tmdbService.getMovies(this.category, this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.movies = response.results;
          this.total_results = Math.min(response.total_results, 500 * 20);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.error('Błąd API:', err);
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.triggerLoad();
  }
  addToWatch(id: number) {
    this.loadingToWatchIds.add(id);
    this.cdr.detectChanges();
    this.movieListService.addToWatch(id).pipe(
      finalize(() => {
        this.loadingToWatchIds.delete(id);
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          this._snackBar.open('Added to watch', 'OK', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
        error: (err) => {
          this._snackBar.open('Error', 'close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });

  }

  isAddingToWatch(id: number): boolean {
    return this.loadingToWatchIds.has(id);
  }
}