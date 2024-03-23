import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FinancialNode } from '../_models/financial.node';
import { Transaction } from '../_models/transaction';
import { TransactionService } from '../_services/transaction.service';
import { TransactionInfoComponent } from "../transaction-info/transaction-info.component";

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
  imports: [CommonModule, TransactionInfoComponent, NgIf]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  @Input()
  selectedNode?: FinancialNode;
  selectedTransaction?: Transaction;

  constructor(
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.transactionService.getTransactions().subscribe(transactions => this.transactions = transactions)
  }

  onSelect(transaction: Transaction): void {
    this.selectedTransaction = transaction;
  }

}
