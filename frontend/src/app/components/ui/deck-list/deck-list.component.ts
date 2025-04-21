import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { EntityListComponent } from '../entity-list/entity-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { Card, Deck } from '../../../types';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalcForceService } from '../../../services/calc-force.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [
    MatRadioModule,
    CommonModule,
    ReactiveFormsModule,
    EntityListComponent,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  templateUrl: './deck-list.component.html',
  styleUrl: './deck-list.component.css',
})
export class DeckListComponent {
  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private calcForce: CalcForceService,
    private dialog: MatDialog
  ) {}
  decks: Deck[] = [];
  allCards: Card[] = [];
  deckForces = new Map<string, number>();

  getTotalForce = (deck: Deck): number => {
    return this.calcForce.getTotalForceFromCards(deck, this.allCards);
  };

  async ngOnInit() {
    // this.api.getDecks().subscribe((res) => (this.decks = res));
    // this.api.getCards().subscribe((res) => (this.allCards = res));
    this.decks = await this.api.getDecksAsync();
    this.allCards = await this.api.getCardsAsync();
    for (const deck of this.decks) {
      const force = this.getTotalForce(deck);
      this.deckForces.set(deck.id, force);
    }
  }

  onSaveDeck({ item, isNew }: { item: Deck; isNew: boolean }) {
    const index = this.decks.findIndex((deck) => deck.id === item.id);

    if (isNew) {
      // creating new item
      this.api.createDeck(item).subscribe((created) => {
        this.decks.push(created);
        this.decks = [...this.decks];
        this.snackBar.open('Deck created!', 'Close', { duration: 3000 });
      });
    } else {
      if (index > -1) {
        // editting existing item
        this.decks[index] = item;
        const cards = this.allCards.filter((card) =>
          item.cards.includes(card.id.toString())
        );

        const sumForce = cards.reduce(
          (acc: number, card: Card): number => acc + Number(card.value),
          0
        );

        if (sumForce <= 30) {
          this.api.updateDeck(item).subscribe((saved) => {
            this.decks[index] = saved;
            const force = this.getTotalForce(this.decks[index]);
            this.deckForces.set(this.decks[index].id, force);
            this.decks = [...this.decks]; // force redraw table because mat-table does not register change
            this.snackBar.open('Deck updated successfully!', 'Close', {
              duration: 3000,
            });
          });
        } else {
          this.snackBar.open(
            'The total force of a deck must not exceed 30.',
            'Close',
            {
              duration: 3000,
            }
          );
        }
      }
    }
  }

  onDeleteDeck(toDelete: any) {
    const index = this.decks.find((card) => card.id === toDelete.id)?.id;
    if (index) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Delete Deck',
          message: `Are you sure you want to delete "${toDelete.name}"?`,
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.api.deleteDeck(index.toString()).subscribe(() => {
            const deckListIndex = this.decks.findIndex(
              (deck) => deck.id === toDelete.id
            );
            this.decks.splice(deckListIndex, 1);
            this.snackBar.open('Deck successfully deleted!', 'Close', {
              duration: 3000,
            });
          });
        } else {
          this.snackBar.open('Deck deletion canceled.', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}
