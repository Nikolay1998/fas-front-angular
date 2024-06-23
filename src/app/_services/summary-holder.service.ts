import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SummaryService } from './summary.service';
import { Summary } from '../_models/summary';

@Injectable({
  providedIn: 'root'
})
export class SummaryHolderService {

  private emptySummary!: Summary;
  private summarySource = new BehaviorSubject(this.emptySummary);
  currentSummary = this.summarySource.asObservable();

  constructor(
    public summaryService: SummaryService,
  ) { }

  updateSummary() {
    this.summaryService.getSummary().subscribe(sum => this.summarySource.next(sum));
  }
}
