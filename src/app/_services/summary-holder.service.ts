import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SummaryService} from './summary.service';
import {PeriodStats} from "../_models/period-stats";

@Injectable({
  providedIn: 'root'
})
export class SummaryHolderService {

  private emptySummary!: Map<string, number>;
  private summarySource = new BehaviorSubject(this.emptySummary);
  currentSummary = this.summarySource.asObservable();

  private emptyPeriodStats!: PeriodStats;
  private periodStatsSource = new BehaviorSubject(this.emptyPeriodStats);
  currentPeriodStats = this.periodStatsSource.asObservable();

  private _from?: Date;
  private _to?: Date

  constructor(
    public summaryService: SummaryService,
  ) {
  }

  updateSummary() {
    this.summaryService.getSummary().subscribe(sum => this.summarySource.next(sum));
  }

  updateBalanceChange() {
    if (this._from && this._to) {
      this.summaryService.getPeriodStats(this._from, this._to).subscribe(periodStats => this.periodStatsSource.next(periodStats));
    }
  }

  set setTo(value: Date) {
    if (this._to != value) {
      this._to = value;
      this.updateBalanceChange();
    }
  }

  set setFrom(value: Date) {
    if (this._from != value) {
      this._from = value;
      this.updateBalanceChange();
    }
  }

}
