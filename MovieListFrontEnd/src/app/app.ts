import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; // 1. Import modułu
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; // Importy konkretnych dyrektyw
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,       // To naprawia routerLink
    RouterLinkActive, // To naprawia błąd NG0301 i #rla="routerLinkActive"
    RouterOutlet,     // Potrzebne dla <router-outlet>
    MatTabsModule,
    MatToolbarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MovieListFrontEnd');
}
