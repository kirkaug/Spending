import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: Transaction[] = [];
  private storageKey = 'transactions';

  constructor() {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const data = localStorage.getItem(this.storageKey);
    this.transactions = data ? JSON.parse(data) : [];
  }

  getAllTransactions(): Transaction[] {
    return this.transactions;
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.saveTransactions();
  }

  // Call this method after adding, updating, or deleting transactions
  saveTransactions(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
  }

  updateTransaction(updatedTransaction: Transaction): void {
    const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      this.transactions[index] = updatedTransaction;
      this.saveTransactions();
    }
  }
  
  deleteTransaction(id: number): void {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.saveTransactions();
  }

  getNextId(): number {
    return this.transactions.length > 0 
           ? Math.max(...this.transactions.map(t => t.id)) + 1 
           : 1;
  }

  getBalance(): number {
    // Calculate the balance by summing income and subtracting expenses
    // This is a simplified example
    return this.transactions
      .map(t => t.type === 'income' ? t.amount : -t.amount)
      .reduce((acc, amount) => acc + amount, 0);
  }

  getDailyBudget(): number {
    const currentMonthTransactions = this.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const currentMonth = new Date().getMonth();
      return transactionDate.getMonth() === currentMonth;
    });

    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const daysInCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    return monthlyIncome / daysInCurrentMonth;
  }
}
