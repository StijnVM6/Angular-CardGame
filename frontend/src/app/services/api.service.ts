import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, Deck } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  baseUrl = 'http://localhost:3000/api';

  getDecks(): Observable<any> {
    return this.http.get<Deck[]>(this.baseUrl + '/decks');
  }

  getCards(): Observable<any> {
    return this.http.get<Card[]>(this.baseUrl + '/cards');
  }
}
