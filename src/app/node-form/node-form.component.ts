import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FinancialNode } from '../_models/financial.node';
import { NodeHolderService } from '../_services/node-holder.service';
import { NodeService } from '../_services/node.service';

@Component({
  selector: 'app-node-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css'
})
export class NodeFormComponent implements OnChanges {

  //toDo: change to downloading from server
  currencys = [
    { name: 'Dollars', abbrev: 'USD', id: 1 },
    { name: 'Rubbles', abbrev: 'RUB', id: 2 },
    { name: 'Etherium', abbrev: 'ETH', id: 3 },
  ];

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
  });

  constructor(
    private nodeService: NodeService,
    private nodeHolder: NodeHolderService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyForm.get('name')?.setValue(changes['nodeTemplate'].currentValue?.name);
    this.applyForm.get('description')?.setValue(changes['nodeTemplate'].currentValue?.description);
    this.applyForm.get('amount')?.setValue(changes['nodeTemplate'].currentValue?.amount);
    this.applyForm.get('external')?.setValue(changes['nodeTemplate'].currentValue?.external);
    this.applyForm.get('currencyId')?.setValue(changes['nodeTemplate'].currentValue?.currencyId);
  }

  submitForm() {
    let newNode: FinancialNode = {
      id: "",
      name: this.applyForm.value.name ?? '',
      description: this.applyForm.value.description ?? '',
      currencyId: this.applyForm.value.currencyId,
      currencySymbol: this.applyForm.value.currencyId,
      amount: this.applyForm.value.amount,
      userId: "",
      external: this.applyForm.value.external,
      //toDo: change to undefined and check
      lastTransactionDate: new Date()
    }
    if (this.nodeTemplate) {
      this.nodeService.editNode(newNode).subscribe(nodes => this.nodeHolder.updateNodes());
    }
    else {
      //toDo: add only new one
      this.nodeService.addNode(newNode).subscribe(nodes => this.nodeHolder.updateNodes());
    }
    this.isActiveEvent.emit(false);
  }

  cancel() {
    this.isActiveEvent.emit(false);
  }
}
