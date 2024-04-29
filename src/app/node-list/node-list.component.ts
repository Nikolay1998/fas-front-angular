import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FinancialNode } from '../_models/financial.node.js';
import { NodeService } from '../_services/node.service.js';
import { TransactionListComponent } from '../transaction-list/transaction-list.component.js';
import { Transaction } from '../_models/transaction.js';
import { TransactionService } from '../_services/transaction.service.js';
import { NodeFormComponent } from "../node-form/node-form.component";
import { NodeHolderService } from '../_services/node-holder.service.js';

@Component({
    selector: 'app-node-list',
    standalone: true,
    templateUrl: './node-list.component.html',
    styleUrl: './node-list.component.css',
    imports: [CommonModule, TransactionListComponent, NodeFormComponent]
})

export class NodeListComponent implements OnInit {
  nodes: FinancialNode[] = [];
  transactions: Transaction[] = [];
  selectedNode: FinancialNode | undefined;
  selectedForEditNode: FinancialNode | undefined;
  isActiveNodeForm: boolean | undefined;

  constructor(
    public nodeService: NodeService,
    private transactionService: TransactionService,
    public nodeHolder: NodeHolderService,
  ) {
   }

  ngOnInit(): void {
    this.nodeHolder.currentNodes.subscribe(nodes => this.nodes = nodes);
    this.nodeHolder.updateNodes();
  }

  getTransactionsByNode(nodeId: string){
    this.transactionService.getTransactionsByNode(nodeId).subscribe(transactions => this.transactions = transactions)
  }

  onSelect(node: FinancialNode): void {
    this.selectedNode = node;
    this.getTransactionsByNode(node.id)
  }

  onEdit(node: FinancialNode): void {
    this.selectedForEditNode = node;
    this.onNodeFormUpdate(true);
  }

  onNodeFormUpdate(isActive: boolean): void {
    this.isActiveNodeForm = isActive;
  }

  onAddNew(): void {
    this.selectedForEditNode = undefined;
    this.onNodeFormUpdate(true);
  }
}