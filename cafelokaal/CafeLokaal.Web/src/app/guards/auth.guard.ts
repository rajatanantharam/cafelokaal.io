import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }
        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class CafeManagerGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isCafeManager().pipe(
      map(isCafeManager => {
        if (!isCafeManager) {
          return this.router.createUrlTree(['/unauthorized']);
        }
        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAdmin().pipe(
      map(isAdmin => {
        if (!isAdmin) {
          return this.router.createUrlTree(['/unauthorized']);
        }
        return true;
      })
    );
  }
}
