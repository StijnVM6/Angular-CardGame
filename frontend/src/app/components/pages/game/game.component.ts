import { Component } from '@angular/core';
import { HeaderComponent } from '../../ui/header/header.component';
import { CommonModule } from '@angular/common';
import { Card, Deck } from '../../../types';
import { ApiService } from '../../../services/api.service';
import { CalcForceService } from '../../../services/calc-force.service';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatRadioModule,
  MatRadioButton,
  MatRadioGroup,
} from '@angular/material/radio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [
    HeaderComponent,
    CommonModule,
    MatListModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  decks: Deck[] = [];
  allCards: Card[] = [];
  selectedDeckId: string | null = null;
  deckForces = new Map<string, number>();
  selectedCardId: string | null = null;
  playerDeck: Card[] = [];
  playedPlayerCards: string[] = [];
  playedComputerCards: string[] = [];
  playerHand: Card[] = [];
  computerHand: Card[] = [];
  computerDeck: Card[] = [];
  scorePlayer: number = 0;
  scoreComputer: number = 0;
  selectedPlayerCard: Card | null = null;
  selectedComputerCard: Card | null = null;
  playAreaVisible: boolean = false;
  roundInProgress: boolean = false;
  cardChoiceConfirmed: boolean = false;
  currentRound: number = 1;
  maxRounds: number = 5;
  gameOver: boolean = false;
  winner: string = '';

  constructor(
    private api: ApiService,
    private calc: CalcForceService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.decks = await this.api.getDecksAsync();
    this.allCards = await this.api.getCardsAsync();

    for (const deck of this.decks) {
      const force = this.calc.getTotalForceFromCards(deck, this.allCards);
      this.deckForces.set(deck.id, force);
    }
  }

  onReturn() {
    this.router.navigate(['/home']);
  }

  onReturnToDeckChoice() {
    this.playAreaVisible = false;
    this.selectedCardId = null;
    this.selectedPlayerCard = null;
    this.selectedComputerCard = null;
    this.roundInProgress = false;
    this.cardChoiceConfirmed = false;
    this.scorePlayer = 0;
    this.scoreComputer = 0;
    this.currentRound = 1;
    this.maxRounds = 5;
    this.gameOver = false;
    this.winner = '';
  }

  onDeckSelected(deckId: string) {
    this.selectedDeckId = deckId;
  }

  confirmDeckChoice() {
    if (!this.selectedDeckId) return;
    const selectedDeck = this.decks.find(
      (deck) => deck.id === this.selectedDeckId
    );
    if (!selectedDeck) return;

    this.playerDeck = this.allCards.filter((card) =>
      selectedDeck.cards.includes(card.id.toString())
    );

    const otherDecks = this.decks.filter(
      (deck) => deck.id !== this.selectedDeckId
    );
    const randomOpponentDeck =
      otherDecks[Math.floor(Math.random() * otherDecks.length)];
    this.computerDeck = this.allCards.filter((card) =>
      randomOpponentDeck.cards.includes(card.id.toString())
    );

    this.maxRounds = this.playerDeck.length;
    this.playAreaVisible = true;
    this.playerHand = [...this.playerDeck];
  }

  confirmCardChoice() {
    if (!this.selectedCardId || !this.selectedPlayerCard) return;

    const remainingComputerCards = this.computerDeck.filter(
      (card) => !this.playedComputerCards.includes(card.id)
    );

    const randomCard =
      remainingComputerCards[
        Math.floor(Math.random() * remainingComputerCards.length)
      ];
    this.selectedComputerCard = randomCard;

    // Compare values
    const playerVal = this.selectedPlayerCard.value;
    const computerVal = this.selectedComputerCard.value;

    if (playerVal > computerVal) this.scorePlayer++;
    else if (computerVal > playerVal) this.scoreComputer++;

    this.cardChoiceConfirmed = true;
    this.roundInProgress = true;
  }

  onSelectCard(card: Card) {
    this.selectedCardId = card.id;
    this.selectedPlayerCard = card;
  }

  nextRound() {
    this.selectedCardId = null;
    this.roundInProgress = false;
    this.cardChoiceConfirmed = false;

    this.playedPlayerCards.push(this.selectedPlayerCard!.id);
    this.playedComputerCards.push(this.selectedComputerCard!.id);

    this.playerHand = this.playerDeck.filter(
      (card) => !this.playedPlayerCards.includes(card.id.toString())
    );
    this.computerHand = this.computerDeck.filter((card) =>
      this.playedComputerCards.includes(card.id.toString())
    );

    this.selectedPlayerCard = null;
    this.selectedComputerCard = null;

    this.currentRound++;
  }

  showFinalResults() {
    this.selectedPlayerCard = null;
    this.selectedComputerCard = null;
    this.playerHand = [];

    this.gameOver = true;

    if (this.scorePlayer > this.scoreComputer) {
      this.winner = 'You win!';
    } else if (this.scoreComputer > this.scorePlayer) {
      this.winner = 'Computer wins!';
    } else {
      this.winner = "It's a tie!";
    }
  }

  handleNextAction() {
    if (this.currentRound >= this.maxRounds) {
      this.showFinalResults();
    } else {
      this.nextRound();
    }
  }
}
