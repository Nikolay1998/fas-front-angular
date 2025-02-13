import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Transaction} from '../_models/transaction';
import {NumberFormatter} from '../_helpers/number-formatter';
import {FinancialNode} from "../_models/financial.node";
import {TransactionStatus} from "../_models/transaction-status";
import {TransactionAction} from "../_models/transaction-action";
import {NgClass, NgIf} from "@angular/common";


@Component({
  selector: 'tr[transaction-row]',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './transaction-row.component.html',
  styleUrl: './transaction-row.component.css'
})
export class TransactionRowComponent implements OnInit, OnChanges {

  @Input() transaction!: Transaction;
  @Input() selectedNode?: FinancialNode;

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
    this.availableActions = this.getAvailableActions();
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
    let result: TransactionAction[] = [];
    result.push(TransactionAction.REPEAT)
    if (this.transaction.cancelled) {
      result.push(TransactionAction.RESTORE)
    } else {
      result.push(TransactionAction.CANCEL);
      result.push(TransactionAction.EDIT);
    }
    return result;
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

  protected readonly TransactionAction = TransactionAction;
}
