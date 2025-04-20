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
import { Card, Deck } from '../../../types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    MatDialogModule,
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent {
  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  cards: Card[] = [];
  allDecks: Deck[] = [];

  async ngOnInit() {
    // this.api.getCards().subscribe((res) => (this.cards = res));
    this.cards = await this.api.getCardsAsync();
    this.allDecks = await this.api.getDecksAsync();
  }

  onSaveCard({ item, isNew }: { item: Card; isNew: boolean }) {
    const index = this.cards.findIndex((card) => card.id === item.id);

    if (isNew) {
      // creating new item
      this.api.createCard(item).subscribe((created) => {
        this.cards.push(created);
        this.cards = [...this.cards];
        this.snackBar.open('Card created!', 'Close', { duration: 3000 });
      });
    } else {
      if (index > -1) {
        // editting existing item
        this.cards[index] = item;
        if (item.value <= 20 && item.value >= 0) {
          this.api.updateCard(item).subscribe((saved) => {
            this.cards[index] = saved;
            this.cards = [...this.cards]; // force redraw table because mat-table does not register change
            this.snackBar.open('Card updated successfully!', 'Close', {
              duration: 3000,
            });
          });
        } else {
          this.snackBar.open('Card force must be between 0-20.', 'Close', {
            duration: 3000,
          });
        }
      }
    }
  }

  onDeleteCard(toDelete: Card) {
    const index = this.cards.find((card) => card.id === toDelete.id)?.id;
    if (index) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Delete Card',
          message: `Are you sure you want to delete "${toDelete.name}"?`,
        },
      });
      dialogRef.afterClosed().subscribe(async (result: boolean) => {
        if (result) {
          // Remove card to delete from all decks
          const affectedDecks = this.allDecks.filter((deck: Deck) =>
            deck.cards?.some((cardId) => cardId === toDelete.id.toString())
          );
          for (const deck of affectedDecks) {
            deck.cards = deck.cards.filter(
              (cardId) => cardId !== toDelete.id.toString()
            );
            await this.api.updateDeckAsync(deck);
          }

          // Delete card
          this.api.deleteCard(index.toString()).subscribe(() => {
            this.cards.splice(index, 1);
            this.snackBar.open('Card successfully deleted!', 'Close', {
              duration: 3000,
            });
          });
        } else {
          this.snackBar.open('Card deletion canceled.', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}
