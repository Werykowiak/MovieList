import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListComponent } from './MovieList.component'; 

export const routes: Routes = [
  // Przekierowanie ze strony głównej na popularne filmy
  { path: '', redirectTo: '/movies/popular', pathMatch: 'full' },
  
  // Dynamiczna ścieżka dla kategorii
  { path: 'movies/:category', component: MovieListComponent },
  
  // Opcjonalnie: strona błędu 404, jeśli ktoś wpisze coś dziwnego
  { path: '**', redirectTo: '/movies/popular' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }