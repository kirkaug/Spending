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
}
