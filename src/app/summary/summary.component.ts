import {KeyValuePipe, NgFor, NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {NumberFormatter} from '../_helpers/number-formatter';
import {SummaryHolderService} from '../_services/summary-holder.service';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CurrencyService} from "../_services/currency.service";
import {Currency} from "../_models/currency";
import {PeriodStats} from "../_models/period-stats";
import {VisibleSections} from "./visible-sections";


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [NgIf, NgFor, KeyValuePipe, ReactiveFormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {

  summary!: Map<string, number>;
  currencies: Currency[] = [];
  periodStats!: PeriodStats;


  expandedRows: { [key: number]: boolean } = {};

  balanceChangeForm = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),
  })
  defaultFromDate;
  defaultToDate = new Date().toISOString().split('T')[0];

  constructor(
    private summaryHolder: SummaryHolderService,
    public numberFormatter: NumberFormatter,
    private currencyService: CurrencyService,
  ) {
    this.defaultFromDate = this.getFromDate();
  }

  sectionsVisible: VisibleSections = {
    summary: true,
    balance: true,
    expenses: true,
    incomes: true
  };


  toggleSection(section: keyof VisibleSections) {
    this.sectionsVisible[section] = !this.sectionsVisible[section];
  }

  ngOnInit(): void {

    this.balanceChangeForm.controls['from'].valueChanges.subscribe(value => {
        this.summaryHolder.setFrom = value;
        this.summaryHolder.updateBalanceChange()
      }
    );

    this.balanceChangeForm.controls['to'].valueChanges.subscribe(value => {
        this.summaryHolder.setTo = value;
        this.summaryHolder.updateBalanceChange()
      }
    );

    this.balanceChangeForm.controls['from'].setValue(this.defaultFromDate);
    this.balanceChangeForm.controls['to'].setValue(this.defaultToDate);

    this.currencyService.currentNodes.subscribe(currencies => this.currencies = currencies);
    this.currencyService.updateCurrency();

    this.summaryHolder.currentSummary.subscribe(summary => this.onSummaryChanges(summary));
    this.summaryHolder.currentPeriodStats.subscribe(balanceChange => this.onPeriodStatsChange(balanceChange));
    this.summaryHolder.updateSummary();
  }

  private onSummaryChanges(summary: Map<string, number>): void {
    this.summary = summary;
  }

  private getFromDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  private onPeriodStatsChange(periodStats: PeriodStats): void {
    this.periodStats = periodStats;
  }

  getCurrencySymbolById(id: String): string {
    return this.currencies.filter(cur => cur.id == id)[0].symbol;
  }

  getCurrencyNameById(id: String): string {
    return this.currencies.filter(cur => cur.id == id)[0].fullName;
  }

  toggleRow(index: number): void {
    this.expandedRows[index] = !this.expandedRows[index];
  }
}
