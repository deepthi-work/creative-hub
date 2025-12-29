import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check session on service initialization
    this.checkSession();
  }

  login(emailOrPhone: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/login`, 
      { emailOrPhone, password },
      { headers, withCredentials: true }
    );
  }

  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/register`, 
      userData,
      { headers, withCredentials: true }
    );
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logout`, { withCredentials: true });
  }

  setAuthState(userData: any): void {
    if (userData && userData.user) {
      const user: User = {
        id: userData.user.id,
        name: userData.user.name,
        email: userData.user.email,
        phone: userData.user.phone,
        address: userData.user.address || ''
      };
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  checkSession(): void {
    this.http.get<any>(`${this.apiUrl}/session/check`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response.authenticated) {
            const user: User = {
              id: response.userId,
              name: response.username,
              email: response.userEmail,
              address: '' // Session doesn't store address
            };
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            console.log(this.isAuthenticated$);
          } else {
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
          }
        },
        error: (error) => {
          console.error('Session check failed:', error);
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        }
      });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  handleLogout(): void {
    this.logout().subscribe({
      next: () => {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Still clear local state even if server logout fails
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/']);
      }
    });
  }
}