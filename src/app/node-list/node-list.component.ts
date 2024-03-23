import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FinancialNode } from '../_models/financial.node.js';
import { NodeService } from '../_services/node.service.js';
import { TransactionListComponent } from '../transaction-list/transaction-list.component.js';

@Component({
  selector: 'app-node-list',
  standalone: true,
  imports: [CommonModule, TransactionListComponent],
  templateUrl: './node-list.component.html',
  styleUrl: './node-list.component.css'
})

export class NodeListComponent implements OnInit {
  nodes: FinancialNode[] = [];
  selectedNode: FinancialNode | undefined;

  constructor(
    private nodeService: NodeService,
  ) { }

  ngOnInit(): void {
    this.getNodes();
  }

  getNodes() {
    this.nodeService.getNodes().subscribe(nodes => this.nodes = nodes)
  }

  onSelect(node: FinancialNode): void {
    this.selectedNode = node;
  }

}