import { Component } from '@angular/core';
import { HeaderComponent } from '../../ui/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { DeckListComponent } from '../../ui/deck-list/deck-list.component';
import { CardListComponent } from '../../ui/card-list/card-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    MatButtonModule,
    DeckListComponent,
    CardListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private router: Router) {}

  onPlay() {
    this.router.navigate(['/game']);
  }
}
