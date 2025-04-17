import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [MatRadioModule, CommonModule, ReactiveFormsModule],
  templateUrl: './deck-list.component.html',
  styleUrl: './deck-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckListComponent {
  // constructor(private api: ApiService) {}
  // decks: any;
  // deckFormGroup = new FormGroup({
  //   new: new FormControl(''),
  // });
  // ngOnInit() {
  //   this.api.getDecks().subscribe((response) => {
  //     this.decks = response;
  //   });
  // }
}
