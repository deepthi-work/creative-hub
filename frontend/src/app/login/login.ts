import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  emailOrPhone: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.emailOrPhone || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.emailOrPhone, this.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.user) {
          // Set auth state directly from login response
          this.authService.setAuthState(response);
          // Navigate after state is updated
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Login failed. Please try again.';
        alert(this.errorMessage);
      }
    });
  }
}