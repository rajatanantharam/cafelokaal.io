import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login">
      <h2>Welcome to CafeLokaal</h2>
      <p>Please sign in to continue</p>
      <button (click)="login()">Sign In</button>
    </div>
  `,
  styles: [`
    .login {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #f5f5f5;
    }

    button {
      padding: 1rem 2rem;
      font-size: 1.2rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }

    button:hover {
      background: #0056b3;
    }
  `]
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.authService.login().subscribe();
  }
}
