import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProfileFormComponent } from '../../ui/profile-form/profile-form.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ProfileFormComponent, HeaderComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async onLogin(formValue: { login: string; password: string }) {
    const profile = await this.auth.login(formValue);
    if (profile) {
      console.log('Logged in:');
      for (const [key, value] of Object.entries(profile)) {
        console.log(`${key}: ${value}`);
      }
      this.router.navigate(['/home']);
      this.snackBar.open(`Login succesful! Welcome ${profile.name}`, 'Close', {
        duration: 3000,
      });
    }
  }
}
