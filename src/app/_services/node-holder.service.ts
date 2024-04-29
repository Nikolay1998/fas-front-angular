import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodeService } from './node.service';
import { FinancialNode } from '../_models/financial.node';

@Injectable({
  providedIn: 'root'
})
export class NodeHolderService {

  private emptyNodes: FinancialNode[] = []
  private nodesSource = new BehaviorSubject(this.emptyNodes);
  currentNodes = this.nodesSource.asObservable();

  constructor(
    public nodeService: NodeService,
  ) { }

  updateNodes() {
    this.nodeService.getNodes().subscribe(nodes => this.nodesSource.next(nodes));
  }
}
