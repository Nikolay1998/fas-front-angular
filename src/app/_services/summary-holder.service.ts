import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SummaryService } from './summary.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryHolderService {

  private emptySummary!: Map<string, number>;
  private summarySource = new BehaviorSubject(this.emptySummary);
  currentSummary = this.summarySource.asObservable();

  constructor(
    public summaryService: SummaryService,
  ) { }

  updateSummary() {
    this.summaryService.getSummary().subscribe(sum => this.summarySource.next(sum));
  }
}
