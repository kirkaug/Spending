// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service'; // Adjust the path as necessary

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  balance!: number;
  dailyBudget!: number;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.updateBalanceAndBudget();
  }

  updateBalanceAndBudget(): void {
    this.balance = this.transactionService.getBalance(); // Implement this method in the service
    this.dailyBudget = this.transactionService.getDailyBudget(); // Implement this method in the service
  }
}
