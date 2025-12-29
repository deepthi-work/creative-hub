import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  user: User = {
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPreference: '',
    password: ''
  };
  
  //contactPreference: 'email' | 'phone' = 'email';
  //password: string = '';
  confirmPassword: string = '';
  formErrors: { [key: string]: string } = {};
  private apiUrl = 'http://localhost:4000/users/register'

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  validateForm(): boolean {
    this.formErrors = {};

    // Name validation
    if (!this.user.name || this.user.name.trim().length === 0) {
      this.formErrors['name'] = 'Name is required';
      return false;
    }

    // Email or Phone validation (at least one must be filled)
    if (this.user.contactPreference === 'email') {
      if (!this.user.email || this.user.email.trim().length === 0) {
        this.formErrors['email'] = 'Email is required';
        return false;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.user.email)) {
        this.formErrors['email'] = 'Please enter a valid email address';
        return false;
      }
      // Clear phone if email is preferred
      this.user.phone = '';
    } else {
      if (!this.user.phone || this.user.phone.trim().length === 0) {
        this.formErrors['phone'] = 'Phone number is required';
        return false;
      }
      // Basic phone validation (digits only, at least 10 digits)
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(this.user.phone.replace(/\D/g, ''))) {
        this.formErrors['phone'] = 'Please enter a valid phone number (at least 10 digits)';
        return false;
      }
      // Clear email if phone is preferred
      this.user.email = '';
    }

    // Address validation
    if (!this.user.address || this.user.address.trim().length === 0) {
      this.formErrors['address'] = 'Address is required';
      return false;
    }

    // Password validation
    if (!this.user.password || this.user.password.length < 6) {
      this.formErrors['password'] = 'Password must be at least 6 characters';
      return false;
    }

    // Confirm password validation
    if (this.user.password !== this.confirmPassword) {
      this.formErrors['confirmPassword'] = 'Passwords do not match';
      return false;
    }

    return true;
  }

  onSubmit() {
    if (this.validateForm()) {
      const userData = {
        name: this.user.name,
        contactPreference: this.user.contactPreference,
        email: this.user.contactPreference === 'email' ? this.user.email : '',
        phone: this.user.contactPreference === 'phone' ? this.user.phone : '',
        address: this.user.address,
        password: this.user.password
      };
  
      this.authService.register(userData).subscribe({
        next: (response : any) => {
          alert('Signup successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (error : any) => {
          console.log(error.error);
          alert(error.error.error);
          this.formErrors['general'] = error.error?.error || 'Registration failed. Please try again.';
        }
      });
    }
  }

  onContactPreferenceChange() {
    // Clear the non-preferred field when preference changes
    if (this.user.contactPreference === 'email') {
      this.user.phone = '';
      this.formErrors['phone'] = '';
    } else {
      this.user.email = '';
      this.formErrors['email'] = '';
    }
  }
}