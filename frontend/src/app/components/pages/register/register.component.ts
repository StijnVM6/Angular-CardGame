import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../../ui/header/header.component';
import { ProfileFormComponent } from '../../ui/profile-form/profile-form.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, ProfileFormComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async onRegister(formValue: {
    name: string;
    login: string;
    password: string;
  }) {
    const profile = await this.auth.register(formValue);
    if (profile !== null) {
      console.log('Registered:');
      for (const [key, value] of Object.entries(profile)) {
        console.log(`${key}: ${value}`);
      }
      this.router.navigate(['/login']);
      this.snackBar.open(
        `Register succesful! ${profile.name}, please login.`,
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }
}
