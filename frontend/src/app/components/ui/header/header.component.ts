import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    public router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Logout',
        message: `Are you sure you want to logout?`,
        buttonLabel: 'Logout',
      },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(['/login']);
        localStorage.removeItem('token');
      }
    });
  }
}
