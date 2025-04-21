import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { EntityFormComponent } from '../entity-form/entity-form.component';

@Component({
  selector: 'app-entity-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    EntityFormComponent,
  ],
  templateUrl: './entity-list.component.html',
  styleUrl: './entity-list.component.css',
})
export class EntityListComponent {
  @Input() items: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() formFields: { key: string; label: string; type?: string }[] = [];
  @Input() title: string = '';
  @Input() customFormTemplate: TemplateRef<any> | null = null;
  @Output() saveItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() createItem = new EventEmitter<any>();
  @Input() forces: Map<string, number> = new Map();
  @Input() deckViolations: Set<string> = new Set();

  formGroup = new FormGroup({});
  selectedItem: any;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  ngOnInit() {
    this.formFields.forEach((form) => {
      this.formGroup.addControl(form.key, new FormControl(''));
    });
  }

  openSidenav(item: any) {
    this.selectedItem = item;
    this.formGroup.patchValue(item);
    this.sidenav.open();
  }

  getLabel(key: string): string {
    const field = this.formFields.find((form) => form.key === key);
    if (field) return field.label;
    else if (key === 'totalForce') return 'Force';
    else return key;
  }

  onSave() {
    const updatedItem = { ...this.selectedItem, ...this.formGroup.value };
    this.saveItem.emit({ item: updatedItem, isNew: !this.selectedItem });

    // Close only if creating a new item
    if (!this.selectedItem) {
      this.sidenav.close();
    }
  }

  onDelete() {
    this.deleteItem.emit(this.selectedItem);
    this.sidenav.close();
  }

  onCreate() {
    this.selectedItem = null;
    this.formGroup.reset();
    this.formFields.forEach((field) => {
      this.formGroup.get(field.key)?.setValue('');
    });
    this.sidenav.open();
  }
}
