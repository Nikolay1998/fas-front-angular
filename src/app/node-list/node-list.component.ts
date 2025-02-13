import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FinancialNode} from '../_models/financial.node.js';
import {NodeHolderService} from '../_services/node-holder.service.js';
import {NodeFormComponent} from "../node-form/node-form.component";
import {TransactionListComponent} from '../transaction-list/transaction-list.component.js';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NumberFormatter} from '../_helpers/number-formatter.js';
import {NodeService} from "../_services/node.service";

@Component({
    selector: 'app-node-list',
    standalone: true,
    templateUrl: './node-list.component.html',
    styleUrl: './node-list.component.css',
  imports: [CommonModule, TransactionListComponent, NodeFormComponent, FormsModule, ReactiveFormsModule]
})

export class NodeListComponent implements OnInit {
  nodes: FinancialNode[] = [];
  archivedNodes: FinancialNode[] = [];
  filteredNodes: FinancialNode[] = [];
  selectedNode: FinancialNode | undefined;
  selectedForEditNode: FinancialNode | undefined;
  isActiveNodeForm: boolean | undefined;
  search = '';
  error: String = "";
  showArchived: boolean = false;


  constructor(
    public nodeHolder: NodeHolderService,
    public numberFormatter: NumberFormatter,
    private nodeService: NodeService
  ) {
   }

  ngOnInit(): void {
    this.nodeHolder.currentNodes.subscribe(nodes => this.updateAndFilterTransactions(nodes));
    this.nodeHolder.archivedCurrentNodes.subscribe(nodes => this.archivedNodes = nodes);
    this.nodeHolder.updateNodes();
  }

  updateAndFilterTransactions(nodes: FinancialNode[]) {
    this.nodes = nodes;
    this.filterNodes();
  }

  filterNodes() {
      this.filteredNodes = this.nodes
        .filter(tr => tr.name.toLowerCase().includes(this.search))
  }

  onSelect(node: FinancialNode): void {
    this.selectedNode = node;
  }

  onEdit(node: FinancialNode): void {
    this.selectedForEditNode = node;
    this.onNodeFormUpdate(true);
  }

  onArchive(node: FinancialNode) {
    this.nodeService.archiveNode(node).subscribe({
      next: (nodes) => this.updateNodeList(),
      error: (e) => this.error = e
    });
  }

  onRestore(node: FinancialNode) {
    this.nodeService.restoreNode(node).subscribe({
      next: (nodes) => this.updateNodeList(),
      error: (e) => this.error = e
    });
  }

  private updateNodeList() {
    this.nodeHolder.updateNodes();
  }

  onNodeFormUpdate(isActive: boolean): void {
    this.isActiveNodeForm = isActive;
  }

  onAddNew(): void {
    this.selectedForEditNode = undefined;
    this.onNodeFormUpdate(true);
  }

  getColor(node: FinancialNode) : String|null {
    if(node.external && node.amount > 0) {
      return "#fff1f1"
    }
    if(node.external && node.amount <= 0) {
      return "#f1fff1"
    }
    if(node.external && node.amount == 0) {
      return "WHITE"
    }
    return null
  }

  getFormattedAmount(node: FinancialNode) : String {
    var amount = node.amount;
    if (node.external) {
        amount = Math.abs(amount)
      }
      return this.numberFormatter.format(amount) + node.currencySymbol
    }
}
