import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Currency } from '../_models/currency';
import { FinancialNode } from '../_models/financial.node';
import { CurrencyService } from '../_services/currency.service';
import { NodeHolderService } from '../_services/node-holder.service';
import { NodeService } from '../_services/node.service';
import { SummaryHolderService } from '../_services/summary-holder.service';


@Component({
  selector: 'app-node-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, NgSelectModule],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css'
})
export class NodeFormComponent implements OnChanges, OnInit {

  currencys: Currency[] = [];

  @Output()
  isActiveEvent = new EventEmitter<boolean>();

  @Input()
  nodeTemplate?: FinancialNode = undefined;

  applyForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(''),
    external: new FormControl(),
    currencyId: new FormControl(),
    amount: new FormControl(),
    overdraft: new FormControl(),
  });

  error: String = "";

  constructor(
    private nodeService: NodeService,
    private nodeHolder: NodeHolderService,
    private summaryHolder: SummaryHolderService,
    private currencyService: CurrencyService,
  ) { }

  //move downloading currencys to somewhere where it will called one time?
  ngOnInit(): void {
    this.currencyService.currentNodes.subscribe(currencys => this.currencys = currencys);
    this.currencyService.updateCurrency();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyForm.get('name')?.setValue(changes['nodeTemplate'].currentValue?.name);
    this.applyForm.get('description')?.setValue(changes['nodeTemplate'].currentValue?.description);
    this.applyForm.get('amount')?.setValue(changes['nodeTemplate'].currentValue?.amount);
    this.applyForm.get('external')?.setValue(changes['nodeTemplate'].currentValue?.external);
    this.applyForm.get('currencyId')?.setValue(changes['nodeTemplate'].currentValue?.currencyId);
    this.applyForm.get('overdraft')?.setValue(changes['nodeTemplate'].currentValue?.overdraft);
  }

  submitForm() {
    let newNode: FinancialNode = {
      id: this.nodeTemplate ? this.nodeTemplate.id : "",
      name: this.applyForm.value.name ?? '',
      description: this.applyForm.value.description ?? '',
      currencyId: this.applyForm.value.currencyId,
      currencySymbol: this.applyForm.value.currencyId,
      amount: this.applyForm.value.amount,
      userId: "",
      external: this.applyForm.value.external,
      overdraft: this.applyForm.value.overdraft,
      archived: false,
      //toDo: change to undefined and check
      lastTransactionDate: new Date()
    }
    if (this.nodeTemplate) {
      this.nodeService.editNode(newNode).subscribe({
        next: (nodes) => this.updateAndClose(),
        error: (e) => this.error = e
      });
    }
    else {
      //toDo: add only new one
      this.nodeService.addNode(newNode).subscribe({
        next: (nodes) => { this.updateAndClose() },
        error: (e) => this.error = e
      });
    }
  }

  private updateAndClose() {
    this.nodeHolder.updateNodes();
    this.summaryHolder.updateSummary();
    this.isActiveEvent.emit(false)
  }

  cancel() {
    this.isActiveEvent.emit(false);
  }
}
