import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Card, Deck } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  baseUrl = 'http://localhost:3000/api';

  getCards(): Observable<any> {
    return this.http.get<Card[]>(this.baseUrl + '/cards');
  }

  getCardsAsync(): Promise<Card[]> {
    return firstValueFrom(this.http.get<Card[]>(this.baseUrl + '/cards'));
  }

  getCardById(id: string): Observable<any> {
    return this.http.get<Card[]>(`${this.baseUrl}/cards/${id}`);
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.baseUrl}/cards`, card);
  }

  createCard(card: Card): Observable<Card> {
    return this.http.post<Card>(`${this.baseUrl}/cards`, card);
  }

  deleteCard(id: string): Observable<Card> {
    return this.http.delete<Card>(`${this.baseUrl}/cards/${id}`);
  }

  deleteCardAsync(id: string): Promise<Card> {
    return firstValueFrom(
      this.http.delete<Card>(`${this.baseUrl}/cards/${id}`)
    );
  }

  getDecks(): Observable<any> {
    return this.http.get<Deck[]>(this.baseUrl + '/decks');
  }

  getDecksAsync(): Promise<Deck[]> {
    return firstValueFrom(this.getDecks());
  }

  getDeckById(id: string): Observable<any> {
    return this.http.get<Deck[]>(`${this.baseUrl}/decks/${id}`);
  }

  updateDeck(deck: Deck): Observable<Deck> {
    return this.http.put<Deck>(`${this.baseUrl}/decks`, deck);
  }

  updateDeckAsync(deck: Deck): Promise<Deck> {
    return firstValueFrom(this.updateDeck(deck));
  }

  createDeck(deck: Deck): Observable<Deck> {
    return this.http.post<Deck>(`${this.baseUrl}/decks`, deck);
  }

  deleteDeck(id: string): Observable<Deck> {
    return this.http.delete<Deck>(`${this.baseUrl}/decks/${id}`);
  }

  deleteDeckAsync(id: string): Promise<Deck> {
    return firstValueFrom(
      this.http.delete<Deck>(`${this.baseUrl}/decks/${id}`)
    );
  }
}
