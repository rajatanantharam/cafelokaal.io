import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CafeOrder } from '../models/cafe-order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<CafeOrder[]> {
    return this.http.get<CafeOrder[]>(`${environment.apiBaseUrl}/api/orders`);
  }

  syncData(orders: CafeOrder[]): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/posdata`, { orders });
  }

  getMetrics(): Observable<{
    averageProcessingTime: number;
    ordersToday: number;
    failedOrders: number;
  }> {
    return this.http.get<{
      averageProcessingTime: number;
      ordersToday: number;
      failedOrders: number;
    }>(`${environment.apiBaseUrl}/api/metrics`);
  }

  getUserData(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/api/user-data`);
  }

  exportUserData(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/api/user-data/export`);
  }

  deleteUserData(): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/user-data`);
  }
}
