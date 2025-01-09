import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Transaction} from '../_models/transaction';
import {NumberFormatter} from '../_helpers/number-formatter';
import {FinancialNode} from "../_models/financial.node";
import {TransactionStatus} from "../_models/transaction-status";
import {TransactionAction} from "../_models/transaction-action";
import {NgClass} from "@angular/common";


@Component({
  selector: 'tr[transaction-row]',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './transaction-row.component.html',
  styleUrl: './transaction-row.component.css'
})
export class TransactionRowComponent {

  @Input() transaction!: Transaction;
  @Input() selectedNode?: FinancialNode;

  @Output()
  transactionAction = new EventEmitter<TransactionAction>();


  constructor(
    public numberFormatter: NumberFormatter,
  ) {
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
}
