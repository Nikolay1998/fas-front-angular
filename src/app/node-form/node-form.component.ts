import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FinancialNode } from '../_models/financial.node';
import { NodeService } from '../_services/node.service';

@Component({
  selector: 'app-node-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css'
})
export class NodeFormComponent implements OnChanges {
  
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
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyForm.get('name')?.setValue(changes['nodeTemplate'].currentValue?.name);
    this.applyForm.get('description')?.setValue(changes['nodeTemplate'].currentValue?.description);
    this.applyForm.get('amount')?.setValue(changes['nodeTemplate'].currentValue?.amount);

    //toDo: not working 
    this.applyForm.get('external')?.setValue(changes['nodeTemplate'].currentValue?.isExternal);
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
      //toDo: not working
      isExternal: this.applyForm.value.external,
      //toDo: change to undefined and check
      lastTransactionDate: new Date()
    }
    this.nodeService.addNode(newNode).subscribe();
  }

  cancel() {
    // this.nodeTemplate = undefined;
    this.isActiveEvent.emit(false);
  }
}
