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
    MatCheckboxModule,
  ],
  templateUrl: './deck-list.component.html',
  styleUrl: './deck-list.component.css',
})
export class DeckListComponent {
  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private calcForce: CalcForceService
  ) {}
  decks: Deck[] = [];
  allCards: Card[] = [];
  deckForces = new Map<string, number>();

  getTotalForce = async (deck: Deck): Promise<number> => {
    return await this.calcForce.getTotalForce(deck);
  };

  async ngOnInit() {
    // this.api.getDecks().subscribe((res) => (this.decks = res));
    // this.api.getCards().subscribe((res) => (this.allCards = res));
    this.decks = await this.api.getDecksAsync();
    this.allCards = await this.api.getCardsAsync();
    for (const deck of this.decks) {
      const force = await this.getTotalForce(deck);
      this.deckForces.set(deck.id, force);
    }
  }

  onSaveDeck(updated: any) {
    const index = this.decks.findIndex((deck) => deck.id === updated.id);
    if (index > -1) {
      this.decks[index] = updated;
      const cards = this.allCards.filter((card) =>
        updated.cards.includes(card.id.toString())
      );
      const sumForce = cards.reduce(
        (acc: number, card: Card): number => acc + card.value,
        0
      );
      console.log(sumForce);
      if (sumForce <= 20) {
        this.api.updateDeck(updated).subscribe((saved) => {
          this.decks[index] = saved;
          this.decks = [...this.decks]; // force redraw table because mat-table does not register change
          this.snackBar.open('Deck updated successfully!', 'Close', {
            duration: 3000,
          });
        });
      } else {
        this.snackBar.open(
          'The total force of a deck must not exceed 20.',
          'Close'
        );
      }
    }
  }
}
