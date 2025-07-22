import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only add auth header for API requests
    if (!request.url.startsWith(environment.apiBaseUrl)) {
      return next.handle(request);
    }

    return from(this.authService.acquireAccessToken()).pipe(
      switchMap(token => {
        const authReq = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(authReq);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid, trigger login
          this.authService.login();
        }
        return throwError(() => error);
      })
    );
  }
}
