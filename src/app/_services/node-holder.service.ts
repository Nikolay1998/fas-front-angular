import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NodeService} from './node.service';
import {FinancialNode} from '../_models/financial.node';

@Injectable({
  providedIn: 'root'
})
export class NodeHolderService {

  private emptyNodes: FinancialNode[] = []
  private nodesSource = new BehaviorSubject(this.emptyNodes);
  private archivedNodesSource = new BehaviorSubject(this.emptyNodes);
  currentNodes = this.nodesSource.asObservable();
  archivedCurrentNodes = this.archivedNodesSource.asObservable();

  constructor(
    public nodeService: NodeService,
  ) {
  }

  updateNodes() {
    this.nodeService.getNodes().subscribe(nodes => {
      let notArchivedNodes: FinancialNode[] = nodes.filter(tr => !tr.archived);
      console.log("not archived nodes: " + notArchivedNodes.length);
      let archivedNodes: FinancialNode[] = nodes.filter(tr => tr.archived);
      this.nodesSource.next(notArchivedNodes);
      this.archivedNodesSource.next(archivedNodes);
    })
  }
}
