import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder
  ) {
    this.transactionForm = this.formBuilder.group({
      date: ['', Validators.required],
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
    this.transactions = this.transactionService.getAllTransactions();
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

  editTransaction(transaction: Transaction): void {
    // You would set up the transaction form with the transaction data
    this.transactionForm.setValue({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type
    });
    // You might need to keep track of the currently edited transaction ID
  }
  
  deleteTransaction(transactionId: number): void {
    this.transactionService.deleteTransaction(transactionId);
    this.loadTransactions();
  }
}
