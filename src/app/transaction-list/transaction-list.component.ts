import {CommonModule, NgIf} from '@angular/common';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NumberFormatter} from '../_helpers/number-formatter';
import {FinancialNode} from '../_models/financial.node';
import {FormState} from '../_models/form-state';
import {Transaction} from '../_models/transaction';
import {NodeHolderService} from '../_services/node-holder.service';
import {SummaryHolderService} from '../_services/summary-holder.service';
import {TransactionHolderService} from '../_services/transaction-holder.service';
import {TransactionService} from '../_services/transaction.service';
import {TransactionFormComponent} from "../transaction-form/transaction-form.component";
import {TransactionRowComponent} from "../transaction-row/transaction-row.component"
import {TransactionAction} from "../_models/transaction-action";


@Component({
  selector: 'app-transaction-list',
  standalone: true,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
  imports: [CommonModule, NgIf, TransactionFormComponent, FormsModule, TransactionRowComponent]
})
export class TransactionListComponent implements OnInit, OnChanges {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  @Input()
  selectedNode?: FinancialNode;
  selectedTransaction?: Transaction;
  search = '';
  transactionSearch: any;

  isTransactionFormActive: boolean | undefined;

  formState: FormState | undefined;

  selectedForEditTransaction: Transaction | undefined;

  error: String = "";

  constructor(
    public transactionService: TransactionService,
    private transactionHolder: TransactionHolderService,
    public nodeHolder: NodeHolderService,
    public summaryHolder: SummaryHolderService,
    public numberFormatter: NumberFormatter,
  ) {
  }

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
    if (this == undefined) {
      return transactions;
    }

    return transactions.filter(tr => this.selectedNode == undefined ? tr : tr.senderNodeId == this.selectedNode?.id || tr.receiverNodeId == this.selectedNode?.id)
      .filter(tr => tr.description.toLowerCase().includes(this.search.toLowerCase()));
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

  onCancel(transaction: Transaction) {
    this.transactionService.cancelTransaction(transaction).subscribe(
      {
        next: () => this.updateFromServerAndClose(),
        error: (e) => this.error = e
      }
    );
  }

  onRestore(transaction: Transaction) {
    this.transactionService.restoreTransaction(transaction).subscribe(
      {
        next: () => this.updateFromServerAndClose(),
        error: (e) => this.error = e
      }
    );
  }

  private updateFromServerAndClose() {
    this.transactionHolder.updateTransactions();
    this.nodeHolder.updateNodes();
    this.summaryHolder.updateSummary();
  }

  onFormUpdate(isActive: boolean): void {
    this.isTransactionFormActive = isActive;
  }

  onTransactionAction(action: TransactionAction, transaction: Transaction) {
    switch (action) {
      case TransactionAction.REPEAT:
        this.onRepeat(transaction);
        break;
      case TransactionAction.EDIT:
        this.onEdit(transaction);
        break;
      case TransactionAction.CANCEL:
        this.onCancel(transaction);
        break;
      case TransactionAction.RESTORE:
        this.onRestore(transaction);
        break;
    }
  }
}
