import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Transaction } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionForm: FormGroup;
  isEditMode = false;
  editingTransactionId: number | null = null;

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder
  ) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
  
    this.transactionForm = this.formBuilder.group({
      date: [today, Validators.required], // Set the default value to today's date
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+\.?\d*$/)]],
      category: ['', Validators.required],
      type: ['expense', Validators.required] // default to 'expense'
    });
  }
  
  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactions = this.transactionService.getAllTransactions()
      .sort((a, b) => {
        // Convert date strings to date objects for comparison
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
  
        // Compare by date descending first
        if (dateB > dateA) return 1;
        if (dateA > dateB) return -1;
  
        // If dates are equal, then compare by id descending
        return b.id - a.id;
      });
  }  

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const newTransaction: Transaction = {
        ...this.transactionForm.value,
        id: this.transactionService.getNextId() // assuming your service has a method for ID generation
      };
      this.transactionService.addTransaction(newTransaction);
      this.loadTransactions();
      this.transactionForm.reset();
    }
  }

  addTransaction(transaction: Transaction): void {
    this.transactionService.addTransaction(transaction);
    this.loadTransactions(); // Reload the transactions to update the list
  }

  startEdit(transaction: Transaction): void {
    this.isEditMode = true;
    this.editingTransactionId = transaction.id;
    this.transactionForm.patchValue(transaction);
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingTransactionId = null;
    this.transactionForm.reset();
  }

  saveTransaction(): void {
    if (this.transactionForm.valid) {
      if (this.isEditMode) {
        const updatedTransaction: Transaction = {
          id: this.editingTransactionId as number,
          ...this.transactionForm.value
        };
        this.transactionService.updateTransaction(updatedTransaction);
      } else {
        const newTransaction: Transaction = {
          id: this.transactionService.getNextId(),
          ...this.transactionForm.value
        };
        this.transactionService.addTransaction(newTransaction);
      }

      this.loadTransactions();
      this.transactionForm.reset();
      this.isEditMode = false;
      this.editingTransactionId = null;
    }
  }

  deleteTransaction(transactionId: number): void {
    this.transactionService.deleteTransaction(transactionId);
    this.loadTransactions();
  }
}
