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
import { CalcForceService } from '../../../services/calc-force.service';

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
    private dialog: MatDialog,
    private calcForce: CalcForceService
  ) {}
  cards: Card[] = [];
  allDecks: Deck[] = [];
  deckViolations = new Set<string>();

  getTotalForce = (deck: Deck): number => {
    return this.calcForce.getTotalForceFromCards(deck, this.cards);
  };

  async ngOnInit() {
    // this.api.getCards().subscribe((res) => (this.cards = res));
    this.cards = await this.api.getCardsAsync();
    this.allDecks = await this.api.getDecksAsync();
  }

  async onSaveCard({ item, isNew }: { item: Card; isNew: boolean }) {
    if (isNew) {
      // creating new item
      this.api.createCard(item).subscribe((created) => {
        this.cards.push(created);
        this.cards = [...this.cards];
        this.snackBar.open('Card created!', 'Close', { duration: 3000 });
      });
    } else {
      const index = this.cards.findIndex((card) => card.id === item.id);
      if (index > -1) {
        // editting existing item
        const originalCard = this.cards.find((card) => card.id === item.id);
        const forceIncreased = item.value > originalCard!.value;

        // Update the card
        this.cards[index] = item;
        if (item.value <= 20 && item.value >= 0) {
          this.api.updateCard(item).subscribe((saved) => {
            this.cards[index] = saved;
            this.cards = [...this.cards]; // force redraw table because mat-table does not register change
            this.allDecks = [...this.allDecks];
            this.snackBar.open('Card updated successfully!', 'Close', {
              duration: 3000,
            });
          });
        } else {
          this.snackBar.open('Card force must be between 0-20.', 'Close', {
            duration: 3000,
          });
        }

        // check if any of the decks' total power surpassed the max power allowed because of the card change.
        if (forceIncreased) {
          this.deckViolations.clear();
          const affectedDecks: Deck[] = [];
          for (const deck of this.allDecks) {
            if (deck.cards.some((card) => card === item.id)) {
              const force = await this.getTotalForce(deck);
              console.log(force);
              if (force > 30) {
                this.deckViolations.add(deck.id);
                affectedDecks.push(deck);
              }
            }
          }
          if (affectedDecks.length > 0) {
            const deckNames = affectedDecks.map((deck) => deck.name).join(', ');
            console.log(
              `WARNING: The following decks surpassed the allowed total force: ${deckNames}`
            );
          }
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
          buttonLabel: 'Delete',
        },
      });
      dialogRef.afterClosed().subscribe(async (result: boolean) => {
        if (result) {
          // Remove card-to-delete from decks
          const affectedDecks = this.allDecks.filter((deck: Deck) =>
            deck.cards?.some((cardId) => cardId === toDelete.id)
          );
          for (const deck of affectedDecks) {
            deck.cards = deck.cards.filter((cardId) => cardId !== toDelete.id);
            await this.api.updateDeckAsync(deck);
          }

          // Delete card
          this.api.deleteCard(index).subscribe(() => {
            const cardListIndex = this.cards.findIndex(
              (card) => card.id === toDelete.id
            );
            this.cards.splice(cardListIndex, 1);
            this.cards = [...this.cards];
            this.allDecks = [...this.allDecks];
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
