import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, ReactiveFormsModule],
  templateUrl: './deck-list.component.html',
  styleUrl: './deck-list.component.css',
})
export class DeckListComponent {
  constructor(private api: ApiService) {}
  decks: any;
  deckFormGroup = new FormGroup({
    new: new FormControl(''),
  });

  ngOnInit() {
    this.api.getDecks().subscribe((response) => {
      this.decks = response;
    });
  }
}
