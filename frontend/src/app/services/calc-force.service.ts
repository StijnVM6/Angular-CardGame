import { Injectable } from '@angular/core';
import { Card, Deck } from '../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CalcForceService {
  constructor(private api: ApiService) {}

  async getTotalForce(deck: Deck): Promise<number> {
    const allCards: Card[] = await this.api.getCardsAsync();

    const cards = deck.cards
      .map((id: string) =>
        allCards.find((card: Card) => card.id.toString() === id)
      )
      .filter((card): card is Card => !!card);

    return cards.reduce(
      (acc: number, card: Card): number => acc + card.value,
      0
    );
  }
}
