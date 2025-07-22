import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { MsalModule, MsalInterceptor, MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { environment } from './environment';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthGuard, CafeManagerGuard, AdminGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { msalConfig } from './auth.config';
import { UnauthorizedComponent } from './components/unauthorized.component';
import { LoginComponent } from './components/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard, CafeManagerGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UnauthorizedComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MsalModule.forRoot(msalConfig, {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['api://cafelokaal/orders.read']
      }
    }, { 
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        [environment.apiBaseUrl, ['api://cafelokaal/orders.read']]
      ])
    })
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuard,
    CafeManagerGuard,
    AdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
