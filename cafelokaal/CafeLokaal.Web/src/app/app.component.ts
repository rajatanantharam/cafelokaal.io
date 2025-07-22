import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header>
        <h1>CafeLokaal</h1>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        </nav>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>

      <footer>
        <p>&copy; 2024 CafeLokaal. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    header {
      background: #333;
      color: white;
      padding: 1rem 2rem;
    }

    nav {
      margin-top: 1rem;
    }

    nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      margin-right: 1rem;
      border-radius: 4px;
    }

    nav a.active {
      background: #007bff;
    }

    main {
      flex: 1;
      padding: 2rem;
      background: #f5f5f5;
    }

    footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 1rem;
    }
  `]
})
export class AppComponent {
  title = 'CafeLokaal';
}
