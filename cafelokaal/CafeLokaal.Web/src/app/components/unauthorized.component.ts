import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized">
      <h2>Unauthorized Access</h2>
      <p>You don't have permission to access this resource.</p>
      <button (click)="goBack()">Go Back</button>
    </div>
  `,
  styles: [`
    .unauthorized {
      text-align: center;
      padding: 2rem;
    }

    button {
      padding: 0.5rem 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background: #0056b3;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
