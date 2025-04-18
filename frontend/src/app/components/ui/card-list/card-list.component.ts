import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EntityListComponent } from '../entity-list/entity-list.component';
import { Card } from '../../../types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    EntityListComponent,
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent {
  constructor(private api: ApiService, private snackBar: MatSnackBar) {}
  cards: Card[] = [];

  ngOnInit() {
    this.api.getCards().subscribe((res) => (this.cards = res));
  }

  onSaveCard(updated: any) {
    const index = this.cards.findIndex((card) => card.id === updated.id);
    if (index > -1) {
      this.cards[index] = updated;
      if (updated.value <= 20 && updated.value >= 0) {
        this.api.updateCard(updated).subscribe((saved) => {
          this.cards[index] = saved;
          this.cards = [...this.cards]; // force redraw table because mat-table does not register change
          this.snackBar.open('Card updated successfully!', 'Close', {
            duration: 3000,
          });
        });
      } else {
        this.snackBar.open('Card force must be between 0-20.', 'Close');
      }
    }
  }
}
