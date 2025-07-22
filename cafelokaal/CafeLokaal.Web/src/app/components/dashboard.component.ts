import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ApiService } from '../services/api.service';
import { CafeOrder } from '../models/cafe-order.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h2>Order Processing Dashboard</h2>
      
      <button (click)="syncData()" [disabled]="isLoading">
        {{ isLoading ? 'Syncing...' : 'Sync Data' }}
      </button>

      <div class="charts">
        <div class="chart-container">
          <h3>Processing Time Distribution</h3>
          <canvas #processingTimeChart></canvas>
        </div>
        
        <div class="chart-container">
          <h3>Order Status</h3>
          <canvas #orderStatusChart></canvas>
        </div>
      </div>

      <div class="metrics">
        <div class="metric">
          <h4>Average Processing Time</h4>
          <p>{{ averageProcessingTime | number:'1.0-0' }} minutes</p>
        </div>
        
        <div class="metric">
          <h4>Orders Today</h4>
          <p>{{ ordersToday }}</p>
        </div>
        
        <div class="metric">
          <h4>Failed Orders</h4>
          <p>{{ failedOrders }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }

    .charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    .chart-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 20px;
    }

    .metric {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background: #ccc;
    }
  `]
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  orders: CafeOrder[] = [];
  averageProcessingTime = 0;
  ordersToday = 0;
  failedOrders = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.apiService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateMetrics();
        this.renderCharts();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        // Show error toast
      }
    });
  }

  syncData() {
    this.isLoading = true;
    this.apiService.syncData(this.orders).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadOrders();
        // Show success toast
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error syncing data:', error);
        // Show error toast
      }
    });
  }

  calculateMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.ordersToday = this.orders.filter(order => {
      const orderDate = new Date(order.orderStates.orderReceived.startTimestamp);
      return orderDate >= today;
    }).length;

    this.failedOrders = this.orders.filter(order => {
      const received = new Date(order.orderStates.orderReceived.startTimestamp);
      const served = new Date(order.orderStates.orderServed.endTimestamp);
      return served.getTime() - received.getTime() > 30 * 60 * 1000; // More than 30 minutes
    }).length;

    // Calculate average processing time
    const processingTimes = this.orders.map(order => {
      const received = new Date(order.orderStates.orderReceived.startTimestamp);
      const served = new Date(order.orderStates.orderServed.endTimestamp);
      return (served.getTime() - received.getTime()) / (1000 * 60); // Convert to minutes
    });

    this.averageProcessingTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
  }

  renderCharts() {
    this.renderProcessingTimeChart();
    this.renderOrderStatusChart();
  }

  private renderProcessingTimeChart() {
    const processingTimes = this.orders.map(order => {
      const received = new Date(order.orderStates.orderReceived.startTimestamp);
      const served = new Date(order.orderStates.orderServed.endTimestamp);
      return (served.getTime() - received.getTime()) / (1000 * 60);
    });

    const ctx = document.getElementById('processingTimeChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Processing Time (minutes)',
          data: processingTimes,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private renderOrderStatusChart() {
    const statuses = {
      onTime: 0,
      delayed: 0,
      failed: 0
    };

    this.orders.forEach(order => {
      const received = new Date(order.orderStates.orderReceived.startTimestamp);
      const served = new Date(order.orderStates.orderServed.endTimestamp);
      const processingTime = (served.getTime() - received.getTime()) / (1000 * 60);

      if (processingTime <= 15) {
        statuses.onTime++;
      } else if (processingTime <= 30) {
        statuses.delayed++;
      } else {
        statuses.failed++;
      }
    });

    const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['On Time', 'Delayed', 'Failed'],
        datasets: [{
          data: [statuses.onTime, statuses.delayed, statuses.failed],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545']
        }]
      },
      options: {
        responsive: true
      }
    });
  }
}
