import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent {
  constructor(private api: ApiService) {}
  cards: object[] = [];
  displayedColumns: string[] = ['name', 'force'];
  selectedCard: any;
  cardForm = new FormGroup({
    name: new FormControl(''),
    value: new FormControl(''),
  });

  ngOnInit() {
    this.api.getCards().subscribe((response) => {
      this.cards = response;
    });
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  openSidenav(card: any) {
    this.selectedCard = card;
    this.cardForm.patchValue({
      name: card.name,
      value: card.value,
    });
    this.sidenav.open();
  }
}
