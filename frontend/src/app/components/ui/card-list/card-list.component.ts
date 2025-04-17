import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent {
  constructor(private api: ApiService) {}
  cards: any;
  cardFormGroup = new FormGroup({
    new: new FormControl(''),
  });

  ngOnInit() {
    this.api.getCards().subscribe((response) => {
      this.cards = response;
    });
  }
}
