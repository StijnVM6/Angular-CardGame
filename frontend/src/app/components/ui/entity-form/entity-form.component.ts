import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-entity-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.css',
})
export class EntityFormComponent {
  @Input() formFields: { key: string; label: string; type?: string }[] = [];
  @Input() formGroup!: FormGroup;
  @Input() customFormTemplate: TemplateRef<any> | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
