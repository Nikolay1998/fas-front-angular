import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FinancialNode } from '../_models/financial.node.js';
import { Transaction } from '../_models/transaction.js';
import { NodeHolderService } from '../_services/node-holder.service.js';
import { NodeFormComponent } from "../node-form/node-form.component";
import { TransactionListComponent } from '../transaction-list/transaction-list.component.js';
import { FormsModule } from '@angular/forms';
import { NumberFormatter } from '../_helpers/number-formatter.js';

@Component({
    selector: 'app-node-list',
    standalone: true,
    templateUrl: './node-list.component.html',
    styleUrl: './node-list.component.css',
    imports: [CommonModule, TransactionListComponent, NodeFormComponent, FormsModule]
})

export class NodeListComponent implements OnInit {
  nodes: FinancialNode[] = [];
  filteredNodes: FinancialNode[] = [];
  transactions: Transaction[] = [];
  selectedNode: FinancialNode | undefined;
  selectedForEditNode: FinancialNode | undefined;
  isActiveNodeForm: boolean | undefined;
  search = '';


  constructor(
    public nodeHolder: NodeHolderService,
    public numberFormatter: NumberFormatter,
  ) {
   }

  ngOnInit(): void {
    this.nodeHolder.currentNodes.subscribe(nodes => this.updateAndFilterTransactions(nodes));
    this.nodeHolder.updateNodes();
  }

  updateAndFilterTransactions(nodes: FinancialNode[]) {
    this.nodes = nodes;
    this.filterNodes();
  }

  filterNodes() {
      this.filteredNodes = this.nodes.filter(tr => tr.name.toLowerCase().includes(this.search));
  }

  onSelect(node: FinancialNode): void {
    this.selectedNode = node;
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