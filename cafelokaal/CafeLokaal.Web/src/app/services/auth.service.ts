import { Injectable } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AccountInfo, EventMessage, EventType, InteractionStatus, AuthenticationResult } from '@azure/msal-browser';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export interface UserInfo {
  username: string;
  roles: string[];
  email: string;
  cafeId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly ROLES_CLAIM = 'roles';
  private readonly CAFE_ID_CLAIM = 'extension_CafeId';

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {
    this.initializeAuthenticationState();
  }

  private initializeAuthenticationState(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });

    // Initial check
    this.checkAndSetActiveAccount();
  }

  private checkAndSetActiveAccount(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (activeAccount) {
      this.updateCurrentUser(activeAccount);
    } else {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        this.msalService.instance.setActiveAccount(accounts[0]);
        this.updateCurrentUser(accounts[0]);
      }
    }
  }

  private updateCurrentUser(account: AccountInfo): void {
    if (!account) {
      this.currentUserSubject.next(null);
      return;
    }

    const idTokenClaims = account.idTokenClaims as any;
    const user: UserInfo = {
      username: account.name || '',
      email: account.username || '',
      roles: idTokenClaims?.[this.ROLES_CLAIM] || [],
      cafeId: idTokenClaims?.[this.CAFE_ID_CLAIM]
    };

    this.currentUserSubject.next(user);
  }

  public isAuthenticated(): boolean {
    return this.msalService.instance.getActiveAccount() !== null;
  }

  public getActiveAccount(): AccountInfo | null {
    return this.msalService.instance.getActiveAccount();
  }

  public login(): Observable<void> {
    return from(this.msalService.loginRedirect());
  }

  public logout(): Observable<void> {
    this.currentUserSubject.next(null);
    return from(this.msalService.logout());
  }

  public acquireAccessToken(): Observable<string> {
    return this.msalService.acquireTokenSilent({
      scopes: ['api://cafelokaal/orders.read']
    }).pipe(
      map((response: AuthenticationResult) => response.accessToken)
    );
  }

  public hasRole(role: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user?.roles.includes(role) ?? false)
    );
  }

  public isCafeManager(): Observable<boolean> {
    return this.hasRole('CafeManager');
  }

  public isAdmin(): Observable<boolean> {
    return this.hasRole('Admin');
  }

  public getCafeId(): Observable<string | undefined> {
    return this.currentUser$.pipe(
      map(user => user?.cafeId)
    );
  }
}
