import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FinancialNode } from '../_models/financial.node';
import { FormState } from '../_models/form-state';
import { Transaction } from '../_models/transaction';
import { NodeHolderService } from '../_services/node-holder.service';
import { SummaryHolderService } from '../_services/summary-holder.service';
import { TransactionHolderService } from '../_services/transaction-holder.service';
import { TransactionService } from '../_services/transaction.service';
import { NumberFormatter } from '../_helpers/number-formatter';


@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
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

  senderCurrency: string = "?";
  receiverCurrency: string = "?";
  receiverAmountChangedByHand: boolean = false;

  error: string | null = null;
  private errorTimeout: ReturnType<typeof setTimeout> | null = null;


  transactionForm = new FormGroup({
    description: new FormControl('', Validators.required),
    senderNodeId: new FormControl(null, Validators.required),
    receiverNodeId: new FormControl(null, Validators.required),
    senderAmount: new FormControl(null, [Validators.required, Validators.min(0)]),
    receiverAmount: new FormControl(null, [Validators.required, Validators.min(0)]),
    date: new FormControl(null, Validators.required)
  });

  constructor(
    public transactionService: TransactionService,
    public nodeHolder: NodeHolderService,
    public summaryHolder: SummaryHolderService,
    public transactionHolder: TransactionHolderService,
    public numberFormatter: NumberFormatter,
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
      this.senderCurrency = changes['transactionTemplate'].currentValue.senderCurrencySymbol;
      this.receiverCurrency = changes['transactionTemplate'].currentValue.receiverCurrencySymbol;
    }
  }

  ngOnInit(): void {
    this.nodeHolder.currentNodes.subscribe(nodes => this.nodes = nodes);

    this.transactionForm.controls['senderNodeId'].valueChanges.subscribe(value =>
      this.senderCurrency = this.nodes.filter(n => n.id == value)[0].currencySymbol
    );
    this.transactionForm.controls['receiverNodeId'].valueChanges.subscribe(value =>
      this.receiverCurrency = this.nodes.filter(n => n.id == value)[0].currencySymbol
    );
    this.transactionForm.controls['senderAmount'].valueChanges.subscribe(value => {
      if (this.senderCurrency == this.receiverCurrency && !this.receiverAmountChangedByHand) {
        this.transactionForm.controls['receiverAmount'].setValue(value)
      }
    }
    );
    this.transactionForm.controls['receiverAmount'].valueChanges.subscribe(value => {
      if (value != this.transactionForm.controls['senderAmount'].value) {
        this.receiverAmountChangedByHand = true
      }
      if (!value) {
        this.receiverAmountChangedByHand = false;
      }
    }
    );
  }

  submitForm() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    let newTransaction: Transaction = {
      id: this.state == FormState.Edit && this.transactionTemplate ? this.transactionTemplate.id : "",
      description: this.transactionForm.value.description!,
      senderNodeId: this.transactionForm.value.senderNodeId!,
      receiverNodeId: this.transactionForm.value.receiverNodeId!,
      senderNodeName: "",
      receiverNodeName: "",
      senderAmount: this.transactionForm.value.senderAmount!,
      receiverAmount: this.transactionForm.value.receiverAmount!,
      senderCurrencyId: -1, //toDo
      receiverCurrencyId: -1, //toDo
      senderCurrencySymbol: "",
      receiverCurrencySymbol: "",
      date: this.transactionForm.value.date!,
      cancelled: false,
      userId: ""
    };

    if (this.state == FormState.Edit) {
      this.transactionService.editTransaction(newTransaction).subscribe({
        next: () => this.updateFromServerAndClose(),
        error: (e) => {
          if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
          }
          this.error = e

          this.errorTimeout = setTimeout(() => {
            this.error = null;
          }, 2000);
        }
      });
    } else {
      this.transactionService.addTransaction(newTransaction).subscribe({
        next: () => this.updateFromServerAndClose(),
        error: (e) => {
          if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
          }
          this.error = e

          this.errorTimeout = setTimeout(() => {
            this.error = null;
          }, 2000);
        }
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.transactionForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  onBlur(controlName: keyof typeof this.transactionForm.controls) {
    const control = this.transactionForm.get(controlName);
    if (control && control.invalid && control.touched) {
      this.setupErrorHandlers(controlName);
    }
  }

  setupErrorHandlers(controlName: string) {
    const control = this.transactionForm.get(controlName);

    if (!control || !control.errors) return;

    const firstErrorKey = Object.keys(control.errors)[0];

    const errorMessages: Record<string, string> = {
      required: this.getErrorMessage(controlName),
    };

    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    this.error = errorMessages[firstErrorKey] ?? 'Invalid input';

    this.errorTimeout = setTimeout(() => {
      this.error = null;
    }, 2000);
  }
  private getErrorMessage(controlName: string): string {
    const errorMessages: Record<string, string> = {
      name: 'Name is required',
      senderNodeId: 'Sender Node is required',
      receiverNodeId: 'Receiver Node is required',
      date: 'Date is required',
      description: 'Description is required',
      senderAmount: 'Sender amount is required and must be >= 0',
      receiverAmount: 'Receiver amount is required and must be >= 0'
    };
    return errorMessages[controlName] ?? controlName;
  }

  private updateFromServerAndClose() {
    this.transactionHolder.updateTransactions();
    this.nodeHolder.updateNodes();
    this.summaryHolder.updateSummary();
    this.summaryHolder.updateBalanceChange()
    this.isActiveEvent.emit(false)
  }

  onCancel() {
    this.isActiveEvent.emit(false);
  }
}
