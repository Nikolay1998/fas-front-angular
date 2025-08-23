import {KeyValuePipe, NgFor, NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {NumberFormatter} from '../_helpers/number-formatter';
import {SummaryHolderService} from '../_services/summary-holder.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CurrencyService} from "../_services/currency.service";
import {Currency} from "../_models/currency";
import {PeriodStats} from "../_models/period-stats";
import {VisibleSections} from "./visible-sections";
import {RateService} from "../_services/rate.service";


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [NgIf, NgFor, KeyValuePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {

  summary!: Map<string, number>;
  currencies: Currency[] = [];
  periodStats!: PeriodStats;
  summaryEquivalent!: Map<string, number>;
  summaryKeys: string[] = [];

  expandedRows: { [key: number]: boolean } = {};
  selectedKey: string | null = null;

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
    private rateService: RateService
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
    console.log("NgOnInit summary called ")
    this.balanceChangeForm.controls['from'].valueChanges.subscribe(value => {
        this.summaryHolder.setFrom = value;
      }
    );

    this.balanceChangeForm.controls['to'].valueChanges.subscribe(value => {
        this.summaryHolder.setTo = value;
      }
    );

    this.balanceChangeForm.controls['from'].setValue(this.defaultFromDate);
    this.balanceChangeForm.controls['to'].setValue(this.defaultToDate);

    this.currencyService.currentCurerncies.subscribe(currencies => this.currencies = currencies);
    this.summaryHolder.currentSummary.subscribe(summary => this.onSummaryChanges(summary));
    this.summaryHolder.currentPeriodStats.subscribe(balanceChange => this.onPeriodStatsChange(balanceChange));
  }

  private onSummaryChanges(summary: Map<string, number>): void {
    this.summary = summary;
    if (summary) {
      this.rateService.getEquivalents(summary).subscribe(eq => {
        if (eq) {
          this.summaryEquivalent = new Map<string, number>(
            Object.entries(eq)
          );
          this.summaryKeys = Array.from(this.summaryEquivalent.keys());
          if (!this.selectedKey) {
            this.selectedKey = this.summaryKeys[0] || null;
          }
        }
      })
    }
  }

  private getFromDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  getSumByKey(key: string): number {
    return this.summaryEquivalent?.get(key) ?? 0;
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
