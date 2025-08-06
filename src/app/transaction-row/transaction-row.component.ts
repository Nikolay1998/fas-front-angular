import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Transaction } from '../_models/transaction';
import { NumberFormatter } from '../_helpers/number-formatter';
import { FinancialNode } from "../_models/financial.node";
import { TransactionStatus } from "../_models/transaction-status";
import { TransactionAction } from "../_models/transaction-action";
import { NgClass, NgIf } from "@angular/common";

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'tr[transaction-row]',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './transaction-row.component.html',
  styleUrl: './transaction-row.component.css'
})
export class TransactionRowComponent implements OnInit, OnChanges {

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  @Input() transaction!: Transaction;
  @Input() selectedNode?: FinancialNode;
  @Input() filteredTransactions!: Transaction[];

  @Output()
  transactionAction = new EventEmitter<TransactionAction>();

  status: TransactionStatus | undefined;
  availableActions: TransactionAction[] = [];


  constructor(
    public numberFormatter: NumberFormatter,
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    //todo: do it only if corresponding changes occurred
    this.status = this.getState();
  }

  ngOnInit(): void {
  }

  getFormattedDate(): String {
    const date = new Date(this.transaction.date)
    const day = this.numberFormatter.padNumber(date.getDate())
    const month = this.numberFormatter.padNumber(date.getMonth() + 1)
    const year = this.numberFormatter.padNumber(date.getFullYear(), 4)
    return `${day}-${month}-${year}`
  }

  getFormattedAmount(): String {
    let str = this.numberFormatter.format(this.transaction.senderAmount) + this.transaction.senderCurrencySymbol;
    if (this.transaction.senderCurrencySymbol != this.transaction.receiverCurrencySymbol
      || this.transaction.senderAmount != this.transaction.receiverAmount) {
      str = str + " -> " + this.numberFormatter.format(this.transaction.receiverAmount)
        + this.transaction.receiverCurrencySymbol;
    }
    return str;
  }

  getState(): TransactionStatus {
    // console.log("calculate state")
    if (this.selectedNode) {
      if (this.transaction.receiverNodeId == this.selectedNode.id) {
        return TransactionStatus.INCOMING;
      }
      if (this.transaction.senderNodeId == this.selectedNode.id) {
        return TransactionStatus.OUTGOING;
      }
      return TransactionStatus.NEUTRAL;
    }
    if (this.transaction.fromExternal) {
      return TransactionStatus.INCOMING;
    }
    if (this.transaction.toExternal) {
      return TransactionStatus.OUTGOING;
    }
    return TransactionStatus.NEUTRAL;
  }

  getAvailableActions(): TransactionAction[] {
    console.log("calculate available actions")
    if (this.availableActions.length > 0) {
      return this.availableActions;
    }
    let result: TransactionAction[] = [];
    result.push(TransactionAction.REPEAT);
    let transactionIndex = this.filteredTransactions.indexOf(this.transaction);
    if (this.filteredTransactions.at(transactionIndex + 1)?.date == this.transaction.date) {
      result.push(TransactionAction.MOVE_DOWN);
    }
    if (this.filteredTransactions.at(transactionIndex - 1)?.date == this.transaction.date) {
      result.push(TransactionAction.MOVE_UP);
    }
    if (this.transaction.cancelled) {
      result.push(TransactionAction.RESTORE)
    } else {
      result.push(TransactionAction.CANCEL);
      result.push(TransactionAction.EDIT);
    }
    this.availableActions = result;
    return result;
  }

  openMenu() {
    this.getAvailableActions();
    this.menuTrigger.openMenu();
  }

  protected readonly TransactionStatus = TransactionStatus;

  onRepeat() {
    this.transactionAction.emit(TransactionAction.REPEAT);
  }

  onEdit() {
    this.transactionAction.emit(TransactionAction.EDIT);
  }

  onCancel() {
    this.transactionAction.emit(TransactionAction.CANCEL);
  }

  onRestore() {
    this.transactionAction.emit(TransactionAction.RESTORE);
  }

  onMoveUp() {
    this.transactionAction.emit(TransactionAction.MOVE_UP);
  }

  onMoveDown() {
    this.transactionAction.emit(TransactionAction.MOVE_DOWN);
  }

  protected readonly TransactionAction = TransactionAction;
}
