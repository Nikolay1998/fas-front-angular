import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FinancialNode } from '../_models/financial.node';
import { Transaction } from '../_models/transaction';
import { FormState } from '../_models/form-state';
import { TransactionService } from '../_services/transaction.service';
import { TransactionInfoComponent } from "../transaction-info/transaction-info.component";
import { TransactionFormComponent } from "../transaction-form/transaction-form.component";
import { TransactionHolderService } from '../_services/transaction-holder.service';
import { CallbackPipePipe } from "../_helpers/callback-pipe.pipe";
import { filter } from 'rxjs';
import { transition } from '@angular/animations';
// import { FormState } from '../_models/form-state';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
  imports: [CommonModule, TransactionInfoComponent, NgIf, TransactionFormComponent, CallbackPipePipe]
})
export class TransactionListComponent implements OnInit, OnChanges {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  @Input()
  selectedNode?: FinancialNode;
  selectedTransaction?: Transaction;

  isTransactionFormActive: boolean | undefined;

  formState: FormState | undefined;

  selectedForEditTransaction: Transaction | undefined;

  constructor(
    private transactionHolder: TransactionHolderService,
  ) { }

  ngOnInit(): void {
    this.transactionHolder.currentTransactions.subscribe(transactions => this.onTransactionsChanges(transactions));
    this.transactionHolder.updateTransactions();
  }

  onTransactionsChanges(transactions: Transaction[]): void {
    this.transactions = transactions;
    this.filteredTransactions = this.filterTransactions(transactions);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredTransactions = this.filterTransactions(this.transactions);
  }

  private filterTransactions(transactions: Transaction[]): Transaction[] {
    if (this == undefined || this.selectedNode == undefined) {
      return transactions;
    }

    return transactions.filter(tr => tr.senderNodeId == this.selectedNode?.id || tr.receiverNodeId == this.selectedNode?.id );
  }

  onSelect(transaction: Transaction): void {
    this.selectedTransaction = transaction;
  }

  clearFilter() {
    this.selectedNode = undefined;
    this.filteredTransactions = this.transactions;
  }

  onAddNew() {
    this.selectedForEditTransaction = undefined;
    this.formState = FormState.New;
    this.onFormUpdate(true);
  }

  onRepeat(transaction: Transaction) {
    this.selectedForEditTransaction = transaction;
    this.formState = FormState.Repeat;
    this.onFormUpdate(true);
  }

  onEdit(transaction: Transaction) {
    this.selectedForEditTransaction = transaction;
    this.formState = FormState.Edit;
    this.onFormUpdate(true);
  }

  onFormUpdate(isActive: boolean): void {
    this.isTransactionFormActive = isActive;
  }
}
