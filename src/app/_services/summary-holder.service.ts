import { Injectable } from '@angular/core';
import {BehaviorSubject, from} from 'rxjs';
import { SummaryService } from './summary.service';
import {BalanceChange} from "../_models/balance-change";

@Injectable({
  providedIn: 'root'
})
export class SummaryHolderService {

  private emptySummary!: Map<string, number>;
  private summarySource = new BehaviorSubject(this.emptySummary);
  currentSummary = this.summarySource.asObservable();

  private emptyBalanceChange!: BalanceChange[];
  private balanceChangeSource = new BehaviorSubject(this.emptyBalanceChange);
  currentBalanceChange = this.balanceChangeSource.asObservable();

  private _from?: Date;
  private _to?: Date

  constructor(
    public summaryService: SummaryService,
  ) { }

  updateSummary() {
    this.summaryService.getSummary().subscribe(sum => this.summarySource.next(sum));
  }

  updateBalanceChange() {
    if (this._from && this._to) {
      this.summaryService.getBalanceChange(this._from, this._to).subscribe(balanceChange => this.balanceChangeSource.next(balanceChange));
    }
  }

  set setTo(value: Date) {
    this._to = value;
  }
  set setFrom(value: Date) {
    this._from = value;
  }
}
