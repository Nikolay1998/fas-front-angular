import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FinancialNode } from '../_models/financial.node';
import { FormState } from '../_models/form-state';
import { Transaction } from '../_models/transaction';
import { NodeHolderService } from '../_services/node-holder.service';
import { TransactionService } from '../_services/transaction.service';
import { TransactionHolderService } from '../_services/transaction-holder.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit, OnChanges {

  @Output()
  isActiveEvent = new EventEmitter<boolean>();

  @Input()
  state: FormState | undefined;

  @Input()
  transactionTemplate?: Transaction = undefined;

  nodes: FinancialNode[] = [];

  transactionForm = new FormGroup({
    description: new FormControl(),
    senderNodeId: new FormControl(),
    receiverNodeId: new FormControl(),
    senderAmount: new FormControl(),
    receiverAmount: new FormControl(),
    date: new FormControl()
  })

  constructor(
    public transactionService: TransactionService,
    public nodeHolder: NodeHolderService,
    public transactionHolder: TransactionHolderService,
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactionTemplate'].currentValue != undefined) {
      this.transactionForm.get('description')?.setValue(changes['transactionTemplate'].currentValue.description);
      this.transactionForm.get('senderNodeId')?.setValue(changes['transactionTemplate'].currentValue.senderNodeId);
      this.transactionForm.get('receiverNodeId')?.setValue(changes['transactionTemplate'].currentValue.receiverNodeId);
      this.transactionForm.get('senderAmount')?.setValue(changes['transactionTemplate'].currentValue.senderAmount);
      this.transactionForm.get('receiverAmount')?.setValue(changes['transactionTemplate'].currentValue.receiverAmount);
      this.transactionForm.get('date')?.setValue(changes['transactionTemplate'].currentValue.date);
    }
  }

  ngOnInit(): void {
    this.nodeHolder.currentNodes.subscribe(nodes => this.nodes = nodes);

  }

  submitForm() {
    let newTransaction: Transaction = {
      id: "",
      description: this.transactionForm.value.description,
      senderNodeId: this.transactionForm.value.senderNodeId,
      receiverNodeId: this.transactionForm.value.receiverNodeId,
      senderNodeName: "",
      receiverNodeName: "",
      senderAmount: this.transactionForm.value.senderAmount,
      receiverAmount: this.transactionForm.value.receiverAmount,
      senderCurrencyId: -1, //toDo
      receiverCurrencyId: -1, //toDo
      senderCurrencySymbol: "",
      receiverCurrencySymbol: "",
      date: this.transactionForm.value.date,
      isCancelled: false,
      userId: ""
    }
    this.transactionService.addTransaction(newTransaction).subscribe(transactions => this.updateFromServer());
  }

  private updateFromServer() {
    this.transactionHolder.updateTransactions();
    this.nodeHolder.updateNodes();
  }

  onCancel() {
    this.isActiveEvent.emit(false);
  }
}
