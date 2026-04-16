import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListComponent } from './MovieList.component'; 

export const routes: Routes = [
  { path: '', redirectTo: '/movies/popular', pathMatch: 'full' },
  
  { path: 'movies/:category', component: MovieListComponent },
  
  { path: 'movies/search', component: MovieListComponent },
  
  { path: 'movies/watched', component: MovieListComponent },
  { path: 'movies/to-watch', component: MovieListComponent },

  { path: '**', redirectTo: '/movies/popular' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }